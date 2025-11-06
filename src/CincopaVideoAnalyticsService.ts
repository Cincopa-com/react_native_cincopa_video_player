export class CincopaVideoAnalyticsService {
  private rid: string;
  private uid?: string;
  private userEmail?: string;
  private userName?: string;
  private userAccountId?: string;
  private static sessionID?: string;

  private heatmap: Record<number, number> = {};
  private lastPosition = -1;
  private totalUniqueSeconds = 0;
  private durationInMs?: number;
  private videoName?: string;
  private hmid?: string;
  private nextCommitTime?: number;
  private static readonly analyticsBaseUrl = `https://analytics.cincopa.com/ohm.aspx`;
  private static readonly baseUpdateIntervalSeconds = 5;

  constructor({
    rid,
    uid,
    userEmail,
    userName,
    userAccountId,
  }: {
    rid: string;
    uid?: string;
    userEmail?: string;
    userName?: string;
    userAccountId?: string;
  }) {
    this.rid = rid;
    this.uid = uid;
    this.userEmail = userEmail;
    this.userName = userName;
    this.userAccountId = userAccountId;
    this.generateHmid();
    CincopaVideoAnalyticsService.initSessionID();
  }

  private static initSessionID() {
    if (!this.sessionID) {
      this.sessionID = Date.now().toString();
    }
  }

  static get sessionIDValue() {
    if (!this.sessionID) this.initSessionID();
    return this.sessionID!;
  }

  initialize(durationMs?: number, videoName?: string) {
    this.durationInMs = durationMs;
    this.videoName = videoName ?? this.rid;
    this.scheduleNextUpdate();
    this.sendInitialStats();
  }

  sendPlayPauseEvent(isPlaying: boolean) {
    console.log('[Analytics] sendPlayPauseEvent:', isPlaying);
    this.sendUpdate(true);
    this.nextCommitTime = undefined;
    this.scheduleNextUpdate();
  }

  updatePlaybackPosition(seconds: number) {
    if (seconds > 0 && seconds !== this.lastPosition) {
      this.heatmap[seconds] = (this.heatmap[seconds] || 0) + 1;
      this.lastPosition = seconds;

      const now = Date.now();
      if (!this.nextCommitTime || now >= this.nextCommitTime) {
        this.sendUpdate().catch(console.warn);
        this.nextCommitTime =
          now + CincopaVideoAnalyticsService.baseUpdateIntervalSeconds * 1000;
      }
    }
  }

  private scheduleNextUpdate() {
    this.nextCommitTime =
      Date.now() +
      CincopaVideoAnalyticsService.baseUpdateIntervalSeconds * 1000;
  }

  private generateHmRange(hm: Record<number, number>, durSec: number): string {
    this.totalUniqueSeconds = 0;
    const secs = Object.keys(hm)
      .map(Number)
      .sort((a, b) => a - b);

    if (secs.length === 0) return '';

    let buf = '';
    let lastSec = -2;
    let lastWrite = -2;
    let lastVol = 0;

    for (const sec of secs) {
      if (durSec === 0 || this.totalUniqueSeconds < durSec) {
        this.totalUniqueSeconds++;
      }
      const vol = hm[sec]!;
      if (lastVol !== vol) {
        if (lastSec >= 0) {
          if (lastWrite !== lastSec) buf += `-${lastSec}`;
          if (lastVol > 1) buf += `:${lastVol}`;
        }
        if (lastSec >= 0) buf += ',';
        buf += `${sec}`;
        lastWrite = sec;
      } else if (lastSec + 1 < sec) {
        if (lastWrite !== lastSec) buf += `-${lastSec}`;
        if (lastVol > 1) buf += `:${lastVol}`;
        buf += `,${sec}`;
        lastWrite = sec;
      }
      lastSec = sec;
      lastVol = vol;
    }
    if (this.totalUniqueSeconds > 0 && lastSec >= 0) {
      if (lastWrite !== lastSec) buf += `-${lastSec}`;
      if (lastVol > 1) buf += `:${lastVol}`;
    }

    return buf;
  }

  private async sendUpdate(force = false) {
    if (!force && Object.keys(this.heatmap).length === 0) return;

    const durSec = Math.floor((this.durationInMs ?? 0) / 1000);
    const hmList = this.generateHmRange(this.heatmap, durSec);
    const payload: Record<string, any> = {
      ckid: CincopaVideoAnalyticsService.sessionIDValue,
      uid: this.uid ?? '',
      hmid: this.hmid ?? '',
      rid: this.rid,
      hm: hmList,
      prg: this.totalUniqueSeconds,
      name: this.videoName ?? '',
      dur: durSec,
    };

    const ud: Record<string, string> = {};
    if (this.userEmail) ud.email = this.userEmail;
    if (this.userName) ud.name = this.userName;
    if (this.userAccountId) ud.acc_id = this.userAccountId;
    if (Object.keys(ud).length > 0) payload.ud = ud;

    const json = JSON.stringify(payload);
    const url = `${CincopaVideoAnalyticsService.analyticsBaseUrl}?j=${encodeURIComponent(json)}&setref=react-native-app`;

    try {
      await fetch(url);
    } catch (err) {
      console.warn('[Analytics] Error sending:', err);
    }
  }

  private sendInitialStats() {
    this.sendUpdate(true);
  }

  private generateHmid() {
    this.hmid = Math.floor(Math.random() * 2 ** 32).toString();
  }

  dispose() {}
}

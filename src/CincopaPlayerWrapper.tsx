import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Text } from 'react-native';
import CincopaPlayer from './CincopaPlayer';
import type { CincopaPlayerProps, SubtitleTrack } from './CincopaTypes';
import { CincopaVideoAnalyticsService } from './CincopaVideoAnalyticsService';

interface WrapperProps {
  rid: string;
  userData: { name: string; email: string; acc_id: string };
  autoPlay?: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  onError?: (err: any) => void;
}

export interface CincopaPlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getMetadata: () => VideoMetadata | null;
}

export interface VideoMetadata {
  uid?: string;
  name?: string;
  poster?: string;
  duration?: number;
  ratio?: number;
  subtitles?: SubtitleTrack[];
}

const CincopaPlayerWrapper = forwardRef<CincopaPlayerRef, WrapperProps>(
  (
    {
      rid,
      userData,
      autoPlay,
      onReady,
      onPlay,
      onPause,
      onTimeUpdate,
      onEnded,
      onError,
    },
    ref
  ) => {
    const [sourceUri, setSourceUri] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
    const analyticsRef = useRef<CincopaVideoAnalyticsService | null>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
      const url = `https://rt.cincopa.com/${rid}.m3u8`;
      setSourceUri(url);

      fetch(
        `https://rtcdn.cincopa.com/meta_json.aspx?fid=A4HAcLOLOO68!${rid}&ver=app`
      )
        .then((res) => res.json())
        .then((data) => {
          const media = data.media?.items?.[0] ?? {};
          const name = media.title ?? media.filename ?? '';
          const poster = media.versions?.jpg_600x450?.url ?? '';
          const duration = parseDuration(media.duration) || 0;
          const ratio = +media.aspect_ratio;
          const subs: SubtitleTrack[] = (media.extra_files ?? [])
            .filter((f: any) => f.type?.startsWith('subtitle-'))
            .map((f: any) => ({
              title: f.filename,
              uri: f.url,
              language: f.type.split('-')[1] ?? 'en',
              type: 'application/x-subrip',
            }));

          setMetadata({
            uid: data.acc?.user?.uid ?? '',
            name,
            poster,
            duration,
            ratio,
            subtitles: subs,
          });
        })
        .catch(() => setMetadata(null));
    }, [rid]);

    useEffect(() => {
      if (sourceUri) {
        analyticsRef.current = new CincopaVideoAnalyticsService({
          rid,
          uid: metadata?.uid,
          userName: userData?.name || '',
          userEmail: userData.email,
          userAccountId: userData.acc_id,
        });
        analyticsRef.current.initialize(
          metadata?.duration || 0,
          metadata?.name || `Video-${rid}`
        );
      }

      return () => {
        analyticsRef.current?.dispose();
      };
    }, [
      sourceUri,
      rid,
      metadata,
      userData.acc_id,
      userData.email,
      userData?.name,
      metadata?.name,
      metadata?.duration,
    ]);

    const parseDuration = (durationStr?: string) => {
      if (!durationStr) return 0;

      const parts = durationStr.split(':').map((p) => parseFloat(p) || 0);
      let ms = 0;

      if (parts.length === 3) {
        ms =
          (parts[0] ?? 0) * 3600 * 1000 +
          (parts[1] ?? 0) * 60 * 1000 +
          (parts[2] ?? 0) * 1000;
      } else if (parts.length === 2) {
        ms = (parts[0] ?? 0) * 60 * 1000 + (parts[1] ?? 0) * 1000;
      } else if (parts.length === 1) {
        ms = (parts[0] ?? 0) * 1000;
      }

      return ms;
    };

    const handleTimeUpdate = (seconds: number) => {
      analyticsRef.current?.updatePlaybackPosition(Math.floor(seconds));
      onTimeUpdate?.(seconds);
    };

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.play(),
      pause: () => playerRef.current?.pause(),
      seekTo: (seconds: number) => playerRef.current?.seekTo(seconds),
      getMetadata: () => metadata,
    }));

    if (!sourceUri) {
      return <Text style={{ color: 'red' }}>Failed to get source</Text>;
    }

    const props: CincopaPlayerProps = {
      source: { uri: sourceUri, type: 'hls' },
      autoPlay: autoPlay ?? true,
      poster: metadata?.poster,
      duration: metadata?.duration,
      ratio: metadata?.ratio,
      name: userData.name,
      email: userData.email,
      accId: userData.acc_id,
      videoName: metadata?.name,
      subtitles: metadata?.subtitles ?? [],
      onReady,
      onPlay,
      onPause,
      onTimeUpdate,
      onEnded,
      onError,
    };

    return (
      <CincopaPlayer
        {...props}
        ref={playerRef}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          analyticsRef.current?.sendPlayPauseEvent(true);
          onPlay?.();
        }}
        onPause={() => {
          analyticsRef.current?.sendPlayPauseEvent(false);
          onPause?.();
        }}
        onEnded={() => {
          analyticsRef.current?.sendUpdate(true);
          onEnded?.();
        }}
      />
    );
  }
);

export default CincopaPlayerWrapper;

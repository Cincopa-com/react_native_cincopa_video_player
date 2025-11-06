import { ViewStyle } from 'react-native';

export interface SubtitleTrack {
  title: string;
  language?: string;
  type?: 'text/vtt' | 'application/x-subrip';
  uri: string;
}

export interface SelectedSubtitle {
  index?: number;
  language?: string;
}

export interface CincopaPlayerProps {
  source: { uri: string; type?: 'hls' | 'mp4' | string };
  autoPlay?: boolean;
  poster?: string | { source: { uri: string } };
  subtitles?: SubtitleTrack[];
  selectedSubtitle?: SelectedSubtitle;
  style?: ViewStyle;
  name?: string;
  email?: string;
  accId?: string;
  videoName?: string;
  duration?: number;
  ratio?: number;

  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
}

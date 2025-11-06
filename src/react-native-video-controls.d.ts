declare module 'react-native-video-controls' {
  import { Component } from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';
  interface VideoPlayerProps extends ViewProps {
    source: { uri: string; type?: string };
    poster?: { source: { uri?: string }; resizeMode?: 'cover' | 'contain' };
    videoStyle?: StyleProp<ViewStyle>;
    resizeMode?: 'contain' | 'cover';
    paused?: boolean;
    disableBack?: boolean;
    controlTimeout?: number;
    toggleResizeModeOnFullscreen?: boolean;
    onLoad?: () => void;
    onProgress?: (data: { currentTime: number }) => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
  }

  export default class VideoPlayer extends Component<VideoPlayerProps> {}
}

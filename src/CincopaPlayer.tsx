import * as React from 'react';
import { View, Dimensions, Platform, StatusBar } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import type { CincopaPlayerProps } from './CincopaTypes';

const CincopaPlayer = React.forwardRef<any, CincopaPlayerProps>(
  (props, ref) => {
    const {
      source,
      autoPlay = false,
      poster,
      ratio,
      onReady,
      onPlay,
      onPause,
      onTimeUpdate,
      onEnded,
      onError,
    } = props;

    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const videoRef = React.useRef<any>(null);
    const hasStartedRef = React.useRef(false);
    const lastProgressSecondRef = React.useRef<number | null>(null);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    React.useEffect(() => {
      setIsPlaying(autoPlay);
    }, [autoPlay]);

    const handleLoad = () => onReady?.();

    const handleProgress = (data: any) => {
      const sec = Math.floor(data.currentTime);
      if (lastProgressSecondRef.current !== sec) {
        lastProgressSecondRef.current = sec;
        onTimeUpdate?.(data.currentTime);
      }
    };

    const handleEnd = () => {
      setIsPlaying(false);
      hasStartedRef.current = false;
      onEnded?.();
    };

    const handleError = (err: any) => onError?.(err);

    const enterFullscreen = () => videoRef.current?.presentFullscreenPlayer();
    const exitFullscreen = () => videoRef.current?.dismissFullscreenPlayer();

    React.useImperativeHandle(ref, () => ({
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      seekTo: (seconds: number) => videoRef.current?.seek(seconds),
      enterFullscreen,
      exitFullscreen,
    }));

    const posterUri =
      typeof poster === 'string'
        ? poster
        : poster?.source?.uri
          ? poster.source.uri
          : undefined;

    const containerStyle = isFullscreen
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          width: windowWidth,
          height: windowHeight,
          zIndex: 999,
          backgroundColor: 'black',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        }
      : {
          width: windowWidth,
          height: windowWidth / (ratio || 16 / 9),
          backgroundColor: 'black',
        };

    return (
      <View style={containerStyle}>
        <VideoPlayer
          ref={videoRef}
          source={{
            uri: source.uri,
            type: source.type === 'hls' ? 'm3u8' : 'mp4',
          }}
          poster={{ source: { uri: posterUri }, resizeMode: 'cover' }}
          videoStyle={{width: '100%', height: '100%' }}
          resizeMode="contain"
          disableBack
          controlTimeout={5000}
          toggleResizeModeOnFullscreen={false}
          paused={!isPlaying}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
          onError={handleError}
          onPlay={() => {
            setIsPlaying(true);
            onPlay?.();
          }}
          onPause={() => {
            setIsPlaying(false);
            onPause?.();
          }}
          onEnterFullscreen={() => {
            setIsFullscreen(true);
            if (Platform.OS === 'ios') StatusBar.setHidden(true, 'fade');
          }}
          onExitFullscreen={() => {
            setIsFullscreen(false);
            if (Platform.OS === 'ios') StatusBar.setHidden(false, 'fade');
          }}
        />
      </View>
    );
});

export default CincopaPlayer;

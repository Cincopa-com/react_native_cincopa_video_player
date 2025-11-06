import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

interface Props {
  source: string;
}

export const SimpleVideoPlayer: React.FC<Props> = ({ source }) => {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: source }}
        style={styles.video}
        controls
        resizeMode="contain"
        paused={false}
        onError={(e) => console.error('Video error:', e)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

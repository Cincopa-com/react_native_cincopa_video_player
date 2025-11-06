import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AppCincopaPlayer } from 'cincopa-player';

export default function App() {
  const firstUserData = {
    name: 'Test1',
    email: 'user1@example.com',
    acc_id: '1001',
  };
  const secondUserData = {
    name: 'Test2',
    email: 'user2@example.com',
    acc_id: '1002',
  };

  const [player1State, setPlayer1State] = useState({ playing: false, time: 0 });
  const [player2State, setPlayer2State] = useState({ playing: false, time: 0 });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player 1 (autoPlay: true)</Text>
      <AppCincopaPlayer
        rid="AUADizupXspX"
        userData={firstUserData}
        autoPlay={true}
        onPlay={() => setPlayer1State((s) => ({ ...s, playing: true }))}
        onPause={() => setPlayer1State((s) => ({ ...s, playing: false }))}
        onTimeUpdate={(t) => setPlayer1State((s) => ({ ...s, time: t }))}
      />
      <Text style={styles.status}>
        {' | '}
        Time: {player1State.time.toFixed(1)}s
      </Text>

      <Text style={[styles.title, { marginTop: 30 }]}>
        Player 2 (autoPlay: false)
      </Text>
      <AppCincopaPlayer
        rid="AwDDwdvQeo_q"
        userData={secondUserData}
        autoPlay={false}
        onPlay={() => setPlayer2State((s) => ({ ...s, playing: true }))}
        onPause={() => setPlayer2State((s) => ({ ...s, playing: false }))}
        onTimeUpdate={(t) => setPlayer2State((s) => ({ ...s, time: t }))}
      />
      <Text style={styles.status}>
        {' | '}
        Time: {player2State.time.toFixed(1)}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  status: { marginTop: 5, fontSize: 16, color: '#333' },
});

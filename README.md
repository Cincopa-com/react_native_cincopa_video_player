# Cincopa Player for React Native



[![npm version](https://img.shields.io/npm/v/cincopa-player?style=flat-square)](https://www.npmjs.com/package/cincopa-player)
[![npm downloads](https://img.shields.io/npm/dm/cincopa-player?style=flat-square)](https://www.npmjs.com/package/cincopa-player)
[![License](https://img.shields.io/github/license/davitHarut/cincopa-player?style=flat-square)](LICENSE)

---

## ⭐️ Overview

The `cincopa-player` package provides a native React Native component designed to seamlessly integrate the Cincopa media player (video, audio, galleries) into your mobile applications for both iOS and Android.

## ✨ Features

* **Native-Powered Playback:** Leverages native video players (iOS/Android) for optimal performance and smooth, reliable playback of Cincopa media, including adaptive streaming sources.
* **Cincopa Analytics Integration:** Automatically sends key playback events (`video.play`, `video.pause`, and periodic `video.timeupdate`) to Cincopa endpoints for comprehensive performance tracking and viewer retention analysis.
* **Configurable Metadata & Control:** Easily pass structured user data (`email`, `acc_id`, `name`) and essential video configuration properties (`rid`, `autoPlay`) for both personalization and player behavior management.
* **Seamless Cross-Platform UI:** Designed as a standard React Native component, allowing seamless integration into any layout and full control over dimensioning (`height`, `width`) via standard `StyleSheet` props.
* **Full Lifecycle Event Control:** Exposes event handlers (`onPlay`, `onPause`, `onEnded`, `onError`) to allow your React Native application to react instantly to changes in the player's state.

## 🚀 Installation

Install the package using either `npm` or `yarn`:

```bash
# Using npm
npm install cincopa-player

# Using yarn
yarn add cincopa-player
```

### Native Setup (iOS)

For iOS, you need to install the native dependencies via CocoaPods. Navigate to your project's `ios` folder and run:

```bash
cd ios
pod install
```

## 💻 Usage

Import the `AppCincopaPlayer` component and use it, passing the mandatory `rid` (Media RID) prop and other parameters:

```ts
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AppCincopaPlayer } from 'cincopa-player';

export default function App() {
  // User data can be used for analytics or content personalization
  const userData = {
    name: 'Test User',
    email: 'user@example.com',
    acc_id: '1002',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppCincopaPlayer
          rid="YOUR_MEDIA_RID"
          userData={userData}
          autoPlay={true}
          onPlay={()}
          onPause={()}
          onTimeUpdate={()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    width: '100%',
    height: 250,
  },
});

```

## 🛠 API (`AppCincopaPlayer` Props)

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **`rid`** | `string` | **Yes** | The unique Media RID for your Cincopa content. |
| **`userData`** | `object` | No | An object containing user details (`name`, `email`, `acc_id`) for analytics and personalization. |
| **`autoPlay`** | `boolean` | No | If `true`, playback will start automatically. Default: `false`. |
| **`onPlay`** | `() => void` | No | Called when playback starts or resumes. |
| **`onPause`** | `() => void` | No | Called when playback is paused. |
| **`onTimeUpdate`** | `(time: number) => void` | No | Called during playback, returns the current time (in seconds). |


## 💡 Example

See the full `example/` directory for a working demo app that switches streams and shows analytics events in action.

## 🤝 Contributing

Feel free to open issues or PRs on GitHub. Please follow the React Native package conventions and include tests for new features.


## 💬 Support

For assistance, contact [support@cincopa.com](mailto:support@cincopa.com)


## 📄 License

MIT © Cincopa

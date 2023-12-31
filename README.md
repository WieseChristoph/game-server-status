<div align="center">
  <h1>
    <img align=center src="assets/adaptive-icon.png" width="75px" height="75px" />
    Game Server Status
  </h1>
  <p>A simple app to monitor the status of Minecraft and Steam servers.</p>
</div>
<hr>

# Data protection

This app does not collect personal information. It stores the server address, port and display name on the device. Your IP is shared with whichever server you are adding because your device connects to this server to get the status.

# Usage

- Swipe right on a server to edit it
- Swipe left on a server to delete it
- Press and hold on a server to move it
- Pull down to refresh

# Screenshots

|              Home screen              |              Add sever screen              |
| :-----------------------------------: | :----------------------------------------: |
| ![Home](.github/screenshots/home.png) | ![Add server](.github/screenshots/add.png) |

# Developement run

Installation of dependencies

```bash
npm install
```

Start app if you have an emulator or a real device connected and the SDK (Android: adb) installed

```bash
npm run android
# or
npm run ios
```

module.exports = {
  packagerConfig: {
    icon: "public/icon.icns",
    appBundleId: "dev.domi-btnr.cheese",
    name: "Cheese",
    executableName: "Cheese"
  },
  makers: [{
    name: '@electron-forge/maker-zip',
    platforms: ['darwin'],
  }]
}
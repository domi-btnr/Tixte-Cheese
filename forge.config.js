module.exports = {
  packagerConfig: {
    icon: "public/icon.icns",
    appBundleId: "me.bambus.cheese",
    name: "Cheese",
    executableName: "Cheese"
  },
  makers: [{
    name: '@electron-forge/maker-zip',
    platforms: ['darwin'],
  }]
}
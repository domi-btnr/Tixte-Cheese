const { app, BrowserWindow, Tray, nativeImage } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const showWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
        show: false,
    });

    win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

    win.once("ready-to-show", () => {
        app.dock.show();
        win.show();
    });
    if (isDev) win.webContents.openDevTools({ mode: "detach" });
    win.on("close", () => app.dock.hide());
};

app.on("ready", () => {
    app.dock.hide();

    const icon = nativeImage.createFromPath(`${__dirname}/tixte.png`,).resize({ width: 22, height: 22 });
    const tray = new Tray(icon);
    tray.setToolTip("Tixte Snap");

    tray.on("click", () => {
        if (BrowserWindow.getAllWindows().length === 0) showWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

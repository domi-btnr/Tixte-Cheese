const { app, BrowserWindow, Tray, nativeImage, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const Store = require("electron-store");
const store = new Store({
    defaults: {
        keybinds: {
            image: [],
            video: []
        },
        domain: "test.com",
        authToken: ""
    }
});

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        resizable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        show: false
    });

    win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

    win.once("ready-to-show", () => {
        app.dock.show();
        win.show();

        win.webContents.send("updateStore", {
            keybinds: store.get("keybinds"),
            domain: store.get("domain"),
            authToken: store.get("authToken")
        });
    });
    if (isDev) win.webContents.openDevTools({ mode: "detach" });
    win.on("close", () => app.dock.hide());
};

app.on("ready", async () => {
    app.dock.hide();
    
    await require("./server.js")();
    await require("./auth.js")();

    const icon = nativeImage.createFromPath(path.join(__dirname, "../public/cheese.png")).resize({ width: 18, height: 18 });
    const tray = new Tray(icon);
    tray.setToolTip("Cheese 🧀");

    tray.on("click", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
        else BrowserWindow.getAllWindows()[0].show();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("authToken", (_, data) => {
    data = JSON.parse(data);
    store.set("authToken", data?.access_token)
    BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { authToken: data?.access_token });
});

ipcMain.on("logout", () => {
    store.delete("authToken");
    BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { authToken: "" });
});
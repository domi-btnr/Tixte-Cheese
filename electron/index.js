const { app, BrowserWindow, globalShortcut, ipcMain, nativeImage, Tray } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const Store = require("electron-store");
const store = new Store({
    defaults: {
        keybinds: {
            image: [],
            video: []
        },
        domain: "random",
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

    if (store.get("authToken")) ipcMain.emit("authenticate");

    win.once("ready-to-show", () => {
        app.dock.show();
        win.show();

        win.webContents.send("updateStore", {
            keybinds: store.get("keybinds"),
            domain: store.get("domain")
        });
    });
    if (isDev) win.webContents.openDevTools({ mode: "detach" });
    win.on("close", () => app.dock.hide());
};

const addKeybind = (keybind, type) => {
    globalShortcut.register(keybind.join("+"), () => {
        if (type === "image") require("./capture.js").makeImage(store);
        else if (type === "video") require("./capture.js").makeVideo(store);
    });
}

app.on("ready", async () => {
    app.dock.hide();

    await require("./server.js")();
    await require("./auth.js")(store, BrowserWindow);

    const icon = nativeImage.createFromPath(path.join(__dirname, "../public/cheese.png")).resize({ width: 18, height: 18 });
    const tray = new Tray(icon);
    tray.setToolTip("Cheese 🧀");

    tray.on("click", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
        else BrowserWindow.getAllWindows()[0].show();
    });

    Object.entries(store.get("keybinds")).forEach(obj => {
        if (!obj[1].length) return;
        addKeybind(obj[1], obj[0]);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

ipcMain.on("authToken", (_, data) => {
    store.set("authToken", data?.access_token)
    ipcMain.emit("authenticate");
});

ipcMain.on("updateStore", (_, data) => {
    const [key, value] = Object.entries(data)[0];
    store.set(key, value);
    const storeData = { ...{ keybinds: store.get("keybinds"), domain: store.get("domain") }, ...data };
    BrowserWindow.getAllWindows()[0].webContents.send("updateStore", storeData)
});

ipcMain.on("updateKeybinds", (_, data) => {
    globalShortcut.unregisterAll();
    if (!data) return;
    Object.entries(data).forEach(obj => {
        if (!obj[1].length) return;
        addKeybind(obj[1], obj[0]);
    });
});
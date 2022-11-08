const { ipcMain, shell } = require("electron");
const { API, AUTH: { URL, ID, SCOPES, REDIRECT } } = require("../config");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const authLink = `${URL}?client_id=${ID}&scope=${SCOPES.join("+")}&response_type=code&redirect_uri=${REDIRECT}`

module.exports = async (store, BrowserWindow) => {
    ipcMain.on("login", () => {
        shell.openExternal(authLink);
    });

    ipcMain.on("logout", () => {
        store.delete("authToken");
        BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { user: null, domains: [] });
    });

    ipcMain.on("authenticate", async () => {
        const user = await fetch(`${API}/users/@me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.get("authToken")}`
            }
        });
        const _user = await user.json();
        if (!_user.success) BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { user: null, domains: [] });
        else {
            BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { user: _user.data });
            const domains = await fetch(`${API}/users/@me/domains`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.get("authToken")}`
                }
            });
            const _domains = await domains.json();
            if (!_domains.success) BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { domains: [] });
            else BrowserWindow.getAllWindows()[0].webContents.send("updateStore", { domains: _domains.data.domains });
        }
    });
}
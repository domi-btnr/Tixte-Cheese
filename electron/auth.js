const { ipcMain, shell } = require("electron");
const { AUTH: { URL, ID, SCOPES, REDIRECT } } = require("../config");

const authLink = `${URL}?client_id=${ID}&scope=${SCOPES.join("+")}&response_type=code&redirect_uri=${REDIRECT}`

module.exports = async () => {
    ipcMain.on("login", () => {
        shell.openExternal(authLink);
    });
}
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
const { ipcMain } = require("electron");
const express = require("express");
const server = express();

const { PORT } = require("../config");
const { AUTH: { URL, ID, SCOPES, REDIRECT } } = require("../config");
const authLink = `${URL}?client_id=${ID}&scope=${SCOPES.join("+")}&response_type=code&redirect_uri=${REDIRECT}`

module.exports = async () => {
    server.listen(PORT, "0.0.0.0");
    server.get("/callback", async (req, res) => {
        if (!req.query.code) return res.redirect(authLink);
        try {
            const resp = await fetch("https://api.tixte.com/v1/oauth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: ID,
                    client_secret: "nSsFxng0TnkgG1O94Tkr8GZX",
                    grant_type: "authorization_code",
                    scope: SCOPES.join(" "),
                    redirect_uri: REDIRECT,
                    code: req.query.code
                })
            })
            const body = await resp.json();
            if (!body.success) return res.redirect(authLink);
            ipcMain.emit("authToken", null, body.data)
            res.status(200).send("You can now close this window")
        } catch (e) {
            return res.status(500).send(`Internal Server Error: ${e.message}`);
        }
    })
}
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { ipcMain } = require("electron");
const express = require("express");
const server = express();

const { AUTH: { URL, ID, SCOPES, REDIRECT }, PORT } = require("../config");
const authLink = `${URL}?client_id=${ID}&scope=${SCOPES.join("+")}&response_type=code&redirect_uri=${REDIRECT}`

module.exports = async () => {
    server.listen(PORT, "0.0.0.0");
    server.get("/login", async (req, res) => {
        if (!req.query.code) return res.redirect(authLink);
        try {
            const resp = await fetch("http://tixte.bambus.me:6050/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code: req.query.code })
            })
            const body = await resp.json();
            if (!body.access_token) return res.redirect(authLink);
            ipcMain.emit("authToken", null, body.data)
            res.status(200).send("You can now close this window")
        } catch (e) {
            return res.status(500).send(`Internal Server Error: ${e.message}`);
        }
    })
}
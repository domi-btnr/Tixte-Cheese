const fs = require("fs");
const FormData = require("form-data");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { clipboard, Notification, shell } = require("electron");

const { API } = require("../config");

const generateName = () => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const makeImage = async (store) => {
    try {
        const name = generateName();
        require("child_process").execSync(`screencapture -iC /tmp/${name}.png`);
        const file = fs.readFileSync(`/tmp/${name}.png`);
        const payload = new FormData();
        const json = {
            type: 1,
            name: `${name}.png`
        }
        if (store.get("domain") !== "random") json["domain"] = store.get("domain")
        payload.append("payload_json", JSON.stringify(json));
        payload.append("file", file);

        const resp = await fetch(`${API}/upload${(store.get("domain") !== "random") ? "" : "?random=true"}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${store.get("authToken")}`,
                ...payload.getHeaders()
            },
            body: payload
        });
        const body = await resp.json();
        if (body.success) {
            clipboard.write({
                text: body.data.url,
                html: `<a href="${body.data.url}"">${body.data.url}</a>`,
            });
            const notification = new Notification({
                title: "Upload successful",
                body: "The link has been copied to your clipboard",
                urgency: "normal",
                sound: "submarine"
            });
            notification.on("click", () => shell.openExternal(body.data.url));
            notification.show();
        } else {
            const notification = new Notification({
                title: "Failed to upload",
                body: `${body.error?.message || "We encountered an issue when uploading this file"}`,
                urgency: "normal",
                sound: "submarine"
            });
            notification.show();
        }
        fs.unlinkSync(`/tmp/${name}.png`);
    } catch (error) {
        if (error.message.includes("no such file or directory")) return;
        const notification = new Notification({
            title: "Failed to upload",
            body: "We encountered an issue when uploading this file",
            urgency: "normal",
            sound: "submarine"
        });
        notification.show();
    }
};

const makeVideo = (store) => { };

module.exports = { makeImage, makeVideo };
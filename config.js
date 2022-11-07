module.exports = {
	PORT: 6050,
	API: "https://api.tixte.com/v1",
    AUTH: {
        URL: "https://tixte.com/oauth/authorize",
        ID: "2530701e00264f62b0ba3fd184e24687",
        SCOPES: ["identity", "domains", "files.manage"],
        REDIRECT: "http://127.0.0.1:6050/callback"
    }
}
import { useEffect, useState } from "react";
import "./style.scss";

const IPC = window.require("electron").ipcRenderer;

export default function App() {
    const [store, setStore] = useState({});
    IPC.on("updateStore", (_, data) => {
        setStore({ ...store, ...data });
    });

    useEffect(() => {
        console.log(store);
    }, [store]);
    return store?.authToken ? <Dashboard /> : <Login />;
}

const Dashboard = () => {
    return (
        <div className="container">
            <p className="header">You are logged in</p>
            <div className="button" onClick={() => IPC.send("logout")}>
                Logout
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <div className="container">
            <p className="header">Authenticate to continue</p>
            <div className="button" onClick={() => IPC.send("login")}>
                Login with Tixte
            </div>
        </div>
    );
};

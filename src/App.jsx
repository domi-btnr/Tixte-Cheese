import { useState } from "react";
import { Dashboard, Login } from "./components";
import "./style.scss";

const IPC = window.require("electron").ipcRenderer;

export default function App() {
    const [store, setStore] = useState({});
    IPC.on("updateStore", (_, data) => {
        setStore({ ...store, ...data });
    });
    
    return store?.user ? <Dashboard store={store} IPC={IPC} /> : <Login IPC={IPC} />;
}

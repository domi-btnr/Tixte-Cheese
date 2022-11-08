import { useEffect, useState } from "react";
import { Dashboard, Login } from "./components";
import "./style.scss";

const IPC = window.require("electron").ipcRenderer;

export default function App() {
    const [store, setStore] = useState({});
    IPC.on("updateStore", (_, data) => {
        setStore({ ...store, ...data });
    });

    useEffect(() => {
        console.log(store);
        return () => console.log("Updated store");
    }, [store]);
    return store?.user ? <Dashboard store={store} IPC={IPC} handleChange={handleChange} /> : <Login IPC={IPC} />;
}

const handleChange = (v) => {
    const name = v.target.name;
    const value = v.target.value;
    IPC.send("updateStore", JSON.parse(`{"${name}": "${value}"}`));
};

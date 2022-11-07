import { useEffect, useState } from "react";

const IPC = window.require("electron").ipcRenderer;

export default function App() {
    const [store, setStore] = useState({});
    IPC.on("updateStore", (_, data) => {
        setStore({ ...data });
    });

    useEffect(() => {
        console.log(store);
    }, [store]);
    return store?.authToken ? <div>Logged in</div> : <Login />;
}

const Login = () => {
    return (
        <div>
            <p className="">Authenticate to continue</p>
            <button className="" onClick={() => IPC.send("login")}>
                Login with Tixte
            </button>
        </div>
    );
};

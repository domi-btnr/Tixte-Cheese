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
        return () => console.log("Updated store");
    }, [store]);
    return store?.user ? <Dashboard store={store} /> : <Login />;
}

const handleChange = (v) => {
    const name = v.target.name;
    const value = v.target.value;
    IPC.send("updateStore", JSON.parse(`{"${name}": "${value}"}`));
};

const Dashboard = (props) => {
    return (
        <>
            <div className="text-center p-2">
                <div>
                    <div className="row">
                        <div className="absolute top-0 left-0 m-4 text-sm">
                            <span className="truncate">
                                <img
                                    className="rounded-full h-8 w-8 inline -mt-2"
                                    src={`https://us-east-1.tixte.net/assets/avatars/${props.store.user.id}/${props.store.user.avatar}.png`}
                                    alt=""
                                />
                                <span className="ml-2">{props.store.user.username}</span>
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="absolute top-0 right-0 m-4 text-sm cursor-pointer">
                            <span
                                className="text-red-500 hover:underline hover:cursor-pointer"
                                onClick={() => IPC.send("logout")}
                            >
                                Logout
                            </span>
                        </div>
                    </div>
                </div>
                <hr className="mt-10" />
                <div className="m-2 grid grid-cols-2 gap-2 text-left">
                    <div className="col-span-1">
                        <p className="text-sm text-gray-400 font-semibold mt-3 pb-1">Upload Domain</p>
                        <select
                            name="domain"
                            className="dropdown secondaryDropdown mt-1 w-full cursor-pointer"
                            value={props.store.domain}
                            onChange={(v) => handleChange(v, props.store)}
                        >
                            <option value={"random"}>Random Domain</option>
                            {props.store?.domains?.length &&
                                props.store?.domains?.map((domain) => {
                                    return (
                                        <option key={domain.name} value={domain.name}>
                                            {domain.name}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

const Login = () => {
    return (
        <div className="text-center p-2">
            <div>
                <p className="text-xl font-semibold mt-24">Authenticate to continue</p>
                <div className="btn mt-2" onClick={() => IPC.send("login")}>
                    Login with Tixte
                </div>
            </div>
        </div>
    );
};

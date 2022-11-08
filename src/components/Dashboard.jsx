export default function Dashboard(props) {
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
                                onClick={() => props.IPC.send("logout")}
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
                            onChange={(v) => props.handleChange(v)}
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
}

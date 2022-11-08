export default function Login(props) {
    return (
        <div className="text-center p-2">
            <div>
                <p className="text-xl font-semibold mt-24">Authenticate to continue</p>
                <div className="btn mt-2" onClick={() => props.IPC.send("login")}>
                    Login with Tixte
                </div>
            </div>
        </div>
    );
}

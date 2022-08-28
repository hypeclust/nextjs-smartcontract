import { useMoralis } from "react-moralis"
import { useEffect } from "react"
export default function ManualHeade0r() {
    const { enableWeb3, isWeb3Enabled, account,Moralis, deactivateWeb3,isWeb3EnableLoading } = useMoralis()
    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (typeof window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    useEffect(() =>{
        Moralis.onAccountChanged((account) => {
            console.log(account)
            if(account == null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("deactivated")
            }
        })
    })
    return (
        <div>
            {account ? (
                <div>
                    <p>Connected To: {account.slice(0, 6) + "..." + account.slice(-4)}</p>
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled = {isWeb3EnableLoading}
                >
                    Connect Wallet
                </button>
            )}
        </div>
    )
}

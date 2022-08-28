import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div className="border-b-2 flex flex-row p-5 ">
            <h1 className="py-2 px-4 font-bold text-3xl text-black">Decentralized Lottery</h1>

            <div className="ml-auto py-2 px-2">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

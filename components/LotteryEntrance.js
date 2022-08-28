import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState(0)
    const [numPlayer, setNumPlayer] = useState(0)
    const [recentWinner, setRecentWinner] = useState(0)
    const dispatch = useNotification()
    const {
        runContractFunction: enterLottery,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberofPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberofPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    async function updateUi() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const numPlayerFromContract = (await getNumberofPlayers()).toString()
        const recentWinnerFromContract = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromContract)
        setNumPlayer(numPlayerFromContract)
        setRecentWinner(recentWinnerFromContract)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "You have successfully entered the lottery",
            title: "Success",
            position: "topR",
            icon: "",
        })
    }
    return (
        <div className="p-5">
            Hi from lottery Entrance
            {lotteryAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-auto"
                        onClick={async function () {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isFetching || isLoading}
                    >
                        {isFetching || isLoading ? (
                            <div className=" w-4 h-4 border-b-2  p-3 border-white rounded-full animate-spin"></div>
                        ) : (
                            <div>Enter Lottery</div>
                        )}
                    </button>
                    <div>EntranceFee:{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number of Players:{numPlayer}</div>
                    <div>Recent Winner:{recentWinner}</div>
                </div>
            ) : (
                <div>No lottery address</div>
            )}
        </div>
    )
}
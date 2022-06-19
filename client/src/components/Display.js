import '../App.css';
// import { ethers } from 'ethers';
// import { useEffect, useState} from 'react';
import React from 'react';
import Balances from './Balances';

function Display({ provider, signer, setSigner, tokenSymbols, signerAddress, setSignerAddress, bankContract,tokenBalances, setTokenBalances, toBytes32, toRound, toEth, toWei }) {
    
    const isConnected = () => (signer!== undefined)


    const connect = () => {
        getSigner(provider)
        .then(signer => {
            setSigner(signer)
            getTokenBalances(signer)
        })
    }

    const getSigner = async provider => {
        provider.send("eth_requestAccounts",[])
        const signer = provider.getSigner()  

        signer.getAddress()
        .then(address => {
            setSignerAddress(address)
        })

        return signer
    }


    const getTokenBalance = async (symbol, signer) => {
        const balance = await bankContract.connect(signer).getTokenBalance(toBytes32(symbol))
        return toEth(balance)
    }

    const getTokenBalances = (signer) => {
        tokenSymbols.map(async symbol => {
        const balance = await getTokenBalance(symbol, signer)
        setTokenBalances(prev => ({...prev, [symbol]: balance.toString()}))
        })
    }
        
    return (
        <div className="App">
        <header className="App-header">
            {isConnected() ? (
            <div>
                <p>
                Welcome ...{signerAddress?.slice(-4)}
                </p>
                <Balances
                    provider = {provider}
                    signer = {signer}
                    setSigner = {setSigner}
                    tokenSymbols = {tokenSymbols}
                    signerAddress = {signerAddress}
                    setSignerAddress = {setSignerAddress}
                    bankContract = {bankContract}
                    tokenBalances = {tokenBalances}
                    setTokenBalances = {setTokenBalances}
                    toBytes32 = {toBytes32}
                    toRound = {toRound}
                    toEth = {toEth}
                    toWei = {toWei}
                />
            </div>
            ) : (
            <div>
                <p>
                You are not connected
                </p>
                <button 
                className='btn btn-primary'
                onClick={connect}
                >Connect Metamask</button>
            </div>
            )
            }
        </header>
        </div>
    );
}

export default Display;
import "../App.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import React from "react";
import Display from "./Display";

import bankArtifact from "../artifacts/contracts/Bank.sol/Bank.json";
import maticArtifact from "../artifacts/contracts/Matic.sol/Matic.json";
import usdtArtifact from "../artifacts/contracts/Usdt.sol/Usdt.json";
import shibArtifact from "../artifacts/contracts/Shib.sol/Shib.json";

function Bank() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  //store FE obj representing all 3 tokens
  const [tokenContracts, setTokenContracts] = useState({});
  const [tokenBalances, setTokenBalances] = useState({});
  const [tokenSymbols, setTokenSymbols] = useState([]);

  const [amount, setAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [isDeposit, setIsDeposit] = useState(true);

  const toBytes32 = (text) => ethers.utils.formatBytes32String(text);
  const toString = (bytes32) => ethers.utils.parseBytes32String(bytes32);
  const toWei = (ether) => ethers.utils.parseEther(ether);
  const toEth = (wei) => ethers.utils.formatEther(wei).toString();
  const toRound = (num) => Number(num).toFixed(2);

  useEffect(() => {
    const init = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const bankContract = await new ethers.Contract(
        "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
        bankArtifact.abi
      );
      setBankContract(bankContract);

      bankContract
        .connect(provider)
        .getWhiteListedSymbols()
        .then((result) => {
          const symbols = result.map((s) => toString(s));
          setTokenSymbols(symbols);
          getTokenContracts(symbols, bankContract, provider);
        });
    };
    init();
  }, []);

  const getTokenContract = async (symbol, bankContract, provider) => {
    const address = await bankContract
      .connect(provider)
      .getWhiteListedTokensAddress(toBytes32(symbol));
    const abi =
      symbol === "Matic"
        ? maticArtifact.abi
        : symbol === "Shib"
        ? shibArtifact.abi
        : usdtArtifact.abi;
    const tokenContracts = new ethers.Contract(address, abi);
  };

  const getTokenContracts = async (symbol, bankContract, provider) => {
    symbol.map(async (symbol) => {
      const contract = await getTokenContract(symbol, bankContract, provider);
      setTokenContracts((prev) => ({ ...prev, [symbol]: contract }));
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <Display
          provider={provider}
          signer={signer}
          setSigner={setSigner}
          tokenSymbols={tokenSymbols}
          signerAddress={signerAddress}
          setSignerAddress={setSignerAddress}
          bankContract={bankContract}
          tokenBalances={tokenBalances}
          setTokenBalances={setTokenBalances}
          toBytes32={toBytes32}
          toRound={toRound}
          toEth={toEth}
          toWei={toWei}
          showModal = {showModal}
          setShowModal = {setShowModal}
          selectedSymbol = {selectedSymbol}
          setSelectedSymbol = {setSelectedSymbol}
          isDeposit = {isDeposit}
          setIsDeposit = {setIsDeposit}
        />
      </header>
    </div>
  );
}

export default Bank;

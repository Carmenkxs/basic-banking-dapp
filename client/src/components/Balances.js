import React from "react";
import "../App.css";

function Balances({ provider, signer, setSigner, tokenSymbols, signerAddress, setSignerAddress, bankContract, tokenBalances, setTokenBalances, toBytes32, toRound, toEth, toWei, showModal,setShowModal, selectedSymbol, setSelectedSymbol,isDeposit, setIsDeposit}) {

    
    const displayModal = (symbol) => {
        setSelectedSymbol(symbol)
        setShowModal(true)
        console.log('Ok')
      }

    const handleModalDisplay = (symbol) => {
        displayModal(symbol)
    }

  return (
    <div className="list-group">
      <div className="list-group-item">
        {Object.keys(tokenBalances).map((symbol, idx) => (
          <div className="row d-flex py-3" key={idx}>
            <div className="col-md-3">
              <div>{symbol.toUpperCase()}</div>
            </div>
            <div className="d-flex gap-4 col-md-2">
              <small className="opacity-50 text-nowrap">
                {toRound(tokenBalances[symbol])}
              </small>
            </div>
            <div className="d-flex gap-2 col-md-2">
                <button 
                className='btn btn-primary'
                onClick={handleModalDisplay}>
                Deposit/Withdraw</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Balances;

 async function main(){
     //these are the wallets preseeded with ethers
     [signer1,signer2] = await ethers.getSigners();

     //signer1 is the bank
     const Bank = await ethers.getContractFactory("Bank",signer1);
     const bankContract = await Bank.deploy();

     //Signer2 is the wallet that will get allocated tokens from mint
     const Matic = await ethers.getContractFactory("Matic",signer2);
     const matic = await Matic.deploy();

     const Usdt = await ethers.getContractFactory("Usdt",signer2);
     const usdt = await Usdt.deploy();

     const Shib = await ethers.getContractFactory("Shib",signer2);
     const shib = await Shib.deploy();

     //whitelisting tokens
     await bankContract.whiteListToken(
         //convert the token name to bytes 32 string since we defined that var type in Bank.sol
         ethers.utils.formatBytes32String('Matic'),
         matic.address
     );

     await bankContract.whiteListToken(
        //convert the token name to bytes 32 string since we defined that var type in Bank.sol
        ethers.utils.formatBytes32String('Usdt'),
        usdt.address
    );

    await bankContract.whiteListToken(
        //convert the token name to bytes 32 string since we defined that var type in Bank.sol
        ethers.utils.formatBytes32String('Shib'),
        shib.address
    );

    await bankContract.whiteListToken(
        //convert the token name to bytes 32 string since we defined that var type in Bank.sol
        ethers.utils.formatBytes32String('Eth'),
        '0xf0E3eAF9BA25F6fD0A6548AfBE56fEc0A31D03A3'
    );

    console.log("Bank deployed to",bankContract.address,"by",signer1.address)
    console.log("Matic deployed to",matic.address,"by",signer2.address);
    console.log("Tether deployed to",usdt.address,"by",signer2.address);
    console.log("Shiba deployed to",shib.address,"by",signer2.address)
 }

 const process = require('process');
 main()
    .then(() => process.traceDeprecation(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
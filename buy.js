const { ethers } = require("ethers")
const web3=  require("web3");
const UNISWAP = require("@uniswap/sdk")
const fs = require('fs');
const { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent} = require("@uniswap/sdk");
const { getAddress } = require("ethers/lib/utils");
//const { default: Web3 } = require("web3");
require('dotenv').config()

const INFURA_URL_TESTNET = process.env.INFURA_URL_TESTNET
const provider = new ethers.providers.getDefaultProvider(INFURA_URL_TESTNET)
// const QUICKNODE_HTTP_ENDPOINT = "https://withered-falling-cloud.discover.quiknode.pro/2a3a64136d390ae45ae649fb23957a8addc2b142/"
//let provider = new ethers.providers.getDefaultProvider(QUICKNODE_HTTP_ENDPOINT)


const privateKey = process.env.WALLET_SECRET
const wallet = new ethers.Wallet(privateKey, provider)
UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
UNISWAP_ROUTER_ABI = fs.readFileSync("./abis/router.json").toString()
UNISWAP_ROUTER_CONTRACT = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, provider)
const DAI = new Token(
    UNISWAP.ChainId.RINKEBY,
    //"0x95b58a6Bff3D14B7DB2f5cb5F0Ad413DC2940658",
    "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
    18,
    "DAI",
);
const UNI = new Token(
    UNISWAP.ChainId.RINKEBY,
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    18,
    "UNI",
);

console.log("in Swap Tokens")



async function buy(token1, token2, amount, slippage = "50") {
    

    try {
        const pair = await Fetcher.fetchPairData(token1, token2, provider); //creating instances of a pair
        console.log(pair)
        const route = await new Route([pair], token2); // a fully specified path from input token to output token
        console.log(route)
        amountIn = ethers.utils.parseEther(amount.toString()); //helper function to convert ETH to Wei
        amountIn = amountIn.toString()
        console.log(amountIn)
        
        const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
        console.log(slippageTolerance)
        const trade = new Trade( //information necessary to create a swap transaction.
                route,
                new TokenAmount(token2, amountIn),
                TradeType.EXACT_INPUT
        );
        //console.log(trade)

        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
        const path = [token2.address, token1.address]; //An array of token addresses
        const to = wallet.address; // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
        //const value = 22000
        const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string
        

        // console.log(amountOutMin);
        // console.log(amountOutMinHex);
        // console.log(path);
        // console.log(to);
        // console.log(value);
        // console.log(valueHex);
        //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
        rawTxn = await UNISWAP_ROUTER_CONTRACT.populateTransaction.swapExactETHForTokens(amountOutMinHex, path, to, deadline, {
                value: valueHex
            })
        console.log("Raw BUY")
        
        
        
        console.log(rawTxn)
        //Returns a Promise which resolves to the transaction.
        let sendTxn = (await (await wallet).sendTransaction(rawTxn))
        console.log(sendTxn)
        
        
        //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
        let reciept = (await sendTxn).wait()
        console.log(reciept)
        //Logs the information about the transaction it has been mined.
        if (reciept) {
            console.log(" - Transaction is mined - " + '\n' 
            + "Transaction Hash:", (await sendTxn).hash
            + '\n' + "Block Number: " 
            + (await reciept).blockNumber + '\n' 
            + "Navigate to https://rinkeby.etherscan.io/txn/" 
            + (await sendTxn).hash, "to see your transaction")
        } else {
            console.log("Error submitting transaction")
        }

    } catch(e) {
        console.log(e)
    }
}


//swapTokens(UNI, WETH[UNI.chainId], "buy", .006) //first argument = token we want, second = token we have, the amount we want
//swapTokens(UNI, WETH[UNI.chainId], 0.03, "buy")
buy(DAI, WETH[DAI.chainId], 0.001)
// swapTokens(WETH[DAI.chainId], DAI, 22000, "sell")
//swapTokens(WETH[DAI.chainId], DAI, 0.005, "sell")
//module.exports.swapTokens = swapTokens;
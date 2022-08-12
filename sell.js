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
const signer = wallet.provider.getSigner(wallet.address);
//const account = wallet.connect(provider)
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
function erc20(acc,tokenAddress) {
    return new ethers.Contract(
        tokenAddress,
        [{
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "payable": false,
            "type": "function"
        },
        {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {
          "constant": false,
          "inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"}],
          "name": "approve",
          "outputs": [{"name": "","type": "bool"}],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
      ],
        acc
    );
  }

function router(acc) {
return new ethers.Contract(
    UNISWAP_ROUTER_ADDRESS,
    [
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
        'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
        'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
        'function swapExactTokensForETH (uint amountOutMin, address[] calldata path, address to, uint deadline) external payable'
    ],
    acc
);
}


const swapAbi = [{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"minter_","type":"address"},{"internalType":"uint256","name":"mintingAllowedAfter_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"address","name":"newMinter","type":"address"}],"name":"MinterChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint96","name":"votes","type":"uint96"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumTimeBetweenMints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mintCap","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mintingAllowedAfter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"minter_","type":"address"}],"name":"setMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const sellToken = async(token1, token2, amount, value=99)=>{
    const wethcontract = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const slippage = 0
    var customWsProvider = new ethers.providers.getDefaultProvider(INFURA_URL_TESTNET);
    const wallet = new ethers.Wallet(privateKey);
    const account = wallet.connect(customWsProvider)
    const tokenContract=token1.address
    const sellTokenContract = new ethers.Contract(tokenContract,swapAbi,account)
    const contract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS,UNISWAP_ROUTER_ABI,account)
    const accountAddress = account.address
    const tokenBalance = await erc20(account,tokenContract).balanceOf(accountAddress);
    let amountOutMin = 0;
    const amountIn = tokenBalance.mul(value).div(100)
    const amounts = await router(account).getAmountsOut(amountIn, [tokenContract,wethcontract]);
    if (parseInt(slippage) !== 0) {
      amountOutMin = amounts[1].sub(amounts[1].mul(`${slippage}`).div(100));
    } else {
      amountOutMin = amounts[1]
    }
    const approve = await sellTokenContract.approve(UNISWAP_ROUTER_ADDRESS, amountIn)
    const receipt_approve = await approve.wait();
    if (receipt_approve && receipt_approve.blockNumber && receipt_approve.status === 1) { 
      console.log(`Approved https://rinkeby.etherscan.io/txn/${receipt_approve.transactionHash}`);
      const swap_txn = await contract.swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn ,amountOutMin, 
        [tokenContract, wethcontract],
        accountAddress,
        (Date.now() + 1000 * 60 * 10),
        {
          'gasLimit': ethers.BigNumber.from(1000000).toHexString(),
          'gasPrice': account.getGasPrice(),
        }
      )
      const receipt = await swap_txn.wait();
      if (receipt && receipt.blockNumber && receipt.status === 1) { // 0 - failed, 1 - success
        console.log(`Transaction https://rinkeby.etherscan.io/txn/${receipt.transactionHash} mined, status success`);
      } else if (receipt && receipt.blockNumber && receipt.status === 0) {
        console.log(`Transaction https://rinkeby.etherscan.io/txn/${receipt.transactionHash} mined, status failed`);
      } else {
        console.log(`Transaction https://rinkeby.etherscan.io/txn/${receipt.transactionHash} not mined`);
      }
    }
  }

async function sell(token1, token2, amount, slippage = "50") {

    try {
        const coin= await Fetcher.fetchTokenData(token1.chainId, token1.address);
        const pair = await Fetcher.fetchPairData(token1, token2, provider); //creating instances of a pair
        const route = await new Route([pair], token1); // a fully specified path from input token to output token
        amountIn = ethers.utils.parseEther(amount.toString()); //helper function to convert ETH to Wei
        amountIn = amountIn.toString()

        const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
        console.log(slippageTolerance)
        const trade = new Trade( //information necessary to create a swap transaction.
                route,
                new TokenAmount(token1, amountIn),
                TradeType.EXACT_INPUT
        );        

        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
        const path = [token1.address, token2.address]; //An array of token addresses
        const to = wallet.address; // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
        const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string
        // console.log(amountOutMin);
        // console.log(amountOutMinHex);
        // console.log(path);
        // console.log(to);
        // console.log(value);
        // const signer = provider.getSigner()
        console.log("before")
        const sellTokenContract = new ethers.Contract(token1.address,ab,signer)
        console.log(sellTokenContract)
        const approve = await sellTokenContract.approve(UNISWAP_ROUTER_ADDRESS, valueHex)
        console.log("hello")
        const receipt_approve = await approve.wait();
        console.log("hi")
        if (receipt_approve){

        //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
        rawTxn = await UNISWAP_ROUTER_CONTRACT.populateTransaction.swapExactTokensForETH(valueHex, amountOutMinHex, path, to, deadline,{
             gasPrice: wallet.getGasPrice(),
            gasLimit: ethers.BigNumber.from(1000000).toHexString()
        })}
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

//sell(UNI, WETH[UNI.chainId], 0.01)

sellToken(DAI, WETH[DAI.chainId], 4568)
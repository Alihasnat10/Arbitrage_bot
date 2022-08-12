var ethers = require("ethers");
const web3=  require("web3");
const fs = require("fs");
const buy = require("./buy")
const sell = require("./sell")
//const swap = require("./swap_tokens")
const UNISWAP = require("@uniswap/sdk")
const { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent} = require("@uniswap/sdk");
//var url = "wss://withered-falling-cloud.discover.quiknode.pro/2a3a64136d390ae45ae649fb23957a8addc2b142/";
var url = "wss://rinkeby.infura.io/ws/v3/bba552d7432b4a24bc27c3e60289e149";
async function buyT(a, b, c) {
  await buy.buyToken(a, b, c);
}
async function sellT(a, b, c) {
  await sell.sellToken(a, b, c);
}

function calculate_gas_price(action="buy", amount){
  if (action==="buy"){
    var a  = ethers.utils.formatUnits(amount.add(1), 'gwei')
    return ethers.BigNumber.from(a).toHexString()
  }else{
    var a =  ethers.utils.formatUnits(amount.sub(1), 'gwei')
    return ethers.BigNumber.from(a).toHexString()
  }
}

var init = function() {
  var customWsProvider = new ethers.providers.WebSocketProvider(url);
  const iface = new ethers.utils.Interface(['function    swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)',
'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline)'])

  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {//UNSWAP Router Address: 0xE592427A0AEce92De3Edee1F18E0157C05861564
      if (transaction && transaction.to==="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") {//UNSWAP Router Address Rinkbey
        const value = web3.utils.fromWei(transaction.value.toString())
        const gasPrice= web3.utils.fromWei(transaction.gasPrice.toString())
        const gasLimit= web3.utils.fromWei(transaction.gasLimit.toString())
      // for example we will be only showing transaction that are higher than 30 bnb
        if(value) {
          console.log("value : ",value);
          console.log("gasPrice : ",gasPrice);
          console.log("gasLimit : ",gasLimit);
          //we can print the sender of that transaction
          console.log("from",transaction.from);
          console.log("to", transaction.to);
          console.log("data", transaction.data);
          let result = []
          //we will use try and catch to handle the error and decode the data of the function used to swap the token
          try {
            result = iface.decodeFunctionData('swapExactETHForTokens', transaction.data)
          } catch (error) {
          try {
            result = iface.decodeFunctionData('swapExactETHForTokensSupportingFeeOnTransferTokens', transaction.data)
          } catch (error) {
          try {
            result = iface.decodeFunctionData('swapETHForExactTokens', transaction.data)
          } catch (error) {
            console.log("final err : ",transaction);
          }
          }
          }
          if(result.length>0){
            let tokenAddress = ""
            if(result[1].length>0){
              tokenAddress = result[1][1]
              console.log("tokenAddress",tokenAddress);
              // const buyGasPrice = calculate_gas_price("buy",transaction.gasPrice)
              // const sellGasPrice = calculate_gas_price("sell",transaction.gasPrice)
              // after calculating the gas price we buy the token
              console.log("going to buy");
              //await buy.buyToken(tokenAddress,transaction.gasLimit,buyGasPrice)
              //var res = buyT(tokenAddress,gasLimit,transaction.gasPrice)
              buy.buyToken(tokenAddress,gasLimit,transaction.gasPrice)
              // if (res === 1){
              // // after buying the token we sell it 
              // console.log("going to sell the token");
              // //await sell.sellToken(tokenAddress,transaction.gasLimit,sellGasPrice)
              // sellT(tokenAddress,gasLimit,transaction.gasPrice)}
            }
          }
          
          // console.log(result)
          // var csv = "";
          // for (let i of result) {
          //   csv += i.join(",") + "\r\n";
          // }

          // fs.appendFileSync("result.csv", csv);
          // console.log("Done!");
        }
    }
      
  });
});

  customWsProvider._websocket.on("error", async () => {
    console.log(`Unable to connect to retrying in 3s...`);
    setTimeout(init, 3000);
  });
  customWsProvider._websocket.on("close", async (code) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    customWsProvider._websocket.terminate();
    setTimeout(init, 3000);
  });
};

init();
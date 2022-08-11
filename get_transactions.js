var ethers = require("ethers");
const web3=  require("web3");
//const swap = require("./swap_tokens")
const UNISWAP = require("@uniswap/sdk")
const { Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent} = require("@uniswap/sdk");
var url = "wss://withered-falling-cloud.discover.quiknode.pro/2a3a64136d390ae45ae649fb23957a8addc2b142/";
//var url = "wss://rinkeby.infura.io/ws/v3/179530a65e254205b5cc48e1cb05070d/";


function calculate_gas_price(action="buy", amount){
  if (action==="buy"){
    return ethers.utils.formatUnits(amount.add(1), 'gwei')
  }else{
    return ethers.utils.formatUnits(amount.sub(1), 'gwei')
  }
}

var init = function () {
  var customWsProvider = new ethers.providers.WebSocketProvider(url);
  
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {//UNSWAP Router Address: 0xE592427A0AEce92De3Edee1F18E0157C05861564
      if (transaction && transaction.to==="0xE592427A0AEce92De3Edee1F18E0157C05861564") {//UNSWAP Router Address Rinkbey
        //console.log(transaction);
        const value = web3.utils.fromWei(transaction.value.toString())
        const gasPrice= web3.utils.fromWei(transaction.gasPrice.toString())
        const gasLimit= web3.utils.fromWei(transaction.gasLimit.toString())

        console.log(transaction)
        // console.log("Hash : ",transaction.hash);
        // console.log("value : ",value);
        // console.log("gasPrice : ",gasPrice);
        // console.log("gasLimit : ",gasLimit);
        // console.log("from : ",transaction.from);
        // console.log("to : ",transaction.to);
        // console.log("gasLimit : ",gasLimit);
        // console.log("data : ",transaction.data);
        //swap.swapTokens(UNI, WETH[UNI.chainId], .006)
      
      
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
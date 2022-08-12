const { ethers } = require('ethers')
const fs = require("fs");

const iface = new ethers.utils.Interface(['function    swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)',
'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline)',
"function transferFrom(address from, address to, uint amount)",
])
// Decoding function data (the value of tx.data)
const txData = "0x7ff36ab500000000000000000000000000000000000000000000047e9369d28ed214f6470000000000000000000000000000000000000000000000000000000000000080000000000000000000000000d62c797a1b2a9ae2c883e4c5a052b302e11777f80000000000000000000000000000000000000000000000000000000062f60bb20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c778417e063141139fce010982780140aa0cd5ab0000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea";
let result = [""]
result[0] = iface.decodeFunctionData("swapExactETHForTokens", txData)
console.log(result)
var csv = "";
if (result.length > 0){
for (let i of result) {
  csv += i.join(",") + "\r\n";
}

fs.appendFileSync("demoA.csv", csv);
console.log("Done!");}
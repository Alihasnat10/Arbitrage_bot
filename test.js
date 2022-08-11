const { ethers } = require('ethers')

const inputAmount = 0.09
// .001 => 1 000 000 000 000 000
const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    18
)
console.log("hello");
console.log(amountIn);
console.log((amountIn * 100000).toString())
//console.log(parseInt(amountIn, 18))
// const ethValue = ethers.utils.formatEther(amountIn);
// console.log(ethValue)
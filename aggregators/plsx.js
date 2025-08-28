// aggregators/pulsex.js

const PULSE_X_ROUTER = "0x165C3410fC91EF562C50559f7d2289fEbed552d9";

const routerAbi = [
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

export async function swapPulseX(tokenIn, tokenOut, amount, userAddr) {
  console.log("Swapping on PulseX:", { tokenIn, tokenOut, amount, userAddr });

  if (!window.ethereum) throw new Error("No wallet provider found");

  const { ethers } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const amountIn = ethers.utils.parseUnits(amount.toString(), 18);
  const slippagePct = 0.005; // 0.5%
  const amountOutMin = amountIn.mul(995).div(1000); // Apply slippage
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 600; // 10 mins

  const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);
  const router = new ethers.Contract(PULSE_X_ROUTER, routerAbi, signer);

  try {
    console.log("Approving token...");
    const approveTx = await tokenContract.approve(PULSE_X_ROUTER, amountIn);
    await approveTx.wait();
    console.log("Approval complete.");

    console.log("Executing swap...");
    const tx = await router.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      userAddr,
      deadline
    );

    console.log("TX Submitted:", tx.hash);
    await tx.wait();
    console.log("Swap complete!");
  } catch (err) {
    console.error("PulseX Swap Error:", err.message);
    throw err;
  }
}

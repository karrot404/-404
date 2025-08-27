// karrot-logic.js

import { swapPulseX } from './aggregators/pulsex.js';
import { swapRay } from './aggregators/ray.js';
import { swapZK } from './aggregators/zk.js';
import { swap9mm } from './aggregators/9mm.js';
import { swapPiteas } from './aggregators/piteas.js';
import { swapUniswap } from './aggregators/uniswap.js';
import { swapPancakeSwap } from './aggregators/pancake.js';
import { swapCowSwap } from './aggregators/cowswap.js';
import { swap1inch } from './aggregators/oneinch.js';
import { swapMatcha } from './aggregators/matcha.js';
import { swapThorSwap } from './aggregators/thorswap.js';
import { getLibertySwapQuote } from './aggregators/libertyswap.js';

import { tokenMap } from './tokenMap.js';

// Default aggregator
let selectedAggregator = "PulseX";

// DOM Elements
const tokenFrom = document.getElementById("tokenFrom");
const tokenTo = document.getElementById("tokenTo");
const fromIcon = document.getElementById("fromIcon");
const toIcon = document.getElementById("toIcon");

// ⚙️ Allow aggregator switching
export function setAggregator(name) {
  selectedAggregator = name;
  console.log(`[Aggregator Set] → ${selectedAggregator}`);
  populateTokens();
}

// 🔁 Update token icons + check for same-token warning
export function updateIcons() {
  const tokens = tokenMap[selectedAggregator] || [];
  const fromMeta = tokens.find(t => t.address === tokenFrom.value);
  const toMeta = tokens.find(t => t.address === tokenTo.value);

  fromIcon.src = fromMeta?.logo || "img/default-token.png";
  toIcon.src = toMeta?.logo || "img/default-token.png";

  fromIcon.onerror = () => { fromIcon.src = "img/default-token.png"; };
  toIcon.onerror = () => { toIcon.src = "img/default-token.png"; };

  handleLikeTokenWarning(); // 👈 Check if same token selected
}

// ⚠️ Warn if same token selected for From and To
function handleLikeTokenWarning() {
  const sameToken = tokenFrom.value === tokenTo.value;
  if (sameToken) {
    toIcon.style.boxShadow = "0 0 10px #FF7F11";
    tokenTo.style.color = "#FF7F11";
  } else {
    toIcon.style.boxShadow = "none";
    tokenTo.style.color = "";
  }
}

// 🔁 Populate token dropdowns based on selected aggregator
export function populateTokens() {
  const tokens = tokenMap[selectedAggregator] || [];

  tokenFrom.innerHTML = "";
  tokenTo.innerHTML = "";

  tokens.forEach(token => {
    const optionFrom = new Option(token.label, token.address);
    const optionTo = new Option(token.label, token.address);
    tokenFrom.add(optionFrom);
    tokenTo.add(optionTo);
  });

  tokenFrom.value = tokens[0]?.address;
  tokenTo.value = tokens[1]?.address || tokens[0]?.address;

  updateIcons();
}

// 🚀 Master Swap Execution
export async function executeSwap(tokenIn, tokenOut, amount, userAddr) {
  switch (selectedAggregator) {
    case "PulseX":
      return swapPulseX(tokenIn, tokenOut, amount, userAddr);
    case "Ray":
      return swapRay(tokenIn, tokenOut, amount, userAddr);
    case "ZK":
      return swapZK(tokenIn, tokenOut, amount, userAddr);
    case "9mm":
      return swap9mm(tokenIn, tokenOut, amount, userAddr);
    case "Piteas":
      return swapPiteas(tokenIn, tokenOut, amount, userAddr);
    case "Uniswap":
      return swapUniswap(tokenIn, tokenOut, amount, userAddr);
    case "PancakeSwap":
      return swapPancakeSwap(tokenIn, tokenOut, amount, userAddr);
    case "CowSwap":
      return swapCowSwap(tokenIn, tokenOut, amount, userAddr);
    case "1inch":
      return swap1inch(tokenIn, tokenOut, amount, userAddr);
    case "Matcha":
      return swapMatcha(tokenIn, tokenOut, amount, userAddr);
    case "ThorSwap":
      return swapThorSwap(tokenIn, tokenOut, amount, userAddr);
    case "LibertySwap":
      return getLibertySwapQuote({
        tokenIn,
        tokenOut,
        amount,
        userAddr,
        fromChain: 'ETH',
        toChain: 'ETH',
      });
    default:
      throw new Error("Unknown aggregator: " + selectedAggregator);
  }
}

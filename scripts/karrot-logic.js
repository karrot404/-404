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

let selectedAggregator = "PulseX";

// DOM Elements
const tokenFrom = document.getElementById("tokenFrom");
const tokenTo = document.getElementById("tokenTo");
const fromIcon = document.getElementById("fromIcon");
const toIcon = document.getElementById("toIcon");

// Aggregator switching
export function setAggregator(name) {
  selectedAggregator = name;
  console.log(`[Aggregator Set] → ${selectedAggregator}`);
  populateTokens();
}

// Token icon update and warning for identical selection
export function updateIcons() {
  const tokens = tokenMap[selectedAggregator] || [];
  const fromMeta = tokens.find(t => t.address === tokenFrom.value);
  const toMeta = tokens.find(t => t.address === tokenTo.value);

  fromIcon.src = fromMeta?.logo || "img/default-token.png";
  toIcon.src = toMeta?.logo || "img/default-token.png";

  fromIcon.onerror = () => { fromIcon.src = "img/default-token.png"; };
  toIcon.onerror = () => { toIcon.src = "img/default-token.png"; };

  handleLikeTokenWarning();
}

// Highlight warning if tokens are the same
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

// Populate token select inputs
export function populateTokens() {
  const tokens = tokenMap[selectedAggregator] || [];

  tokenFrom.innerHTML = "";
  tokenTo.innerHTML = "";

  tokens.forEach(token => {
    tokenFrom.add(new Option(token.label, token.address));
    tokenTo.add(new Option(token.label, token.address));
  });

  tokenFrom.value = tokens[0]?.address;
  tokenTo.value = tokens[1]?.address || tokens[0]?.address;

  updateIcons();
}

// 🚀 Extended Swap Execution with Advanced Options
export async function executeSwap(tokenIn, tokenOut, amount, recipient, options = {}) {
  const {
    slippage = 0.5,
    useCrossChain = false,
    pxAsset = null
  } = options;

  console.log(`[Executing Swap] Aggregator: ${selectedAggregator}`);
  console.log({
    tokenIn, tokenOut, amount, recipient,
    slippage, useCrossChain, pxAsset
  });

  const swapArgs = { tokenIn, tokenOut, amount, recipient, slippage, useCrossChain, pxAsset };

  switch (selectedAggregator) {
    case "PulseX":
      return swapPulseX(swapArgs);
    case "Ray":
      return swapRay(swapArgs);
    case "ZK":
      return swapZK(swapArgs);
    case "9mm":
      return swap9mm(swapArgs);
    case "Piteas":
      return swapPiteas(swapArgs);
    case "Uniswap":
      return swapUniswap(swapArgs);
    case "PancakeSwap":
      return swapPancakeSwap(swapArgs);
    case "CowSwap":
      return swapCowSwap(swapArgs);
    case "1inch":
      return swap1inch(swapArgs);
    case "Matcha":
      return swapMatcha(swapArgs);
    case "ThorSwap":
      return swapThorSwap(swapArgs);
    case "LibertySwap":
      return getLibertySwapQuote({
        tokenIn, tokenOut, amount, userAddr: recipient,
        fromChain: 'ETH',
        toChain: useCrossChain ? 'SOL' : 'ETH',
        slippage,
        pxAsset
      });
    default:
      throw new Error("Unknown aggregator: " + selectedAggregator);
  }
}

    default:
      throw new Error("Unknown aggregator: " + selectedAggregator);
  }
}

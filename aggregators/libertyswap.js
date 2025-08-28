// libertyswap.js

const AGGREGATOR_ENDPOINTS = {
  lifi: 'https://li.quest/v1/quote',
  socket: 'https://api.socket.tech/v2/quote',
  squid: 'https://api.squidrouter.com/v1/quote'
};

// 🛠 Basic fetch utility with timeout and fallback
async function fetchWithFallback(urls, params, timeout = 7000) {
  for (const [name, endpoint] of Object.entries(urls)) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${endpoint}?${queryString}`, {
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) throw new Error(`Aggregator ${name} failed`);

      const data = await response.json();
      console.log(`[✅ ${name.toUpperCase()}] Quote received`);
      return { aggregator: name, data };
    } catch (err) {
      console.warn(`[⚠️ ${name.toUpperCase()}] Failed:`, err.message);
    }
  }

  throw new Error('All aggregator endpoints failed.');
}

// 📦 Swap execution
export async function getLibertySwapQuote({ tokenIn, tokenOut, amount, fromChain = 'ETH', toChain = 'ETH', userAddr }) {
  const formattedAmount = (parseFloat(amount) * 1e18).toString(); // assumes 18 decimals

  const params = {
    fromChain,
    toChain,
    fromToken: tokenIn,
    toToken: tokenOut,
    fromAddress: userAddr,
    fromAmount: formattedAmount,
    slippage: 1, // 1%
    allowBridges: 'all',
    allowExchanges: 'all',
    integrator: 'karrotdex'
  };

  return await fetchWithFallback(AGGREGATOR_ENDPOINTS, params);
}

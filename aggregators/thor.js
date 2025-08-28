// aggregators/thorswap.js

const THORSWAP_API = 'https://api.thorswap.finance/v1/router'; // Confirm with docs or devs

export async function swapThorSwap(tokenIn, tokenOut, amount, userAddr) {
  try {
    const res = await fetch(THORSWAP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: tokenIn,
        to: tokenOut,
        amount,
        userAddress: userAddr
      })
    });

    if (!res.ok) throw new Error(`THORSwap API error: ${res.status}`);

    const data = await res.json();
    console.log("THORSwap response:", data);

    if (data.swapLink) {
      window.open(data.swapLink, '_blank');
      return { status: 'redirect', url: data.swapLink };
    }

    return data;
  } catch (err) {
    console.error("THORSwap swap error:", err);
    throw err;
  }
}

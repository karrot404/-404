import asyncio
from typing import List, Dict, Any, Optional
import random

# --- Core Multi-Chain Client ---

class ChainClient:
    def __init__(self, name: str, rpc_url: str):
        self.name = name
        self.rpc_url = rpc_url
        self.connected = False

    async def connect(self):
        # Simulated connection
        print(f"[{self.name}] Connecting to {self.rpc_url}...")
        await asyncio.sleep(1)
        self.connected = True
        print(f"[{self.name}] Connected!")

    async def get_latest_block(self) -> int:
        # Simulated block number fetch
        if not self.connected:
            raise Exception(f"[{self.name}] Not connected")
        block_num = random.randint(1000000, 2000000)
        print(f"[{self.name}] Latest block: {block_num}")
        return block_num

    async def send_transaction(self, tx_data: Dict[str, Any]) -> str:
        # Simulated transaction sending
        if not self.connected:
            raise Exception(f"[{self.name}] Not connected")
        print(f"[{self.name}] Sending transaction: {tx_data}")
        await asyncio.sleep(2)
        tx_hash = f"0x{random.getrandbits(256):064x}"
        print(f"[{self.name}] Transaction sent: {tx_hash}")
        return tx_hash


# --- Multi-Chain Manager ---

class MultiChainManager:
    def __init__(self):
        self.chains: Dict[str, ChainClient] = {}

    def add_chain(self, name: str, rpc_url: str):
        self.chains[name] = ChainClient(name, rpc_url)
        print(f"Added chain {name}")

    async def connect_all(self):
        await asyncio.gather(*(chain.connect() for chain in self.chains.values()))

    async def get_latest_blocks(self) -> Dict[str, int]:
        results = await asyncio.gather(*(chain.get_latest_block() for chain in self.chains.values()))
        return {name: block for name, block in zip(self.chains.keys(), results)}

    async def send_tx_on_chain(self, chain_name: str, tx_data: Dict[str, Any]) -> Optional[str]:
        if chain_name not in self.chains:
            print(f"Chain {chain_name} not found")
            return None
        return await self.chains[chain_name].send_transaction(tx_data)


# --- SmartHATAgent (GANGAR Mode) ---

class SmartHATAgent:
    def __init__(self, multi_chain_manager: MultiChainManager):
        self.mcm = multi_chain_manager

    async def run(self):
        print("Starting SmartHATAgent v0.3 GANGAR Mode...")
        await self.mcm.connect_all()

        latest_blocks = await self.mcm.get_latest_blocks()
        print("Latest blocks across chains:", latest_blocks)

        # Example: Send a simple tx on each chain
        for chain_name in self.mcm.chains.keys():
            tx_data = {
                "to": "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
                "value": random.randint(1, 10**18),
                "data": "0x"
            }
            tx_hash = await self.mcm.send_tx_on_chain(chain_name, tx_data)
            print(f"Sent tx on {chain_name}: {tx_hash}")

        print("SmartHATAgent run complete.")


# --- Usage Example ---

async def main():
    mcm = MultiChainManager()
    # Add some example chains (RPC URLs are dummy)
    mcm.add_chain("Ethereum", "https://mainnet.infura.io/v3/YOUR-PROJECT-ID")
    mcm.add_chain("BinanceSmartChain", "https://bsc-dataseed.binance.org/")
    mcm.add_chain("Polygon", "https://polygon-rpc.com/")

    agent = SmartHATAgent(mcm)
    await agent.run()

if __name__ == "__main__":
    asyncio.run(main())

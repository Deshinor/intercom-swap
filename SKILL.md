# SKILL.md — IntercomSwap Radar

## Overview

**IntercomSwap Radar** is a P2P swap monitoring and simulation dashboard for the BTC Lightning ↔ USDT Solana ecosystem, built on the Intercom protocol.

This fork extends **IntercomSwap** with a real-time browser-based dashboard that visualizes swap activity, simulates RFQ flows, and monitors network peers.

---

## What This Fork Adds

On top of the upstream IntercomSwap protocol:

| Feature | Description |
|---|---|
| Live Swap Feed | Real-time display of network swap activity (settled, pending, negotiating) |
| RFQ Simulator | Interactive tool to broadcast RFQs and watch maker quotes arrive |
| P2P Order Book | Depth view of BTC/USDT quotes from network peers |
| Swap Flow Visualizer | Animated step-by-step view of the full HTLC lifecycle |
| Peer Network Map | Grid of active makers/takers/observers with volume stats |
| Market Stats | BTC price, 24h volume, open RFQs, success rate |

---

## Agent Instructions

### Running the Dashboard

```bash
# No install needed — single HTML file
open index.html
# Or: npx serve . → http://localhost:3000
```

### What Agents Can Do With This App

1. **Demonstrate the swap flow** — Use the animated flow visualizer to explain each step of an IntercomSwap trade to users
2. **Simulate RFQs** — Use the RFQ Simulator panel to show how a quote negotiation works without touching real funds
3. **Monitor the network** — The peer grid and live feed show current network activity
4. **Educate about the protocol** — The order book and stats panels give context for pricing

### Integration With Upstream IntercomSwap

This dashboard is meant to be used **alongside** a running IntercomSwap node:

```bash
# Start your swap peer (from upstream intercom-swap)
scripts/run-swap-maker.sh my-store 49222 0000intercomswapbtcusdt

# Then open the Radar dashboard to monitor activity
open index.html
```

In a full integration, the dashboard would connect to the SC-Bridge WebSocket (`ws://127.0.0.1:<scBridgePort>`) to display real network data instead of simulated data.

### Extending This Fork

Agents building on this fork should:

1. Replace the simulated data engine (`// DATA ENGINE` section in `index.html`) with real SC-Bridge WebSocket connections
2. Use `swapctl` commands to feed real orderbook and trade data to the UI
3. Wire up the RFQ Simulator to actually call `scripts/swapctl.sh rfq ...`

### Key Upstream Tools (From IntercomSwap)

Refer to upstream `SKILL.md` for full details on:
- `swapctl` — SC-Bridge control (RFQ, quote, terms, escrow)
- `rfq-maker` / `rfq-taker` — Automated swap bots
- `lnctl` — Lightning operations
- `solctl` — Solana wallet operations
- `promptd` + Collin UI — LLM-powered swap assistant

---

## Protocol Reference

```
RFQ Channel (e.g. 0000intercomswapbtcusdt)
    │
    │ RFQ → QUOTE → QUOTE_ACCEPT
    │
    ▼
Invite-only swap:<trade_id> channel
    │
    │ TERMS → ACCEPT → LN_INVOICE → SOL_ESCROW_CREATED
    │ → LN_PAID → SOL_CLAIMED
    │
    ▼
Settlement
  BTC: Lightning payment (preimage reveals)
  USDT: Solana HTLC escrow claim
```

---

## Trac Address

```
ADD_YOUR_TRAC_ADDRESS_HERE
```

---

## License

MIT — same as upstream IntercomSwap (Trac-Systems/intercom).
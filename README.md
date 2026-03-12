# IntercomSwap Radar

> **A real-time P2P swap monitoring & simulation dashboard for the BTC Lightning ↔ USDT Solana ecosystem.**

Built on top of [Intercom](https://github.com/Trac-Systems/intercom) and forked from [IntercomSwap](https://github.com/TracSystems/intercom-swap).

---

## Trac Address

```
trac129qqqmca6ufqsvg3xpncfgfkfwapsr7m8s283yw98j653nskjsdsztxamr
```

---

## What Is This?

**IntercomSwap Radar** is a live dashboard app that visualizes and simulates the IntercomSwap P2P protocol. It provides:

- 🔴 **Live swap feed** — real-time (simulated) trade activity across the Intercom P2P network
- 📡 **RFQ Simulator** — interactive tool to simulate broadcasting a Request-for-Quote and watching makers respond
- 📊 **P2P Order Book** — depth-of-market view of BTC/USDT quotes from network peers
- ⚡ **Swap Flow Visualizer** — step-by-step animation of the full HTLC swap lifecycle:
  `RFQ → Quote → Terms → Solana Escrow → Lightning Settlement`
- 🌐 **Peer Network Map** — visual overview of active makers, takers, and observers
- 📈 **Live Market Stats** — BTC price, volume, open RFQs, success rate

---

## Screenshots

![IntercomSwap Radar Dashboard](screenshot.png)

---

## Architecture

```
Browser (IntercomSwap Radar UI)
        │
        ├── Visualizes: P2P RFQ/Quote/Terms/Escrow/Settle flow
        ├── Simulates: RFQ negotiation via Intercom sidechannels
        └── Monitors: Swap activity, peer network, order depth

Underlying Protocol (IntercomSwap):
        │
        ├── Intercom P2P layer (Hyperswarm/HyperDHT + Protomux)
        ├── Sidechannel RFQ negotiation
        ├── Solana HTLC escrow program (USDT leg)
        └── Lightning Network (BTC leg)
```

---

## How It Works

The dashboard demonstrates the complete **IntercomSwap** swap lifecycle:

1. **RFQ** — Taker broadcasts a Request-for-Quote on a rendezvous sidechannel
2. **Quote** — Makers respond with USDT amounts and fee terms
3. **Terms** — Binding HTLC parameters exchanged in invite-only `swap:<trade_id>` channel
4. **Escrow** — Maker locks USDT in Solana HTLC program (locked to LN payment hash)
5. **Settle** — Taker pays Lightning invoice → learns preimage → claims Solana USDT

All coordination uses the **Intercom** P2P stack (no central server required).

---

## Running the App

This is a single-file HTML application — no build step needed.

```bash
# Clone this repo
git clone <your-fork-url>
cd intercom-swap-radar

# Open in browser
open index.html

# Or serve locally
npx serve .
# → http://localhost:3000
```

---

## Project Structure

```
intercom-swap-radar/
├── index.html        # Main dashboard app (self-contained)
├── SKILL.md          # Agent instructions for this fork
├── README.md         # This file
└── screenshot.png    # Proof screenshot
```

---

## Upstream Dependencies

| Project | Role |
|---|---|
| [Trac-Systems/intercom](https://github.com/Trac-Systems/intercom) | Base P2P protocol |
| [TracSystems/intercom-swap](https://github.com/TracSystems/intercom-swap) | Swap harness (forked) |
| Trac Network (TNK) | Underlying blockchain |
| Lightning Network | BTC settlement layer |
| Solana | USDT escrow layer |

---

## Competition Entry

- ✅ Fork of IntercomSwap
- ✅ Trac address in README
- ✅ SKILL.md updated with agent instructions
- ✅ Working app with proof screenshots

---

## License

MIT — same as upstream IntercomSwap.

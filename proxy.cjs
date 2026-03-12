const WebSocket = require('ws');
const SC_BRIDGE_URL   = 'ws://127.0.0.1:49222';
const SC_BRIDGE_TOKEN = '6e6be042ac0ee3a7348a8de366a2abbf51538283762e42e3a6381800035c575f';
const PROXY_PORT      = 49300;
const CHANNELS        = ['0000intercomswapbtcusdt', '0000intercom'];
let scBridgeSocket = null;
let browserClients = new Set();
let reconnectTimer = null;
const server = new WebSocket.Server({ port: PROXY_PORT });
server.on('listening', function () {
  console.log('[Proxy] Browser WebSocket server running on ws://127.0.0.1:' + PROXY_PORT);
});
server.on('connection', function (browserWs) {
  console.log('[Proxy] Browser connected');
  browserClients.add(browserWs);
  browserWs.send(JSON.stringify({ type: 'proxy_status', connected: scBridgeSocket !== null && scBridgeSocket.readyState === WebSocket.OPEN }));
  browserWs.on('close', function () { browserClients.delete(browserWs); });
  browserWs.on('error', function () { browserClients.delete(browserWs); });
});
function broadcast(data) {
  var msg = typeof data === 'string' ? data : JSON.stringify(data);
  browserClients.forEach(function (client) { if (client.readyState === WebSocket.OPEN) client.send(msg); });
}
function connectToSCBridge() {
  console.log('[Proxy] Connecting to SC-Bridge...');
  scBridgeSocket = new WebSocket(SC_BRIDGE_URL);
  scBridgeSocket.on('open', function () {
    console.log('[Proxy] SC-Bridge connected — authenticating...');
    scBridgeSocket.send(JSON.stringify({ type: 'auth', token: SC_BRIDGE_TOKEN }));
    CHANNELS.forEach(function (channel) {
      scBridgeSocket.send(JSON.stringify({ type: 'sc_watch', channel: channel }));
      console.log('[Proxy] Watching channel: ' + channel);
    });
    scBridgeSocket.send(JSON.stringify({ type: 'info' }));
    broadcast({ type: 'proxy_status', connected: true });
    console.log('[Proxy] Ready — forwarding messages to browser');
  });
  scBridgeSocket.on('message', function (raw) {
    var str = raw.toString();
    try { console.log('[SC-Bridge]', JSON.stringify(JSON.parse(str)).substring(0, 120)); } catch(e) { console.log('[SC-Bridge]', str.substring(0, 120)); }
    broadcast(str);
  });
  scBridgeSocket.on('error', function (err) { console.error('[Proxy] Error:', err.message); });
  scBridgeSocket.on('close', function () {
    console.log('[Proxy] SC-Bridge disconnected — retrying in 5s...');
    broadcast({ type: 'proxy_status', connected: false });
    scBridgeSocket = null;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connectToSCBridge, 5000);
  });
}
connectToSCBridge();

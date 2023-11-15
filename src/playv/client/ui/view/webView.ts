import alt from 'alt-client';
const isLocalhost = alt.getServerIp() == '::ffff:127.0.0.1' || alt.getServerIp() == '::1';
export const webView = new alt.WebView(alt.debug && isLocalhost ? 'http://localhost:5173/' : 'http://resource/client/html/index.html');

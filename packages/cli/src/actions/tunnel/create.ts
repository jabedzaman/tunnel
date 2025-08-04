import { createServer } from "http";
import httpProxy from "http-proxy";
import WebSocket from "ws";
import { api } from "~/api";

export class Create {
  private ws: WebSocket | null = null;
  private config: { localPort: number };
  private localServer!: ReturnType<typeof createServer>;

  constructor(config: { localPort: number }) {
    this.config = config;
  }

  async connect() {
    // 1. get tunnel information from the server
    const tunnelInfo = await api.tunnel.create({
      localPort: this.config.localPort,
    });

    // 2. establish WebSocket connection
    this.ws = new WebSocket("ws://localhost:8080/v1/tunnel");

    // 3. setup local proxy server
    this.setupLocalProxy();

    return tunnelInfo;
  }

  private async setupLocalProxy() {
    //  create proxy server
    const proxy = httpProxy.createProxyServer();

    this.localServer = createServer((req, res) => {
      proxy.web(req, res, {
        target: `http://localhost:${this.config.localPort}`,
      });
    });

    // Handle WebSocket connections
    this.ws?.on("message", (data) => {
      const message = JSON.parse(data.toString());
      this.handleTunnelMessage(message);
    });
  }

  private handleTunnelMessage(message: any) {
    // Handle incoming tunnel requests
    // Forward to local server and send response back
  }
}

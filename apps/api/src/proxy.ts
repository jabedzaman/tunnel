import express, { Request, Response, NextFunction } from "express";
import { WebSocket } from "ws";
import bodyParser from "body-parser";

export class ProxyManager {
  private activeTunnels = new Map<string, WebSocket>();
  private app: express.Application;
  private pendingResponses = new Map<
    string,
    { res: Response; timeout: NodeJS.Timeout }
  >();

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json()); // parse JSON body
    this.setupProxyRoutes();
  }

  private setupProxyRoutes() {
    this.app.use(
      "*",
      async (req: Request, res: Response, next: NextFunction) => {
        const host = req.get("host");
        const subdomain = host ? this.extractSubdomain(host) : null;

        if (subdomain && this.activeTunnels.has(subdomain)) {
          this.forwardToTunnel(subdomain, req, res);
        } else {
          res.status(404).json({ error: "Tunnel not found" });
        }
      }
    );
  }

  handleTunnelConnection(ws: WebSocket, req: any) {
    const token = this.extractToken(req);
    if (!this.validateToken(token)) {
      ws.close(1008, "Unauthorized");
      return;
    }

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleTunnelMessage(ws, message);
      } catch {
        console.error("Invalid WS message");
      }
    });

    ws.on("close", () => {
      this.removeTunnel(ws);
    });
  }

  private async forwardToTunnel(
    subdomain: string,
    req: Request,
    res: Response
  ) {
    const tunnelWs = this.activeTunnels.get(subdomain);
    if (!tunnelWs) {
      return res.status(502).json({ error: "Tunnel unavailable" });
    }

    const requestId = this.generateRequestId();
    const proxyReq = {
      id: requestId,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    };

    // Store response handler with timeout
    const timeout = setTimeout(() => {
      this.pendingResponses.delete(requestId);
      res.status(504).json({ error: "Tunnel response timeout" });
    }, 10000);

    this.pendingResponses.set(requestId, { res, timeout });

    // Send to tunnel client
    tunnelWs.send(JSON.stringify(proxyReq));
  }

  private extractSubdomain(host: string): string | null {
    const parts = host.split(".");
    return parts.length > 2 ? parts[0] : null;
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private extractToken(req: any): string | null {
    return req.headers["authorization"]?.replace("Bearer ", "") || null;
  }

  private validateToken(token: string | null): boolean {
    // return token === "valid-token"; // Replace with real validation
    return true;
  }

  private handleTunnelMessage(ws: WebSocket, message: any) {
    if (message.id && this.pendingResponses.has(message.id)) {
      const pending = this.pendingResponses.get(message.id)!;
      clearTimeout(pending.timeout);
      pending.res.status(message.status || 200).send(message.body);
      this.pendingResponses.delete(message.id);
    }
  }

  private removeTunnel(ws: WebSocket) {
    for (const [subdomain, socket] of this.activeTunnels.entries()) {
      if (socket === ws) {
        this.activeTunnels.delete(subdomain);
        break;
      }
    }
  }
}

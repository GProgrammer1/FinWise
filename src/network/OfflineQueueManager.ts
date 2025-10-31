import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import { ApiClient } from "../api/ApiClient";

export interface QueuedRequest {
  id?: number;
  method: string;
  url: string;
  body?: string;
  headers?: string;
  createdAt?: number;
}

export class OfflineQueueManager {
  private static db: SQLite.SQLiteDatabase;
  private static flushing = false;

  // open database
  static async init() {
    this.db = await SQLite.openDatabaseAsync("finwise_offline_queue.db");
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT NOT NULL,
        url TEXT NOT NULL,
        body TEXT,
        headers TEXT,
        createdAt INTEGER DEFAULT (strftime('%s','now'))
      );
    `);

    // monitor connectivity
    NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        OfflineQueueManager.flush();
      }
    });

    console.log("[OfflineQueue] initialized");
  }

  static async enqueue(req: Omit<QueuedRequest, "id">) {
    // dedupe check
    const existing = await this.db.getFirstAsync(
      `SELECT id FROM queue WHERE method=? AND url=? AND body=?;`,
      [req.method, req.url, JSON.stringify(req.body || null)]
    );
    if (existing) {
      console.log(`[OfflineQueue] Duplicate request skipped: ${req.url}`);
      return;
    }

    await this.db.runAsync(
      `INSERT INTO queue (method, url, body, headers, createdAt)
       VALUES (?, ?, ?, ?, strftime('%s','now'));`,
      [
        req.method,
        req.url,
        JSON.stringify(req.body || null),
        JSON.stringify(req.headers || {}),
      ]
    );
    console.log(`[OfflineQueue] Added → ${req.method} ${req.url}`);
  }

  static async getAll(): Promise<QueuedRequest[]> {
    return await this.db.getAllAsync<QueuedRequest>(
      "SELECT * FROM queue ORDER BY id ASC;"
    );
  }

  static async remove(id: number) {
    await this.db.runAsync("DELETE FROM queue WHERE id=?;", [id]);
  }

  static async flush() {
    if (OfflineQueueManager.flushing) return;
    OfflineQueueManager.flushing = true;

    const api = ApiClient.getInstance();
    const queue = await this.getAll();
    if (!queue.length) {
      OfflineQueueManager.flushing = false;
      return;
    }

    console.log(`[OfflineQueue] Flushing ${queue.length} requests...`);

    for (const item of queue) {
      try {
        const data = item.body ? JSON.parse(item.body) : undefined;
        const headers = item.headers ? JSON.parse(item.headers) : undefined;

        await api.request({
          method: item.method,
          url: item.url,
          data,
          headers,
        });

        await this.remove(item.id!);
        console.log(`[OfflineQueue]  Sent ${item.method} ${item.url}`);
      } catch (err) {
        console.warn(`[OfflineQueue] Failed again ${item.url}`);
      }
    }

    OfflineQueueManager.flushing = false;
  }
}

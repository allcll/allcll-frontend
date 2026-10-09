import Dexie, { EntityTable } from 'dexie';

export interface AdminApiLogs {
  request_id: number;
  statusCode: number;
  method: string;
  request_url: string;
  timestamp: string;
  request_body: string;
  response_body: string;
}

class MyDexieDB extends Dexie {
  public admin_api_logs!: EntityTable<AdminApiLogs, 'request_id'>;

  constructor() {
    super('ALLCLL_Admin_Logs');
    this.version(1).stores({
      admin_api_logs: '++request_id, statusCode, method, request_url, timestamp, request_body, response_body',
    });
  }
}

export const db = new MyDexieDB();

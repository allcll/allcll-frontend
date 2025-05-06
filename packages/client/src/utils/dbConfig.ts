import { initDB, ObjectStoreSchema } from 'react-indexed-db-hook';

interface DBConfig {
  keyPath: string;
  autoIncrement?: boolean;
  indexes: ObjectStoreSchema[];
}

export const DB_NAME = 'ALLCLL_Simulation';
export const DB_VERSION = 1;

export const DB_CONFIG: Record<string, DBConfig> = {
  interested_snapshot: {
    keyPath: 'snapshot_id',
    autoIncrement: true,
    indexes: [
      { name: 'user_id', keypath: 'user_id', options: { unique: false } },
      { name: 'created_at', keypath: 'created_at', options: { unique: false } },
      { name: 'simulated', keypath: 'simulated', options: { unique: false } },
    ],
  },

  interested_subject: {
    keyPath: 'interested_id',
    autoIncrement: true,
    indexes: [
      { name: 'snapshot_id', keypath: 'snapshot_id', options: { unique: false } },
      { name: 'subject_id', keypath: 'subject_id', options: { unique: false } },
    ],
  },

  simulation_run: {
    keyPath: 'simulation_run_id',
    autoIncrement: true,
    indexes: [
      { name: 'snapshot_id', keypath: 'snapshot_id', options: { unique: false } },
      { name: 'user_id', keypath: 'user_id', options: { unique: false } },
      { name: 'success_subject_count', keypath: 'success_subject_count', options: { unique: false } },
      { name: 'subject_count', keypath: 'subject_count', options: { unique: false } },
      { name: 'accuracy', keypath: 'accuracy', options: { unique: false } },
      { name: 'score', keypath: 'score', options: { unique: false } },
      { name: 'total_elapsed', keypath: 'total_elapsed', options: { unique: false } },
      { name: 'started_at', keypath: 'started_at', options: { unique: false } },
      { name: 'ended_at', keypath: 'ended_at', options: { unique: false } },
    ],
  },

  simulation_run_selections: {
    keyPath: 'run_selections_id',
    autoIncrement: true,
    indexes: [
      { name: 'simulation_run_id', keypath: 'simulation_run_id', options: { unique: false } },
      { name: 'interested_id', keypath: 'interested_id', options: { unique: false } },
      { name: 'selected_index', keypath: 'selected_index', options: { unique: false } },
      { name: 'status', keypath: 'status', options: { unique: false } },
      { name: 'started_at', keypath: 'started_at', options: { unique: false } },
      { name: 'ended_at', keypath: 'ended_at', options: { unique: false } },
    ],
  },

  simulation_run_events: {
    keyPath: 'event_id',
    autoIncrement: true,
    indexes: [
      { name: 'simulation_section_id', keypath: 'simulation_section_id', options: { unique: false } },
      { name: 'event_type', keypath: 'event_type', options: { unique: false } },
      { name: 'timestamp', keypath: 'timestamp', options: { unique: false } },
    ],
  },
};

export function initSimulationDB() {
  initDB({
    name: DB_NAME,
    version: DB_VERSION,
    objectStoresMeta: Object.entries(DB_CONFIG).map(([name, schema]) => ({
      store: name,
      storeConfig: { keyPath: schema.keyPath, autoIncrement: schema.autoIncrement ?? false },
      storeSchema: schema.indexes || [],
    })),
  });
}

export interface InterestedSnapshot extends InterestedSnapshotData{
  snapshot_id: number;
}

export interface InterestedSnapshotData {
  user_id: string;
  created_at: string;
  simulated: boolean;
}

export interface InterestedSubject extends InterestedSubjectData {
  interested_id: number;
}

export interface InterestedSubjectData {
  snapshot_id: number;
  subject_id: number;
}

export interface SimulationRun extends SimulationRunData {
  simulation_run_id: number;
}

export interface SimulationRunData {
  snapshot_id: number;
  user_id: string;
  success_subject_count: number;
  subject_count: number;
  accuracy: number;
  score: number;
  total_elapsed: number;
  started_at: string;
  ended_at: string;
}

export interface SimulationRunSelections extends SimulationRunSelectionsData{
  run_selections_id: number;
}

export interface SimulationRunSelectionsData {
  simulation_run_id: number;
  interested_id: number;
  selected_index: number;
  status: string;
  started_at: string;
  ended_at: string;
}

export interface SimulationRunEvents extends SimulationRunEventsData {
  event_id: number;
}

export interface SimulationRunEventsData {
  simulation_section_id: number;
  event_type: string;
  timestamp: string;
}
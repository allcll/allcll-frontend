import Dexie, { EntityTable } from 'dexie';

class MyDexieDB extends Dexie {
  public interested_snapshot!: EntityTable<InterestedSnapshot, 'snapshot_id'>;
  public interested_subject!: EntityTable<InterestedSubject, 'interested_id'>;
  public simulation_run!: EntityTable<SimulationRun, 'simulation_run_id'>;
  public simulation_run_selections!: EntityTable<SimulationRunSelections, 'run_selections_id'>;
  public simulation_run_events!: EntityTable<SimulationRunEvents, 'event_id'>;

  constructor() {
    super('ALLCLL_Simulation');
    this.version(1).stores({
      interested_snapshot: '++snapshot_id,user_id,created_at,simulated',
      interested_subject: '++interested_id,snapshot_id,subject_id',
      simulation_run:
        '++simulation_run_id,snapshot_id,user_id,department_name,success_subject_count,subject_count,accuracy,score,total_elapsed,started_at,ended_at',
      simulation_run_selections:
        '++run_selections_id,simulation_run_id,interested_id,selected_index,status,started_at,ended_at',
      simulation_run_events: '++event_id,simulation_section_id,event_type,timestamp',
    });
  }
}

export const db = new MyDexieDB();

export interface InterestedSnapshot extends InterestedSnapshotData {
  snapshot_id: number;
}

export interface InterestedSnapshotData {
  user_id: string;
  created_at: number;
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
  department_name: string;
  success_subject_count: number;
  subject_count: number;
  accuracy: number;
  score: number;
  total_elapsed: number;
  search_event_at: number;
  started_at: number;
  ended_at: number;
}

export interface SimulationRunSelections extends SimulationRunSelectionsData {
  run_selections_id: number;
}

export interface SimulationRunSelectionsData {
  simulation_run_id: number;
  interested_id: number;
  selected_index: number;
  status: number;
  started_at: number;
  ended_at: number;
}

export interface SimulationRunEvents extends SimulationRunEventsData {
  event_id: number;
}

export interface SimulationRunEventsData {
  simulation_section_id: number;
  event_type: number;
  timestamp: number;
}

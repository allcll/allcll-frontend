import { db, SimulationRunEvents } from '@/utils/dbConfig.ts';

class SimulationEventService {
  public async create(data: Omit<SimulationRunEvents, 'event_id'>): Promise<number> {
    return db.simulation_run_events.add(data);
  }
}

export default new SimulationEventService();

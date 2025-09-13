import { db, SimulationRun } from '@/utils/dbConfig.ts';
import { SIMULATION_ERROR } from '@/utils/simulation/simulation.ts';

class SimulationRunService {
  public async getOngoing(throwErrorOnNotStarted = false): Promise<SimulationRun | null> {
    const ongoing = db.simulation_run.filter(run => run.ended_at === -1);
    const lastOngoing = await ongoing.last();
    const ongoingCount = await ongoing.count();

    if (ongoingCount > 1) {
      throw new Error(SIMULATION_ERROR.MULTIPLE_SIMULATION_RUNNING);
    }

    if (throwErrorOnNotStarted && !lastOngoing) {
      throw new Error(SIMULATION_ERROR.ONGOING_SIMULATION_NOT_FOUND);
    }

    return lastOngoing ?? null;
  }

  public async isRunning(): Promise<boolean> {
    const ongoing = db.simulation_run.filter(run => run.ended_at === -1);
    const ongoingCount = await ongoing.count();
    return ongoingCount > 0;
  }

  public async getById(simulationId: number): Promise<SimulationRun> {
    const simulation = await db.simulation_run.get(simulationId);

    if (!simulation) throw new Error(SIMULATION_ERROR.SIMULATION_NOT_FOUND);

    return simulation;
  }

  public async getRun(simulationId: number): Promise<SimulationRun | undefined> {
    return db.simulation_run.get(simulationId);
  }

  public async create(data: Omit<SimulationRun, 'simulation_run_id'>): Promise<number> {
    return db.simulation_run.add(data);
  }

  public async update(id: number, data: Partial<SimulationRun>): Promise<number> {
    return db.simulation_run.update(id, data);
  }

  public async deleteById(id: number): Promise<void> {
    return db.simulation_run.delete(id);
  }
}

export default new SimulationRunService();

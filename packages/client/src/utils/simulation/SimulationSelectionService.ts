import { db, SimulationRunSelections } from '@/utils/dbConfig.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';

const submittedFilter = (sections: SimulationRunSelections) =>
  [APPLY_STATUS.SUCCESS, APPLY_STATUS.FAILED].includes(sections.status);

class SimulationSelectionService {
  public async create(data: Omit<SimulationRunSelections, 'run_selections_id'>): Promise<number> {
    return db.simulation_run_selections.add(data);
  }

  public async update(id: number, data: Partial<SimulationRunSelections>): Promise<number> {
    return db.simulation_run_selections.update(id, data);
  }

  public async getByRunId(simulationId: number): Promise<SimulationRunSelections[]> {
    return db.simulation_run_selections.where('simulation_run_id').equals(simulationId).toArray();
  }

  public async getSubmittedByRunId(simulationId: number): Promise<SimulationRunSelections[]> {
    return db.simulation_run_selections
      .filter(s => s.simulation_run_id === simulationId && submittedFilter(s))
      .toArray();
  }

  public async getNotSubmittedByRunId(simulationId: number): Promise<SimulationRunSelections[]> {
    return db.simulation_run_selections
      .filter(s => s.simulation_run_id === simulationId && !submittedFilter(s))
      .toArray();
  }

  public async getInProgressByRunId(simulationId: number): Promise<SimulationRunSelections[]> {
    return db.simulation_run_selections
      .where('simulation_run_id')
      .equals(simulationId)
      .filter(s => s.ended_at === -1)
      .toArray();
  }

  public async deleteByRunId(simulationId: number): Promise<void> {
    await db.simulation_run_selections.where('simulation_run_id').equals(simulationId).delete();
  }

  public async countSubmitted(simulationId: number): Promise<number> {
    return db.simulation_run_selections
      .filter(run => run.simulation_run_id === simulationId && run.ended_at >= 0)
      .count();
  }
}

export default new SimulationSelectionService();

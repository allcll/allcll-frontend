/**
 * 이 파일은 시뮬레이션 관련 데이터베이스의 백업 및 복원 기능을 담당합니다.
 * Dexie.js를 사용하여 IndexedDB에 저장된 시뮬레이션 데이터(관심과목, 시뮬레이션 실행 기록 등)를
 * JSON 파일 형태로 내보내거나(백업), JSON 파일을 읽어 데이터베이스를 복원하는 기능을 제공합니다.
 * 또한, 진행 중인 시뮬레이션 데이터만 별도로 백업하거나 전체 데이터를 삭제하는 유틸리티 함수도 포함합니다.
 *
 * @function backupDatabase - 전체 데이터베이스를 'db-backup.json' 파일로 백업합니다.
 * @function backupOngoingSimulation - 진행중인 시뮬레이션 관련 데이터만 'ongoing-simulation.json' 파일로 백업합니다.
 * @function restoreDatabase - 제공된 파일을 사용하여 데이터베이스 상태를 복원합니다.
 * @function deleteAllDatabase - 데이터베이스의 모든 관련 테이블을 삭제합니다.
 * @function isValidDatabase - 현재 데이터베이스 스키마가 예상과 일치하는지 확인합니다.
 */
import { db } from '@/utils/dbConfig.ts';

const EXPECTED_TABLES = [
  'interested_snapshot',
  'interested_subject',
  'simulation_run',
  'simulation_run_selections',
  'simulation_run_events',
];

export async function backupDatabase() {
  isValidDatabase();

  const data = {
    interested_snapshot: await db.interested_snapshot.toArray(),
    interested_subject: await db.interested_subject.toArray(),
    simulation_run: await db.simulation_run.toArray(),
    simulation_run_selections: await db.simulation_run_selections.toArray(),
    simulation_run_events: await db.simulation_run_events.toArray(),
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'db-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function backupOngoingSimulation() {
  isValidDatabase();

  const simulation_run = await db.simulation_run.filter(s => s.ended_at === -1).last();
  if (!simulation_run) {
    throw new Error('진행중인 시뮬레이션이 없습니다.');
  }

  const simulation_run_selections = await db.simulation_run_selections
    .where('simulation_run_id')
    .equals(simulation_run.simulation_run_id)
    .toArray();
  const sectionIds = simulation_run_selections.map(s => s.run_selections_id);
  const simulation_run_events = await db.simulation_run_events
    .filter(e => sectionIds.includes(e.simulation_section_id))
    .toArray();

  const interested_snapshot = await db.interested_snapshot
    .where('snapshot_id')
    .equals(simulation_run.snapshot_id)
    .toArray();
  const interested_subject = await db.interested_subject
    .where('snapshot_id')
    .equals(simulation_run.snapshot_id)
    .toArray();

  const data = {
    simulation_run: [simulation_run],
    simulation_run_selections,
    simulation_run_events,
    interested_snapshot,
    interested_subject,
  };

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ongoing-simulation.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function restoreDatabase(file: File) {
  isValidDatabase();

  const text = await file.text();
  const imported = JSON.parse(text);
  await db.transaction('rw', db.interested_snapshot, db.interested_subject, async () => {
    await db.interested_snapshot.clear();
    await db.interested_subject.clear();

    await db.interested_snapshot.bulkAdd(imported.interested_snapshot || []);
    await db.interested_subject.bulkAdd(imported.interested_subject || []);
  });

  await db.transaction('rw', db.simulation_run, db.simulation_run_selections, db.simulation_run_events, async () => {
    await db.simulation_run.clear();
    await db.simulation_run_selections.clear();
    await db.simulation_run_events.clear();

    await db.simulation_run.bulkAdd(imported.simulation_run || []);
    await db.simulation_run_selections.bulkAdd(imported.simulation_run_selections || []);
    await db.simulation_run_events.bulkAdd(imported.simulation_run_events || []);
  });
}

export async function deleteAllDatabase() {
  isValidDatabase();

  await db.transaction('rw', db.interested_snapshot, db.interested_subject, async () => {
    await db.interested_snapshot.clear();
    await db.interested_subject.clear();
  });

  await db.transaction('rw', db.simulation_run, db.simulation_run_selections, db.simulation_run_events, async () => {
    await db.simulation_run.clear();
    await db.simulation_run_selections.clear();
    await db.simulation_run_events.clear();
  });
}

function isValidDatabase() {
  const currentTables = db.tables.map(table => table.name).sort();
  const expectedTables = [...EXPECTED_TABLES].sort();

  if (JSON.stringify(currentTables) !== JSON.stringify(expectedTables)) {
    throw new Error(`DB 스키마가 예상과 다릅니다: ${currentTables.join(', ')}`);
  }
}

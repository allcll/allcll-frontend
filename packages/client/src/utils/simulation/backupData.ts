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

function isValidDatabase() {
  const currentTables = db.tables.map(table => table.name).sort();
  const expectedTables = [...EXPECTED_TABLES].sort();

  if (JSON.stringify(currentTables) !== JSON.stringify(expectedTables)) {
    throw new Error(`DB 스키마가 예상과 다릅니다: ${currentTables.join(', ')}`);
  }
}

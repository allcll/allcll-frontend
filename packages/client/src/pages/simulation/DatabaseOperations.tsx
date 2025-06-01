import {
  backupDatabase,
  deleteAllDatabase,
  restoreDatabase,
  backupOngoingSimulation,
} from '@/utils/simulation/backupData';
import { forceStopSimulation } from '@/utils/simulation/simulation';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const DatabaseOperations: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleBackupDataBase = async () => {
    try {
      await backupDatabase();
      alert('Backup completed successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to backup the database.');
    }
  };

  const handleBackupOngoingSimulation = async () => {
    try {
      await backupOngoingSimulation();
      alert('Backup completed successfully.');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleRestoreDataBase = async () => {
    if (file) {
      try {
        await restoreDatabase(file);
        alert('Restore completed successfully.');
      } catch (error) {
        console.error(error);
        alert('Failed to restore the database.');
      }
    } else {
      alert('Please select a file to restore.');
    }
  };

  const handleDeleteDataBase = async () => {
    try {
      await deleteAllDatabase();
      alert('Database cleared successfully.');

      window.location.href = '/simulation';
    } catch (error) {
      console.error(error);
      alert('Failed to delete the database.');
    }
  };

  const handleForceSimulation = async () => {
    try {
      await forceStopSimulation();

      window.location.href = '/simulation';
    } catch (error) {
      console.error(error);
      alert('Failed to delete the database.');
    }
  };
  return (
    <>
      <Helmet>
        <title>ALLCLL | 시뮬레이션 데이터 베이스 관리</title>
      </Helmet>

      <div className="max-w-4xl min-h-screen mx-auto p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-900">데이터베이스 관리</h2>

        <div className="flex justify-center gap-5">
          <button
            onClick={handleBackupOngoingSimulation}
            className="bg-slate-200 cursor-pointer text-gray-800 px-6 py-3 rounded-md shadow-md hover:bg-slate-400 hover:text-white transition-colors"
          >
            진행중인 시뮬레이션 내보내기
          </button>
          <button
            onClick={handleForceSimulation}
            className="w-full md:w-auto bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors"
          >
            시뮬레이션 중지
          </button>
        </div>

        {/* Export Button */}
        <div className="flex justify-center gap-5">
          <button
            onClick={handleBackupDataBase}
            className="bg-gray-100 cursor-pointer text-gray-800 px-6 py-3 rounded-md shadow-md hover:bg-gray-400 hover:text-white transition-colors"
          >
            전체 데이터베이스 내보내기
          </button>
          <button
            onClick={handleDeleteDataBase}
            className="bg-red-600  cursor-pointer text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 hover:text-white transition-colors"
          >
            데이터 초기화
          </button>
        </div>

        {/* Import Button & File Input (Side by Side) */}
        <div className="flex items-center space-x-4 justify-center">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full md:w-80 cursor-pointer text-sm text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRestoreDataBase}
            className="bg-white cursor-pointer text-gray-800 px-6 py-3 rounded-md shadow-md hover:bg-gray-400 hover:text-white transition-colors"
          >
            데이터베이스 불러오기
          </button>
        </div>
      </div>
    </>
  );
};

export default DatabaseOperations;

import { useRef, useState } from 'react';
// import * as XLSX from 'xlsx';
import { Subject, TableHeaderNames, useSubjectTable } from '@/hooks/useSubjectTable.ts';
import LogoutSvg from '@/assets/logout.svg?react';
import SearchSvg from '@/assets/logout.svg?react';
import ExcelSvg from '@/assets/excel.svg?react';
import DownloadSvg from '@/assets/download.svg?react';
import SideNavBar from '@/components/SideNavBar.tsx';
import Button from '@/components/Button.tsx';

const LogoutLink = '';

interface ExcelData {
  [key: string]: string;
}

function App() {
  const subjects = useSubjectTable();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelData] = useState<ExcelData[]>([]);
  const [excelDataHeaders] = useState<string[]>([]);

  // const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
  // const file = event.target.files?.[0];
  // if (file) {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const jsonData: Subject[] = XLSX.utils.sheet_to_json(worksheet);
  //     setExcelData(jsonData as unknown as ExcelData[]);
  //
  //     if (jsonData.length > 0) {
  //       setExcelDataHeaders(Object.keys(jsonData[0]));
  //     }
  //
  //     console.log(jsonData);
  //   };
  //   reader.readAsArrayBuffer(file);
  // }
  // };

  const uploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <SideNavBar />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center bg-white px-6 py-4 shadow">
          <h1 className="text-xl font-bold">과목 관리</h1>
          <div className="flex space-x-4 items-center">
            <span className="text-gray-600">관리자</span>
            <a className="flex items-center gap-2 rounded bg-gray-100 text-gray-600 px-4 py-2" href={LogoutLink}>
              <LogoutSvg /> 로그아웃
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* Upload Section */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4">과목 데이터 업로드</h2>
            <div className="flex space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                // onChange={handleFileUpload}
              />
              <Button className="bg-blue-500 text-white px-4 hover:bg-blue-600" onClick={uploadButtonClick}>
                <ExcelSvg /> 엑셀 업로드
              </Button>
              <Button className="text-blue-500 px-4 py-2 rounded border border-blue-500 hover:bg-blue-50">
                <DownloadSvg /> 템플릿 다운로드
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <SearchSvg />
            <input type="text" placeholder="과목명, 교수명으로 검색" className="w-full outline-none" />
            <select className="ml-4 border px-3 py-2 rounded">
              <option>전체 학과</option>
            </select>
          </div>

          {/* excel Course Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  {/* Table Headers */}
                  {excelDataHeaders.map(name => (
                    <th key={name} className="py-2">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(0, 10).map((subject, index) => (
                  <tr key={index} className="border-b">
                    {excelDataHeaders.map(key => (
                      <td key={`${subject.subjectId}_${key}`} className="py-2">
                        {subject[key as keyof Subject]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {/*<div className="flex justify-center mt-4">*/}
            {/*  <button className="px-3 py-1 border rounded-l">이전</button>*/}
            {/*  {[1, 2, 3].map((page) => (*/}
            {/*    <button*/}
            {/*      key={page}*/}
            {/*      className={`px-3 py-1 border ${currentPage === page ? "bg-blue-500 text-white" : ""}`}*/}
            {/*      onClick={() => setCurrentPage(page)}*/}
            {/*    >*/}
            {/*      {page}*/}
            {/*    </button>*/}
            {/*  ))}*/}
            {/*  <button className="px-3 py-1 border rounded-r">다음</button>*/}
            {/*</div>*/}
          </div>

          {/* Course Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  {/* Table Headers */}
                  {TableHeaderNames.map(({ name }) => (
                    <th key={name} className="py-2">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="border-b">
                    {TableHeaderNames.map(({ key }) => (
                      <td key={`${subject.subjectId}_${key}`} className="py-2">
                        {subject[key as keyof Subject]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {/*<div className="flex justify-center mt-4">*/}
            {/*  <button className="px-3 py-1 border rounded-l">이전</button>*/}
            {/*  {[1, 2, 3].map((page) => (*/}
            {/*    <button*/}
            {/*      key={page}*/}
            {/*      className={`px-3 py-1 border ${currentPage === page ? "bg-blue-500 text-white" : ""}`}*/}
            {/*      onClick={() => setCurrentPage(page)}*/}
            {/*    >*/}
            {/*      {page}*/}
            {/*    </button>*/}
            {/*  ))}*/}
            {/*  <button className="px-3 py-1 border rounded-r">다음</button>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

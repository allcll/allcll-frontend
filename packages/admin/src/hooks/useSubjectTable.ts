import {useEffect, useState} from "react";

export const TableHeaderNames = [
  { name: "id", key: "subjectId" },
  { name: "과목코드", key: "subjectCode" },
  { name: "과목명", key: "subjectName" },
  { name: "분반", key: "classCode" },
  { name: "담당교수", key: "professorName" },
  { name: "학점", key: "credit" },
];

export interface Subject {
  classCode: string; // 분반
  professorName: string; // 교수명
  subjectCode: string; // 과목코드
  subjectId: number; // 과목 ID
  subjectName: string; // 과목명
}

export const useSubjectTable = () => {
  const [data, setData] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return data ?? [];
}
export interface ISubject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  classCode: string;
  professorName: string;
}

export function getRandomSubjects(count: number) {
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getSubjectById(subjectId: number) {
  return subjects.find((subject) => subject.subjectId === subjectId);
}

export const subjects = [
  {
    subjectId: 1405,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "001",
    professorName: "박태순"
  },
  {
    subjectId: 1406,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "002",
    professorName: "박태순"
  },
  {
    subjectId: 1407,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "003",
    professorName: "노재춘"
  },
  {
    subjectId: 1408,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "004",
    professorName: "이수정"
  },
  {
    subjectId: 1409,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "005",
    professorName: "이수정"
  },
  {
    subjectId: 1410,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "006",
    professorName: "LEE KANGWON"
  },
  {
    subjectId: 1411,
    subjectName: "운영체제",
    subjectCode: "004310",
    classCode: "007",
    professorName: "LEE KANGWON"
  },
  {
    subjectId: 1412,
    subjectName: "컴퓨터그래픽스",
    subjectCode: "003281",
    classCode: "001",
    professorName: "최수미"
  },
  {
    subjectId: 1413,
    subjectName: "데이터베이스",
    subjectCode: "007219",
    classCode: "001",
    professorName: "신동일"
  },
  {
    subjectId: 1414,
    subjectName: "데이터베이스",
    subjectCode: "007219",
    classCode: "002",
    professorName: "신동일"
  },
  {
    subjectId: 1415,
    subjectName: "데이터베이스",
    subjectCode: "007219",
    classCode: "003",
    professorName: "윤은일"
  },
  {
    subjectId: 1416,
    subjectName: "데이터베이스",
    subjectCode: "007219",
    classCode: "004",
    professorName: "Mohammad Jalil Piran"
  },
  {
    subjectId: 1417,
    subjectName: "프로그래밍언어의개념",
    subjectCode: "007313",
    classCode: "001",
    professorName: "Mohammad Jalil Piran"
  },
  {
    subjectId: 1418,
    subjectName: "딥러닝",
    subjectCode: "010881",
    classCode: "001",
    professorName: "김정현"
  },
  {
    subjectId: 1419,
    subjectName: "딥러닝",
    subjectCode: "010881",
    classCode: "002",
    professorName: ""
  },
  {
    subjectId: 1420,
    subjectName: "딥러닝",
    subjectCode: "010881",
    classCode: "003",
    professorName: "Usman Ali"
  },
  {
    subjectId: 1421,
    subjectName: "최신기술콜로키움1",
    subjectCode: "011921",
    classCode: "001",
    professorName: "한동일"
  },
  {
    subjectId: 1422,
    subjectName: "신호및시스템",
    subjectCode: "F01230",
    classCode: "001",
    professorName: "이영렬"
  },
  {
    subjectId: 1423,
    subjectName: "신호및시스템",
    subjectCode: "F01230",
    classCode: "002",
    professorName: "유영환"
  },
  {
    subjectId: 1424,
    subjectName: "Capstone디자인(산학협력프로젝트)",
    subjectCode: "009960",
    classCode: "001",
    professorName: "한동일"
  },
  {
    subjectId: 1425,
    subjectName: "Capstone디자인(산학협력프로젝트)",
    subjectCode: "009960",
    classCode: "002",
    professorName: "권기학"
  },
  {
    subjectId: 1426,
    subjectName: "Capstone디자인(산학협력프로젝트)",
    subjectCode: "009960",
    classCode: "003",
    professorName: "Rajendra Dhakal"
  },
  {
    subjectId: 1427,
    subjectName: "영상처리",
    subjectCode: "006132",
    classCode: "001",
    professorName: "이영렬"
  },
  {
    subjectId: 1428,
    subjectName: "영상처리",
    subjectCode: "006132",
    classCode: "002",
    professorName: "한동일"
  },
  {
    subjectId: 1429,
    subjectName: "정보보호개론",
    subjectCode: "006135",
    classCode: "001",
    professorName: "김민철"
  },
  {
    subjectId: 1430,
    subjectName: "정보보호개론",
    subjectCode: "006135",
    classCode: "002",
    professorName: "Tanveer Jawad"
  },
  {
    subjectId: 1431,
    subjectName: "무선통신",
    subjectCode: "006478",
    classCode: "001",
    professorName: "유영환"
  },
  {
    subjectId: 1432,
    subjectName: "무선통신",
    subjectCode: "006478",
    classCode: "002",
    professorName: "Nhu Ngoc DAO"
  },
  {
    subjectId: 1433,
    subjectName: "졸업연구및진로1",
    subjectCode: "010111",
    classCode: "001",
    professorName: "박태순"
  },
  {
    subjectId: 1434,
    subjectName: "졸업연구및진로1",
    subjectCode: "010111",
    classCode: "002",
    professorName: "신동일"
  },
  {
    subjectId: 1435,
    subjectName: "졸업연구및진로1",
    subjectCode: "010111",
    classCode: "003",
    professorName: "문승빈"
  }
];
import { Link } from "react-router-dom";

const Logs = [
  { id: 1, department: "컴퓨터공학과", name: "김민수", phone: "010-1234-5678", score: 98765 },
  { id: 2, department: "컴퓨터공학과", name: "이영희", phone: "010-2345-6789", score: 12345 },
  { id: 3, department: "컴퓨터공학과", name: "박철수", phone: "010-3456-7890", score: 54321 },
  { id: 4, department: "컴퓨터공학과", name: "최지은", phone: "010-4567-8901", score: 67890 },
  { id: 5, department: "컴퓨터공학과", name: "정하늘", phone: "010-5678-9012", score: 23456 },
]

function Dashboard() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">모의 수강 신청 로그</h1>
        <div>
          <input type="text" className="border border-gray-300"/>
        </div>
      </div>

        <section>
          {Logs.map((log, index) => (
            <Link key={index} to={`/simulation/logs/${log.id}`} className="block bg-white p-6 rounded-2xl shadow-sm mb-2 hover:bg-gray-100">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <label className="font-bold">{log.id}</label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold">학과</label>
                  <span>{log.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-bold">이름</label>
                  <span>{log.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-bold">전화번호</label>
                  <span>{log.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-bold">점수</label>
                  <span>{log.score}</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
    </>
  );
}

export default Dashboard;
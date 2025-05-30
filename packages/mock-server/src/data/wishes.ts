// 학과 랜덤으로 몇개 뽑아서 totalCount에 합계가 맞도록 넣어주기
export const getDepartmentRegister = (totalCount: number) => {
  return {
    eachDepartmentRegisters: [
      {
        studentBelong: '본교생',
        registerDepartment: '컴퓨터공학과',
        eachCount: totalCount - 3,
      },
      {
        studentBelong: '본교생',
        registerDepartment: '소프트웨어학과',
        eachCount: 3,
      },
    ],
  };
};

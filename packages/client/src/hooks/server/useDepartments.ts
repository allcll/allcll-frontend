import {useQuery} from '@tanstack/react-query';

export interface Department {
  departmentName: string
  departmentCode: string
}

interface DepartmentsAPIResponse {
  departments: Department[]
}

function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    staleTime: Infinity,
    select: (data: DepartmentsAPIResponse) => {
      const departments = data.departments;
      departments.sort((a, b) => a.departmentName.localeCompare(b.departmentName));

      return departments;
    },
  });
}

const fetchDepartments = async (): Promise<DepartmentsAPIResponse> => {
  const response = await fetch('/api/departments', {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export interface DepartmentDict {
  universityDict: Record<string, string[]>
  collegeDict: Record<string, string[]>
}

export const useDepartmentDict = (departments?: Department[]): DepartmentDict => {
  if (!departments)
    return {universityDict: {}, collegeDict: {}};

  let universityDict: Record<string, string[]> = {};
  let collegeDict: Record<string, string[]> = {};

  departments.forEach((departments) => {
    const [universityName, collegeName, departmentName] = departments.departmentName.split(' ');
    const university = universityName.trim();
    const college = collegeName?.trim();
    const department = departmentName?.trim();

    if (!!college) {
      if (!universityDict[university]) {
        universityDict[university] = [];
      }
      universityDict[university] = [...universityDict[university], college];

      if (!department) {
        collegeDict[college] = [college];
      }
    }

    if (!!department) {
      if (!universityDict[university]) {
        universityDict[university] = [];
      }
      universityDict[university] = [...universityDict[university], department];

      if (!collegeDict[college]) {
        collegeDict[college] = [];
      }
      collegeDict[college] = [...collegeDict[college], department];
    }
  });

  return {universityDict, collegeDict};
}

export const searchFromUniversity = (searchInput: string, universityDict: Record<string, string[]>) => {
  const names = searchInput.split(' ').map((name) => name.trim());

  for (const universityName in universityDict) {
    if (names.some(name => universityDict[universityName].includes(name))) {
      return universityName;
    }
  }

  console.error('No university found', searchInput);
  return '';
}

export const searchFromCollege = (searchInput: string, collegeDict: Record<string, string[]>) => {
  const names = searchInput.split(' ').map((name) => name.trim());

  for (const collegeName in collegeDict) {
    if (names.some(name => collegeName.includes(name))) {
      return collegeName;
    }
  }

  console.error('No college found', searchInput);
  return '';
}

export default useDepartments;
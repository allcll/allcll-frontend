// do not use path aliases here, they are not available in the mock server
export const DataType = {
  BASKETS: { key: 'baskets', path: '../../../client/public/baskets.json' },
  DEPARTMENTS: { key: 'departments', path: '../../public/departments.json' },
  LECTURES: { key: 'lectures', path: '../../public/subjects.json' },
};

const data: Record<string, any> = {};

export async function getData(dataType: (typeof DataType)[keyof typeof DataType]) {
  if (dataType.key in data) {
    return data[dataType.key];
  }

  return await import(dataType.path);
}

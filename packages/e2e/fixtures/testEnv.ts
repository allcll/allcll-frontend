export interface Environment {
  targetUrl: string;
  // 필요한 필드 추가
}

let env: Environment | undefined;

export async function getTestEnv(): Promise<Environment> {
  if (env) return env;

  // JSON 파일을 동적으로 import
  let testEnv;
  if (process.env.VITE_TEST_ENV) {
    testEnv = JSON.parse(process.env.VITE_TEST_ENV);
  } else {
    const json = await import('../environment.json');
    testEnv = json.default;
  }

  env = {
    targetUrl: testEnv['target-url'],
  };

  return env;
}

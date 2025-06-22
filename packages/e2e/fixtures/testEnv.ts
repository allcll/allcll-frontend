import environment from '../environment.json';
// Fixme: Dynamic import is not supported in this context, so we use a static import instead

export interface Environment {
  targetUrl: string;
  // 필요한 필드 추가
}

let env: Environment | undefined;

export async function getTestEnv(): Promise<Environment> {
  if (env) return env;

  let testEnv;
  if (process.env.VITE_TEST_ENV) {
    testEnv = JSON.parse(process.env.VITE_TEST_ENV);
  } else {
    testEnv = environment;
  }

  env = {
    targetUrl: testEnv['target-url'],
  };

  return env;
}

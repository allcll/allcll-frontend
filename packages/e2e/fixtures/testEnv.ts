export interface Environment {
  targetUrl: string;
  // 필요한 필드 추가
}

interface Env {
  default: Environment;
}

let env: Environment | undefined;

export async function getTestEnv(): Promise<Environment> {
  if (env) return env;

  let testEnv;
  if (process.env.VITE_TEST_ENV) {
    testEnv = JSON.parse(process.env.VITE_TEST_ENV);
  } else {
    testEnv = ((await import('../environment.json', { assert: { type: 'json' } })) as unknown as Env)['default'];
  }

  env = {
    targetUrl: testEnv['target-url'],
  };

  return env;
}

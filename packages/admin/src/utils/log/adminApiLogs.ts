import { AdminApiLogs, db } from '../dbConfig';

/**
 *  * 새로운 Admin에서 요청한 API 로그를 추가합니다.
 * @param response
 * @param method
 * @param request_body
 * @returns
 */
export async function addRequestLog(response: Response, method: string, request_body: any) {
  const { status: statusCode, url, body } = response;

  await db.admin_api_logs.add({
    statusCode: statusCode,
    method: method,
    request_url: url,
    timestamp: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    request_body: request_body,
    response_body: JSON.stringify(body) || '',
  });
  return {};
}

/**
 * IndexedDB에 저장된 모든 API 로그를 가져옵니다.
 * @returns {Promise<AdminApiLogs[]>} - 로그 배열 또는 에러
 */
export async function getRequestLogs(): Promise<AdminApiLogs[]> {
  try {
    return await db.admin_api_logs.toArray();
  } catch (e) {
    console.error('Failed to get logs from IndexedDB:', e);
    throw e;
  }
}

/**
 *IndexedDB에 저장된 API로그 중 method를 선택하여 필터링 합니다.
 * @param statusCode
 * @param request_url
 * @returns
 */
export async function filterRequestLogs(statusCode?: number, request_url?: string) {
  try {
    if (statusCode) {
      return (await db.admin_api_logs.toArray()).filter(log => {
        return log.statusCode === statusCode && log.request_url.includes(request_url ?? '');
      });
    }

    const logs = await db.admin_api_logs.toArray();
    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch (e) {
    console.error('Failed to get logs from IndexedDB:', e);
    throw e;
  }
}

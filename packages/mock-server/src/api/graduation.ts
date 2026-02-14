import { http, HttpResponse } from 'msw';
import { getGraduationState, setGraduationState, resetGraduationState } from '../utils/graduation-state';
import { userProfiles } from '../data/graduation/profiles';
import { criteriaData } from '../data/graduation/criteria';
import { checkResultsByUserType } from '../data/graduation/results';
import { categoriesData } from '../data/graduation/categories';

export const handlers = [
  // 1-1. POST /api/auth/login
  http.post('/api/auth/login', async () => {
    setGraduationState({ isAuthenticated: true });
    return HttpResponse.json({}, { status: 200 });
  }),

  // 1-2. POST /api/auth/logout
  http.post('/api/auth/logout', async () => {
    setGraduationState({ isAuthenticated: false });
    return HttpResponse.json({}, { status: 200 });
  }),

  // 1-3. GET /api/auth/me
  http.get('/api/auth/me', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(userProfiles[state.userType]);
  }),

  // 1-4. PATCH /api/auth/me
  http.patch('/api/auth/me', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    // 실제로는 request body를 파싱해서 userType을 변경하는 로직이 들어갈 수 있음
    // 여기서는 단순 성공 응답
    return HttpResponse.json({}, { status: 200 });
  }),

  // 1-5. DELETE /api/auth/me
  http.delete('/api/auth/me', async () => {
    resetGraduationState();
    return new HttpResponse(null, { status: 204 });
  }),

  // 3-1. GET /api/graduation/certifications/criteria
  http.get('/api/graduation/certifications/criteria', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({
      data: criteriaData[state.userType],
    });
  }),

  // 3-6. GET /api/graduation/criteria/categories
  http.get('/api/graduation/criteria/categories', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(categoriesData[state.userType]);
  }),

  // 3-7. GET /api/graduation/certifications/overview
  http.get('/api/graduation/certifications/overview', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    // overview 데이터도 criteriaData의 일부를 재사용하거나 별도 정의 가능
    // 여기서는 criteriaData의 context와 policy를 조합해서 응답
    const criteria = criteriaData[state.userType];
    return HttpResponse.json({
      data: {
        context: criteria.context,
        policy: {
          ...criteria.policy,
          criteria: ['ENGLISH', 'CLASSIC', 'CODING'],
          version: 3,
        },
        targets: {
          english: {
            targetType: criteria.englishCriteria.targetType,
          },
          coding: {
            targetType: criteria.codingCriteria.targetType,
          },
        },
      },
    });
  }),

  // 4-2. GET /api/graduation/departments
  http.get('/api/graduation/departments', async () => {
    // 로그인 여부와 상관없이 조회 가능하다고 가정 (또는 필요 시 체크)
    return HttpResponse.json({
      admissionYear: 2023,
      departments: [
        {
          deptCd: '3523',
          deptNm: '콘텐츠소프트웨어학과',
          collegeNm: '인공지능융합대학',
          deptGroup: 'NATURAL_SCI',
          englishTargetType: 'NON_MAJOR',
          codingTargetType: 'CODING_MAJOR',
        },
        {
          deptCd: '9999',
          deptNm: '영어영문학과',
          collegeNm: '인문과학대학',
          deptGroup: 'HUMANITIES',
          englishTargetType: 'ENGLISH_MAJOR',
          codingTargetType: 'NON_MAJOR',
        },
        {
          deptCd: '1001',
          deptNm: '컴퓨터공학과',
          collegeNm: '공과대학',
          deptGroup: 'NATURAL_SCI',
          englishTargetType: 'NON_MAJOR',
          codingTargetType: 'CODING_MAJOR',
        },
      ],
    });
  }),

  // 5-1. POST /api/graduation/check
  http.post('/api/graduation/check', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    // 파일 업로드 성공 시 상태를 DONE으로 변경
    setGraduationState({ graduationStep: 'DONE' });
    return new HttpResponse(null, { status: 201 });
  }),

  // 5-2. GET /api/graduation/check
  http.get('/api/graduation/check', async () => {
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }

    if (state.graduationStep === 'NO_FILE') {
      return new HttpResponse(null, { status: 404 });
    }

    if (state.graduationStep === 'PROCESSING') {
      return new HttpResponse(null, { status: 404 });
    }

    const result = checkResultsByUserType[state.userType];

    return HttpResponse.json({
      data: result,
    });
  }),

  // Debug API: 상태 강제 변경
  http.post('/api/debug/graduation/state', async ({ request }) => {
    const body = (await request.json()) as any;
    const newState = setGraduationState(body);
    return HttpResponse.json(newState);
  }),

  // Debug API: 상태 조회
  http.get('/api/debug/graduation/state', async () => {
    return HttpResponse.json(getGraduationState());
  }),
];

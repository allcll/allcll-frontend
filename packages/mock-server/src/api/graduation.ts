import { http, HttpResponse, delay } from 'msw';
import { getGraduationState, setGraduationState, resetGraduationState } from '../utils/graduation-state';
import { userProfiles } from '../data/graduation/profiles';
import { criteriaData } from '../data/graduation/criteria';
import { checkResultsByUserType } from '../data/graduation/results';
import { categoriesData } from '../data/graduation/categories';
import { coursesDataByUserType } from '../data/graduation/courses';

export const handlers = [
  // 1-1. POST /api/auth/login
  http.post('/api/auth/login', async () => {
    await delay(1000);
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
    await delay(800);
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
    return HttpResponse.json(criteriaData[state.userType]);
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
        // 소프트웨어융합대학
        { deptCd: '3220', deptNm: '소프트웨어학과', collegeNm: '소프트웨어융합대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'CODING_MAJOR' },
        { deptCd: '3221', deptNm: '컴퓨터공학과', collegeNm: '소프트웨어융합대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'CODING_MAJOR' },
        { deptCd: '3222', deptNm: '정보보호학과', collegeNm: '소프트웨어융합대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'CODING_MAJOR' },
        // 인공지능융합대학
        { deptCd: '38191', deptNm: '데이터사이언스학과', collegeNm: '인공지능융합대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'CODING_MAJOR' },
        { deptCd: '3523', deptNm: '콘텐츠소프트웨어학과', collegeNm: '인공지능융합대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'CODING_MAJOR' },
        { deptCd: '3524', deptNm: '인공지능학과', collegeNm: '인공지능융합대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'CODING_MAJOR' },
        // 공과대학
        { deptCd: '1001', deptNm: '기계항공우주공학부', collegeNm: '공과대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '1002', deptNm: '전자정보통신공학부', collegeNm: '공과대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '1003', deptNm: '건설환경공학부', collegeNm: '공과대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '1004', deptNm: '건축학부', collegeNm: '공과대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '1005', deptNm: '나노신소재공학부', collegeNm: '공과대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        // 자연과학대학
        { deptCd: '2001', deptNm: '수학통계학부', collegeNm: '자연과학대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '2002', deptNm: '물리천문학과', collegeNm: '자연과학대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '2003', deptNm: '화학과', collegeNm: '자연과학대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '2004', deptNm: '생명시스템학부', collegeNm: '자연과학대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        // 경영경제대학
        { deptCd: '4001', deptNm: '경영학부', collegeNm: '경영경제대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '4002', deptNm: '경제학과', collegeNm: '경영경제대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '4003', deptNm: '무역학부', collegeNm: '경영경제대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '4004', deptNm: '호텔관광외식경영학부', collegeNm: '경영경제대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        // 인문과학대학
        { deptCd: '9999', deptNm: '영어영문학과', collegeNm: '인문과학대학', deptGroup: 'HUMANITIES', englishTargetType: 'ENGLISH_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '5002', deptNm: '국어국문학과', collegeNm: '인문과학대학', deptGroup: 'HUMANITIES', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '5003', deptNm: '역사학과', collegeNm: '인문과학대학', deptGroup: 'HUMANITIES', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '5004', deptNm: '중어중문학과', collegeNm: '인문과학대학', deptGroup: 'HUMANITIES', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '5005', deptNm: '일어일문학과', collegeNm: '인문과학대학', deptGroup: 'HUMANITIES', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        // 사회과학대학
        { deptCd: '6001', deptNm: '행정학과', collegeNm: '사회과학대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '6002', deptNm: '미디어커뮤니케이션학과', collegeNm: '사회과학대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '6003', deptNm: '도시부동산학과', collegeNm: '사회과학대학', deptGroup: 'SOCIAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        // 예체능대학
        { deptCd: '7001', deptNm: '체육학과', collegeNm: '예체능대학', deptGroup: 'ARTS', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '7002', deptNm: '회화과', collegeNm: '예체능대학', deptGroup: 'ARTS', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '7003', deptNm: '만화애니메이션텍학과', collegeNm: '예체능대학', deptGroup: 'ARTS', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '7004', deptNm: '패션디자인학과', collegeNm: '예체능대학', deptGroup: 'ARTS', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        // 의약학대학
        { deptCd: '8001', deptNm: '간호학과', collegeNm: '의약학대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
        { deptCd: '8002', deptNm: '바이오융합공학부', collegeNm: '의약학대학', deptGroup: 'NATURAL_SCI', englishTargetType: 'NON_MAJOR', codingTargetType: 'NON_MAJOR' },
      ],
    });
  }),

  // 5-1. POST /api/graduation/check
  http.post('/api/graduation/check', async () => {
    await delay(2000);
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
    await delay(1500);
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

    return HttpResponse.json(result);
  }),

  // 6-1. GET /api/graduation/courses
  http.get('/api/graduation/courses', async () => {
    await delay(1000);
    const state = getGraduationState();
    if (!state.isAuthenticated) {
      return new HttpResponse(null, { status: 401 });
    }
    if (state.graduationStep !== 'DONE') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(coursesDataByUserType[state.userType]);
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

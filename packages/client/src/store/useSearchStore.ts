import { create } from 'zustand';

interface Filter {
  type: string; // 필터 타입 (일치, 이상, 이하)
  value: string; // 필터 값 (예: 학점, 여석 등)
}

interface ISearchStore {
  searches: {
    keyword: string; // 키워드 (과목명, 교수명, 학수번호, 분반)
    department: string | null; // 학과
    category: string | null; // 수업유형
    grade: string[]; // 학년
    credit: string[]; // 학점
    time: string; // 수업시간 (요일/시간)
    classroom: string[]; // 강의실
    note: string; // 비고 (외국인, 영어강의 등)
    language: string; // 강의언어
    wishes: Filter; // 관심과목 (일치, 이상, 이하)
    seats: Filter; // 여석 (일치, 이상, 이하)
    isFavorite: boolean; // 즐겨찾기 여부
    isPinned: boolean; // 알림 과목 여부
  };

  isFiltered: boolean;
  setSearches: (key: keyof ISearchStore['searches'], value: string | string[] | Filter | boolean | null) => void;
  setToggled: (key: 'isFavorite' | 'isPinned') => void;
  resetSearches: () => void;
}

// - [ ]  필터(chip) → 학점, 학년, 여석, 관심과목 수
// - [ ]  세부 필터(modal) → 수업시간(요일/시간), 강의실, 비고(외국인…)

const InitialSearches: ISearchStore['searches'] = {
  keyword: '',
  department: null,
  category: null,
  grade: [],
  credit: [],
  time: '',
  classroom: [],
  note: '',
  language: '',
  wishes: { type: '=', value: '' },
  seats: { type: '=', value: '' },
  isFavorite: false,
  isPinned: false,
};

const createSearchStore = () =>
  create<ISearchStore>(set => ({
    searches: { ...InitialSearches },

    isFiltered: false,
    setSearches: (key, value) => {
      if (key === 'wishes' || key === 'seats') {
        return set(state => ({
          searches: {
            ...state.searches,
            [key]: { ...(state.searches[key] as Filter) },
          },
        }));
      }
      return set(state => ({
        searches: {
          ...state.searches,
          [key]: value,
        },
      }));
    },
    setToggled: key =>
      set(state => ({
        searches: {
          ...state.searches,
          [key]: !state.searches[key],
        },
      })),
    resetSearches: () =>
      set(() => ({
        searches: { ...InitialSearches },
        isFiltered: false,
      })),
  }));

// 다른 필터도 이런식으로 한번에 설계하고 내보내는 식으로 설계
export const useSearchStore = createSearchStore();

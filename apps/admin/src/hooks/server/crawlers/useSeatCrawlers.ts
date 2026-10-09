import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastNotification } from '@allcll/common';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { getSessionConfig, isValidSession } from '@/utils/sessionConfig.ts';
import { REFETCH_INTERVAL } from '@/hooks/server/session/useAdminSession.ts';

export type SeatUtilsType = 'TOTAL' | 'GRADE_1' | 'GRADE_2' | 'GRADE_3' | 'GRADE_4';

interface ISeatUtilsOption {
    value: SeatUtilsType;
    label: string;
}

export const SEAT_UTILS_OPTIONS: ISeatUtilsOption[] = [
    { value: 'TOTAL', label: '전체' },
    { value: 'GRADE_1', label: '1학년' },
    { value: 'GRADE_2', label: '2학년' },
    { value: 'GRADE_3', label: '3학년' },
    { value: 'GRADE_4', label: '4학년' },
];

const getSeatUtilsLabel = (seatUtilsType: SeatUtilsType) =>
    SEAT_UTILS_OPTIONS.find(option => option.value === seatUtilsType)?.label ?? '전체';

const startCrawlersSeat = async (userId: string, seatUtilsType: SeatUtilsType = 'TOTAL') => {
    const response = await fetchOnAPI(`/api/admin/seat/start?userId=${userId}&seatUtilsType=${seatUtilsType}`, {
        method: 'POST',
    });

    const response_body = await response.text();
    if (!response.ok) {
        await addRequestLog(response, 'POST', '');
        throw new Error(response_body);
    }

    await addRequestLog(response, 'POST', '');

    return response;
};

const cancelCrawlersSeat = async () => {
    const response = await fetchOnAPI('/api/admin/seat/cancel', {
        method: 'POST',
    });

    const response_body = await response.text();

    if (!response.ok) {
        await addRequestLog(response, 'POST', '');
        throw new Error(response_body);
    }

    await addRequestLog(response, 'POST', '');

    return response;
};

const startSeasonCrawlersSeat = async (userId: string, seatUtilsType: SeatUtilsType = 'TOTAL') => {
    const response = await fetchOnAPI(`/api/admin/season-seat/start?userId=${userId}&seatUtilsType=${seatUtilsType}`, {
        method: 'POST',
    });

    const response_body = await response.text();
    if (!response.ok) {
        await addRequestLog(response, 'POST', '');
        throw new Error(response_body);
    }

    await addRequestLog(response, 'POST', '');
    return response;
};

interface CheckedCrawlerSeatResponse {
    userId: string;
    isActive: boolean;
}

const checkCrawlersSeat = async () => {
    return await fetchJsonOnAPI<CheckedCrawlerSeatResponse>('/api/admin/seat/check');
};

/**
 *여석 크롤링 상태를 확인하는 API입니다.
 * @returns
 */
export function useCheckCrawlerSeat() {
    const isValid = isValidSession();

    return useQuery({
        queryKey: ['check-seat'],
        queryFn: checkCrawlersSeat,
        select: data => data,
        staleTime: 0, // 항상 stale로 간주
        refetchInterval: REFETCH_INTERVAL,
        enabled: isValid,
    });
}

/**
 *여석 크롤링을 시작하는 API입니다.
 * @returns
 */
export function useStartCrawlersSeat() {
    const toast = useToastNotification.getState().addToast;
    const session = getSessionConfig();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (seatUtilsType: SeatUtilsType = 'TOTAL') => startCrawlersSeat(session?.userId ?? '', seatUtilsType),
        onSuccess: async (_, seatUtilsType) => {
            toast(`${getSeatUtilsLabel(seatUtilsType ?? 'TOTAL')} 여석 크롤링이 시작되었습니다.`, 'seat-crawl-start');

            await queryClient.invalidateQueries({ queryKey: ['check-seat'] });
        },
        onError: err => console.error(err),
    });
}

/**
 *여석 크롤링을 중단하는 API입니다.
 * @returns
 */
export function useCancelCrawlersSeat() {
    const toast = useToastNotification.getState().addToast;
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelCrawlersSeat,
        onSuccess: async () => {
            toast('여석 크롤링이 중단되었습니다.', 'seat-crawl-stop');

            await queryClient.invalidateQueries({ queryKey: ['check-seat'] });
        },
        onError: err => console.error(err),
    });
}

/**
 * 계절학기 여석 크롤링을 시작하는 API입니다.
 * @returns
 */
export function useStartSeasonCrawlersSeat() {
    const toast = useToastNotification.getState().addToast;
    const session = getSessionConfig();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (seatUtilsType: SeatUtilsType = 'TOTAL') =>
            startSeasonCrawlersSeat(session?.userId ?? '', seatUtilsType),
        onSuccess: async (_, seatUtilsType) => {
            toast(`${getSeatUtilsLabel(seatUtilsType ?? 'TOTAL')} 계절 여석 크롤링이 시작되었습니다.`, 'season-seat-crawl-start');
            await queryClient.invalidateQueries({ queryKey: ['check-seat'] });
        },
        onError: err => console.error(err),
    });
}

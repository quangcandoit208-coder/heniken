import { CalendarDataResponse } from '../types';

export const fetchCalendarData = async (): Promise<CalendarDataResponse> => {
  const response = await fetch('/api/calendar-data');
  if (!response.ok) {
    let detail = '';
    try {
      const payload = await response.json() as { error?: string };
      detail = payload.error ? `: ${payload.error}` : '';
    } catch {
      detail = '';
    }
    throw new Error(`Không thể tải dữ liệu lịch (${response.status})${detail}`);
  }
  return response.json();
};

import { CalendarDataResponse } from '../types';

export const fetchCalendarData = async (): Promise<CalendarDataResponse> => {
  const response = await fetch('/api/calendar-data');
  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu lịch (${response.status})`);
  }
  return response.json();
};

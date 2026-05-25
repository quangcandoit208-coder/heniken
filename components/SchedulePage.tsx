
import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from './FilterBar';
import EventTable from './EventTable';
import PaginationControls from './PaginationControls';
import { FilterState, ProgramEvent, SortConfig, SortField, AppSettings } from '../types';
import { CalendarRange } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';

interface SchedulePageProps {
  events: ProgramEvent[];
  settings?: AppSettings;
  initialBrandFilter?: string | null;
  language: 'vi' | 'en';
}

const SchedulePage: React.FC<SchedulePageProps> = ({ events, settings, initialBrandFilter, language }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    city: '',
    brand: '',
    bu: '', // Initialize bu filter
    dateFrom: '',
    dateTo: ''
  });

  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    if (initialBrandFilter) {
      setFilters(prev => ({ ...prev, brand: initialBrandFilter }));
    }
  }, [initialBrandFilter]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    order: 'asc'
  });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      order: current.field === field && current.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      city: '',
      brand: '',
      bu: '', // Reset bu filter
      dateFrom: '',
      dateTo: ''
    });
    setShowPastEvents(false);
  };

  const dateWindow = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - diffToMonday);

    const startDate = new Date(currentMonday);
    startDate.setDate(currentMonday.getDate() - 7);

    const endDate = new Date(currentMonday);
    endDate.setDate(currentMonday.getDate() + 13);

    const toISODate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const toVNString = (d: Date) => {
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    const prefix = language === 'vi' ? 'Từ' : 'From';
    const middle = language === 'vi' ? 'đến' : 'to';
    const suffix = language === 'vi' ? '(3 tuần)' : '(3 weeks)';

    return {
        start: toISODate(startDate),
        end: toISODate(endDate),
        label: `${prefix} ${toVNString(startDate)} ${middle} ${toVNString(endDate)} ${suffix}`
    };
  }, [language]);

  const processedEvents = useMemo(() => {
    let result = [...events];
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    result = result.filter(e => e.date >= dateWindow.start && e.date <= dateWindow.end);

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(e => 
        e.venue.toLowerCase().includes(searchLower) || 
        e.address.toLowerCase().includes(searchLower)
      );
    }
    if (filters.city) {
      result = result.filter(e => e.city === filters.city);
    }
    if (filters.bu) {
      result = result.filter(e => e.bu === filters.bu);
    }
    if (filters.brand) {
      result = result.filter(e => e.brand === filters.brand);
    }
    
    if (filters.dateFrom) {
      result = result.filter(e => e.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(e => e.date <= filters.dateTo);
    }

    if (!showPastEvents) {
        result = result.filter(e => e.date >= today);
    }

    result.sort((a, b) => {
      const isPastA = a.date < today;
      const isPastB = b.date < today;

      if (isPastA !== isPastB) {
          return isPastA ? 1 : -1;
      }

      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === undefined || bValue === undefined) return 0;

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [events, filters, sortConfig, showPastEvents, dateWindow]);

  const {
    currentPage,
    pageSize,
    paginatedItems: paginatedEvents,
    setCurrentPage,
    totalItems,
    totalPages,
  } = usePagination(processedEvents, 20);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig, showPastEvents, setCurrentPage]);

  const t = {
    range: language === 'vi' ? 'Phạm vi:' : 'Range:',
    title: language === 'vi' ? 'Lịch trình Activation' : 'Activation Schedule',
    subtitle: language === 'vi' ? settings?.scheduleSubtitle || 'Tìm kiếm và theo dõi các hoạt động mới nhất.' : 'Search and track the latest activities.'
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l7.5 22.5h22.5l-18 13.5 7.5 22.5-18-13.5-18 13.5 7.5-22.5-18-13.5h22.5z' fill='%23FFFFFF' stroke='%23d1d5db' stroke-width='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-3 sm:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4">
            <div>
                <h2 className="text-xl md:text-4xl font-black text-green-900 leading-tight">
                    {t.title}
                </h2>
                <p className="text-[10px] md:text-lg text-gray-500">
                    {t.subtitle}
                </p>
            </div>
            <div className="w-fit bg-white/80 backdrop-blur-sm border border-green-100 text-green-800 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-sm font-bold flex items-center gap-1.5 shadow-sm">
                <CalendarRange className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span>{t.range} {dateWindow.label}</span>
            </div>
        </div>

        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          showPastEvents={showPastEvents}
          setShowPastEvents={setShowPastEvents}
          onReset={handleResetFilters} 
          language={language}
          context="Activation"
          variant="green"
        />

        <EventTable 
          events={paginatedEvents} 
          sortConfig={sortConfig} 
          onSort={handleSort}
          language={language}
          totalEvents={processedEvents.length}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          language={language}
        />
      </div>
    </div>
  );
};

export default SchedulePage;

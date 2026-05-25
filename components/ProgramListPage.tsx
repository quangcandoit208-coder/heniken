
import React, { useState, useMemo, useEffect } from 'react';
import { Promotion, ProgramType, Region, View } from '../types';
import { REGIONS } from '../constants';
import { Calendar, Tag, Search, Filter, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import PaginationControls from './PaginationControls';
import { usePagination } from '../hooks/usePagination';

interface ProgramListPageProps {
  promotions: Promotion[];
  onSelectProgram: (id: string) => void;
  setCurrentView: (view: View) => void;
  language: 'vi' | 'en';
}

const ProgramListPage: React.FC<ProgramListPageProps> = ({ promotions, onSelectProgram, setCurrentView, language }) => {
  const [filterType, setFilterType] = useState<ProgramType | 'All'>('All');
  const [filterRegion, setFilterRegion] = useState<Region | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const oneMonthAgoStr = `${oneMonthAgo.getFullYear()}-${String(oneMonthAgo.getMonth() + 1).padStart(2, '0')}-${String(oneMonthAgo.getDate()).padStart(2, '0')}`;

  const { activePrograms, pastPrograms } = useMemo(() => {
    const filtered = promotions.filter(p => {
      if (p.endDate < oneMonthAgoStr) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterType !== 'All' && p.type !== filterType) return false;
      if (filterRegion !== 'All' && !p.regions.includes(filterRegion)) return false;
      return true;
    });

    const active = filtered.filter(p => p.endDate >= todayStr);
    const past = filtered.filter(p => p.endDate < todayStr);

    active.sort((a, b) => b.startDate.localeCompare(a.startDate));
    past.sort((a, b) => b.endDate.localeCompare(a.endDate));

    return { activePrograms: active, pastPrograms: past };
  }, [promotions, filterType, filterRegion, searchQuery, todayStr, oneMonthAgoStr]);

  const {
    currentPage: activePage,
    pageSize: activePageSize,
    paginatedItems: paginatedActivePrograms,
    setCurrentPage: setActivePage,
    totalItems: activeTotalItems,
    totalPages: activeTotalPages,
  } = usePagination(activePrograms, 12);

  const {
    currentPage: pastPage,
    pageSize: pastPageSize,
    paginatedItems: paginatedPastPrograms,
    setCurrentPage: setPastPage,
    totalItems: pastTotalItems,
    totalPages: pastTotalPages,
  } = usePagination(pastPrograms, 12);

  useEffect(() => {
    setActivePage(1);
    setPastPage(1);
  }, [filterType, filterRegion, searchQuery, setActivePage, setPastPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  const t = {
    title: language === 'vi' ? 'Thông Tin Chương Trình' : 'Program Information',
    searchPlaceholder: language === 'vi' ? 'Tìm tên chương trình...' : 'Search programs...',
    allRegions: language === 'vi' ? 'Tất cả khu vực' : 'All Regions',
    all: language === 'vi' ? 'Tất cả' : 'All',
    activeTitle: language === 'vi' ? 'Chương trình đang diễn ra' : 'Ongoing Programs',
    pastTitle: language === 'vi' ? 'Đã kết thúc (Gần đây)' : 'Ended (Recently)',
    noResults: language === 'vi' ? 'Không có chương trình nào đang diễn ra phù hợp với bộ lọc.' : 'No ongoing programs matching the filters.',
    note: language === 'vi' ? '* Lưu ý: Các chương trình đã kết thúc hơn 30 ngày sẽ tự động ẩn khỏi danh sách.' : '* Note: Programs ended more than 30 days ago are hidden automatically.',
    ended: language === 'vi' ? 'Đã kết thúc' : 'Ended',
    running: language === 'vi' ? 'Đang chạy' : 'Running',
    expired: language === 'vi' ? 'Hết hạn' : 'Expired'
  };

  const getBrandColor = (brand: string) => {
    const lower = brand.toLowerCase();
    if (lower.includes('heineken')) return 'bg-green-600';
    if (lower.includes('tiger')) return 'bg-orange-500';
    if (lower.includes('bia việt')) return 'bg-red-600';
    if (lower.includes('bivina')) return 'bg-rose-500';
    if (lower.includes('larue')) return 'bg-yellow-500';
    if (lower.includes('strongbow')) return 'bg-pink-500';
    return 'bg-blue-600';
  };

  const ProgramCard = ({ promo, isPast }: { promo: Promotion; isPast?: boolean }) => (
    <div 
        key={promo.id} 
        onClick={() => onSelectProgram(promo.id)} 
        className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all ${isPast ? 'opacity-70 grayscale-[50%]' : ''}`}
    >
        <div className="relative h-48 overflow-hidden">
            <picture className="w-full h-full">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </picture>
            <div className="absolute top-4 left-4 flex gap-2">
                 <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase shadow-sm ${getBrandColor(promo.brand)}`}>
                    {promo.brand}
                </span>
                 <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold shadow-sm">
                    {promo.type}
                </span>
            </div>
            {isPast && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-gray-800/80 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{t.ended}</span>
                </div>
            )}
        </div>
        <div className="p-5">
            <h3 className={`text-lg font-bold mb-3 line-clamp-2 leading-tight ${isPast ? 'text-gray-600' : 'text-gray-900 group-hover:text-green-700'}`}>
                {promo.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {promo.regions.map(r => (
                    <span key={r} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-medium rounded border border-gray-100 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {r}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-3 border-t border-gray-50">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(promo.startDate)}</span>
                {isPast ? (
                    <span className="flex items-center gap-1 text-red-400 font-medium"><XCircle className="w-3 h-3" /> {t.expired}</span>
                ) : (
                    <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle2 className="w-3 h-3" /> {t.running}</span>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                {t.title}
            </h1>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                        value={filterRegion}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterRegion(e.target.value as Region | 'All')}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none text-sm cursor-pointer"
                    >
                        <option value="All">{t.allRegions}</option>
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
                    {['All', 'Activation', 'AWO'].map(t_val => (
                        <button 
                            key={t_val} 
                            onClick={() => setFilterType(t_val as any)} 
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === t_val ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t_val === 'All' ? t.all : t_val}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">{t.activeTitle}</h2>
                <div className="h-px bg-gray-200 w-full"></div>
            </div>
            {activePrograms.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedActivePrograms.map(promo => <ProgramCard key={promo.id} promo={promo} />)}
                
                </div>
                <div className="mt-6">
                    <PaginationControls
                        currentPage={activePage}
                        totalPages={activeTotalPages}
                        totalItems={activeTotalItems}
                        pageSize={activePageSize}
                        onPageChange={setActivePage}
                        language={language}
                    />
                </div>
              </>
            ) : (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                    {t.noResults}
                </div>
            )}
        </div>

        {pastPrograms.length > 0 && (
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-500 whitespace-nowrap">{t.pastTitle}</h2>
                    <div className="h-px bg-gray-200 w-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedPastPrograms.map(promo => <ProgramCard key={promo.id} promo={promo} isPast />)}
                </div>
                <div className="mt-6">
                    <PaginationControls
                        currentPage={pastPage}
                        totalPages={pastTotalPages}
                        totalItems={pastTotalItems}
                        pageSize={pastPageSize}
                        onPageChange={setPastPage}
                        language={language}
                    />
                </div>
                <p className="mt-8 text-center text-xs text-gray-400 italic">
                    {t.note}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProgramListPage;

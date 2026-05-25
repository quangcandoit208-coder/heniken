
import React from 'react';
import { Filter, Search, Tag, RotateCcw, MapPin, Building2 } from 'lucide-react';
import { FilterState } from '../types';
import { CITIES, BRANDS, BUS } from '../constants';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  showPastEvents: boolean;
  setShowPastEvents: (show: boolean) => void;
  onReset: () => void;
  language: 'vi' | 'en';
  context?: 'Activation' | 'AWO';
  variant?: 'green' | 'blue';
  // New props for customization
  locationLabel?: string;
  locationOptions?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  setFilters, 
  showPastEvents, 
  setShowPastEvents, 
  onReset, 
  language, 
  context = 'Activation',
  variant = 'green',
  locationLabel,
  locationOptions = CITIES
}) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getPlaceholder = () => {
    if (context === 'AWO') {
        return language === 'vi' ? 'Tìm chương trình...' : 'Search program...';
    }
    return language === 'vi' ? 'Tìm quán, địa chỉ...' : 'Search venue...';
  };

  const t = {
    title: language === 'vi' ? 'Bộ lọc' : 'Filters',
    hidePast: language === 'vi' ? 'Ẩn cũ' : 'Hide past',
    searchPlaceholder: getPlaceholder(),
    allLocations: locationLabel ? `Tất cả ${locationLabel}` : (language === 'vi' ? 'Tất cả TP' : 'All Cities'),
    allBrands: language === 'vi' ? 'Tất cả Brand' : 'All Brands',
    allBU: language === 'vi' ? 'Tất cả BU' : 'All BU',
    from: language === 'vi' ? 'Từ' : 'From',
    to: language === 'vi' ? 'Đến' : 'To',
    reset: language === 'vi' ? 'Xóa' : 'Clear'
  };

  const bgGradient = variant === 'blue' ? 'from-blue-700 to-blue-600' : 'from-green-700 to-green-600';
  const accentColor = variant === 'blue' ? 'text-blue-200' : 'text-green-200';
  const focusRing = variant === 'blue' ? 'focus:ring-blue-400' : 'focus:ring-green-400';
  const toggleBg = variant === 'blue' ? 'bg-blue-400' : 'bg-green-400';

  // Activation shows 6 filters, AWO shows 5
  const gridColsClass = context === 'Activation' ? 'lg:grid-cols-6' : 'lg:grid-cols-5';

  return (
    <div className={`bg-gradient-to-r ${bgGradient} p-3 sm:p-5 rounded-xl shadow-lg mb-4 border border-white/10`}>
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5">
        <div className="flex items-center gap-1.5 text-white font-bold">
            <Filter className={`w-4 h-4 sm:w-5 sm:h-5 ${accentColor}`} />
            <span className="text-sm sm:text-lg tracking-tight uppercase">{t.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
            <button onClick={onReset} className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all border border-white/20 backdrop-blur-sm">
                <RotateCcw className="w-3 h-3" /> {t.reset}
            </button>
            <div className="h-4 w-px bg-white/20"></div>
            <label className="flex items-center cursor-pointer select-none gap-1.5 text-[10px] sm:text-sm text-white/90">
                <div className="relative">
                    <input type="checkbox" className="sr-only" checked={!showPastEvents} onChange={() => setShowPastEvents(!showPastEvents)} />
                    <div className={`block w-7 h-4 sm:w-9 sm:h-5 rounded-full transition-colors ${!showPastEvents ? toggleBg : 'bg-black/30 border border-white/10'}`}></div>
                    <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-transform ${!showPastEvents ? 'translate-x-3 sm:translate-x-4' : ''}`}></div>
                </div>
                <span className="font-medium whitespace-nowrap">{t.hidePast}</span>
            </label>
        </div>
      </div>
      
      <div className={`grid grid-cols-2 ${gridColsClass} gap-2 sm:gap-4`}>
        <div className="relative">
            <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <select value={filters.brand} onChange={(e) => handleChange('brand', e.target.value)} className={`pl-8 w-full p-2 bg-white border border-transparent rounded-lg text-xs sm:text-sm focus:ring-2 ${focusRing} outline-none appearance-none shadow-sm cursor-pointer h-9 sm:h-10`}>
                <option value="">{t.allBrands}</option>
                {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
        </div>
        <div className="relative">
            {locationLabel === 'BU' ? (
                <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            ) : (
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            )}
            <select value={filters.city} onChange={(e) => handleChange('city', e.target.value)} className={`pl-8 w-full p-2 bg-white border border-transparent rounded-lg text-xs sm:text-sm focus:ring-2 ${focusRing} outline-none appearance-none shadow-sm cursor-pointer h-9 sm:h-10`}>
                <option value="">{t.allLocations}</option>
                {locationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
        
        {/* BU Filter specific for Activation context */}
        {context === 'Activation' && (
          <div className="relative">
              <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <select value={filters.bu || ''} onChange={(e) => handleChange('bu', e.target.value)} className={`pl-8 w-full p-2 bg-white border border-transparent rounded-lg text-xs sm:text-sm focus:ring-2 ${focusRing} outline-none appearance-none shadow-sm cursor-pointer h-9 sm:h-10`}>
                  <option value="">{t.allBU}</option>
                  {BUS.map(bu => <option key={bu} value={bu}>{bu}</option>)}
              </select>
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-lg">
            <span className="pl-1 text-[9px] font-black text-white/80 uppercase">{t.from}</span>
            <input type="date" value={filters.dateFrom} onChange={(e) => handleChange('dateFrom', e.target.value)} className={`w-full p-1 bg-white border-none rounded text-xs focus:ring-2 ${focusRing} outline-none shadow-sm h-7 sm:h-8`} />
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-lg">
            <span className="pl-1 text-[9px] font-black text-white/80 uppercase">{t.to}</span>
            <input type="date" value={filters.dateTo} onChange={(e) => handleChange('dateTo', e.target.value)} className={`w-full p-1 bg-white border-none rounded text-xs focus:ring-2 ${focusRing} outline-none shadow-sm h-7 sm:h-8`} />
        </div>
        <div className={`relative col-span-2 ${context === 'Activation' ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input type="text" placeholder={t.searchPlaceholder} value={filters.search} onChange={(e) => handleChange('search', e.target.value)} className={`pl-8 w-full p-2 bg-white border border-transparent rounded-lg text-xs sm:text-sm focus:ring-2 ${focusRing} outline-none transition-all shadow-sm h-9 sm:h-10`} />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

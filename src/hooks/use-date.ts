import { create } from 'zustand';
import { DateRange } from 'react-day-picker';

interface DateRangeStore {
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
}

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const useDateRangeStore = create<DateRangeStore>((set) => ({
  dateRange: {
    from: normalizeDate(new Date()),
    to: new Date()
  },
  setDateRange: (range) => set({ dateRange: range }),
}));

export default useDateRangeStore;

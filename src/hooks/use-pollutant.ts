import { create } from 'zustand';

interface PollutantStore {
  pollutant: "CO" | "CO2" | "NO2" | "SO2" | "PM10" | "PM25" | "";
  setPollutant: (pollutant: "CO" | "CO2" | "NO2" | "SO2" | "PM10" | "PM25" | "") => void;
}


const usePollutantStore = create<PollutantStore>((set) => ({
  pollutant: "",
  setPollutant: (pollutant) => set({ pollutant }),
}));

export default usePollutantStore;

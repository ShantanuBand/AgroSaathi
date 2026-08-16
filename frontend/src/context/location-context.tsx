import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './auth-context';

export interface LocationContextType {
  selectedDistrict: string;
  selectedCity: string;
  districtsList: string[];
  citiesList: string[];
  setDistrict: (district: string) => void;
  setCity: (city: string) => void;
  resetLocation: () => void;
}

const STORAGE_DISTRICT_KEY = 'agri_hub_selected_district';
const STORAGE_CITY_KEY = 'agri_hub_selected_city';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    return localStorage.getItem(STORAGE_DISTRICT_KEY) || 'Amravati';
  });

  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem(STORAGE_CITY_KEY) || 'All';
  });

  const { user } = useAuth();
  const prevUserRef = useRef<string | null>(null);

  // Sync location with user's profile upon login
  useEffect(() => {
    if (user && user.id !== prevUserRef.current) {
      if (user.district) setSelectedDistrict(user.district);
      if (user.city) setSelectedCity(user.city);
      prevUserRef.current = user.id;
    }
  }, [user]);

  const [districtsList, setDistrictsList] = useState<string[]>([
    "Amravati", "Nashik", "Pune", "Akola", "Latur", "Nagpur", "Solapur", "Chhatrapati Sambhajinagar", "Jalgaon", "Satara", "Sangli"
  ]);

  const [citiesList, setCitiesList] = useState<string[]>([]);

  // Fetch districts list from API on mount
  useEffect(() => {
    async function fetchDistricts() {
      try {
        const res = await fetch('/api/locations/districts');
        if (res.ok) {
          const data = await res.json();
          const names = data.map((d: any) => d.name);
          if (names.length > 0) {
            setDistrictsList(names);
          }
        }
      } catch (e) {
        console.error('Failed to load districts in LocationContext:', e);
      }
    }
    fetchDistricts();
  }, []);

  // Update cities list whenever selectedDistrict changes
  useEffect(() => {
    async function fetchCities() {
      if (!selectedDistrict || selectedDistrict === 'All') {
        setCitiesList([]);
        return;
      }

      try {
        const dKey = selectedDistrict.toLowerCase().replace(/[^a-z0-9]/g, '');
        const res = await fetch(`/api/locations/districts/d_${dKey}/cities`);
        if (res.ok) {
          const data = await res.json();
          const names = data.map((c: any) => c.name);
          setCitiesList(names);
          // If the stored city is invalid, reset it
          setSelectedCity(prev => {
            if (prev !== 'All' && !names.includes(prev)) {
              return 'All';
            }
            return prev;
          });
        } else {
          setCitiesList([]);
        }
      } catch (e) {
        console.error('Failed to load cities in LocationContext:', e);
        setCitiesList([]);
      }
    }
    fetchCities();
  }, [selectedDistrict]);

  // Persist location selections to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_DISTRICT_KEY, selectedDistrict);
  }, [selectedDistrict]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CITY_KEY, selectedCity);
  }, [selectedCity]);

  const setDistrict = (district: string) => {
    setSelectedDistrict(district);
    setSelectedCity('All'); // Reset city when district changes
  };

  const setCity = (city: string) => {
    setSelectedCity(city);
  };

  const resetLocation = () => {
    setSelectedDistrict('All');
    setSelectedCity('All');
  };

  return (
    <LocationContext.Provider
      value={{
        selectedDistrict,
        selectedCity,
        districtsList,
        citiesList,
        setDistrict,
        setCity,
        resetLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

/**
 * Hook to manage Country, State, and City selections and data using the 
 * 'country-state-city' package.
 */
export const useLocations = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selection, setSelection] = useState({
    country: '',
    state: '',
    city: ''
  });

  // Load all countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries().map(c => ({
      id: c.isoCode,
      name: c.name,
      flag: c.flag
    })));
  }, []);

  const handleCountryChange = (countryCode) => {
    setSelection({ country: countryCode, state: '', city: '' });
    
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode).map(s => ({
        id: s.isoCode,
        name: s.name
      }));
      setStates(countryStates);
    } else {
      setStates([]);
    }
    setCities([]);
  };

  const handleStateChange = (stateCode) => {
    setSelection(prev => ({ ...prev, state: stateCode, city: '' }));
    
    if (selection.country && stateCode) {
      const stateCities = City.getCitiesOfState(selection.country, stateCode).map(c => ({
        id: c.name, // Cities often don't have isoCodes, using name as ID
        name: c.name
      }));
      setCities(stateCities);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (cityName) => {
    setSelection(prev => ({ ...prev, city: cityName }));
  };

  return {
    countries,
    states,
    cities,
    selection,
    handleCountryChange,
    handleStateChange,
    handleCityChange
  };
};

export default useLocations;

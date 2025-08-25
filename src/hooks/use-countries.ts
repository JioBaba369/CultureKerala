
'use client';

import { useState, useEffect } from 'react';
import { countriesData } from '@/lib/data/countries';
import { indiaStatesData } from '@/lib/data/india-states';
import type { Country, IndiaState } from '@/types';

export const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [indiaStates, setIndiaStates] = useState<IndiaState[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, you might fetch this from an API
        setCountries(countriesData);
        setIndiaStates(indiaStatesData);
        setIsLoading(false);
    }, []);

    return { countries, indiaStates, isLoading };
};

    
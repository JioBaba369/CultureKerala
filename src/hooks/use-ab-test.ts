
'use client';

import { useEffect, useState } from 'react';

type TestVariant = 'a' | 'b';

export const useABTest = (testName: string): TestVariant => {
  const [variant, setVariant] = useState<TestVariant>('a');

  useEffect(() => {
    const key = `ab_test_${testName}`;
    let storedVariant = localStorage.getItem(key);

    if (storedVariant === 'a' || storedVariant === 'b') {
      setVariant(storedVariant);
    } else {
      const randomVariant = Math.random() < 0.5 ? 'a' : 'b';
      localStorage.setItem(key, randomVariant);
      setVariant(randomVariant);
    }
  }, [testName]);

  return variant;
};

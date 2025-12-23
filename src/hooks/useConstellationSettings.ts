import { useState, useEffect, useCallback } from 'react';
import { ConstellationPattern } from '@/components/ConstellationPatternSelector';

const SETTINGS_KEY = 'stellar-constellation-settings';

interface ConstellationSettings {
  pattern: ConstellationPattern;
  groupByMood: boolean;
}

const defaultSettings: ConstellationSettings = {
  pattern: 'auto',
  groupByMood: true,
};

export const useConstellationSettings = () => {
  const [settings, setSettings] = useState<ConstellationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to parse constellation settings:', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  const setPattern = useCallback((pattern: ConstellationPattern) => {
    setSettings((prev) => ({ ...prev, pattern }));
  }, []);

  const setGroupByMood = useCallback((groupByMood: boolean) => {
    setSettings((prev) => ({ ...prev, groupByMood }));
  }, []);

  return {
    pattern: settings.pattern,
    groupByMood: settings.groupByMood,
    setPattern,
    setGroupByMood,
    isLoading,
  };
};

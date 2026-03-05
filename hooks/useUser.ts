'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabase-browser';
import type { User } from '@supabase/supabase-js';

type UseUserResult = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};

export const useUser = (): UseUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(data.user);
      }
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
  };
};

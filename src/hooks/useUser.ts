"use client"
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  portrait: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/sing-in/auth-token`;
        const response = await api.fetch(endpoint);
        const responseData = await response.json();
        if (!response.ok) throw new Error('Failed to fetch user data');
        setUser(responseData.user);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return { user, loading, error };
}
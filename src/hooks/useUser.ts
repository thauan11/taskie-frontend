"use client"
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
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          throw new Error('Failed to fetch user data');
        }
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
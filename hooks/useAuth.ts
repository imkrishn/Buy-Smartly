import { useState, useEffect } from 'react';
import { auth } from '@/auth';

const useAuth = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setIsData] = useState({});

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const session = await auth();
        if (session) {
          setIsLogin(true);
          setIsData(session);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, []);

  return { isLogin, loading, data };
};

export default useAuth;

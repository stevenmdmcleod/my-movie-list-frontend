import { useEffect, useState} from 'react';
import axios from 'axios';
import { BASE_ROUTE } from '../utils/config';

export interface UseProfileDataReturn {
    data: Profile | null,
    loading: boolean
}

const useProfileData = (userId : string): UseProfileDataReturn => {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // if (!userId) return;
    const token = window.localStorage.getItem("token");
    if (!userId) {
      setLoading(false);
      return;
    };
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`${BASE_ROUTE}/users/userId/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        setData(response);
      } catch (error) {
        console.error(error)
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return {
    data,
    loading,
  };
};

export default useProfileData;
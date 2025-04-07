import { useEffect, useState} from 'react';
import axios from 'axios';

export interface UseProfileDataReturn {
    data: Profile | null,
    loading: boolean
}

const useProfileData = (userId : string): UseProfileDataReturn => {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/userId/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
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
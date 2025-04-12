import { useEffect, useState} from 'react';
import axios from 'axios';

export interface UseIndividualWatchlistDataReturn {
    data: Watchlist | null,
    loading: boolean
}

const useIndividualWatchlistData = (listId : string | undefined): UseIndividualWatchlistDataReturn => {
  const [data, setData] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!listId) return;
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`${import.meta.env.VITE_BASE_URL}/watchlist/${listId}`, {
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
  }, [listId]);

  return {
    data,
    loading,
  };
};

export default useIndividualWatchlistData;
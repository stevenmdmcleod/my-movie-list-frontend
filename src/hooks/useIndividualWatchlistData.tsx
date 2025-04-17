import { useEffect, useState} from 'react';
import axios from 'axios';
import { BASE_ROUTE } from '../utils/config';

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
        const { data: response } = await axios.get(`${BASE_ROUTE}/watchlist/${listId}`, {
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
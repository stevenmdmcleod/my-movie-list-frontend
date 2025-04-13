import {useState, useEffect} from 'react';
import axios from 'axios';
import { BASE_ROUTE } from '../utils/config';

const useMultipleProfiles = (userIds: string[] | undefined) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      if (!userIds || userIds.length == 0) return;
      const fetchProfiles = async () => {
        try {
          const results = await Promise.all(
            userIds.map(id =>
              axios.get(`${BASE_ROUTE}/users/userId/${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
                },
              }).then(res => res.data)
            )
          );
          setProfiles(results);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      };
  
      if (userIds.length > 0) {
        fetchProfiles();
      }
    }, [userIds]);
  
    return { profiles, loading };
};

export default useMultipleProfiles;
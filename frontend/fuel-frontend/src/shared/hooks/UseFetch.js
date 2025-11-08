import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";

export const useFetch = (endpoint, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}${endpoint}`);
        if (mounted) setData(res.data);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, deps);

  return { data, loading, error };
};

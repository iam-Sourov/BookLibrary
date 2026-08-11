import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
})
const useAxiosSecure = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`
      return config
    })
    const resInterceptor = axiosSecure.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      console.log(error);

      const statusCode = error.status;
      if (statusCode === 401 || statusCode === 403) {
        logOut()
          .then(() => {
            navigate('/login')
          })
      }
      return Promise.reject(error);
    })
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    }
  }, [user, logOut, navigate])

  return axiosSecure;
};

export default useAxiosSecure;
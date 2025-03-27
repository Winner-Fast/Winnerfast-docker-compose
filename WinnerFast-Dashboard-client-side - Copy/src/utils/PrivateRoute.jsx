import { useNavigate } from 'react-router-dom';
import {useEffect} from "react"
import { toast } from 'sonner';
import axios from 'axios';

const ProtectedRoute = ({ element }) => {
    const   navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('UserToken');
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You can not access this page unless you are logged in')
      navigate('/login'); 
      return;
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null; 
};


export default ProtectedRoute;
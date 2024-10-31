import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext'; 
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuthContext(); 
    const navigate = useNavigate();

    useEffect(() => {
      if (!user || !user.roles.includes("ROLES_ADMIN")) {
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to access this page.',
          icon: 'warning',
          confirmButtonText: 'Okay'
        }).then(() => {
          navigate("/"); 
        });
      }
    }, [user, navigate]); 

    if (user && user.roles.includes("ROLES_ADMIN")) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;

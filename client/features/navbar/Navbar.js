import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../app/store';

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    // <div>
    //   <h1>Weather</h1>
    //   <nav>

    //       <div>
    //         <Link to="/home">Home</Link>
    //       </div>
    //   </nav>
    //   <hr />
    // </div>
    <></>
  );
};

export default Navbar;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
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

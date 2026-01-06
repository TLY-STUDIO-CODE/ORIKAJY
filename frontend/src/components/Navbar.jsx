import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../logo.png";
import { useDispatch, useSelector } from 'react-redux';
import {LogOut, reset } from "../features/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const logout = () =>{
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    };
    
    return (
        <div>
            <nav 
                class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <NavLink to="/dashboard" class="navbar-item">
                        <img src={logo} width="45" height="10" alt="logo"/>
                    </NavLink>
                
                    <a 
                        href='!#' 
                        role="button" 
                        class="navbar-burger burger" 
                        aria-label="menu" 
                        aria-expanded="false" 
                        data-target="navbarBasicExample"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
            
                <div id="navbarBasicExample" class="navbar-menu">
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                <button onClick={logout} class="button is-light">
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar
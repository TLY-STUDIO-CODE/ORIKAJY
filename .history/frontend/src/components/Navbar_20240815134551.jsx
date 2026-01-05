import React from 'react';
import { NavLink } from "react-router-dom";
import logo from "../logo.png";

const Navbar = () => {
    return (
        <div>
            <nav 
                class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <NavLink to="/dashboard" class="navbar-item">
                        <img src={logo} width="100" height="1" alt="logo"/>
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
                                <button class="button is-light">
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
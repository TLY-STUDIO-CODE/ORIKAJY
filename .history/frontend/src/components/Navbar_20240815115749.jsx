import React from 'react';
import {NavLink} from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <NavLink to="/dashboard" class="navbar-item">
                        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/>
                    </NavLink>
                
                    <a href='!#' role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
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
    )
}

export default Navbar;

import React from 'react';
import {NavLink} from "react-router-dom";
const Siderbar = () => {
  return (
    <div>
        <aside className="menu has-shadow">
            <p className="menu-label">General</p>
            <ul className="menu-list">
                <li><NavLink to={"/dashboard"}>Dashboard</NavLink></li>
                <li><NavLink to={"/products"}>Products</NavLink></li>
            </ul>
            <p className="menu-label">Admin</p>
            <ul className="menu-list">
                <li><NavLink to={"/users"}>Users</NavLink></li>
            </ul>
            <p className="menu-label">Transactions</p>
            <ul className="menu-list">
                <li><a>Payments</a></li>
                <li><a>Transfers</a></li>
                <li><a>Balance</a></li>
            </ul>
        </aside>
    </div>
  )
}

export default Siderbar;
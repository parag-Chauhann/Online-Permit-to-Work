import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../../Images/TSM-Logo.png";
import "../Home.css";

function Navbar() {
    const [nav, setNav] = useState(false);

    // Function to handle scroll events
    const changeBackground = () => {
        if (window.scrollY >= 50) {
            setNav(true);
        } else {
            setNav(false);
        }
    };

    // Adding scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', changeBackground);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('scroll', changeBackground);
        };
    }, []);

    return (
        <nav className={nav ? 'nav active' : 'nav'}>
            <Link to="#" className='logo'>
                <img src={logo} alt="logo" />
            </Link>
            <input type="checkbox" className='menu-btn' id="menu-btn" />
            <label className="menu-icon" htmlFor='menu-btn'>
                <span className='nav-icon'></span>
            </label>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/permitform">Permit to Work</Link></li>
                <li><Link to="https://www.thesafetymaster.com/">TSM</Link></li>
                <li><Link to="https://bookmysafety.com/">BookMySafety</Link></li>
                <li><Link to="/">Download</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;

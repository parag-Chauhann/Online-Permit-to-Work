import React from 'react';
import "./Home.css";
import About from './Pages/About';
import Contact from './Pages/Contact';
import Feature from './Pages/Feature';
import Presentation from './Pages/Presentation';
import aboutImage from "./images/Frame 19.png";
import aboutImage1 from "./images/download.png";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div id='main'>
                <div className="name">
                    <h1><span>Permit to Work </span>Software</h1>
                    <p className='details'>Our Permit-to-Work software streamlines the process of issuing, tracking, and managing work permits, ensuring safety and compliance in all work environments</p>
                    {/* <a href="" className='cv-btn'>Download</a> */}
                    <Link to='/permitform'>
                        <button class="pushable">
                            <span class="shadow"></span>
                            <span class="edge"></span>
                            <span class="front">START</span>
                        </button>
                    </Link>

                </div>
            </div>
            <Feature />
            <About image={aboutImage} title="About" button="get the app" />
            <Presentation />
            <About image={aboutImage1} title="About" button="get the app" />
            <Contact />
        </>

    )
}

export default Home;
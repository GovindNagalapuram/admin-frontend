import React from 'react';

import Login from "../loginSignup/login";

import '../../assets/sass/home.scss';

const Home = () => {
    return (
        <div className="home-page-outer-layer">
          <div className="home-page-inner-layer">
            <div className="form-component-inner-layer">
              <Login/>
              {/* <Signup/> */}
            </div>
          </div>
        </div>
    );
}

export default Home;

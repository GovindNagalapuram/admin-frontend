import React, { useContext } from 'react';

import { ModalContext } from '../../utils/context/index';

import AddServiceForm from '../services/index';

import { Logo } from '../../assets/images/index';
import '../../assets/sass/navbar.scss';

const Navbar = (props) => {

    const modalContext = useContext(ModalContext);

    const handleData = () => {
        
        return (
            <div className="navbar-outer-layer">
                <div className="navbar-inner-layer">
                    <div className="logo-container">
                        <Logo/>
                    </div>
                    <div className="profile-container">
                        <div
                            className = "button-container"
                            onClick={() => modalContext.openOrCloseModal("open", "addServiceForm")}
                        >
                            Add Service
                        </div>
                        {
                            props.adminName
                            ?
                            <div className="button-container">
                                {
                                    props.adminName
                                }
                            </div>
                            :
                            null
                        }
                        
                        <a href='/'>
                            <div className="button-container">
                                Sign out
                            </div>
                        </a>
                    </div>
                </div>
                <AddServiceForm />
            </div>
        )
    }

    return (
        <div>
            {handleData()}
        </div>
    );
}

export default Navbar;

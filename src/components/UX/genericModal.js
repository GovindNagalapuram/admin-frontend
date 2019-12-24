import React, { useContext } from 'react';

import { ModalContext } from '../../utils/context/index';

import { BigCloseButton } from '../../assets/images';
import '../../assets/sass/navbar.scss';

const GenericModal = (props) => {

    const modalContext = useContext(ModalContext);

    return (
        <div className="generic-modal-outer-layer">
            <div className="generic-modal-inner-layer">
                <div 
                    className="close-modal-button-container"
                    onClick={() => modalContext.openOrCloseModal("close")}
                >
                    <div className="close-modal-button-container-inner-layer">
                        <BigCloseButton/>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    );
}



export default GenericModal;
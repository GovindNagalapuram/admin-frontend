import React, { useReducer } from 'react';

import { ModalContext } from '../index';

import { openOrCloseModalAction } from '../../../actions/modal';
import openOrCloseModalReducer from '../../../reducers/modal';

const ModalContextProvider = (props) => {

    const [ valueGlobal, dispatchActionsGlobal ] = useReducer(openOrCloseModalReducer, {});

    const openOrCloseModal = (openOrClose, modalType, modalData) => {
        dispatchActionsGlobal(
            openOrCloseModalAction(openOrClose, modalType, modalData)
        )
    }

    return (
        <ModalContext.Provider
            value={{
                valueGlobalState: valueGlobal,
                openOrCloseModal: (openOrClose, modalType, modalData) => openOrCloseModal(openOrClose, modalType, modalData)
            }}
        >
            {props.children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider;
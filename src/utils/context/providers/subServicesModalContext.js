import React, { useReducer } from 'react';

import { SubServicesModalContext } from '../index';

import { openOrCloseModalAction } from '../../../actions/modal';
import openOrCloseModalReducer from '../../../reducers/modal';

const SubServicesModalContextProvider = (props) => {

    const [ valueGlobal, dispatchActionsGlobal ] = useReducer(openOrCloseModalReducer, {});

    const openOrCloseModal = (openOrClose, modalType) => {
        dispatchActionsGlobal(
            openOrCloseModalAction(openOrClose, modalType)
        )
    }

    return (
        <SubServicesModalContext.Provider
            value={{
                valueGlobalState: valueGlobal,
                openOrCloseModal: (openOrClose, modalType) => openOrCloseModal(openOrClose, modalType)
            }}
        >
            {props.children}
        </SubServicesModalContext.Provider>
    )
}

export default SubServicesModalContextProvider;
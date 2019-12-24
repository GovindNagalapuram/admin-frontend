import React, { useContext, useState } from 'react';

import { ModalContext } from '../../../utils/context';

import DraftMails from './draftMail';
import MailForm from './mailForm';
import SentMail from './sentMail';
import { WhiteCloseButton } from '../../../assets/images';

const MailService = () => {

    const modalContext = useContext(ModalContext);

    const [ headers ] = useState([
        {
            name: "Draft Mails",
            id: 1
         },
         {
            name: "Sent Mails",
            id: 2       
         }
    ]);
    const [ dataId, setDataId ] = useState(1);

    const returnHeaderContent = () => {
        return headers.map((item,i) => {
            return(
                <div 
                    className="headerText"
                    key={i}
                    onClick={() => {
                        setDataId(item.id)
                    }}
                >
                    <h3 className={dataId === item.id ? "headerTextOne" : ""}>{item.name}</h3>
                </div>
            )
                
        })
    }

    const returnServiceInfo = () => {
        if(dataId === 1){
            return(
                <div className="draft-mail-container">
                    <DraftMails />
                </div>
            )
        }

        else if(dataId === 2){
            return(
                <div className="sent-mail-container">
                    <SentMail />
                </div>
            )
        }
    }

    return(
        <div className="mail-services-outer-container">
            <div className="service-header-inner-container">
                {returnHeaderContent()}
            </div>
            <div className="mail-service-info-container">
                {returnServiceInfo()}
            </div>
            <div className="mail-service-inner-container">
                <div className="compose-mail-button-container">
                    <div 
                        className="compose-button"
                        onClick={() => modalContext.openOrCloseModal("open", "mailForm")}
                    >
                        <p>Compose</p>
                    </div>
                </div>
            </div>
            <MailForm />
        </div>
    )
}

export default MailService;
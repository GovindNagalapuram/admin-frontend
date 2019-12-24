import React, { useEffect, useState } from 'react';
import Axios from 'axios';

import { api } from '../../../actions/apiLinks';
import { decryptData } from '../../../factories/encryptDecrypt';
import { formatDateWithTimeString } from '../../../factories/formatter';

import { NavBarLoadingIcon, SmallCloseButton } from '../../../assets/images';

const SentMail = () => {

    const [ sentMails, setSentMails ] = useState(null);

    const [ sentMailObjectId, setSentMailObjectId ] = useState([]);
    const [ sentMailRecipients, setSentMailRecipients ] = useState([]);
    const [ sentMailSubject, setSentMailSubject ] = useState([]);
    const [ sentMailBody, setSentMailBody ] = useState([]);

    const [ sentMailOpen, setSentMailOpen ] = useState(false);

    useEffect(() => {
        Axios.get(
            api.FETCH_SENT_MAIL,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
        )
        .then(res => {
            const { sentMailExist, sentMails } = decryptData(res.data.responseData);

            if (sentMailExist) setSentMails(sentMails);
        })
        .catch(err => console.log(err))
    }, [])

    const returnSentMails = () => {

        // let handleCheck = (id) => {
        //     const index = sentMailObjectId.indexOf(id);

        //     if (index < 0) sentMailObjectId.push(id);
        //     else sentMailObjectId.splice(index, 1);

        //     setSentMailObjectId([...sentMailObjectId])
        // }

        if (sentMails) {
            return sentMails.map((mail, i) => {
                return (
                    <div
                        className="sent-mail-body-container" 
                        key={i}
                        onClick={() => {
                            setSentMailOpen(true)
                            setSentMailObjectId([mail._id])
                            setSentMailRecipients(mail.mailRecipients)
                            setSentMailSubject(mail.mailSubject)
                            setSentMailBody(mail.mailBody)
                        }}  
                    >
                        {/* <input 
                            type="checkbox" 
                            id={i}
                            onChange={() => handleCheck(mail._id)}
                        /> */}
                        <div className="mail-subject-container">
                            <h3>{mail.mailSubject}</h3> 
                            <p>Sent on: {formatDateWithTimeString(mail.time)}</p>
                        </div>
                    </div>
                )
            })
        }
    }


    const returnOpenedSentMail = () => {

        const RecipientsContent = () => {
            // console.log(sentMailRecipients)
            return sentMailRecipients.map((item,i) => {
                return(
                    <p key={i}>{item}</p>
                )
            })
        }

        if (sentMailOpen) {
            return(
                <div className="mail-modal-main-container">
                    <div 
                        className="mail-modal-close-button-container"
                        onClick={() => {
                            setSentMailOpen(false)
                            setSentMailObjectId([])
                            setSentMailRecipients(null)
                            setSentMailSubject(null)
                            setSentMailBody(null)
                        }}
                    >
                        <SmallCloseButton />
                    </div>
                    <div className="subject-container">
                        {/* <h3>To: <span>{sentMailRecipients}</span></h3> */}
                        <div className="sended-mail-recipients-container">
                            <h3>To:</h3>
                            <div className="sended-recipients">
                                <div className="sended-recipients-inner-container">
                                    {RecipientsContent()}
                                </div>
                            </div>
                        </div>
                        {/* <div>To: {RecipientsContent()}</div> */}
                        <h3>Subject: <span>{sentMailSubject}</span></h3>
                        <div  className="input-text-area-container">
                            <div dangerouslySetInnerHTML={{ __html: sentMailBody }} />
                            {/* <textarea value={sentMailBody} readOnly /> */}
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="sent-mail-main-container">
            <div className={sentMails ? "hide" : "show-loader"}>
                <NavBarLoadingIcon />
            </div>
            <div className={sentMailOpen ? "hide" : "sent-mail-inner-container"}>
                {returnSentMails()}
            </div>
            <div className={sentMailOpen ? "show-mail-modal-outer-layer" : "hide"}>
                <div className="show-mail-modal">
                    <div className="show-mail-modal-inner-layer">
                        {returnOpenedSentMail()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SentMail;
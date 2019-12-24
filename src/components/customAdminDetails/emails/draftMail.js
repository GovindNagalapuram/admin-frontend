import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { api } from '../../../actions/apiLinks';
import { ModalContext } from '../../../utils/context';
import { encryptData, decryptData } from '../../../factories/encryptDecrypt';

import { WhiteButton } from '../../UX/uxComponents';
import { formatDateWithTimeString } from '../../../factories/formatter';
import { NavBarLoadingIcon, WhiteCloseButton } from '../../../assets/images';

const DraftMails = () => {

    const modalContext = useContext(ModalContext);

    const [ draftMails, setDraftMails ] = useState(null);
    const [ draftMailObjectId, setDraftMailObjectId ] = useState([]);

    const [ deleteModal, setDeleteModal ] = useState(false);
    const [ deleteMail, setDeleteMail ] = useState(null);

    const [ refreshPage, setRefreshPage ] = useState(false);

    useEffect(() => {
        Axios.get(
            api.FETCH_DRAFT_MAIL,
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
            const { draftMailExist, draftMails } = decryptData(res.data.responseData);

            if (draftMailExist) setDraftMails(draftMails);
        })
        .catch(err => console.log(err)) 

        const { modalType, showModal, modalData } = modalContext.valueGlobalState;

        if (modalType === "mailForm" && !showModal && modalData) setRefreshPage(modalData.refreshPage)
        else setRefreshPage(false)

    }, [ refreshPage, modalContext.valueGlobalState ])

    const returnDraftMails = () => {

        let handleCheck = (id) => {
            const index = draftMailObjectId.indexOf(id);

            if (index < 0) draftMailObjectId.push(id);
            else draftMailObjectId.splice(index, 1);

            setDraftMailObjectId([...draftMailObjectId])
        }

        if (draftMails) {
            return draftMails.map((mail, i) => {
                return (
                    <div 
                        className="draft-message-container"
                        key={i}
                    >
                        <div className="drafted-message-inner-container">
                            <input 
                                type="checkbox" 
                                id={i}
                                onChange={() => handleCheck(mail._id)}
                            />
                            <div 
                                className="drafted-message-body-container"
                                onClick={() => {
                                    modalContext.openOrCloseModal("open", "mailForm", {
                                        draftMailObjectId: [mail._id],
                                        mailRecipients: mail.mailRecipients,
                                        mailSubject: mail.mailSubject,
                                        mailBody: mail.mailBody
                                    })
                                }}
                            >
                                <h3>{mail.mailSubject}</h3> <p>Drafted on: {formatDateWithTimeString(mail.time)}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    const handleDeleteDraftMails = () => {

        let requestDataToBackend = {
            requestData: encryptData({
                _id: draftMailObjectId
            })
        }

        Axios.post(
            api.DELETE_DRAFT_MAIL,
            requestDataToBackend,
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
            const { draftMailDeleted, numberOfMailsDeleted } = decryptData(res.data.responseData);

            if (draftMailDeleted) {
                // console.log(numberOfMailsDeleted);
                setDeleteMail(numberOfMailsDeleted)
                setDeleteModal(true)
                timeoutFunction()
                setRefreshPage(true)
            }
        })
        .catch(err => console.log(err))
    }

    const timeoutFunction = () => {
        setTimeout(() => {
            setDeleteModal(false)
        }, 3000);
    }

    return (
        <div className="drafted-message-main-container">
            <div className={draftMails ? "hide" : "show-loader"}>
                <NavBarLoadingIcon />
            </div>
            <div className={draftMailObjectId.length !== 0 ? "delete-button-container" : "hide"}>
                <WhiteButton
                    runFunction={() => handleDeleteDraftMails()}
                >
                    Delete
                </WhiteButton>
            </div>
            <div className="drafted-message-outer-container">
                {returnDraftMails()}
            </div>
            <div className={ deleteModal ?  "deleted-mails-container" : "hide"}>
                <p> {deleteMail} message deleted</p>
                <div 
                    className="close-button"
                    onClick={() => setDeleteModal(false)}
                >
                    <WhiteCloseButton />
                </div>
            </div>
        </div>
    )
}

export default DraftMails;
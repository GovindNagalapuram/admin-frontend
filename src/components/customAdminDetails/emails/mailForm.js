import React, { useContext, useEffect, useRef, useState } from 'react';
import Axios from 'axios';

import { api } from '../../../actions/apiLinks';

import { encryptData, decryptData } from '../../../factories/encryptDecrypt';

import { ModalContext } from '../../../utils/context';

import { WhiteButton } from '../../UX/uxComponents';
import { SmallCloseButton, WhiteCloseButton } from '../../../assets/images';

const MailForm = () => {

    const modalContext = useContext(ModalContext);

    const [ mailModal, setMailModal ] = useState(false);
    const [ expandContainer, setExpandContainer ] = useState(false);

    const [ mailRecipients, setMailRecipients ] = useState([]);
    const [ mailSubject, setMailSubject ] = useState(null);
    const [ mailBody, setMailBody ] = useState(null);

    const [ draftMailObjectId, setDraftMailObjectId ] = useState([]);
    
    const [ recipientErrorMails, setRecipientErrorMails ] = useState([]);

    const [ mailRecipientFieldError, setMailRecipientFieldError ] = useState(false);
    const [ mailSubjectFieldError, setMailSubjectFieldError ] = useState(false);
    const [ mailBodyFieldError, setMailBodyFieldError ] = useState(false);
    
    const [ displayEmailValueValidationError, setDisplayEmailValueValidationError ] = useState(false);

    const [ deleteModal, setDeleteModal ] = useState(false);
    const [ deleteMail, setDeleteMail ] = useState(null);
    const [ draftModal, setDraftModal ] = useState(false)

    const emailInput1 = useRef("");
    const emailInput2 = useRef("");

    useEffect(() => {
        const { modalType, showModal, modalData } = modalContext.valueGlobalState;

        if (modalType === "mailForm") {
            setMailModal(showModal)
            
            if (!!modalData && !modalData.refreshPage) {
                const { draftMailObjectId, mailRecipients, mailSubject, mailBody } = modalData;
                
                if (draftMailObjectId.length !== 0) setDraftMailObjectId(draftMailObjectId)
                if (mailRecipients) setMailRecipients(mailRecipients)
                if (mailSubject) setMailSubject(mailSubject)
                if (mailBody) setMailBody(mailBody)
            }
        };

    }, [modalContext.valueGlobalState.showModal])

    const getAllRecipient = () => {
        if(mailRecipients.length !== 0 ){
            return mailRecipients.map((item,i) => {
                return(
                    <div
                    className="added-recipient-container"
                        key={i}
                    >
                        <p>{item}</p>
                        <div
                            className="delete-tag-container"
                            onClick={() => removeMailRecipient(i)}
                        >
                            <SmallCloseButton/>
                        </div>
                    </div>
                )
            })
        }
    }

    const removeMailRecipient = (index) => {
        mailRecipients.splice(index, 1);
        setMailRecipients([...mailRecipients])
    }

    const expandMailContent = () => {
        setExpandContainer(true)
    //    document.getElementById("expandContent").style.height = "10"
    }
    
    const hideExpandContent = () => {
        if(expandContainer){
            setExpandContainer(false)
        }
    }

    const handleValidation = () => {
        if(mailRecipients.length === 0) setMailRecipientFieldError(true)
        if(!mailSubject) setMailSubjectFieldError(true)
        if(!mailBody) setMailBodyFieldError(true)

        if (mailRecipients && !mailRecipientFieldError 
            && mailSubject && !mailSubjectFieldError 
            && mailBody && !mailBodyFieldError) {

                let requestDataToBackend = {
                    requestData: encryptData({
                        mailRecipients,
                        mailSubject,
                        mailBody
                    })
                }

                Axios.post(
                   api.SEND_MAIL,
                   requestDataToBackend,
                   {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                })
                .then(res => {
                    const { mailSent } = decryptData(res.data.responseData);

                    if (mailSent) {
                        setMailModal(false)
                        setMailRecipients([])
                        setMailSubject(null)
                        setMailBody(null)
                        setDraftMailObjectId([])
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const mailValidator = (value, key) => {

        const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       
        let val = value.split(/(?:\r\n|\r|\n)/g)

        if(val.length > 1) {
            val.map(item => {
                if(regExEmail.test(item)){
                    if(key === "Enter" || key === "paste"){
                        if (!mailRecipients.includes(item)) mailRecipients.push(item.toLowerCase())

                        setMailRecipients([...mailRecipients])
                        setDisplayEmailValueValidationError(false)
                        setMailRecipientFieldError(false)
                        
                        emailInput1.current.value = ""
                        emailInput2.current.value = ""
                        setRecipientErrorMails([])
                    }
                }
                else{
                    if (!recipientErrorMails.includes(item)) recipientErrorMails.push(item.toLowerCase())

                    emailInput2.current.value = recipientErrorMails
                    setRecipientErrorMails([...recipientErrorMails])
                    setDisplayEmailValueValidationError(true)
                }
            })
        }

        else {
            let newVal = val.filter((item) => item.trim() != '')
            
            if (newVal.length !== 0) {
                if(regExEmail.test(val)){
                    if(key === "Enter" || key === "paste"){
                        if (!mailRecipients.includes(val)) mailRecipients.push(val.toString())
    
                        setMailRecipients([...mailRecipients])
                        setDisplayEmailValueValidationError(false)
                        setMailRecipientFieldError(false)
                        
                        emailInput1.current.value = ""
                        emailInput2.current.value = ""
                        setRecipientErrorMails([])
                    }
                }
                else{
                    setDisplayEmailValueValidationError(true)
                }
            }

            else setDisplayEmailValueValidationError(false)
        }
    }

    const handleDraftMail = () => {

        if (mailRecipients.length !== 0 || mailSubject || mailBody) {
            let requestDataToBackend = {
                requestData: encryptData({
                    draftId: draftMailObjectId,
                    mailRecipients,
                    mailSubject,
                    mailBody
                })
            }
    
            Axios.put(
                api.DRAFT_MAIL,
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
            .then(async res => {
                const { draftMailCreated } = decryptData(res.data.responseData);
            
                if (draftMailCreated) {
                    modalContext.openOrCloseModal("close", "mailForm")

                    setMailRecipients([])
                    setMailSubject(null)
                    setMailBody(null)
                    setDraftModal(true)
                    setTimeout(() => {
                        setDraftModal(false)
                    }, 3000);
                }
            })
            .catch(err => console.log(err))
        }

        else {
            modalContext.openOrCloseModal("close", "mailForm")
            
            setMailRecipientFieldError(false)
            setMailSubjectFieldError(false)
            setMailBodyFieldError(false)
            setDisplayEmailValueValidationError(false)

            emailInput1.current.value = ""
            emailInput2.current.value = ""
        }
    }

    const handleDeleteDraftMails = () => {

        if (draftMailObjectId.length !== 0) {
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
                    setDeleteMail(numberOfMailsDeleted)
                    setDeleteModal(true)
                    setDeleteModal(true)
                    setTimeout(() => {
                        setDeleteModal(false)
                    }, 3000);

                    modalContext.openOrCloseModal("close", "mailForm", { refreshPage: true })
                }
            })
            .catch(err => console.log(err))
        }

        else {
            modalContext.openOrCloseModal("close", "mailForm", { refreshPage: true })

            emailInput1.current.value = ""
            emailInput2.current.value = ""

            setMailRecipients([])
            setMailSubject(null)
            setMailBody(null)
            setRecipientErrorMails([])

            setMailRecipientFieldError(false)
            setMailSubjectFieldError(false)
            setMailBodyFieldError(false)

            setDisplayEmailValueValidationError(false)
        }
    }


    return (
        <div className="mail-form-outer-container">
            <div className={mailModal ? "mail-service-modal-container" : "hide"}>
                <div className="mail-service-modal-inner-container">
                    <div className="modal-main-container">
                        <div className="modal-header-container">
                            <div className="modal-header-inner-container">
                                <p>New Message</p>
                                <div 
                                    className="close-container"
                                    onClick={() => {
                                        handleDraftMail()
                                        setDraftMailObjectId([])
                                    }}
                                >
                                    <p>close</p>
                                </div>
                            </div>  
                        </div>
                        <div className="modal-body-container">
                            <div className="modal-body-inner-container">
                                <div className={expandContainer ? "expand-mail-container" : "hide"} id="expandContent">
                                    {getAllRecipient()}
                                </div>
                                <div 
                                    className="input-field-container"
                                    onClick={() => hideExpandContent()}
                                >
                                    <div className={expandContainer ? "hide" : "all-recipient-mail-container"}>
                                        {getAllRecipient()}
                                        <div className={mailRecipients.length > 3 ? "show-more-button-container" : "hide"}>
                                            <div 
                                                className="button-container-inner-layer"
                                                onClick={() => expandMailContent()}
                                            >
                                                <p>{mailRecipients.length - 5} More</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div 
                                        className="input-field-container"
                                        id="emailSystem" 
                                        onPaste={e => mailValidator(e.clipboardData.getData('Text'), e.type)}
                                    >
                                        <input 
                                            className={recipientErrorMails.length !== 0 ? "hide" : "show"}
                                            type="text"
                                            placeholder="Enter Recipient"
                                            ref={emailInput1}
                                            onKeyDown={e => mailValidator(e.target.value, e.key)}
                                        />
                                        <input 
                                            className={recipientErrorMails.length !== 0 ? "show" : "hide"}
                                            type="text"
                                            placeholder="Enter Recipient"
                                            ref={emailInput2}
                                            onKeyDown={e => mailValidator(e.target.value, e.key)}
                                        />
                                    </div>
                                    <span className="InputSeparatorLine"></span>
                                    <p className={mailRecipientFieldError ? "showErrorMessage" : "hide"}>this field cannot be empty</p>
                                    <p className={displayEmailValueValidationError ? "showErrorMessage" : "hide"}>Please keep in mind, email should be valid.</p>
                                </div>
                                <div 
                                    className="input-field-container"
                                    onClick={() => hideExpandContent()}
                                >
                                    <input 
                                        type="text"
                                        placeholder="Add a Subject"
                                        defaultValue={!!mailSubject ? mailSubject : ""}
                                        onChange={(e) => {
                                            setMailSubject(e.target.value)
                                            setMailSubjectFieldError(false)
                                        }}
                                    />
                                    <span className="InputSeparatorLine"></span>
                                    <p className={mailSubjectFieldError ? "showErrorMessage" : "hide"}>this field cannot be empty</p>
                                </div>
                
                                <div 
                                    className="input-text-area-container"
                                    onClick={() => hideExpandContent()}
                                >
                                    <textarea
                                        placeholder="Enter message"
                                        value={mailBody ? mailBody : ""}
                                        onChange={e => {
                                            setMailBody(e.target.value)
                                            setMailBodyFieldError(false)
                                        }}
                                    />
                                </div>
                                <p className={mailBodyFieldError ? "showErrorMessage" : "hide"}>this field cannot be empty</p>
                            </div>
                        </div>
                        <div className="mail-features-container">
                            <div className="mail-features-inner-container">
                                <div className="button-container discard">
                                    <WhiteButton
                                        runFunction={() => handleDeleteDraftMails()}
                                    >
                                        Discard
                                    </WhiteButton>
                                </div>
                                <div className="button-container">
                                    <WhiteButton
                                        runFunction={() => handleValidation()}
                                    >
                                        Send
                                    </WhiteButton>
                                </div>
                            </div>
                        </div>
                    </div>        
                </div>
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
            <div className={draftModal ? "draft-modal" : "hide"}>
                <p>Your draft mail created.</p>
                <div 
                    className="close-button"
                    onClick={() => setDraftModal(false)}
                >
                    <WhiteCloseButton />
                </div>
            </div>
        </div>
    )
}

export default MailForm;
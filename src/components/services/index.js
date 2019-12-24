import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { api } from '../../actions/apiLinks';

import { ModalContext, SubServicesModalContext } from '../../utils/context/index';

import { decryptData } from '../../factories/encryptDecrypt';
import { formatNameToCapitalisation } from '../../factories/formatter';

import GenericModal from '../UX/genericModal';
import ImageUploader from '../UX/imageUploader';
import { WhiteButton } from '../UX/uxComponents';

import SubServiceForm from './subServicesForm';

const AddServiceForm = () => {

    const modalContext = useContext(ModalContext);
    const subServicesModalContext = useContext(SubServicesModalContext);
    
    const [ addSubService, setAddSubService ] = useState(true);
    const [ subColumn, setSubColumn ] = useState(false);

    const [ serviceNameError, setServiceNameError ] = useState(false);
    const [ serviceImageError, setServiceImageError ] = useState(false);

    const [ serviceId, setServiceId ] = useState(null);
    const [ serviceName, setServiceName ] = useState(null);
    const [ serviceImage, setServiceImage ] = useState(null);

    const [ showImageUploader, setShowImageUploader ] = useState(false);
    const [ submitClicked, setSubmitClicked ] = useState(false);

    const [ subServices, setSubServices ] = useState(null);

    useEffect(() => {
        const { showModal, modalData } = modalContext.valueGlobalState;

        if (showModal) {
            if (!!modalData) {
                const { serviceId, serviceImage, serviceName, subServices } = modalData;

                setServiceId(serviceId)
                setServiceName(serviceName)
                setServiceImage(serviceImage)

                setSubServices(subServices)
            }
        } 

        else {
            setServiceId(null)
            setServiceName(null)
            setServiceImage(null)

            setSubServices(null)

            setShowImageUploader(false)
            setAddSubService(true)
            
            setServiceNameError(false)
            setServiceImageError(false)

            setSubmitClicked(false)
        }

    }, [modalContext.valueGlobalState.showModal])

    useEffect(() => {
        const { showModal } = subServicesModalContext.valueGlobalState;

        if (showModal) {
            setAddSubService(false)
            setSubColumn(true)
        }
        else {
            setAddSubService(true)
            setSubColumn(false)
        }

    }, [subServicesModalContext.valueGlobalState.showModal])

    const handleServiceId = () => {

        if (!serviceId) {
            if (serviceName) {
                // let serviceAcronym = serviceName.match(/\b(\w)/g).join('');
    
                // let subServiceId = `${serviceAcronym}001`;
    
                // console.log(subServiceId);
    
                Axios.get(
                    api.GET_ALL_SERVICE,
                    {
                        headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            "Content-Type": "application/json"
                        },
        
                        withCredentials: true
                    }
                )
                .then(res => {
                    const { services, serviceExist } = decryptData(res.data.responseData);
    
                    if (serviceExist) {
                        services.map((prevService) => {
    
                            let formattedSuffixNum,
                            previousServiceId = prevService.serviceId,
                            segregatedId = previousServiceId.split(/([0-9]+)/).filter(Boolean),
                            prefixId = segregatedId[0],
                            suffixNum = parseInt(segregatedId[1], 10)
    
                            suffixNum++;
    
                            suffixNum = ("000" + suffixNum);
                            formattedSuffixNum = suffixNum.substring(suffixNum.length - 3)
    
                            let newServiceId = `${prefixId}${formattedSuffixNum}`
    
                            setServiceId(newServiceId)
    
                        })
                    }
    
                    else {
                        let serviceId = `SER001`;
    
                        setServiceId(serviceId)
                    }
                })
                .catch(err => console.log(err))
            }
        }
    }

    const handleServiceValidation = () => {
        let dummyArray = [];

        if (!serviceName) {
            setServiceNameError(true)
            dummyArray.push("serviceName")
        }

        if (!serviceImage) {
            setServiceImageError(true)
            dummyArray.push("serviceImage")
        }

        if (dummyArray.length === 0) {
            setAddSubService(true)
            setSubColumn(false)
        }
    }

    const servicesForm = () => {

        let handleSubServiceValidation = () => {

            let dummyArray = [];

            if (!serviceName) {
                setServiceNameError(true)
                dummyArray.push("serviceName")
            }

            if (!serviceImage) {
                setServiceImageError(true)
                dummyArray.push("serviceImage")
            }

            if (dummyArray.length === 0) {
                handleServiceId()
                subServicesModalContext.openOrCloseModal("open", "subServicesForm")
            }

        }

        let handleSubServicesColumn = () => {
            return (
                <div className={subColumn ? "sub-services-form-container" : "added-sub-services-scroll-container"}>
                    <div 
                        className={subColumn ? "close-sub-service" : "hide"}
                        onClick= {() => {
                            setAddSubService(true)
                            subServicesModalContext.openOrCloseModal("close", "subServicesForm")
                        }}
                    >
                        <p>Close</p>
                    </div>
                    <SubServiceForm 
                        serviceId={serviceId} 
                        serviceName={serviceName}
                        serviceImage={serviceImage}
                        subColumn={subColumn}
                        submitClicked={submitClicked}
                        subServices={subServices}
                    />
                </div>
            )
        }

        return(
            <div className="services-form-container-outer-layer">
                <div className="services-form-container-inner-layer">
                    <div className="input-form-container">
                        <div className="input-header">
                            Service Name: 
                        </div>
                        <div className="input-container">
                            <input 
                                type="text"
                                placeholder="Add service-name"
                                defaultValue={serviceName ? serviceName : ""}
                                onChange={async (e) => {
                                    await setServiceName(formatNameToCapitalisation(e.target.value.trim()))
                                    setServiceNameError(false)
                                    // handleServiceId()
                                }}
                            />
                            <span className="InputSeparatorLine"></span>
                            <p className={serviceNameError ? "show" : "hide"}>provide a name for service</p>
                        </div>
                    </div>
                    <div className="input-form-container">
                        <div className="input-header">
                            Service Image: 
                        </div>
                        <div className="input-container">
                            <div className={serviceImage ? "service-image-container" : "hide"}>
                                <img src={serviceImage} alt=""/>
                                <div 
                                    className="change-image-button"
                                    onClick={() => setShowImageUploader(true)} 
                                >
                                    <p>Change Image</p>
                                </div>
                            </div>
                            <div 
                                className={serviceImage ? "hide" : "add-button-container"}
                                onClick={() => setShowImageUploader(true)}    
                            >
                                <p>Add Image</p>
                            </div>
                            {
                                serviceImage
                                ?
                                ""
                                :
                                <p className={serviceImageError ? "show" : "hide"}>provide an image for service</p>
                            }
                        </div>
                    </div>
                    <div className="input-form-container">
                        <div className="input-header">
                            Sub Services: 
                        </div>
                        <div className={addSubService ? "input-container" : "hide"}>
                            <div 
                                className="add-button-container"
                                onClick={() => handleSubServiceValidation()}
                            >
                                <p>Add Sub-Service</p>
                            </div>
                        </div>
                    </div>
                    {handleSubServicesColumn()}
                </div>
                {handleImageUploader()}
            </div>
        )
    }

    const handleImageUploader = () => {
        return (
            <div className={showImageUploader ? "image-uploader-container" : "hide"}>
                <div className="image-uploader-inner-wrapper">

                    <ImageUploader
                        imageType="regularImage" // regularImage || profilePicture
                        resultData={data => setServiceImage(data.imageURL)}
                        showInitialImage={""}
                        imageClassName="serviceImage"
                    />
                
                    <div className={!!serviceImage ? "image-upload-show-button" : "hide"}>
                        <WhiteButton
                            runFunction={() => setShowImageUploader(false)}
                        >
                            Add
                        </WhiteButton>
                    </div>
                    <div 
                        className="image-close-container"
                        onClick={() => setShowImageUploader(false)}
                    >
                        <p>Close</p>
                    </div>
                </div>
            </div>
        )
    }

    const handleData = () => {
        const { showModal, modalType, modalData } = modalContext.valueGlobalState;

        if (showModal) {
            if (modalType === "addServiceForm") {
                if (!!modalData) {
                    return (
                        <GenericModal>
                             <div className="services-form-column-container">
                                {servicesForm()}
                            </div>
                            <div className="submit-button-container">
                                <WhiteButton
                                    runFunction={() => {
                                        handleServiceValidation()
                                        setSubmitClicked(true)
                                    }}
                                >
                                    Submit
                                </WhiteButton>
                            </div>
                        </GenericModal>
                    )
                }

                else {
                    return (
                        <GenericModal>
                            <div className="services-form-column-container">
                                {servicesForm()}
                            </div>
                            <div className="submit-button-container">
                                <WhiteButton
                                    runFunction={() => {
                                        handleServiceValidation()
                                        setSubmitClicked(true)
                                    }}
                                >
                                    Submit
                                </WhiteButton>
                            </div>
                        </GenericModal>
                    )
                }
            }
        }
    };

    return (
        <div className="dummy-modal-container">
            {handleData()}
        </div>
    )
}

export default AddServiceForm;
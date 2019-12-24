import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { SubServicesModalContext, ModalContext } from '../../utils/context/index';

import { api } from '../../actions/apiLinks';

import { encryptData, decryptData } from '../../factories/encryptDecrypt';
import { formatNameToCapitalisation } from '../../factories/formatter';

import ImageUploader from '../UX/imageUploader';
import { WhiteButton } from '../UX/uxComponents';

import { DeleteCloseButton, HappyFace, BigLoadingIcon } from '../../assets/images';

const SubServiceForm = (props) => {
    
    const subServicesModalContext = useContext(SubServicesModalContext);
    const modalContext = useContext(ModalContext);

    const [ subServicesError, setSubServicesError ] = useState(false);
    const [ subServiceNameError, setSubServiceNameError ] = useState(false);
    const [ subServiceImageError, setSubServiceImageError ] = useState(false);
    const [ subServiceDescriptionError, setSubServiceDescriptionError ] = useState(false);
    // const [ subServicePriceError, setSubServicePriceError ] = useState(false);
    // const [ subServiceTimelineError, setSubServiceTimelineError ] = useState(false);

    const [ successModal, setSuccessModal ] = useState(false)

    const [ subServices, setSubservices ] = useState([]);

    const [ subColumn, setSubColumn ] = useState(false);

    const [ subServiceId, setSubServiceId ] = useState(null);
    const [ subServiceName, setSubServiceName ] = useState(null); 
    const [ subServiceImage, setSubServiceImage ] = useState(null);
    const [ subServiceDescription, setSubServiceDescription ] = useState(null);
    const [ subServicePrice, setSubServicePrice ] = useState(null);
    const [ subServiceTimeline, setSubServiceTimeline ] = useState(null);

    const [ showImageUploader, setShowImageUploader ] = useState(false);
    // const [ addLoader, setAddLoader ] = useState(false);
    const [ submitLoader, setSubmitLoader ] = useState(false);

    const [ tempC, setTempC ] = useState(0);

    useEffect(() => {
        const { showModal } = subServicesModalContext.valueGlobalState;

        if (showModal) {
            setSubServiceName(null)
            setSubServiceImage(null)
            setSubServiceDescription(null)
            setSubServicePrice(null)
            setSubServiceTimeline(null)

            setShowImageUploader(false)

            setSubServicesError(false)
            setSubServiceNameError(false)
            setSubServiceImageError(false)
            setSubServiceDescriptionError(false)
        }

    }, [subServicesModalContext.valueGlobalState.showModal])

     useEffect(() => {

        if(props.subServices) {
            setSubservices(props.subServices)
        }

        if(props.submitClicked) {
            if (subServices.length !== 0) {
                validateFinalData()
                setSubmitLoader(true)
            }
            else {
                setSubServicesError(true)
            }
        }

        setSubColumn(props.subColumn)
    }, [props])

    const handleSubServiceId = (serviceId, previousSSID) => {

        let formattedSuffixNum,
        subservId = previousSSID,
        segregatedId = subservId.split(/([0-9]+)/).filter(Boolean),
        prefixId = segregatedId[0],
        suffixNum = parseInt(segregatedId[1], 10)
    
        suffixNum++;

        suffixNum = ("000" + suffixNum);
        formattedSuffixNum = suffixNum.substring(suffixNum.length - 3)
        // // let idNum = subservId.match(/\d+/)[0] 

        setSubServiceId(`${serviceId}-${prefixId}${formattedSuffixNum}`)

        subServices.push({
            subServiceId: `${serviceId}-${prefixId}${formattedSuffixNum}`,
            subServiceName, 
            subServiceImage,
            subServiceDescription,
            subServicePrice,
            subServiceTimeline
        })

        setSubservices([...subServices])
        subServicesModalContext.openOrCloseModal("close")
    }

    const validateSubService = () => {

        let { serviceId } = props;

        let dummyArray = [];
        
        if (!subServiceName) { 
            setSubServiceNameError(true)
            dummyArray.push("subServiceName")
        }
        if (!subServiceImage) {
            setSubServiceImageError(true)
            dummyArray.push("subServiceImage")
        }
        if (!subServiceDescription) {
            setSubServiceDescriptionError(true)
            dummyArray.push("subServiceDescription")
        }
        // if (!subServicePrice) { 
        //     setSubServicePriceError(true)
        //     dummyArray.push("subServicePrice")
        // }
        // if (!subServiceTimeline) { 
        //     setSubServiceTimelineError(true)
        //     dummyArray.push("subServiceTimeline")
        // }
        
        if (dummyArray.length === 0) {
            if(serviceId) {
                if (subServiceId) {

                    if (props.subColumn) {

                        let previousSSID = subServiceId.split('-')[1];

                        handleSubServiceId(serviceId, previousSSID)
                    }

                    else {
                        let index = subServices.findIndex(subService => subService.subServiceId === subServiceId);
                        
                        if(index < 0) {
                            let previousSSID = subServiceId.split('-')[1];
        
                            // console.log(previousSSID.split('-')[1]);

                            handleSubServiceId(serviceId, previousSSID);
                        }
    
                        else {
                            subServices.splice(index, 1);
    
                            subServices.push({
                                subServiceId,
                                subServiceName, 
                                subServiceImage,
                                subServiceDescription,
                                subServicePrice,
                                subServiceTimeline
                            })
        
                            setSubservices([...subServices])
                            subServicesModalContext.openOrCloseModal("close")
                        }

                    }
                }

                else {
                    
                    Axios.get(
                        api.GET_SERVICE_BY_ID + `?serviceId=${serviceId}`,
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
                        const { service, serviceExist } = decryptData(res.data.responseData);

                        if (serviceExist) {
                            // edit service to add/update sub services

                            let subService = service.subServices.pop();

                            let previousSSID = subService.subServiceId.split('-')[1];

                            handleSubServiceId(serviceId, previousSSID)
                        }

                        else {
                            setSubServiceId(`${serviceId}-SS001`)

                            subServices.push({
                                subServiceId: `${serviceId}-SS001`,
                                subServiceName, 
                                subServicePrice,
                                subServiceTimeline,
                                subServiceImage,
                                subServiceDescription
                            })
                            

                            setSubservices([...subServices])
                            // setAddLoader(false)
                            subServicesModalContext.openOrCloseModal("close")
                        }

                    })
                    .catch(err => console.log(err))
                }
            }
        }
    }

    const validateFinalData = () => {
        const { serviceId, serviceName, serviceImage } = props;
        
        if (subServices.length !== 0) {
            let newService = {
                serviceId,
                serviceName,
                serviceImage,
                subServices
            }

            let dataToBackend = {
                requestData: encryptData(newService)
            }

            Axios.post(
                api.CREATE_SERVICE,
                dataToBackend,
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
                // console.log(res)
                setSubmitLoader(false)
                setSuccessModal(true)
            })
            .catch(err => console.log(err))
        }

        else {
            setSubServicesError(true)
        }
    }

    const handleImageUploader = () => {
        return (
            <div className={showImageUploader ? "image-uploader-container" : "hide"}>
                <div className="image-uploader-inner-wrapper">
                    { 
                        tempC % 2 === 0 
                        ?
                        <ImageUploader
                            imageType="regularImage" // regularImage || profilePicture
                            resultData={data => setSubServiceImage(data.imageURL)}
                            showInitialImage={""}
                            imageClassName="serviceImage"
                        />
                        :
                        <div>
                            <ImageUploader
                                imageType="regularImage" // regularImage || profilePicture
                                resultData={data => setSubServiceImage(data.imageURL)}
                                showInitialImage={""}
                                imageClassName="serviceImage"
                            />
                        </div>
                    }
                    <div className={!!subServiceImage ? "image-upload-show-button" : "hide"}>
                        <WhiteButton
                            runFunction={() => {setShowImageUploader(false)}}
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
        // let { subColumn } = props;

        let deleteSubCategory = (value) => {
            const index = subServices.indexOf(value); 
 
            if(index >= 0){
             subServices.splice(index, 1);
            }
            setSubservices([...subServices])
         }

        let addedSubServices = () => {
            if(subServices.length !== 0) {
                return subServices.map((item,i) => {
                    return(
                        <div 
                            key={i} 
                            className="added-sub-services-outer-container" 
                            >
                            <div 
                                className="tooltip-text"
                                onClick={() => {
                                    setSubColumn(true)
                                    setSubServiceId(item.subServiceId)
                                    setSubServiceName(item.subServiceName)
                                    setSubServiceImage(item.subServiceImage)
                                    setSubServiceDescription(item.subServiceDescription)
                                    setSubServicePrice(item.subServicePrice)
                                    setSubServiceTimeline(item.subServiceTimeline)
                                }}
                            >
                                <p>Click to edit</p>
                            </div>
                            <div className="added-sub-services-inner-container">
                                <div className="image-value-container">
                                    <img src={item.subServiceImage} alt=""/>
                                </div>
                                <div className="added-sub-services-form-container">
                                    <div className="added-sub-input">
                                        <h3>{item.subServiceName} <span>({item.subServiceId})</span></h3>
                                        <div className="line"></div>
                                    </div>
                                    <div className="sub-rate-timeline-input">
                                        <h3>Price: <span>{item.subServicePrice}</span> </h3>
                                        <h3>Timeline: <span>{item.subServiceTimeline}</span></h3>
                                    </div>
                                    <div className="sub-input">
                                        <h3>{item.subServiceDescription}</h3>
                                    </div>
                                </div>
                            </div>
                            <div 
                                className="delete-sub-services-button-container"
                                onClick={() => {
                                    deleteSubCategory(item)
                                }}
                            >
                                <DeleteCloseButton />
                            </div>
                        </div>
                    )
                })
            }
        }

        let subServicesColumn = () => {
            return(
                    <div className="sub-services-form-input-data-container">
                        <div className="input-area-form-container">
                            <div className="input-field-header">
                                <h3>Sub Service Name:</h3>
                            </div>
                            <div className="input-field-container">
                                <input 
                                    type="text"
                                    placeholder="Enter Sub services name"
                                    defaultValue={subServiceName ? subServiceName : ""}
                                    onChange={(e) => {
                                        setSubServiceName(formatNameToCapitalisation(e.target.value.trim()))
                                        setSubServiceNameError(false)
                                    }}
                                />
                                <span className="InputSeparatorLine"></span>
                                <p className={subServiceNameError ? "show" : "hide"}>provide a name for sub-service</p>
                            </div>
                        </div>
                       
                        <div className="input-area-form-container">
                            <div className="input-field-header">
                                <h3>Sub Service Image:</h3>
                            </div>
                            <div className="sub-service-image-container">
                                <div className="sub-image-add-container">
                                    <div className={subServiceImage ? "sub-service-image-container" : "hide"}>
                                            <img src={subServiceImage} alt=""/>
                                    </div>
                                    <div 
                                        className={subServiceImage ? "change-image-button" : "hide"}
                                        onClick={() => {
                                            setTempC(tempC + 1)
                                            setShowImageUploader(true)
                                        }}
                                        >
                                        <p>Change Image</p>
                                    </div>
                                    <div 
                                        className={subServiceImage ? "hide" : "change-image-button"}
                                        onClick={() => {
                                            setTempC(tempC + 1)
                                            setShowImageUploader(true)
                                        }}
                                        >
                                        <p>Add Image</p>
                                    </div>
                                </div>
                                {
                                    subServiceImage
                                    ?
                                    ""
                                    :
                                    <p className={subServiceImageError ? "show-image-text" : "hide"}>provide an image for sub-service</p>     
                                }
                               
                            </div>
                            {/* <div className={subServiceImage ? "hide" :"input-field-container"}>
                                <div 
                                    className="add-button-container"
                                    onClick={() => setShowImageUploader(true)}
                                    >
                                    <p>Add Image</p>
                                </div>
                                
                            </div> */}

                        </div>
                        <div className="input-area-form-container">
                            <div className="input-field-header">
                                <h3>Sub Service Description:</h3>
                            </div>
                            <div className="input-field-container">
                                <textarea
                                    rows="10"
                                    defaultValue={subServiceDescription ? subServiceDescription : ""}
                                    onChange={(e) => {
                                        setSubServiceDescription(e.target.value)
                                        setSubServiceDescriptionError(false)
                                    }}
                                />
                                <p className={subServiceDescriptionError ? "show" : "hide"}>provide a description of sub-service</p>
                            </div>
                        </div>

                        <div className="input-area-form-container">
                            <div className="input-field-header">
                                <h3>Sub Service Rate:</h3>
                            </div>
                            <div className="input-field-container">
                                <input 
                                    type="text"
                                    placeholder="Enter Sub services Rate"
                                    defaultValue={subServicePrice ? subServicePrice : ""}
                                    onChange={(e) => {
                                        setSubServicePrice(e.target.value)
                                        // setSubServicePriceError(false)
                                    }}
                                />
                                <span className="InputSeparatorLine"></span>
                                {/* <p className={subServicePriceError ? "show" : "hide"}>provide a Rate for sub-service</p> */}
                            </div>
                        </div>
                        <div className="input-area-form-container">
                            <div className="input-field-header">
                                <h3>Sub Service Timeline:</h3>
                            </div>
                            <div className="input-field-container">
                                <input 
                                    type="text"
                                    placeholder="Enter Sub services TImeline"
                                    defaultValue={subServiceTimeline ? subServiceTimeline : ""}
                                    onChange={(e) => {
                                        setSubServiceTimeline(e.target.value)
                                        // setSubServiceTimelineError(false)
                                    }}
                                />
                                <span className="InputSeparatorLine"></span>
                                {/* <p className={subServiceTimelineError ? "show" : "hide"}>provide a Timeline for sub-service</p> */}
                            </div>
                        </div>
                        <div className="add-close-button">
                            <div 
                                className="close-sub-container"
                                onClick={() => {
                                    subServicesModalContext.openOrCloseModal("close", "subServicesForm")
                                }}
                            >
                                <p>close</p>
                            </div>
                            <div 
                                className="add-sub-button-container"
                                onClick={() => {
                                        validateSubService()
                                        // setAddLoader(true)
                                    }}
                            >
                                <p>Add</p>
                            </div>
                        </div>
                    </div>
            )
        }

        if(subColumn) {
            return(
                <div className="sub-services-form-inner-container">
                    {subServicesColumn()}
                    {handleImageUploader()}
                </div>
            )
        }

        else {
            
            if(subServicesError) {
                return <p className={subServicesError ? "showError" : "hide"}>add sub service under this service</p>
            }

            else{
                return(
                    <div className="added-input-container">
                        {addedSubServices()}
                        <div className={successModal ? "service-success-modal" : "hide"}>
                            <div className="success-modal-inner-layer">
                                <div className="svg-image-container">
                                    <HappyFace/>
                                </div>
                                <p>You have successfully uploaded the services.</p>
                                <div className="close-success-modal-button-container">
                                    <WhiteButton
                                        runFunction={() => {
                                            setSuccessModal(false)
                                            modalContext.openOrCloseModal("close", "serviceUpload", 7)
                                        }}
                                    >
                                        Close
                                    </WhiteButton>
                                </div>
                            </div>
                        </div>
                        {/* <div className={addLoader ? "add-services-loader" : "hide"}>
                            <div className="add-services-loader-inner-container">
                                <NavbarLoaderIcon/>
                            </div>
                        </div> */}
                        <div className={submitLoader ? "submit-services-loader" : "hide"}>
                            <div className="submit-services-loader-inner-container">
                                <BigLoadingIcon/>
                            </div>
                        </div>
                    </div>
                )
            }

        }

    }

    return(
        handleData()
    )
}

export default SubServiceForm;
import React, { useState, useEffect } from 'react';
import { CSVLink } from "react-csv";
import { Image } from 'cloudinary-react';
import axios from 'axios';

import { api } from '../../../actions/apiLinks';

import { decryptData } from '../../../factories/encryptDecrypt';
import { PublicId } from '../../../factories/cloudinaryFactory';
import { formatDateString, formatTimeString } from '../../../factories/formatter';

import {BigCloseButton,NavBarLoadingIcon} from "../../../assets/images/index"

function CustomDesignDetails() {

    const [ designDetailsArray, setDesignDetailsArray ] = useState([])
    const [ modalContainer, setModalContainer ] = useState( "order-details-modal-container hide" )
    const [ showImage, setShowImage ] = useState("")
    const [ loadingClass, setLoadingClass ] = useState('loadingAnim')
    const [ mainClass, setMainClass ] = useState('order-details-inner-layer hide')
    const [ fetchId, setFetchId ] = useState(null)
    const [ defaultImage, setDefaultImage ] = useState("")

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        axios.get(
            api.CUSTOM_DESIGN_ENQUIRY,
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
            //
            //
            // Decrypt data
            let decryptedData = decryptData(res.data.responseData);
            // console.log(decryptedData)
            // Decrypt data
            //
            //

            setDesignDetailsArray(decryptedData.customDesignRequests)
            setLoadingClass('loadingAnim  hide')
            setMainClass('order-details-inner-layer')
        })
        .catch(err => console.log(err))
    }, [])

    const returnOrderDetailsModal = () => {

        const displayImage = () => {
            if (showImage !== "") {
                return (
                    <div 
                        className="productImages-container"
                        >
                        <Image 
                            cloudName="rolling-logs" 
                            publicId={PublicId(showImage)} 
                            width="780" 
                            // height="40"
                            crop="fit" 
                        />
                        {/* <img src={showImage} alt="" /> */}
                    </div>
                );
            }
            else{
                if (designDetailsArray.length !== 0) {
                    return(
                        <div
                        className="productImages-container"
                        >
                            <Image 
                                cloudName="rolling-logs" 
                                publicId={PublicId(defaultImage)} 
                                width="780" 
                                crop="fit" 
                            />
                            {/* <img src={item.imageURL} alt=""/> */}
                        </div>
                    )
                }
            }
        }

        const imageSlider = () => {

            if (designDetailsArray.length !== 0) {
                return designDetailsArray.map((item,i) => {
                    if(fetchId === item.time){
                        return item.referenceImages.map((item,j) => {
                            return(
                                <div
                                    key={j}
                                    className="img-container"
                                    onClick={() => {
                                        setShowImage(item.imageURL)
                                    }}
                                >
                                    <Image 
                                        cloudName="rolling-logs" 
                                        publicId={PublicId(item.imageURL)} 
                                        width="160" 
                                        height="180"
                                        crop="fit" 
                                    />
                                    {/* <img src={item.imageURL} alt=""/> */}
                                </div>
                            )
                        })
                    }
                    else{
                        return(
                            <div key={i}></div>
                        )
                    }
                })
            }
        }

        return(
            <div className="custom-images-modal-container-outer-layer">
                <div className="custom-images-modal-container-inner-layer">
                    <div className="preview-img-slider-container">
                        <div className="preview-img-slider-container-inner-layer">
                            {imageSlider()}
                        </div>
                    </div>
                    <div className="preview-img-main-container">
                        <div className="preview-img-main-container-inner-layer">
                            {displayImage()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const customOrderInfoContent = () => {
        const returnCustomImages = (item) => {
            if(item.referenceImages.length !== 0){
                return(
                    <div
                        className="img-length-container"
                        onClick={() => {
                            setModalContainer("order-details-image-modal-container")
                            setFetchId(item.time)
                            setShowImage("")
                            setDefaultImage(item.referenceImages[0].imageURL)
                        }}
                    >
                        <p>{item.referenceImages.length} <span>click for image preview</span> </p>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        Nil
                    </div>
                )
            }
        }
        
        if (designDetailsArray.length !== 0) {
            return designDetailsArray.map((item,i) => {
                // console.log(item)
                return(
                    <div 
                        key={i}
                        className="order-info-content-container">
                        <div className="order-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{item.name}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.mobileNo}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.emailId}</p>
                            </div>
                            <div className="info-value-container">
                                {returnCustomImages(item)}
                            </div>
                            <div className="info-value-container">
                                <p>{formatDateString(item.date)}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{formatTimeString(item.date)}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    const headers = [
        { label: "Vendor name", key: "name" },
        { label: "Mobile", key: "mobileNo" },
        { label: "Email address", key: "emailId" },
        { label: "Images", key: "referenceImages" },
        // { label: "Date and time", key: "time" },
        { label: "Date", key: "date" },
        { label: "Time", key: "time" },
    ];

    // console.log(designDetailsArray);

    return(
        <div className="order-details-outer-layer">
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                
                <div
                    className="analytics-page-number-section">
                    <div className="analytics-page-number-section-inner-layer">
                        <div 
                            className="download-button-conatiner"
                        >
                           <CSVLink 
                                data={
                                    designDetailsArray.map(item => ({ 
                                        name: item.name, 
                                        emailId: item.emailId,
                                        mobileNo: item.mobileNo,
                                        referenceImages: item.referenceImages.length,
                                        // time: new Date(item.time).toUTCString().slice(0,22)
                                        date: (item.date).slice(0,10),
                                        time: (item.date).slice(11,16)
                                    })
                                )}
                                headers={headers}
                                filename={"custom-design-details.csv"}
                            >
                                <p>Download me</p>
                            </CSVLink>
                        </div>
                    </div>
                </div>
                <div className="grid-container-outer-layer">
                    <div className="grid-container-inner-layer">
                        <div className="grid-title-layer">
                            <h3>Customer name</h3>
                            <div className="tooltip">
                                <p>Sort list by customer-name</p>
                            </div>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Mobile</h3>
                            <div className="tooltip">
                                <p>Sort list by Mobile no.</p>
                            </div>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Email address</h3>
                            <div className="tooltip">
                                <p>Sort list by Email-address</p>
                            </div>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Images</h3>
                            <div className="tooltip">
                                <p>Sort list by Images</p>
                            </div>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Date</h3>
                            <div className="tooltip">
                                <p>Sort list by Date</p>
                            </div>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Time</h3>
                            <div className="tooltip">
                                <p>Sort list by time</p>
                            </div>
                        </div>
                    </div>
                </div>
                {customOrderInfoContent()}
            </div>
            <div className={modalContainer}>
                <div className="modalContainer-inner-layer">
                    <div
                        className="close-button"
                        onClick={() => {
                            setModalContainer("order-details-modal-container hide")
                    }} 
                    >
                        <BigCloseButton /> 
                    </div>
                    <div className="order-details-modal-container-innerLayer">
                        {returnOrderDetailsModal()}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CustomDesignDetails;
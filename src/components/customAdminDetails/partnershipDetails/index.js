import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { api } from '../../../actions/apiLinks';

import Popup from "../../common/popup";

import { decryptData } from '../../../factories/encryptDecrypt';
import { formatDateString, formatTimeString } from '../../../factories/formatter';

import { NavBarLoadingIcon } from "../../../assets/images/index";


const PartnerDetails = () => {

    const [ partnerDetailsArray, setPartnerDetailsArray ] = useState([]);
    const [ loadingClass, setLoadingClass ] = useState("loadingAnim");
    const [ mainClass, setMainClass ] = useState("order-details-inner-layer hide");
    const [ showPopup, setShowPopup ] = useState(false); 

    useEffect(() => {
        axios.get(
            api.VENDOR_ONBOARD_REQUESTS,
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
            let decryptedData = decryptData(res.data.responseData) 
            // Decrypt data
            //
            //
            
            setPartnerDetailsArray(decryptedData.vendorOnboardAndAdRequests)
            setLoadingClass('loadingAnim  hide')
            setMainClass('order-details-inner-layer')

        })
        .catch(err => console.log(err))
    }, [])

    const  partnerInfoContent = () => {
        // const { partnerDetailsArray } = this.state;

        if (partnerDetailsArray.length !== 0) {
            return partnerDetailsArray.map((item,i) => {
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
                                <p>{item.emailId.replace(".com", "")}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.requestType === "vendorOnboard" ? <span>On board request</span> : <span>Ad display request</span> }</p>
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

    const partnershipPageNumberSection = () => {
       return(
        <div
            className="analytics-page-number-section">
            <div className="analytics-page-number-section-inner-layer">
                <div 
                    className="download-button-conatiner"
                    onClick={() => togglePopup()}
                >
                    <p>Download me</p>
                </div>

            </div>
        </div>
       ) 
    }

    const togglePopup = () => {
        setShowPopup(!showPopup)
    };

    const headers = [
        { label: "Vendor name", key: "name" },
        { label: "Mobile", key: "mobileNo" },
        { label: "Email address", key: "emailId" },
        { label: "Request type", key: "requestType" },
        { label: "Date", key: "date" },
        { label: "Time", key: "date" },
      ];

    return(
        <div className="order-details-outer-layer">
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                {partnershipPageNumberSection()}
                {showPopup ? 
                    <Popup
                        data={partnerDetailsArray}
                        filename={"partnership-details.csv"}
                        headers={headers}
                        text={'Partnership Details CSV'}
                        closePopup={togglePopup}
                    />
                    : null
                }
                <div className="grid-container-outer-layer">
                    <div className="grid-container-inner-layer">
                        <div className="grid-title-layer">
                            <h3>Vendor name</h3>
                            <div className="tooltip">
                                <p>Sort list by Vendor-name</p>
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
                            <h3>Request type</h3>
                            <div className="tooltip">
                                <p>Sort list by Request-type</p>
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
                {
                    partnerDetailsArray.length !== 0 ? partnerInfoContent() : <div className="loading-wrapper">
                        <NavBarLoadingIcon />
                    </div>
                }
                {partnershipPageNumberSection()}
            </div>
        </div>
    )

}

export default PartnerDetails;

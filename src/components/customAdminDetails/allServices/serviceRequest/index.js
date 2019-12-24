import React, { useEffect, useState }  from 'react';
import Axios from 'axios';

import { api } from '../../../../actions/apiLinks';
import { decryptData } from '../../../../factories/encryptDecrypt';

import { NavBarLoadingIcon } from '../../../../assets/images';
import { formatDateWithTimeString } from '../../../../factories/formatter';

const ServiceRequests = () => {

    const [ serviceRequests, setServiceRequests ] = useState([])

    const [ loadingClass, setLoadingClass ] = useState('loadingAnim')
    const [ mainClass, setMainClass ] = useState('"services-partner-pages-inner-layer" hide')

    useEffect(() => {
        // Update the document title using the browser API
        Axios.get(
            api.SERVICE_QUOTE_DATA,
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
            let { serviceRequestExist, serviceRequest } = decryptData(res.data.responseData);

            if (serviceRequestExist) setServiceRequests(serviceRequest);
            else setServiceRequests([]);

            setLoadingClass('loadingAnim  hide')
            setMainClass("services-partner-pages-inner-layer")

        })
        .catch(err => console.log(err))
    }, [])

    const servicePartnerInfo = () => {

        if (serviceRequests.length !== 0) {
            return serviceRequests.map((item,i) => {
                return(
                    <div 
                        key={i}
                        className="architect-info-content-container">
                        <div className="architect-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{item.name}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.emailId.replace(".com", "")}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.mobileNo}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.serviceName}-{item.subServiceName}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{formatDateWithTimeString(item.date)}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        else {
            return <p>No service requested yet.</p>
        }
    }

    const getGridLabels = () => {
        const headingArray = [
            { label: "Name", value: 0 },
            { label: "Email-id", value: 1 },
            { label: "Phone no.", value: 2 },
            { label: "Service Type", value: 3},
            { label: "Requested On", value: 4}
        ];
        
        return headingArray.map(item => {
            return(
                <div className="grid-title-layer" key={item.value}>
                    <h3>{item.label}</h3>
                </div>
            )
        })

    }

    return(
        <div className="services-details-pages-outer-layer">
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                <div className="grid-container-outer-layer">
                    <div className="grid-container-inner-layer">
                        {getGridLabels()}
                    </div>
                </div>
                {servicePartnerInfo()}
            </div>
        </div>
    )
}

export default ServiceRequests;
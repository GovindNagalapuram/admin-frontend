import React, { useContext } from 'react';

import { WhiteButton } from '../../UX/uxComponents';
import Axios from 'axios';
import { decryptData } from '../../../factories/encryptDecrypt';

import { ModalContext } from '../../../utils/context/index';
import { api } from '../../../actions/apiLinks';

const EditOrDeleteService = (props) => {

    const { serviceName, serviceId, serviceImage, subServices, _id } = props.detailedServiceData;
    const modalContext = useContext(ModalContext);

    const handleSubServices = () => {
        return subServices.map((subService, i) => {
            return (
                <div key={i} className="sub-service-inner-container">
                    <div className="sub-service-info-headers">
                        <div className="sub-service-image-container">
                             <img 
                                src={subService.subServiceImage}
                                alt={subService.subServiceId}
                            />
                        </div>
                        <div className="sub-services-details">
                            <div className="sub-id-name-container">
                                <h3>{subService.subServiceName}</h3>
                                <h3>({subService.subServiceId})</h3>
                            </div>
                            <div className="price-timeline-container">
                                <p className={subService.subServiceTimeline ? "show" : "hide"}>Timeline: <span>{subService.subServiceTimeline}</span></p>
                                <p className={subService.subServicePrice ? "show" : "hide"}>Price: <span>{subService.subServicePrice}</span></p>
                            </div>
                        </div>
                    </div>
                    <p className="description-para">{subService.subServiceDescription}</p>
                </div>
            )
        })
    }

    const handleDeleteService = () => {
        Axios.delete(
            api.DELETE_SERVICE + `?objectId=${_id}`,
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
            const { postDeleted } = decryptData(res.data.responseData);

            if (postDeleted) modalContext.openOrCloseModal("close", "serviceDelete", 7);
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="service-details-main-container">
            <div className="service-scroll-container">
                <div className="service-details-container-inner-layer">
                    <div className="service-custom-container">
                        <div className="id-name-container">
                            <h3>{serviceName} details</h3>
                            <h3 className="sub-service-id">{serviceId}</h3>
                        </div>
                        <div className="imageContainer">
                            <img 
                                src={serviceImage}
                                alt={serviceId}
                            />
                        </div>
                        <div className="sub-services-custom-container">
                            {handleSubServices()}
                        </div>
                        <div className="update-delete-button-container">
                            <div className="delete-button-container">
                                <WhiteButton
                                    runFunction={() => handleDeleteService()}
                                >
                                    Delete Details
                                </WhiteButton>  
                            </div>
                            <div className="update-button-container">
                                <WhiteButton
                                    runFunction={() => modalContext.openOrCloseModal("open", "addServiceForm", props.detailedServiceData)}
                                >
                                    Update Details
                                </WhiteButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditOrDeleteService;
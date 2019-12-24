import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { api } from '../../../actions/apiLinks';

import { decryptData } from '../../../factories/encryptDecrypt';
import { formatDateWithTimeString } from '../../../factories/formatter';

import { ModalContext } from '../../../utils/context/index';

import EditOrDeleteService from './editOrDeleteServices';
import { NavBarLoadingIcon, NavbarLoaderIcon, BigCloseButton } from '../../../assets/images';

const Services = () => {

    const modalContext = useContext(ModalContext);
    
    const [ loadingClass, setLoadingClass ] = useState('loadingAnim')
    const [ mainClass, setMainClass ] = useState('service-details-inner-layer hide')

    const [ servicesData, setServicesData ] = useState([]);
    const [ detailsModalLoader, setDetailsModalLoader ] = useState(true);

    const [ detailedServiceData, setDetailedServcieData ] = useState([])

    const [ modalContainer, setModalContainer ] = useState("service-details-modal-container hide")

    useEffect(() => {

        const { modalType, showModal } = modalContext.valueGlobalState;

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
            const { serviceExist, services } = decryptData(res.data.responseData);

            if (serviceExist) setServicesData(services)
            else setServicesData([])

            setLoadingClass('loadingAnim  hide')
            setMainClass('service-details-inner-layer')
        })
        .catch(err => console.log(err))

        if (!showModal) {
            if (modalType === "serviceUpload" || modalType === "serviceDelete") setModalContainer("service-details-modal-container hide")
        }

        // console.log(modalType, showModal );

    }, [modalContext.valueGlobalState.modalType])

    const fetchDetails = (serviceId) => {

        Axios.get(
            api.GET_SERVICE_BY_ID + `?serviceId=${serviceId}`,
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
            const { service, serviceExist } = decryptData(res.data.responseData);

            if (serviceExist) setDetailedServcieData(service)
            else setDetailedServcieData(null)

            setDetailsModalLoader(false)
        })
        .catch(err => console.log(err))

    }

    const openSlider = () => document.getElementById("slider").style.width = "50%";

    const servicesInfoContent = () => {
        if (servicesData.length !== 0) {
            return servicesData.map((service, i) => {
                return (
                    <div
                        key={i}
                        className="service-info-content-container"
                    >
                        <div className="service-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{service.serviceName}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{service.serviceId}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{service.subServices.length}</p>
                            </div>
                            <div className="info-value-container detail-switch">
                                <p>{formatDateWithTimeString(service.date)}</p>
                                <div className="info-value-container detail-time">
                                    <div 
                                        className="detail-button-Container"
                                        onClick={() => {
                                            setModalContainer("service-details-modal-container")
                                            openSlider()
                                            fetchDetails(service.serviceId)
                                            // setVendorDetailsArray([])
                                        }}
                                        >
                                            <p>Details</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        else {
            return <p className="emptyContainerText">There are no services added yet.</p>
        }
    }

    const returnServiceDetailsModal = () => {
        if (detailsModalLoader) {
            return <NavbarLoaderIcon />
        }

        else {
            return <EditOrDeleteService detailedServiceData={detailedServiceData} />
        }
    }

    return (
        <div className="service-details-outer-layer">
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                <div className="grid-container-outer-layer">
                    <div className="grid-container-inner-layer">
                        <div className="grid-title-layer">
                            <h3>Service Name</h3>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Service Id</h3>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Sub-services</h3>
                        </div>
                        <div className="grid-title-layer">
                            <h3>Created On</h3>
                        </div>
                    </div>
                </div>
                {servicesInfoContent()}
            </div>
            <div id="slider" className={modalContainer}>
                <div className="modalContainer-inner-layer">
                    <div
                        className="close-button"
                        onClick={() => {
                            setModalContainer("service-details-modal-container hide")
                      }} 
                    >
                        <BigCloseButton /> 
                    </div>
                    <div className="service-details-modal-container-innerLayer">
                        {returnServiceDetailsModal()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services;
import React, { useEffect, useState }  from 'react';
import Axios from 'axios';

import { api } from '../../../../actions/apiLinks';
import { decryptData } from '../../../../factories/encryptDecrypt';

import { NavBarLoadingIcon, BigCloseButton, BigCloseWhiteButton } from '../../../../assets/images';
import { formatDateWithTimeString } from '../../../../factories/formatter';

const ServicePartners = () =>{

    const [ servicePartners, setServicePartners ] = useState([])

    const [ loadingClass, setLoadingClass ] = useState('loadingAnim')
    const [ mainClass, setMainClass ] = useState('architect-pages-inner-layer hide')
    const [ modalContainer, setModalContainer ] = useState("service-partner-details-modal-container hide")


    const [ partnerMailId, setPartnerMailId ] = useState(null)
    const [ partnerNumber, setPartnerNumber ] = useState(null)
    const [ partnerTeam, setPartnerTeam ] = useState(null)
    const [ requestedTime, setRequestedTime ] = useState(null)

    const [ classValue, setClassValue ] = useState(null)


    useEffect(() => {
        // Update the document title using the browser API
        Axios.get(
            api.SERVICE_PARTNER_ONBOARD_REQUESTS,
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
            let { partnersExist, partners } = decryptData(res.data.responseData);

            // console.log(partners)
                
            if (partnersExist) setServicePartners(partners);
            else setServicePartners([]);

            setLoadingClass('loadingAnim  hide')
            setMainClass("architect-pages-inner-layer")
        })
        .catch(err => console.log(err))
    }, [])

    const openSlider = () => document.getElementById("slider").style.width = "35%";

    const returnPartnerDetailsModal = () => {

        let getWorkingTeamData = (data,type) => {

            const teamSize = [
                { label: "Choose one", value: 0 },
                { label: "1 - 3 members", value: 1 },
                { label: "4 - 6 members", value: 2 },
                { label: "7 - 10 members", value: 3 },
                { label: "> 10 members", value: 4 }
            ];

            if(data){
                if(type == "team"){
                    return teamSize.map((item,i) => {
                        if(data == item.value){
                            return(
                                <h3 key={i}>{item.label}</h3>
                            )
                        }
                    })
                }
            }
        }

        return(
            <div className="flex-column-container">
                <div className="service-partner-info-container">
                    {/* <h3>Service Partner Details</h3> */}
                    <div className="details-container">
                        <div className="partner-data">
                            <p>Email-id:</p>
                            <h3>{ partnerMailId }</h3>
                        </div>
                        <div className="partner-data">
                            <p>Phone No.:</p>
                            <h3>{ partnerNumber }</h3>
                        </div>
                        <div className="partner-data">
                            <p>Team:</p>
                            {getWorkingTeamData(partnerTeam,"team")}
                        </div>
                        <div className="partner-data">
                            <p>Requested date:</p>
                            <h3>{formatDateWithTimeString(requestedTime)}</h3>
                        </div>
                    </div>
                    <div
                        className="close-button"
                            onClick={() => {
                                setClassValue(null)
                        }} 
                        >
                        <BigCloseWhiteButton /> 
                    </div>
                </div>
            </div>
        )
    }

    const servicePartnerInfo = () => {

        let getPartnerDetails = (data) => {
            return data.map((item, i)=>{
                return (
                    <p key={i}>{item}</p>
                )
            })
        }

        let getWorkingData = (data,type) => {
            const budgetArray = [
                { label: "Choose one", value: 0 },
                { label: "1 year", value: 1 },
                { label: "1 - 3 year", value: 2 },
                { label: "3 - 5 year", value: 3 },
                { label: "5 - 10 year", value: 4 },
                { label: "10 - 20 year", value: 5 },
                { label: "20+ year", value: 6 },
            ];

            // const teamSize = [
            //     { label: "Choose one", value: 0 },
            //     { label: "1 - 3 members", value: 1 },
            //     { label: "4 - 6 members", value: 2 },
            //     { label: "7 - 10 members", value: 3 },
            //     { label: "> 10 members", value: 4 }
            // ];

            if(data){
                if(type == "experience"){
                    return budgetArray.map((item,i) => {
                        if(data == item.value){
                            return(
                                <p key={i}>{item.label}</p>
                            )
                        }
                    })
                } 
                // else if(type == "team"){
                //     return teamSize.map((item,i) => {
                //         if(data == item.value){
                //             return(
                //                 <p key={i}>{item.label}</p>
                //             )
                //         }
                //     })
                // }
            }
        }

        if (servicePartners.length !== 0) {
            return servicePartners.map((item,i) => {
                return(
                    <div 
                        key={i}
                        className="architect-info-content-container">
                        <div className="architect-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{item.name}</p>
                            </div>
                            {/* <div className="info-value-container">
                                <p>{item.emailId}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.mobileNo}</p>
                            </div> */}
                            <div className="info-value-container">
                                <div className="get-listed-details">
                                    {getPartnerDetails(item.services)}
                                </div>
                            </div>
                            <div className="info-value-container">
                                <div className="get-listed-details">
                                    {getPartnerDetails(item.projectType)}
                                </div>
                            </div>
                            <div className="info-value-container">
                                <p>{item.budgetType}</p>
                            </div>
                            <div className="info-value-container">
                                <div className="get-listed-details">
                                    {getPartnerDetails(item.software)}
                                </div>
                            </div>
                            <div className="info-value-container detail-switch">
                                {/* <p>{item.workExperience}</p> */}
                                {getWorkingData(item.workExperience,"experience")}
                                <div className="info-value-container detail-time">
                                    <div 
                                        className="detail-button-Container"
                                        onClick={() => {
                                            // setModalContainer("service-partner-details-modal-container")
                                            openSlider()
                                            setPartnerMailId(item.emailId)
                                            setPartnerNumber(item.mobileNo)
                                            setPartnerTeam(item.workingTeam)
                                            setRequestedTime(item.date)
                                            setClassValue(i)
                                            // fetchDetails(item.name)
                                            // setVendorDetailsArray([])
                                        }}
                                        >
                                            <p>Details</p>
                                    </div>
                                </div>
                            </div>
                            <div className="info-value-container">
                                {/* <p>{item.workingTeam}</p> */}
                                {/* {getWorkingData(item.workingTeam,"team")} */}
                            </div>
                        </div>
                        <div className={classValue === i  ? "architect-details-container" : "hide"}>
                            {returnPartnerDetailsModal()}
                        </div>
                    </div>
                )
            })
        }

        else {
            return <p>There are no service partners requested yet.</p>
        }
    }

    const getGridLabels = () => {
        const headingArray = [
            { label: "Name", value: 0 },
            // { label: "Email-id", value: 1 },
            // { label: "Phone no.", value: 2 },
            { label: "Services", value: 1 },
            { label: "Projects", value: 2 },
            { label: "Budget", value: 3 },
            { label: "Softwares", value: 4 },
            { label: "Experiencee", value: 5 },
            // { label: "Team", value: 8 }
        ];
        
        return headingArray.map((item,i) => {
            return(
                <div className="grid-title-layer" key={i}>
                    <h3>{item.label}</h3>
                </div>
            )
        })

    }

    return(
        <div className="architect-details-pages-outer-layer">
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
                        {returnPartnerDetailsModal()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicePartners;
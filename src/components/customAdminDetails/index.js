import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { api } from '../../actions/apiLinks';

import Navbar from '../common/navbar';

import OrderDetails from './orderDetails';
import PartnerDetails from './partnershipDetails';
import CustomDesignDetails from './customDesignDetails';
import PageAnalytics from './pageAnalytics';
import Services from './services';
import DesignPartner from './allServices/servicePartner';

import { decryptData } from '../../factories/encryptDecrypt';

import { BigLoadingIcon } from "../../assets/images";
import '../../assets/sass/admin.scss'
import ServicePartner from './allServices/serviceRequest';
import ServiceColumn from './allServices';
import MailService from './emails';

function Adminpanel () {
    
    const [ adminContent,setAdminContent ] = useState("admin-panel-content-container hide")
    const [ loadingClass, setLoadingClass ] = useState("loadingClassMain")
    const [ mainClass, setMainClass] = useState("admin-panel-inner-layer hide")
    const [ headers ] = useState([
        {
            name: "Orders",
            id: 1
         },
         {
            name: "Partnerships",
            id: 2       
         },
         {
            name: "Custom designs",
            id: 3
         },
         {
            name: "Vendors",
            id: 4
         },
         {
            name: "Analytics",
            id: 5   
         },
         {
            name: "Products",
            id: 6
         },
         {
            name: "Service",
            id: 7
         },
         {
            name: "Mails",
            id: 8
         },
        //  {
        //     name: "Service request",
        //     id: 9
        //  },

    ])
    const [ ScatId, setScatId ] = useState("")
    const [ dataId, setDataId ] = useState(1)
    const [ adminData, setAdminData ] = useState(null)

    useEffect(() => {

        Axios.get(
                api.ADMIN_DATA, 
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
                // DECRYPT REQUEST DATA
                // 
                let decryptedData = decryptData(
                    res.data.responseData
                )
                //
                // DECRYPT REQUEST DATA
                //

                setAdminData(decryptedData)
                setLoadingClass("loadingClassMain hide")
                setMainClass("admin-panel-inner-layer")

            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status === 401){
                        console.error(err.response)
                        window.open('/', "_self")
                    }
                        
                }
    
                else
                    console.error(err)
            })
    },[])

    const returnHeaderContent = () => {
            // const { headers } = this.state;
        
            return headers.map((item,i) => {
                // console.log(item);
                return(
                    <div 
                        className="headerText"
                        key={i}
                        onClick={() => {
                            setAdminContent("admin-panel-content-container")
                            setScatId(1)
                            setDataId(item.id)
                        }}
                    >
                        <h3 className={dataId === item.id ? "headerTextOne" : ""}>{item.name}</h3>
                    </div>
                )
                    
            })
    }

    const  returnInfoContent = () => {

        if(dataId === 1){
            return(
                <div>
                    <OrderDetails/>
                </div>
            )
        }

        else if(dataId === 2){
            return(
                <div>
                    <PartnerDetails/>
                </div>
            )
        }

        else if(dataId === 3){
            return(
                <div>
                    <CustomDesignDetails/>
                </div>
            )
        } 
        
        else if(dataId === 5){
            return(
                <div>
                    <PageAnalytics/>
                </div>
            )
        }

        else if(dataId === 7){
            return(
                <div>
                    <ServiceColumn />
                </div>
            )
        }
        
        else if(dataId === 8){
            return(
                <div>
                    <MailService />
                </div>
            )
        }
        
        // else if(dataId === 9){
        //     return(
        //         <div>
        //             <ServicePartner />
        //         </div>
        //     )
        // }
    }

    return (
        <div className="admin-panel-outer-layer">
            {
                adminData
                ?
                <Navbar 
                    adminName = {adminData.adminName}
                />
                :
                <Navbar/>
            }
            <div className={loadingClass}>
                <BigLoadingIcon/>
                <h1>We are loading...</h1>
            </div>
            
            <div className={mainClass}>
                <div className="admin-panel-header-container">
                    {returnHeaderContent()}
                </div>
                <div className="admin-content-outer-layer">
                    <div className={ScatId === "" ? "admin-content-container" : adminContent}>
                        { returnInfoContent() }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Adminpanel;

import React, { useState }  from 'react';

import ServiceRequests from './serviceRequest';
import ServicePartners from './servicePartner';

import Services from '../services';

const ServiceColumn = () => {

    const [ headers ] = useState([
        {
            name: "Types of Services",
            id: 1
         },
         {
            name: "Service Partners",
            id: 2       
         },
         {
            name: "Service Request",
            id: 3
         }
    ])
    const [ dataId, setDataId ] = useState(1)


    const returnHeaderContent = () => {
        return headers.map((item,i) => {
            return(
                <div 
                    className="headerText"
                    key={i}
                    onClick={() => {
                        setDataId(item.id)
                    }}
                >
                    <h3 className={dataId === item.id ? "headerTextOne" : ""}>{item.name}</h3>
                </div>
            )
                
        })
    }

    const returnServiceInfo = () => {
        if(dataId === 1){
            return(
                <div>
                    <Services/>
                </div>
            )
        }

        else if(dataId === 2){
            return(
                <div>
                    <ServicePartners/>
                </div>
            )
        }

        else if(dataId === 3){
            return(
                <div>
                    <ServiceRequests/>
                </div>
            )
        } 
    }

    return(
        <div className="service-container">
            <div className="service-header-inner-container">
                {returnHeaderContent()}
            </div>
            <div className="service-info-container">
                {returnServiceInfo()}
            </div>
        </div>
    )

}

export default ServiceColumn;
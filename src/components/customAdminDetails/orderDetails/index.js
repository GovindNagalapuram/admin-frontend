import React, { useState } from 'react';

import RequestQuoteOrders from './requestQuoteOrders';
import PlacedOrders from './placedOrders';


function OrderDetails () {
    
    const [ headers ] = useState([
        {
            name: "Order quotes",
            id: 1
         },
         {
            name: "Placed orders",
            id: 2       
         }
    ]);
    const [ dataId, setDataId ] = useState(1);

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

    const sectionHeaders = [
        { label: "Customer name", key: "name" },
        { label: "Mobile", key: "mobileNo" },
        { label: "Email address", key: "emailId" },
        { label: "Call time", key: "callTimings" },
        // { label: "Date and time", key: "time" },
        { label: "Date", key: "date" },
        { label: "Time", key: "time" },
    ];

    const returnOrdersInfo = () => {
        if(dataId === 1) return <RequestQuoteOrders />;
        else if(dataId === 2) return <PlacedOrders />;
    }

    return(
        <div className="order-details-outer-layer">
            <div className="order-header-inner-container">
                {returnHeaderContent()}
            </div>

            <div className="orders-info-container">
                {/* <div className="analytics-page-number-section">
                    <div className="analytics-page-number-section-inner-layer">
                        <div 
                            className="download-button-conatiner"
                        >
                            <CSVLink 
                                data={
                                    customerDetailsArray.map(item => ({ 
                                        name: item.name, 
                                        emailId: item.emailId,
                                        mobileNo: item.mobileNo,
                                        callTimings: item.callTimings !== "BH" ? "8am to 10am Or 5pm to 8pm" : "10am to 5pm",
                                        // time: new Date(item.time).toUTCString().slice(0,22)
                                        date: (item.date).slice(0,10),
                                        time: (item.date).slice(11,16)
                                    })
                                )}
                                headers={sectionHeaders}
                                filename={"order-details.csv"}
                            >
                                <p>Download me</p>
                            </CSVLink>
                        </div>
                    </div>
                </div> */}

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
                        <div className={"grid-title-layer"}>
                            <h3>{dataId !== 2 ? "Call time" : "Items"}</h3>
                            <div className={dataId !== 2 ? "tooltip" : "hide"}>
                                <p>Sort list by Call-time</p>
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
                    {returnOrdersInfo()}
                </div>
        </div>
    )
}

export default OrderDetails;
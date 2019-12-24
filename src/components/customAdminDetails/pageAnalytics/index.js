import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { api } from '../../../actions/apiLinks';

import Popup from "../../common/popup";

import { decryptData } from '../../../factories/encryptDecrypt';
import { NavBarLoadingIcon, WhiteArrowRight , WhiteArrowLeft, BigCloseButton } from '../../../assets/images/index';
import { formatDateString, formatTimeString } from '../../../factories/formatter';

function PageAnalytics (){
    const [ mainClass , setMainClass ] = useState('order-details-inner-layer hide');
    const [ loadingClass, setLoadingClass ] = useState('loadingAnim')
    const [ modalContainer, setModalContainer ] = useState( "order-details-modal-container hide")
    const [ currentPage , setCurrentPage ] = useState(0);
    const [ analyticsData, setAnalyticsData ] = useState([]);
    const [ totalPageNumber, setTotalPageNumber ] = useState(null);
    const [ id, setid ] = useState(0)
    const [ fetchId, setfetchId ] = useState(null)

    const [ dateTemp, setDateTemp ] = useState(null)

    const [ sortType , setSortType ] = useState(
        {
            name : "sub_category",
            order : 1
        }
    )

    const [ sortOrder, setSortOrder ] = useState(-1)
    const [ arrowDirection, setArrowDirection ] = useState("arrow-down")

    const [ arrowDisplay, setArrowDisplay ] = useState(Array(6).fill(" hide"))

    // setTimeout(() => {
    //     this.setState({ position: 1 });
    // }, 3000);
    const [ showPopup, setShowPopup ] = useState(false); 

    useEffect(() => {
        axios.get(
            `${api.GET_TOP_VIEWED_SCATS}?page=${currentPage}&sort_by=${sortType.name}&sort_type=${sortType.order}`,
                {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            )
            .then((res) => {
                let decryptedData = decryptData(res.data.responseData);

                // forEach instead of map in line 30 

                decryptedData.filter(item => 
                    item.metadata.forEach((subItem) => {
                        setAnalyticsData(item.data)
                        setTotalPageNumber(Array(Math.ceil(subItem.total / 50)).fill(null))
                        setLoadingClass('loadingAnim  hide')
                        setMainClass('order-details-inner-layer')
                    })
                );
            })
            .catch(err => console.log(err))
        
    }, [ currentPage, sortType ]);

    useEffect(() => {
        if(sortOrder === 1){
            setArrowDirection("arrow-up")
        }
        else{
            setArrowDirection("arrow-down")
        }
    }, [ sortOrder ])

    const nextSlider = () => {
        const newIndex = currentPage + 1
        setCurrentPage(newIndex)
        setid(newIndex)
        if(newIndex === totalPageNumber.length){
            setCurrentPage(0)
            setid(0)
        }
        if(totalPageNumber.length === 1){
            setCurrentPage(0)
            setid(0)
        }
    }

    const prevSlider = () => {
        let cat = (totalPageNumber.length) - 1
        let pageIndex = currentPage - 1
        setCurrentPage(pageIndex)
        setid(pageIndex)
        if(pageIndex === -1){
            setCurrentPage(cat);
            setid(cat)
        }
        if(totalPageNumber.length === 1){
            setCurrentPage(0)
            setid(0)
        }
    }

    const openSlider = () => {
        document.getElementById("slider").style.width = "50%";
    }

    const returnAnalyticsDetailsModal = () => {


        const returnAnalyticsDataHeader = () => {
            return analyticsData.map((item,i) => {
                if(item.fetchId === fetchId){
                    return(
                        <div
                            className="analytics-data-header-container"
                            key = {i}
                        >
                            <div className="analytics-data-header-container-innerLayer">
                                <p>{item.categoryName}</p>
                                <span>/</span>
                                <p>{item.subCategoryName}</p>
                                <span>/</span>
                                <p>{item.isSubCat ? "" : item.productTypeName}</p>
                            </div>
                        </div>
                    )
                }
            })
        }

        let allData = []

        if(dateTemp){
            allData = dateTemp.datesViewed
            allData = allData.map((item, i) => {
                // console.log(item)
                return {
                    date : item.split("T")[0],
                    time : item.split("T")[1],
                    times : []
                }
            })
        }

        // let views = 0

        let newAllData = allData.reduce((all, item, i) => {
            let allDoesntContainItemDate = true;
            
            all.map((item2, j) => {
                if(item.date === item2.date){
                    item2.times = [
                        ...item2.times,
                        item.time
                    ]

                    allDoesntContainItemDate = false
                }

                // else{
                //     allDoesntContainItemDate = true
                // }
            })

            if(allDoesntContainItemDate){
                all.push({
                    date : item.date,
                    times : [
                        item.time,
                        ...item.times
                    ]
                })
            }

            return all
        } , [])

        const returnAllDates = () => {

            const returnTimes = (timesArray) => {

                return <p>{timesArray.join(", ")}</p> 
                // return timesArray.map((item, i) => {
                //     return (
                //         <p 
                //             className="times-individual"
                //             key = {i}
                //             >
                //             {item}
                //         </p>
                //     )
                // })    
            }


            return newAllData.map((item, i) => {
                return (
                    <div
                        key = {i}
                        className="time-view-conatiner"
                    >
                        <div className="date-time-container">
                            <p>{item.date}</p>
                        </div>
                        <div className="date-time-container">
                            {
                                returnTimes(item.times)
                            }
                        </div>
                        <div className="date-time-container">
                            <p>{item.times.length}</p>
                        </div>
                    </div>
                )
            })

            
        }

        return(
            <div className="analytics-data-main-container">
                <div className="analytics-scroll-container">
                    <div className="analytics-details-inner-layer">
                        {returnAnalyticsDataHeader()}
                        <div className="analytics-view-container">
                            <div className="analytics-view-container-innerLayer">
                                <div className="view-container">
                                    <h3>Date Viewed</h3>
                                </div>
                                <div className="view-container">
                                    <h3>Time</h3>
                                </div>
                                <div className="view-container">
                                    <h3>Views</h3>
                                </div>
                            </div>
                        </div>
                        { allData.length !== 0 ? returnAllDates() : null }                     
                    </div>
                </div>
            </div>
        )
    }

    const returnPageNumbers = () => {
        if (totalPageNumber) {
            return totalPageNumber.map((item, i) => {
                return (
                    <div
                        key={i}
                        onClick={() => {
                            setAnalyticsData([])
                            setCurrentPage(i)
                            setid(i)
                        }}
                        >
                         <h3 className = { i === id  ? "underline" : "" }>{i + 1}</h3>
                    </div>
                );
            })
        }
    };

    const pageAnalyticsInfo = () => {

        let dataToReturnToRender = [];

        for (let i=0; i < analyticsData.length ; i++) {

            let item = analyticsData[i];

            // console.log(item.datesViewed[item.datesViewed.length - 1])

            if(item) {
                dataToReturnToRender.push(
                    <div
                        key={i}
                        className="order-info-content-container"
                    >
                        <div className="order-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{item.categoryName}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.subCategoryName}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.isSubCat ? "" : item.productTypeName}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.viewCount}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{formatDateString(item.time)}</p>
                                {/* <p>{(item.datesViewed[item.datesViewed.length - 1]).split("T")[0]}</p> */}
                            </div>
                            <div className="info-value-container detail-time">
                                <p>{formatTimeString(item.time)}</p>
                                {/* <p>{(item.datesViewed[item.datesViewed.length - 1]).split("T")[1]}</p> */}
                                <div 
                                    className="detail-button-Container"
                                    onClick={() => {
                                        setModalContainer("order-details-modal-container")
                                        openSlider()
                                        setDateTemp(item)
                                        setfetchId(item.fetchId)
                                    }}
                                    >
                                        <p>Details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        return dataToReturnToRender;
    }

    const sortBy = (name) => {
        setSortType(
            {
                name,
                order : sortOrder
            }
        )
    }

    const toggleSortOrder = () => {
        if(sortOrder === -1)
        setSortOrder(1)

        else
        setSortOrder(-1)
    }

    const analyticsPageNumberSection = () => {
        return(
            <div
                className="analytics-page-number-section">
                <div className="analytics-page-number-section-inner-layer">
                    <div className="page-number-container">
                        <div 
                            className="arrow-container"
                            onClick={() => {
                                prevSlider()
                                setAnalyticsData([])
                            }}
                        >
                            <WhiteArrowLeft/>
                        </div>
                        <div className="page-numbers">
                            <p>Page</p>
                            <div className="slides">
                                {returnPageNumbers()}
                            </div>
                        </div>
                        <div 
                            className="arrow-container"
                            onClick={() => {
                                nextSlider()
                                setAnalyticsData([])
                            }}
                        >
                            <WhiteArrowRight/>
                        </div>
                    </div>
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

    const pageAnalyticsInfoHeaders = () => {
        return(
            <div className="grid-container-inner-layer">
                <div 
                    className="grid-title-layer"
                    onClick = {() => {
                        let dummyArray = Array(6).fill(" hide")

                        dummyArray.splice(0, 1, "")
                        setArrowDisplay(
                            dummyArray
                        )

                        setAnalyticsData([])
                        sortBy("category")
                        toggleSortOrder()
                    }}
                >
                    <h3>Category</h3>
                    <div className={arrowDirection + arrowDisplay[0]}></div>
                    <div className="tooltip">
                        <p>Sort list by category</p>
                    </div>
                </div>
                <div 
                    className="grid-title-layer"
                    onClick = {() => {
                        let dummyArray = Array(6).fill(" hide")

                        dummyArray.splice(1, 1, "")
                        setArrowDisplay(
                            dummyArray
                        )
                        setAnalyticsData([])
                        sortBy("sub_category")
                        toggleSortOrder()
                    }}
                    >
                    <h3>Sub category</h3>
                    <div className={arrowDirection + arrowDisplay[1]}></div>
                    <div className="tooltip">
                        <p>Sort list by Sub category</p>
                    </div>
                </div>
                <div 
                    className="grid-title-layer"
                    onClick = {() => {
                        let dummyArray = Array(6).fill(" hide")

                        dummyArray.splice(2, 1, "")
                        setArrowDisplay(
                            dummyArray
                        )
                        setAnalyticsData([])
                        sortBy("product_type")
                        toggleSortOrder()
                    }}
                    >
                    <h3>Product type</h3>
                    <div className={arrowDirection + arrowDisplay[2]}></div>
                    <div className="tooltip">
                        <p>Sort list by product type</p>
                    </div>
                </div>
                <div 
                    className="grid-title-layer"
                    onClick = {() => {
                        let dummyArray = Array(6).fill(" hide")

                        dummyArray.splice(3, 1, "")
                        setArrowDisplay(
                            dummyArray
                        )
                        setAnalyticsData([])
                        sortBy("views")
                        toggleSortOrder()
                    }}
                    >
                    <h3>Views</h3>
                    {}
                    <div className={arrowDirection + arrowDisplay[3]}></div>
                    <div className="tooltip">
                        <p>Sort list by views</p>
                    </div>
                </div>
                <div 
                    className="grid-title-layer"
                    onClick = {() => {
                        let dummyArray = Array(6).fill(" hide")

                        dummyArray.splice(4, 1, "")
                        setArrowDisplay(
                            dummyArray
                        )
                        setAnalyticsData([])
                        sortBy("time")
                        toggleSortOrder()
                    }}
                    >
                    <h3>Date</h3>
                    <div className={arrowDirection + arrowDisplay[4]}></div>
                    <div className="tooltip">
                        <p>Sort list by date</p>
                    </div>
                </div>
                <div 
                    className="grid-title-layer"
                    onClick = {() => {
                        let dummyArray = Array(6).fill(" hide")

                        dummyArray.splice(5, 1, "")
                        setArrowDisplay(
                            dummyArray
                        )
                        setAnalyticsData([])
                        sortBy("time")
                        toggleSortOrder()
                    }}
                    >
                    <h3>Time</h3>
                    <div className={arrowDirection + arrowDisplay[5]}></div>
                    <div className="tooltip">
                        <p>Sort list by time</p>
                    </div>
                </div>
            </div>
        )
    }
 

    // console.log(analyticsData);

    const headers = [
        { label: "Category", key: "categoryName" },
        { label: "Sub category", key: "subCategoryName" },
        { label: "Product type", key: "productTypeName" },
        { label: "Date", key: "date" },
        { label: "Time", key: "time" }
    ];

    const togglePopup = () => {
        setShowPopup(!showPopup)
    };

    return(
        <div className="order-details-outer-layer">
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                {analyticsPageNumberSection()}
                {
                    showPopup ? 
                    <Popup
                        data={analyticsData}
                        filename={"page-analytics.csv"}
                        headers={headers}
                        text={'Page Analytics CSV'}
                        closePopup={togglePopup}
                    />
                    : null
                }
                <div className="grid-container-outer-layer">
                    {pageAnalyticsInfoHeaders()}
                </div>
                {
                    analyticsData.length !== 0 ? pageAnalyticsInfo() : <div className="loading-wrapper">
                        <NavBarLoadingIcon />
                    </div>
                }
                {analyticsPageNumberSection()}
            </div>
            <div id="slider" className={modalContainer}>
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
                        {returnAnalyticsDetailsModal(dateTemp)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageAnalytics;


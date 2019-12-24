import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Image } from 'cloudinary-react';

import { api } from '../../../actions/apiLinks';

import PublicId from '../../../factories/cloudinaryFactory';
import { decryptData } from '../../../factories/encryptDecrypt';
import { formatPriceToLocale, formatDateString, formatTimeString } from '../../../factories/formatter';

import { BigCloseButton, NavBarLoadingIcon } from '../../../assets/images';

const RequestQuoteOrders = () => {

    const [ loadingClass, setLoadingClass ] = useState('loadingAnim');
    const [ mainClass, setMainClass ] = useState('order-details-inner-layer hide');
    const [ modalContainer, setModalContainer ] = useState( "order-details-modal-container hide");

    const [ customerDetailsArray, setcustomerDetailsArray ] = useState([]);
    const [ vendorDetailsArray, setVendorDetailsArray ] = useState([]);
    
    const [ customerName, setCustomerName ] = useState(null);
    const [ customerMobileNo, setCustomerMobileNo ] = useState(null);
    const [ customerEmailId, setCustomerEmailId ] = useState(null);
    const [ productId, setProductId ] = useState(null);

    useEffect(() => {
        Axios.get(
            api.PRODUCT_QUOTE_REQUEST,
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
            
            let decryptedData = decryptData(res.data.responseData)

            setcustomerDetailsArray(decryptedData.productAndCustomerDetails)
            setLoadingClass('loadingAnim  hide')
            setMainClass('order-details-inner-layer')
        })
        .catch(err => console.log(err))
    }, [])

    const openSlider = () => {
        document.getElementById("slider").style.width = "35%";
    }

    // const fetchDetails = (pId) => {

    //     Axios.get(
    //         `${api.GET_VENDOR_DETAILS}/${pId}`,
    //         {
    //             headers: {
    //                 'accept': 'application/json',
    //                 'Accept-Language': 'en-US,en;q=0.8',
    //                 "Content-Type": "application/json",
    //             },
    //             withCredentials: true
    //         }    
    //     )
    //     .then(res => {
    //         let { vendorDetails } = decryptData(res.data.responseData) 

    //         setVendorDetailsArray(vendorDetails)
    //     })
    //     .catch(err => console.log(err))

    // }

    const returnOrderDetailsModal = () => {

        const returnCustomerDetails = () => {
            return (
                <div 
                    className="customer-info-section">
                    <div className="data-input-Container">
                        <p>Name</p>
                        <div className="info-section">
                            <p>{customerName}</p>
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="data-input-Container">
                        <p>Email address</p>
                        <div className="info-section">
                            <p>{customerEmailId}</p>
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="data-input-Container">
                        <p>Contact number</p>
                        <div className="info-section">
                            <p>{customerMobileNo}</p>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
            )
        }
    
        // const returnVendorDetails = () => {
    
        //     if (vendorDetailsArray.length !== 0) {
        //         return(
        //             <div 
        //                 className="customer-info-section">
        //                 <div className="data-input-Container">
        //                     <p>Vendor to contact</p>
        //                     <div className="info-section">
        //                         <p>{vendorDetailsArray.firstName} {vendorDetailsArray.lastName}</p>
        //                         <div className="line"></div>
        //                     </div>
        //                 </div>
        //                 <div className="data-input-Container">
        //                     <p>Vendor email</p>
        //                     <div className="info-section">
        //                         <p>{vendorDetailsArray.emailId}</p>
        //                         <div className="line"></div>
        //                     </div>
        //                 </div>
        //                 <div className="data-input-Container">
        //                     <p>Vendor mobile</p>
        //                     <div className="info-section">
        //                         <p>{vendorDetailsArray.mobileNo}</p>
        //                         <div className="line"></div>
        //                     </div>
        //                 </div>
        //             </div>
        //         )
        //     }
    
        //     else {
        //         return <p>Loading ... </p>
        //     }
        // }
    
        const returnProductDetails = () => {
            // const { customerDetailsArray } = this.state;
    
            const returnMaterial = (productMaterial) => {
                let { materialName, materialGrade, materialCost } = productMaterial;
    
                return(
                    <div className="material-info-section">
                        <div className="material-section">
                            <h3>Material Name</h3>
                            <p>{materialName}</p>
                        </div>
                        <div className="material-section">
                            <h3>Material Grade</h3>
                            <p>{!!materialGrade ? materialGrade : "No, choice"}</p>
                        </div>
                        <div className="material-section">
                            <h3>Material Cost</h3>
                            <p>{!!materialCost ? formatPriceToLocale(materialCost) : "No, extra cost"}</p>
                        </div>
                    </div>
                )
            }
    
            const returnSize = (productSize) => {
                if (!!productSize) {
                    let { sizeName, sizeCost } = productSize;
        
                    return(
                        <div className="material-info-section">
                            <div className="material-section">
                                <h3>Size Name</h3>
                                <p>{sizeName}</p>
                            </div>
                            <div className="material-section">
                                <h3>Size Cost</h3>
                                <p>{!!sizeCost ? formatPriceToLocale(sizeCost) : "No, extra cost"}</p>
                            </div>
                        </div>
                    )
                }
    
                else {
                    return(
                        <div className="material-info-section">
                            <div className="material-section">
                                <h3>No choice, sizes are standard.</h3>
                            </div>
                        </div>
                    )
                }
            }
    
            const returnProductImages = (productImages) => {
                return productImages.map((item,j) => {
                    return(
                        <div
                            key={j}
                            className="return-img-container"
                        >
                            <Image 
                                cloudName="rolling-logs" 
                                publicId={PublicId(item.imageURL)} 
                                width="150" 
                                crop="fit" 
                            />
                            {/* <img src={item.imageURL} alt={item.itemCode}/> */}
                        </div>
                    )
                })
            }
    
            const handleColorOrFinish = (productData) => {
    
                if (!!productData.colorOption) {
                    let { colorCost, colorName, colorCode } = productData.colorOption;
    
                    return(
                        <div className="material-info-section">
                            <div className="material-section">
                                <h3>Color name</h3>
                                <p>{colorName}</p>
                            </div>
                            <div className="material-section">
                                <h3>Color code</h3>
                                <p>{colorCode}</p>
                            </div>
                            <div className="material-section">
                                <h3>Color cost</h3>
                                <p>{!!colorCost ? formatPriceToLocale(colorCost) : "No, extra cost"}</p>
                            </div>
                        </div>
                    )
                }
    
                else if (!!!!productData.finishingOption) {
                    let { finishCost, finishName, finishCode, finishImage } = productData.finishingOption;
    
                    return(
                        <div className="material-info-section">
                            <div className="material-section">
                                <h3>Finish name</h3>
                                <p>{finishName}</p>
                            </div>
                            <div className="material-section">
                                <h3>Finish code</h3>
                                <p>{finishCode}</p>
                            </div>
                            <div className="material-section">
                                <h3>Finish cost</h3>
                                <p>{!!finishCost ? formatPriceToLocale(finishCost) : "No, extra cost"}</p>
                            </div>
                        </div>
                    )
                }
    
                else {
                    return(
                        <div className="material-info-section">
                            <div className="material-section">
                                <h3>No, color or finish option.</h3>
                            </div>
                        </div>
                    ) 
                }
                
            }
    
            if (customerDetailsArray.length !==0) {
                return customerDetailsArray.map((item, i) => {
                    if (item.productData.productId === productId) {
                        return(
                            <div 
                                key={i}
                                className="customer-info-section"
                            >
                                <div className="data-input-Container">
                                    <p>Product name</p>
                                    <div className="info-section">
                                        <p>{item.productData.productName}</p>
                                        <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Product code</p>
                                    <div className="info-section">
                                        <p>{item.productData.productCode}</p>
                                        <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Product Id</p>
                                    <div className="info-section">
                                        <p>{item.productData.productId}</p>
                                        <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>BrandName</p>
                                    <div className="info-section">
                                        <p>{item.productData.brandName}</p>
                                        <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Quantity</p>
                                    <div className="info-section">
                                        <p>{item.productData.quantity}</p>
                                        <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Base price</p>
                                    <div className="info-section">
                                    <p>₹ {formatPriceToLocale(item.productData.basePrice)}</p>
                                    <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Discount</p>
                                    <div className="info-section">
                                        <p>{item.productData.discount} %</p>
                                        <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>GST Percentage</p>
                                    <div className="info-section">
                                    <p>{item.productData.gstPercentage} %</p>
                                    <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Net price incl GST</p>
                                    <div className="info-section">
                                    <p>₹ {formatPriceToLocale(item.productData.netPriceInclGST)}</p>
                                    <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Total price incl GST</p>
                                    <div className="info-section">
                                    <p>₹ {formatPriceToLocale(item.productData.totalPriceInclGST)}</p>
                                    <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Saved price incl GST</p>
                                    <div className="info-section">
                                    <p>₹ {formatPriceToLocale(item.productData.savedPriceInclGST)}</p>
                                    <div className="line"></div>
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Product Material</p>
                                    {returnMaterial(item.productData.productMaterial)}
                                    <div className="line"></div>
                                </div>
                                <div className="data-input-Container">
                                        <p>Product Color / finish Option</p>
                                        {/* {!!item.productData.colorOption ? <span>No data given</span> : returnColor()} */}
                                        {handleColorOrFinish(item.productData)}
                                    <div className="line"></div>
                                </div>
                                <div className="data-input-Container">
                                        <p>Product Size</p>
                                        {returnSize(item.productData.size)}
                                    <div className="line"></div>
                                </div>
                                <div className="data-input-Container">
                                    <p>Product images</p>
                                    <div className="info-section img-section">
                                        {returnProductImages(item.productData.productImages)}
                                    </div>
                                </div>
                                <div className="data-input-Container">
                                    <div className="info-section">
                                        <a href={item.productLink} target="blank">Let me, see the product</a>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
            }
        }

        return(
            <div className="order-details-main-container">
                <div className="order-scroll-container">
                    <div className="details-container-inner-layer">
                        <div className="customerDetails-container">
                            <h3>Customer details</h3>
                            {returnCustomerDetails()}
                        </div>
                        {/* <div className="customerDetails-container">
                            <h3>Vendor details</h3>
                            {returnVendorDetails()}
                        </div> */}
                        <div className="customerDetails-container">
                            <h3>Product details</h3>
                            {returnProductDetails()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const orderInfoContent = () => {
        if(customerDetailsArray.length !==0){
            return customerDetailsArray.map((item,i) => {
                return(   
                    <div 
                        key={i}
                        className="order-info-content-container">
                        <div className="order-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{item.name}</p>
                            </div>
                            <div className="info-value-container mobile-num-container">
                                <p>{item.mobileNo}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.emailId}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.callTimings !== "BH" ? <span>8am to 10am Or 5pm to 8pm</span> : <span>10am to 5pm</span>}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{formatDateString(item.date)}</p>
                            </div>
                            <div className="info-value-container detail-time">
                                <p>{formatTimeString(item.date)}</p>
                                <div 
                                    className="detail-button-Container"
                                    onClick={() => {
                                        setCustomerName(item.name)
                                        setCustomerMobileNo(item.mobileNo)
                                        setCustomerEmailId(item.emailId)
                                        setProductId(item.productData.productId)
                                        setModalContainer("order-details-modal-container")
                                        openSlider()
                                        // fetchDetails(item.productData.productId)
                                        setVendorDetailsArray([])
                                    }}
                                >
                                    <p>Details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    return (
        <div>
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                {orderInfoContent()}
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
                            {returnOrderDetailsModal()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestQuoteOrders;
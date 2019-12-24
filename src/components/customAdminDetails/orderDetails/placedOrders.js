import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Image from 'cloudinary-react/lib/components/Image/Image';

import { api } from '../../../actions/apiLinks';

import PublicId from '../../../factories/cloudinaryFactory';
import { decryptData } from '../../../factories/encryptDecrypt';
import { formatPriceToLocale, formatDateString, formatTimeString } from '../../../factories/formatter';

import { NavBarLoadingIcon, BigCloseButton } from '../../../assets/images';

const PlacedOrders = () => {

    const [ loadingClass, setLoadingClass ] = useState('loadingAnim');
    const [ mainClass, setMainClass ] = useState('order-details-inner-layer hide');

    const [ modalType, setModalType ] = useState(null);
    const [ modalContainer, setModalContainer ] = useState( "order-details-modal-container hide");

    const [ placedOrders, setPlacedOrders ] = useState([]);
    // const [ vendorDetailsArray, setVendorDetailsArray ] = useState([]);
    
    const [ customerName, setCustomerName ] = useState(null);
    const [ customerMobileNo, setCustomerMobileNo ] = useState(null);
    const [ customerEmailId, setCustomerEmailId ] = useState(null);
    const [ customerAddress, setCustomerAddress ] = useState(null);

    const [ orderId, setOrderId ] = useState(null);
    const [ productId, setProductId ] = useState(null);

    useEffect(() => {
        Axios.get(
            api.GET_ALL_PLACED_ORDERS,
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
            let { orders, ordersExist } = decryptData(res.data.responseData);

            if (ordersExist) setPlacedOrders(orders);

            setLoadingClass('loadingAnim  hide')
            setMainClass('order-details-inner-layer')
        })
        .catch(err => console.log(err))
    }, [])

    // useEffect(() => {
    //     Axios.get(
    //         `${api.GET_VENDOR_DETAILS}/${productId}`,
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
    // }, [productId])

    const openSlider = () => document.getElementById("slider").style.width = "35%";

    const orderInfoContent = () => {
        if(placedOrders.length !== 0) {
            return placedOrders.map((item, i) => {
                return(   
                    <div 
                        key={i}
                        className="order-info-content-container"
                    >
                        <div className="order-info-content-inner-layer">
                            <div className="info-value-container">
                                <p>{item.address.name}</p>
                            </div>
                            <div className="info-value-container mobile-num-container">
                                <p>{item.address.mobileNumber}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.emailId}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{item.cartItems.length}</p>
                            </div>
                            <div className="info-value-container">
                                <p>{formatDateString(item.date)}</p>
                            </div>
                            <div className="info-value-container detail-time">
                                <p>{formatTimeString(item.date)}</p>
                                <div 
                                    className="detail-button-Container"
                                    onClick={() => {
                                        setModalType("cartDetails")
                                        setCustomerName(item.address.name)
                                        setCustomerMobileNo(item.address.mobileNumber)
                                        setCustomerEmailId(item.emailId)
                                        setCustomerAddress(item.address.completeAddress)
                                        setOrderId(item._id)
                                        setModalContainer("order-details-modal-container")
                                        openSlider()
                                        // setVendorDetailsArray([])
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

    const returnCartItemsModal = () => {

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
                        <p>Email</p>
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
                    <div className="data-input-Container">
                        <p>Delivery address</p>
                        <div className="info-section">
                            <p>{customerAddress}</p>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
            )
        }

        const returnCartItems = () => {
            if (placedOrders.length !==0) {
                return placedOrders.map(order => {
                    if (order._id === orderId) {
                        return order.cartItems.map((item, i) => {
                            return (
                                <div 
                                    key={i}
                                    className="cart-info-section-outer-container"
                                    onClick={() => {
                                        setProductId(item.productId)
                                        // setModalContainer("order-details-modal-container")
                                        setModalType("cartItemDetails")
                                    }}
                                >
                                    <div className="cart-info-section-inner-container">
                                        <div className="cart-info-hover-container">
                                            <p>View more details</p>
                                        </div>
                                        <div className="cart-details-image-container">
                                            <div className="img-container">
                                                <Image 
                                                    cloudName="rolling-logs" 
                                                    publicId={PublicId(item.productThumbImage)} 
                                                    width="150" 
                                                    crop="fit" 
                                                />
                                            </div>
                                        </div>
                                        <div className="cart-details-input-container">
                                            <div className="data-input-Container">
                                                <div className="info-section">
                                                    <h3>Product name :</h3>
                                                    <p>{item.productName}</p>
                                                </div>
                                            </div>
                                            <div className="data-input-Container">
                                                <div className="info-section">
                                                    <h3>Quantity :</h3>
                                                    <p>{item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="data-input-Container">
                                                <div className="info-section">
                                                    <h3>Brand-name :</h3>
                                                    <p>{item.brandName}</p>
                                                </div>
                                            </div>
                                            <div className="data-input-Container">
                                                <div className="info-section">
                                                    <h3>Total price incl GST :</h3>
                                                    <p>₹ {formatPriceToLocale(item.totalPriceInclGST)}</p>
                                                </div>
                                            </div>
                                            <div className="data-input-Container">
                                            <div className="info-section">
                                                <h3>Saved price incl GST :</h3>
                                                <p>₹ {formatPriceToLocale(item.discountInclGST)}</p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
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
                        <div className="customer-details-cart-container">
                            <h3>Cart Items</h3>
                            <div className="customer-details-cart-inner-container">
                                {returnCartItems()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const returnCartItemDetailsModal = () => {
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

            const returnProductImages = (productImage) => {
                return(
                    <div className="return-img-container">
                        <Image 
                            cloudName="rolling-logs" 
                            publicId={PublicId(productImage)} 
                            width="150" 
                            crop="fit" 
                        />
                        {/* <img src={item.imageURL} alt={item.itemCode}/> */}
                    </div>
                )
            }
    
            if (placedOrders.length !== 0) {
                return placedOrders.map(order => {
                    return order.cartItems.map((item, i) => {
                        if (item.productId === productId) {
                            return(
                                <div 
                                    key={i}
                                    className="customer-info-section"
                                >
                                    <div className="data-input-Container">
                                        <p>Product name</p>
                                        <div className="info-section">
                                            <p>{item.productName}</p>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Product code</p>
                                        <div className="info-section">
                                            <p>{item.productCode}</p>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Product Id</p>
                                        <div className="info-section">
                                            <p>{item.productId}</p>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>BrandName</p>
                                        <div className="info-section">
                                            <p>{item.brandName}</p>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Quantity</p>
                                        <div className="info-section">
                                            <p>{item.quantity}</p>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Base price</p>
                                        <div className="info-section">
                                        <p>₹ {formatPriceToLocale(item.basePrice)}</p>
                                        <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Discount</p>
                                        <div className="info-section">
                                            <p>{item.discount} %</p>
                                            <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>GST Percentage</p>
                                        <div className="info-section">
                                        <p>{item.gstPercentage} %</p>
                                        <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Net price incl GST</p>
                                        <div className="info-section">
                                        <p>₹ {formatPriceToLocale(item.netPriceInclGST)}</p>
                                        <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Total price incl GST</p>
                                        <div className="info-section">
                                        <p>₹ {formatPriceToLocale(item.totalPriceInclGST)}</p>
                                        <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Saved price incl GST</p>
                                        <div className="info-section">
                                        <p>₹ {formatPriceToLocale(item.discountInclGST)}</p>
                                        <div className="line"></div>
                                        </div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Product Material</p>
                                        {returnMaterial(item.productMaterial)}
                                        <div className="line"></div>
                                    </div>
                                    <div className="data-input-Container">
                                            <p>Product Color / finish Option</p>
                                            {/* {!!item.colorOption ? <span>No data given</span> : returnColor()} */}
                                            {handleColorOrFinish(item)}
                                        <div className="line"></div>
                                    </div>
                                    <div className="data-input-Container">
                                            <p>Product Size</p>
                                            {returnSize(item.size)}
                                        <div className="line"></div>
                                    </div>
                                    <div className="data-input-Container">
                                        <p>Product image</p>
                                        <div className="info-section img-section">
                                            {returnProductImages(item.productThumbImage)}
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
                })
            }
        }

        return(
            <div className="order-details-main-container">
                <div
                    className="expand-modal-close-button"
                    onClick={() => setModalType("cartDetails")} 
                >
                    {/* <BigCloseButton />  */}
                    <p>Back</p>
                </div>
                <div className="order-scroll-container">
                    <div className="details-container-inner-layer">
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

    const handleModals = () => {
        return (
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
                    {modalType === "cartDetails" ? returnCartItemsModal() : returnCartItemDetailsModal()}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className={loadingClass}>
                <NavBarLoadingIcon />
            </div>
            <div className={mainClass}>
                {orderInfoContent()}
                <div id="slider" className={modalContainer}>
                    {handleModals()}
                </div>
            </div>
        </div>
    )
}

export default PlacedOrders;
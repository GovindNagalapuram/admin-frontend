import React, { useState } from 'react';
import { connect } from 'react-redux';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/constants';
import { BigCloseButton } from '../../assets/images/index'

import "../../assets/sass/popup.scss";

import { CSVLink } from "react-csv";
import { DateRangePicker } from 'react-dates';

import { setStartDate, setEndDate } from '../../actions/filters';

function Popup(props) {
    const [ focusedInput, setFocusedInput ] = useState(null);

    return (
        <div className='popup-outer-layer'>
            <div className='popup-inner-layer'>
                <div className="popup-container">
                    <div className="popup-header">
                        <div className="popup-header-inner-container">
                            <h3>{props.text}</h3>
                        </div>
                        <div 
                            className="close-button-container"
                            onClick={props.closePopup}
                        >
                            <BigCloseButton/>
                        </div>
                    </div>
                    <div className="download-option-outer-layer">
                        <div className="download-date-container">
                            <DateRangePicker
                                startDateId="startDate"
                                endDateId="endDate"
                                startDate={props.filters.startDate}
                                endDate={props.filters.endDate}
                                onDatesChange={({ startDate, endDate }) => { 
                                    props.setStartDate(startDate)
                                    props.setEndDate(endDate)
                                }}
                                focusedInput={focusedInput}
                                onFocusChange={(focusedInput) => { setFocusedInput(focusedInput) }}
                                showClearDates={true}
                                isOutsideRange={() => false}
                            />
                        </div>
                        <div className="download-button-container">
                            <CSVLink 
                                data={
                                    props.data.map(item => {
                                        if (item.referenceImages) {
                                            return { 
                                                name: item.name, 
                                                emailId: item.emailId,
                                                mobileNo: item.mobileNo,
                                                referenceImages: item.referenceImages.length,
                                                date: (item.time).slice(0,10),
                                                time: (item.time).slice(11,16)
                                            }
                                        }

                                        else if (item.categoryName || item.subCategoryName || item.productTypeName) {
                                            return {
                                                categoryName: item.categoryName, 
                                                subCategoryName: item.subCategoryName,
                                                productTypeName: item.productTypeName,
                                                date: (item.time).slice(0,10),
                                                time: (item.time).slice(11,16)
                                            }
                                        }

                                        else {
                                            return { 
                                                name: item.name, 
                                                emailId: item.emailId,
                                                mobileNo: item.mobileNo,
                                                callTimings: item.callTimings !== "BH" ? "8am to 10am Or 5pm to 8pm" : "10am to 5pm",
                                                date: (item.time).slice(0,10),
                                                time: (item.time).slice(11,16)
                                            }
                                        }
                                    }
                                )}
                                headers={props.headers}
                                filename={props.filename}
                            >
                                <p>Download me</p>
                            </CSVLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    filters: state.filtersReducer
  });

export default connect(mapStateToProps, { setStartDate, setEndDate })(Popup);
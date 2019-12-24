import React from 'react';

import "../../assets/sass/ux_components.scss";

export const GradientButton = (props) => {
    return (
        <div
            className={props.buttonDisabled ? "gradientButtonWrapper disabled-button" : "gradientButtonWrapper"  } 
            onClick={() => {

                if (!props.buttonDisabled){
                    if (props.runFunction)
                        props.runFunction()
                }
                
            }}
            >
            {props.children}
        </div>
    )
}

export const WhiteButton = (props) => {
    return (
        <div
            className="whiteButtonWrapper"
            onClick={() => {
                if (props.runFunction)
                    props.runFunction()
            }}
        >
            {props.children}
        </div>
    )
}

export const RadioButton = (props) => {
    // console.log(props)
    return (
        <div className="radio-outline">
            <div className="radio-mid">
                {props.options.map(option => {
                    return (
                        <label key={option.id} className="radio-inline">
                            <input
                                id={option.id}
                                name={props.name}
                                suffix={props.suffix}
                                onChange={props.onChange}
                                value={option.value}
                                checked={props.selectedOption ? props.selectedOption.indexOf(option.value) > -1 : false}
                                type="radio" 
                            />
                            <span className ="checkmark"></span>
                            <p>{option.value} {props.suffix}</p>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export const SelectList = (props) => {

    const selectOptions = props.options.map(option => (
        <option key={option.label} value={option.value}>
            {option.label}
        </option>
    ));

    return (
        <div className="form-group">
            <select
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            >
                {selectOptions}
            </select>
        </div>
    );
}


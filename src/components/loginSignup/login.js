// import React, { Component } from 'react';
import React, { useState, useRef } from 'react'
import { encryptData,decryptData } from '../../factories/encryptDecrypt';
// import { Link, NavLink } from 'react-router-dom'
// import '../assets/sass/loginSignup.scss'
import '../../assets/sass/loginSignup.scss'
import Axios from 'axios';
import { api } from '../../actions/apiLinks';

function Login(){

    const[ userEmailText , setuserEmailText ] = useState(null)
    const[ userEmailClass , setuserEmailClass ] = useState('emailText hide')
    const[ userEmailIsValid , setuserEmailIsValid ] = useState(false)
    const[ userEmail, setUserEmail ] = useState("")

    const[ passwordText , setpasswordText ] = useState(null)
    const[ passwordClass , setpasswordClass ] = useState('passwordText hide')
    const[ passwordIsValid , setpasswordIsValid ] = useState(false)
    const[ userPassword, setUserPassword ] = useState("")

    const emailAddress = useRef('');
    const pWord = useRef('');

    const validateEmail = (e) => {
        let theInput = e.target.value
        let nameRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        let validEmail = nameRegex.test(theInput)
        if (!validEmail) {
            setuserEmailText('Please keep in mind, the email address has to be valid')
            setuserEmailClass('emailText')
            setuserEmailIsValid(false)
        }
    
        else if (validEmail && theInput.includes('.')) {
            setuserEmailText(null)
            setuserEmailClass('emailText hide')
            setuserEmailIsValid(true)
            setUserEmail(theInput)
        }
    
        else {
            setuserEmailText("Please keep in mind, the email address has to be valid")
            setuserEmailClass('emailText')
            setuserEmailIsValid(false)
        }
      }
    
    const validatePassword = (e) => {
        const { key } = e
        let theInput;
    
        if (key !== 'Enter') theInput = e.target.value + key
    
        else theInput = e.target.value
    
        if (theInput.length < 6) {
            setpasswordText('Please keep in mind, the password has to be atleast 6 characters long.')
            setpasswordClass('passwordText')
            setpasswordIsValid(false)
        }
        else {
            setpasswordText(null)
            setpasswordClass('passwordText hide')
            setpasswordIsValid(true)
            setUserPassword(theInput)
        }
    
        if (key === "Enter") {
            console.log(passwordIsValid)
            validateAndSubmit()
        }
    
      };
    
    const validateAndSubmit = () => {
    
          if (emailAddress.current.value === '') {
            setuserEmailText("You have to provide an email. It cannot be empty.")
            setuserEmailClass('emailText')
            setuserEmailIsValid(false)  
          }


         if (pWord.current.value === ''){
            setpasswordText( "You have to give a password. It cannot be empty.")
            setpasswordClass('passwordText')
            setpasswordIsValid(false)
          }

         if (userEmailIsValid && passwordIsValid ){

            // console.log(23)
            setpasswordClass('passwordText hide')
            
            const dataToSendBackend = {

                adminEmail: userEmail,
                adminPassword: userPassword 

            }

            //
            // Encrypt data
            //
            const encryptedData = encryptData(dataToSendBackend)
            //
            // Encrypt data
            //

            const requestData = {
                requestData: encryptedData,
                message: "User trying to log in"
            }

            Axios.post(
                api.ADMIN_LOGIN,
                requestData,
                {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                })
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


                    if (!decryptedData.registered)
                        setpasswordText("Sorry, you have not yet registered with us. Please sign-up")
                        setpasswordClass('passwordText')
                        setpasswordIsValid(true)

                    if (!decryptedData.passwordRight)
                        setpasswordText("Your password doesnot match the one in our records. Try logging in through google or linkedIn.")
                        setpasswordClass('passwordText')
                        setpasswordIsValid(true)

                    if (decryptedData.passwordRight && decryptedData.registered) {
                        localStorage.setItem('loginThrough', 'form')

                        console.log(decryptedData)

                        window.open('/admin-page', '_self')

                        // if (decryptedData.userType === "admin"){
                        //     window.open('/adminpage', '_self')
                        // }
                        
                        // else{

                        //     window.open('/')
                        // }


                        // if(res.data.userType === "faculty")
                        // window.open('/faculty/profile-details', '_self')

                        // if (res.data.userType === "architect")
                        //     window.open('/architect/profile-details', '_self')
                    }

                })
                .catch(err => {
                    console.error('bad', err)
                    throw err
                })

         }

    };

    return (
        <div className="main-component-outer-layer">
          <div className="main-component-inner-layer">
              <div className="form-page-container">
                  <div className="form-page-container-inner-layer">
                      <div className="form-container one">
                          <div className="upper-container">
                              <div className="main-header-container">
                                  <h3>Admin login</h3>
                              </div>
                              <div className="input-form-container">
                                <div className="input-wrapper">
                                    <input
                                        ref={emailAddress}
                                        type="email"
                                        placeholder="Email"
                                        onChange={(e) => validateEmail(e)}
                                    />
                                    <span className="InputSeparatorLine"> </span>
                                    <p className={userEmailClass}> {userEmailText} </p>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        ref={pWord}
                                        type="password"
                                        placeholder="Type a new password here"
                                        onKeyPress={(e) => validatePassword(e)}
                                    />
                                    <span className="InputSeparatorLine"> </span>
                                    <p className={passwordClass}> {passwordText} </p>
                                </div>
                              </div>
                          </div>
                          <div className="button-container">
                              <div 
                                className="button-container-inner-layer"
                                onClick={() => {
                                  validateAndSubmit()
                              }}
                              >
                                  Proceed
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>  
      </div>
    );

}

// class Login extends Component {

//     state={
//       userEmailText: null,
//       userEmailClass: 'emailText hide',
//       userEmailIsValid: false,
  
//       passwordText: null,
//       passwordClass: 'passwordText hide',
//       passwordIsValid: false,
//     }
  
//     validateEmail(e) {
//       let theInput = e.target.value
//       let nameRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
//       let validEmail = nameRegex.test(theInput)
//       if (!validEmail) {
//           this.setState({
//               userEmailText: "Please keep in mind, the email address has to be valid",
//               userEmailClass: 'emailText',
//               userEmailIsValid: false
//           })
//       }
  
//       else if (validEmail && theInput.includes('.')) {
//           this.setState({
//               userEmailText: null,
//               userEmailClass: 'emailText hide',
//               userEmailIsValid: true
//           })
//       }
  
//       else {
//           this.setState({
//               userEmailText: "Please keep in mind, the email address has to be valid",
//               userEmailClass: 'emailText',
//               userEmailIsValid: false
//           })
//       }
//     }
  
//     validatePassword(e) {
//       const { key } = e
//       let theInput;
  
//       if (key !== 'Enter') theInput = e.target.value + key
  
//       else theInput = e.target.value
  
//       if (theInput.length < 6) {
//           this.setState({
//               passwordText: "Please keep in mind, the password has to be atleast 6 characters long.",
//               passwordClass: 'passwordText',
//               passwordIsValid: false
//           })
//       }
//       else {
//           this.setState({
//               passwordText: null,
//               passwordClass: 'passwordText hide',
//               passwordIsValid: true
//           })
//       }
  
//       if (key === "Enter") {
//           this.validateAndSubmit()
//       }
  
//     };
  
//     validateAndSubmit = () => {
  
//         if (this.refs.emailAddress.value === '')
//             this.setState({
//                 userEmailText: "You have to provide an email. It cannot be empty.",
//                 userEmailClass: 'emailText',
//                 userEmailIsValid: false,
//             })
  
//         if (this.refs.pWord.value === '')
//             this.setState({
//                 passwordText: "You have to give a password. It cannot be empty.",
//                 passwordClass: 'passwordText',
//                 passwordIsValid: false,
//             })
//   };
  
//     render() {
//       return (
//           <div className="main-component-outer-layer">
//             <div className="main-component-inner-layer">
//                 <div className="form-page-container">
//                     <div className="form-page-container-inner-layer">
//                         <div className="form-container one">
//                             <div className="upper-container">
//                                 <div className="main-header-container">
//                                     <h3>Admin login</h3>
//                                 </div>
//                                 <div className="input-form-container">
//                                   <div className="input-wrapper">
//                                       <input
//                                           ref="emailAddress"
//                                           type="email"
//                                           placeholder="Email"
//                                           onChange={(e) => this.validateEmail(e)}
//                                       />
//                                       <span className="InputSeparatorLine"> </span>
//                                       <p className={this.state.userEmailClass}> {this.state.userEmailText} </p>
//                                   </div>
//                                   <div className="input-wrapper">
//                                       <input
//                                           ref="pWord"
//                                           type="password"
//                                           placeholder="Type a new password here"
//                                           onKeyPress={(e) => this.validatePassword(e)}
//                                       />
//                                       <span className="InputSeparatorLine"> </span>
//                                       <p className={this.state.passwordClass}> {this.state.passwordText} </p>
//                                   </div>
//                                 </div>
//                             </div>
//                             <div className="button-container">
//                                 <div 
//                                   className="button-container-inner-layer"
//                                   onClick={() => {
//                                     this.validateAndSubmit()
//                                 }}
//                                 >
//                                     Proceed
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>  
//         </div>
//       );
//     }
// }
  
export default Login;
import React, { useState } from 'react';
import Axios from 'axios';
import { TimelineLite } from "gsap";

import { api } from '../../actions/apiLinks';

import { UploadImageIcon } from '../../assets/images';
import '../../assets/sass/image_uploader.scss'

const ImageUploader = (props) => {

    const [ pictureClass, setPictureClass ] = useState("pictureContainer")
    const [ smallLoader, setSmallLoader ] = useState("smallLoader hide")
    const [ message, setMessage ] = useState("Click here to upload an image.Formats allowed are.jpeg,.jpg,.png (Max. 1 MB)")
    const [ uploadIconClass, setUploadIconClass ] = useState("uploadIconWrap")
    const [ imageClass, setImageClass ] = useState("imageCover hide")
    const [ imageURL, setImageURL ] = useState("")

    const pictureUploader = (e) => {
        
        let uploaderHandler = (theFile) => {

            if (theFile) {
                if (theFile.size > 1 * 1024 * 1024) {
                    setPictureClass("pictureContainer")
                    setSmallLoader("smallLoader hide")
                    setMessage("The image you are trying to upload exceeds 1 MB in size. Click here again to upload a new one.")
                    setUploadIconClass("uploadIconWrap hide")
                    setImageClass("imageCover")
                    setImageURL("https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/imageTooBig-01.png")
                }

                else {
                    setPictureClass("pictureContainer hide")
                    setSmallLoader("smallLoader")

                    const reader = new FileReader()

                    reader.onloadend = () => {
                        const fd = new FormData()

                        const getExtensionOfFile = () => {
                            const fileExtention = '.' + theFile.type.split('/')[1]
                            return fileExtention
                        }

                        const generateRandomString = () => {

                            let text = ""
                            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

                            for (var i = 0; i < 10; i++)
                                text += possible.charAt(Math.floor(Math.random() * possible.length))
        
                            const randomString = props.imageType 
                                + "-" + "ARC-123"
                                + "-" + text  + "-" + Date.now() 
                            return randomString
                        }

                        const newName = generateRandomString() + getExtensionOfFile()

                        fd.append('toxicData', theFile, newName)
                        uploadImageToBackend(fd)
                    }

                    reader.readAsDataURL(theFile)
                }
            }

        }

        if (e.target.files[0]) uploaderHandler(e.target.files[0])
    }

    const uploadImageToBackend = (imageData) => {

        let progressTrack = (progressEvent) => {
            const tl = new TimelineLite()
            let progress = (progressEvent.loaded / progressEvent.total * 100)
            tl.to('.innerLoadingBar', 0.2, {
                width: progress + "%"
            })
        }

        Axios.post(api.UPLOAD_IMAGE, imageData,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': 'image/png' || 'image/jpg' || 'image/jpeg' || 'image/gif'
                },

                withCredentials: true,

                onUploadProgress: progressTrack
            })

            .then(res => {
                setPictureClass("pictureContainer")
                setSmallLoader("smallLoader hide")
                setMessage("You have uploaded this one. Click to change.")

                setUploadIconClass("uploadIconWrap hide")
                setImageClass("imageCover")

                setImageURL(res.data.imageURL)

                const tl = new TimelineLite()
                tl.set('.innerLoadingBar', {
                    width: 0 + "%"
                })

                props.resultData(res.data)

            })
            .catch(err => {
                console.error(err)
                throw err
            })
    }

    return (
        <div className={"imageUploaderWrap " + props.imageClassName}>
            <div className="pictureUpload">
                <div className="inputContainer">
                    <input 
                        onInput={(e) => pictureUploader(e)}
                        onClick={(e) => e.target.value = null}
                        style={{ display: "none" }}
                        type="file"
                        id={"uploadImageInput" + props.imageClassName}
                        accept="image/*"
                    />

                    <label
                        htmlFor={"uploadImageInput" + props.imageClassName}
                        className={pictureClass}
                    >
                        <div className="uploadContainer" >
                            <div className={uploadIconClass}>
                                <UploadImageIcon />
                            </div>

                            <div className={imageClass}>
                                <img src={imageURL} alt="" />
                            </div>

                            <h3>
                                {message}
                            </h3>
                        </div>
                    </label>

                    <div className={smallLoader}>
                        <div className="outerLoadingBar">
                            <div className="innerLoadingBar">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ImageUploader;
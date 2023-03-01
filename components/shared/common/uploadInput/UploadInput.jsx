import React, { useEffect, useState } from 'react'
import { FaArrowCircleUp } from 'react-icons/fa'
import classes from '../../../../styles/uploadInput.module.scss'

const UploadInput = (props) => {

    const [file , setFile] = useState(null)

    useEffect(()=>{
        if (file) {
        props.setPreviewImage(URL.createObjectURL(file))
        }
    },[file])

    return (
        <div className={classes.wrapper}>
            <div className={classes.fileupload}>
                <input type="file" id='upload' onChange={(event) => {
                    setFile(event.target.files[0])    
                    props.setFormValues(prev => {
                        return {
                            ...prev,
                            mainImageUrl: event.target.files[0],
                            imageUrl:event.target.files[0]
                        }
                    })
                }} />
                <FaArrowCircleUp size={40} />
            </div>
        </div>
    )
}

export default UploadInput

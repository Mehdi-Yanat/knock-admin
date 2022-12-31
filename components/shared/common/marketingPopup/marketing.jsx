import Button from '@components/shared/core/Button';
import FormField from '@components/shared/core/FieldForm';
import Image from 'next/image';
import { SketchPicker } from 'react-color';
import React, { useEffect, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai';
import Dialog from '../Dialog';
import UploadInput from '../uploadInput/UploadInput';
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPopup } from "@utils/core/API";
import FormData from 'form-data';
import { getGetAccessTokenFromCookie, useGetUserDataFromStore } from '@utils/core/hooks';
import { toast } from 'react-toastify';
import CustomNextImage from '../CustomNextImage';

const MarketingPopUp = (props) => {

  const accessToken = getGetAccessTokenFromCookie();
  const { user } = useGetUserDataFromStore()

  const [formValues, setFormValues] = useState({
    h2: props.popup ? props.popup.h2 : '',
    p: props.popup ? props.popup.p : '',
    h2Color: props.popup ? props.popup.h2Color : '',
    pColor: props.popup ? props.popup.pColor : '',
    buttonText: props.popup ? props.popup.buttonText : '',
    buttonColor: props.popup ? props.popup.buttonColor : '',
    buttonLink: props.popup ? props.popup.buttonLink : '',
    mainImageUrl: props.popup ? props.popup.mainImageUrl : ''
  })

  let formData = new FormData()
  formData.append('mainImageUrl', formValues.mainImageUrl)




  const [openEditMode, setOpenEditMode] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)



  const editPopUpmutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault();

      if (typeof (formValues.mainImageUrl) === 'object') {
        fetch(
          `${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/upload/image-popup`,
          {
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Authorization': accessToken
            },
            body: formData
          }
        )
          .then((response) => response.json())
          .then((result) => {
            if ('success' in result && !result.success)
              throw new Error(result.message);

            setPreviewImage(null)
            return result;
          })
      }

      return fetch(
        `${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-popup`,
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'Authorization': accessToken
          },
          body: JSON.stringify(formValues)
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if ('success' in result && !result.success)
            throw new Error(result.message);

          return result;
        });
    },
    onSuccess: (result) => { setTimeout(() => toast(result.message), 0), setOpenEditMode(false) },
    onError: (result) => setTimeout(() => toast(result.message, { type: 'error' }), 0)
  });


  return (
    <Dialog
      header={''}
      isOpen={props.open}
      setIsOpen={props.onOpenChange}
    >
      {openEditMode ? <div className=' m-4 flex justify-center' >
        {previewImage ? <div>
          <CustomNextImage
            isAnimated={false}
            src={previewImage}
            alt="knock plugin"
            width={300}
            height={300}
            priority
            unoptimized />
        </div> : <UploadInput setFormValues={setFormValues} setPreviewImage={setPreviewImage} />}
      </div> :
        <div className=' m-4 flex justify-center'>
          <CustomNextImage isAnimated={false} alt={formValues.h2} width={300} unoptimized height={300} src={previewImage
            ? previewImage
            : formValues.mainImageUrl
              ? process.env.NEXT_PUBLIC_KNOCK_URL_API +
              formValues.mainImageUrl
              : ""} />
        </div>}
      <div className='m-4  flex flex-col items-center gap-5' >
        <h2 style={{ color: formValues.h2Color }} >{formValues.h2}</h2>
        <p style={{ color: formValues.pColor }} >{formValues.p}</p>
        <Button onClick={() => props.onOpenChange(false)} style={{ backgroundColor: formValues.buttonColor }} href={formValues.buttonLink} > {formValues.buttonText} </Button>
        {
          openEditMode ? <div className='flex flex-col gap-5' >
            <FormField
              values={formValues}
              setValues={setFormValues}
              name="h2"
              type="text"
              placeholder="*h2"
              autoComplete="h2"
              minLength={3}
            />
            <FormField
              values={formValues}
              setValues={setFormValues}
              name="p"
              type="text"
              placeholder="*p"
              autoComplete="p"
              minLength={3}
            />
            <FormField
              values={formValues}
              setValues={setFormValues}
              name="buttonText"
              type="text"
              placeholder="*button text"
              autoComplete="buttonText"
              minLength={3}
            />
            <FormField
              values={formValues}
              setValues={setFormValues}
              name="buttonLink"
              type="text"
              placeholder="*button link"
              autoComplete="button link"
              minLength={3}
            />
            <div className="flex flex-col" >
              <label >Button background color</label>
              <SketchPicker disableAlpha={true} color={formValues.buttonColor} onChangeComplete={(color) => {
                setFormValues(prev => {
                  return {
                    ...prev,
                    buttonColor: color.hex
                  }
                })
              }} />
            </div>
            <div className="flex flex-col" >
              <label >H2 color</label>
              <SketchPicker disableAlpha={true} color={formValues.h2Color} onChangeComplete={(color) => {
                setFormValues(prev => {
                  return {
                    ...prev,
                    h2Color: color.hex
                  }
                })
              }} />
            </div>
            <div className="flex flex-col" >
              <label >P color</label>
              <SketchPicker disableAlpha={true} color={formValues.pColor} onChangeComplete={(color) => {
                setFormValues(prev => {
                  return {
                    ...prev,
                    pColor: color.hex
                  }
                })
              }} />
            </div>
          </div> : ''
        }
      </div>
      {user.data ?
        <>
          {openEditMode ? <div className='m-4  flex justify-center gap-5' >
            <Button onClick={editPopUpmutation.mutate} >
              submit
            </Button>
          </div> : <div className='m-4  flex justify-center gap-5'>
            <Button onClick={() => setOpenEditMode(true)} >
              <AiFillEdit />
            </Button>
          </div>}
        </> : ''
      }
    </Dialog>
  )
}

export default MarketingPopUp

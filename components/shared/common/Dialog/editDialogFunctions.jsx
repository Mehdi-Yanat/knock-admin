import Button from "@components/shared/core/Button";
import FormField from "@components/shared/core/FieldForm";
import { useEffect, useState } from "react";
import Dialog from ".";
import { SketchPicker } from 'react-color';
import { useMutation } from "@tanstack/react-query";
import { getGetAccessTokenFromCookie } from "@utils/core/hooks";
import { toast } from "react-toastify";
import UploadInput from '../uploadInput/UploadInput'


const EditBanner = ({ setOnLiveBannerChange, banner, isOpen, setIsOpen }) => {


	const [formValues, setFormValues] = useState({
		text: banner ? banner.text : '',
		textColor: banner ? banner.textColor : '',
		background: banner ? banner.background : '',
		bannerUrl: banner ? banner.bannerUrl : '',
		bannerUrlText: banner ? banner.bannerUrlText : ''
	});

	useEffect(() => {
		setOnLiveBannerChange(formValues)
	}, [formValues, setOnLiveBannerChange])

	const accessToken = getGetAccessTokenFromCookie();

	const editBanner = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-banner`,
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
		onSuccess: (result) =>
			setTimeout(() => toast(result.message), 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit the banner'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editBanner.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editBanner.isLoading}
				>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='text'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>

					<FormField
						values={formValues}
						setValues={setFormValues}
						name='bannerUrl'
						type='text'
						placeholder='*banner url'
						autoComplete='bannerUrl'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='bannerUrlText'
						type='text'
						placeholder='*banner url text'
						autoComplete='bannerUrlText'
						minLength={3}
					/>

					<div className="flex flex-col" >
						<label >Change background</label>
						<SketchPicker disableAlpha={true} color={formValues.background} onChangeComplete={(color) => {
							setFormValues(prev => {
								return {
									...prev,
									background: color.hex
								}
							})
						}} />
					</div>
					<div className="flex flex-col" >
						<label >Change text color</label>
						<SketchPicker disableAlpha={true} color={formValues.textColor} onChangeComplete={(color) => {
							setFormValues(prev => {
								return {
									...prev,
									textColor: color.hex
								}
							})
						}} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={EditBanner.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{EditBanner.isError && (
					<div className='text-bg-secondary-2'>
						<p>{'success'}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
};


const EditMainSection = ({ setOnLiveMainSectionChange, setPreviewImage, mainSection, isOpen, setIsOpen }) => {


	const [formValues, setFormValues] = useState({
		h2: mainSection ? mainSection.h2 : '',
		p: mainSection ? mainSection.p : '',
		buttonText: mainSection ? mainSection.buttonText : '',
		buttonUrl: mainSection ? mainSection.buttonUrl : '',
		h2Color: mainSection ? mainSection.h2Color : '',
		pColor: mainSection ? mainSection.pColor : '',
		mainImageUrl: mainSection ? mainSection.mainImageUrl : '',
	});

	let formData = new FormData()
	formData.append('mainImageUrl', formValues.mainImageUrl)

	console.log(formData);

	useEffect(() => {
		setOnLiveMainSectionChange(formValues)
	}, [formValues, setOnLiveMainSectionChange])

	const accessToken = getGetAccessTokenFromCookie();

	const editMainSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			if (typeof (formValues.mainImageUrl) === 'object') {
				fetch(
					`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/upload/image-main-section`,
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

						return result;
					})
			}

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-main-section`,
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
		onSuccess: (result) =>
			setTimeout(() => toast(result.message), 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit the main section'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editMainSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editMainSection.isLoading}
				>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='h2'
						type='text'
						placeholder='*h2'
						autoComplete='h2'
						minLength={3}
					/>

					<FormField
						values={formValues}
						setValues={setFormValues}
						name='p'
						type='text'
						placeholder='*p'
						autoComplete='p'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='buttonText'
						type='text'
						placeholder='*button text'
						autoComplete='button Text'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='buttonUrl'
						type='text'
						placeholder='*button url'
						autoComplete='button url'
						minLength={3}
					/>

					<div>
						<label >Upload new image</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>

					<div className="flex flex-col" >
						<label >Change h2 color</label>
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
						<label >Change p color</label>
						<SketchPicker disableAlpha={true} color={formValues.pColor} onChangeComplete={(color) => {
							setFormValues(prev => {
								return {
									...prev,
									pColor: color.hex
								}
							})
						}} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editMainSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editMainSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editMainSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
};


export { EditBanner, EditMainSection }
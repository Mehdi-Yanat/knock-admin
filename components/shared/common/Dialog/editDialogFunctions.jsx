import Button from "@components/shared/core/Button";
import FormField from "@components/shared/core/FieldForm";
import { useEffect, useState } from "react";
import Dialog from ".";
import { SketchPicker } from 'react-color';
import { useMutation } from "@tanstack/react-query";
import { getGetAccessTokenFromCookie } from "@utils/core/hooks";
import { toast } from "react-toastify";
import UploadInput from '../uploadInput/UploadInput'
import Image from "next/image";
import classes from "../../../../styles/editDialogFunctions.module.scss"
import axios from "axios";

const EditBanner = ({ setOnLiveBannerChange, banner, isOpen, setIsOpen }) => {


	const [formValues, setFormValues] = useState({
		text: banner ? banner.text : '',
		textColor: banner ? banner.textColor : '',
		background: banner ? banner.background : '',
		bannerUrl: banner ? banner.bannerUrl : '',
		bannerUrlText: banner ? banner.bannerUrlText : '',
		isAddToCartButton: banner ? banner.isAddToCartButton : false,
		disable: banner ? banner.disable : false
	});

	const resetValues = () => {
		setFormValues({
			text: 'Check this out Knock Clipper',
			textColor: 'white',
			background: '#7548FE',
			bannerUrl: '/knock-clipper',
			bannerUrlText: 'here',
			isAddToCartButton: false,
			disable: false
		})
	}

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
					<div>
						<input checked={formValues.disable} type="checkbox" id="diable" name="disable" onChange={(e) => setFormValues(value => {
							return {
								...value,
								disable: e.target.checked
							}
						})} value={formValues.disable} />
						<label for="diable"> Disable banner</label>
					</div>
					<div>
						<input checked={formValues.isAddToCartButton} type="checkbox" id="isAddToCartButton" name="isAddToCartButton" onChange={(e) => setFormValues(value => {
							return {
								...value,
								isAddToCartButton: e.target.checked
							}
						})} value={formValues.isAddToCartButton} />
						<label for="isAddToCartButton"> Enable add to cart functionality </label>
					</div>
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
					<div className='flex justify-end '>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							onClick={resetValues}
							className="mt-4"
						>
							Reset
						</Button>
					</div>

					<div className='flex justify-end '>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
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


const EditMainSection = ({ setOnLiveMainSectionChange, OnLiveMainSectionChange, mainSectionPageId, setPreviewImage, mainSection, isOpen, setIsOpen }) => {

	const [uploadImageApi, setUploadImageApi] = useState('')
	const [editMainSectionApi, setEditMainSectionApi] = useState('')
	const [resetMainSectionApi, setResetMainSectionApi] = useState('')

	const [formValues, setFormValues] = useState({
		h2: '',
		p: '',
		buttonText: '',
		buttonUrl: '',
		h2Color: '',
		pColor: '',
		mainImageUrl: '',
		tradeMark: '',
	});

	let formData = new FormData()
	formData.append('mainImageUrl', formValues.mainImageUrl)
	formData.append('sectionId', OnLiveMainSectionChange.sectionId)



	useEffect(() => {

		if (mainSection) {
			setFormValues(oldValue => {

				if (OnLiveMainSectionChange.sectionId) {
					return {
						...mainSection,
						sectionId: OnLiveMainSectionChange.sectionId
					}
				} else {
					return {
						...mainSection
					}
				}

			})
		}

	}, [mainSection])



	useEffect(() => {
		setOnLiveMainSectionChange(formValues)
	}, [formValues, setOnLiveMainSectionChange])

	const accessToken = getGetAccessTokenFromCookie();

	useEffect(() => {
		const update = () => {
			if (mainSectionPageId) {
				switch (mainSectionPageId) {
					case 'home-page':
						setUploadImageApi('image-main-section')
						setEditMainSectionApi('edit-main-section')
						setResetMainSectionApi('main-section')
						break;
					case 'knock-page':
						setUploadImageApi('image-knock-main-section')
						setEditMainSectionApi('edit-knock-main-section')
						setResetMainSectionApi('knock-main-section')
						break;

					case 'knock-clipper-page':
						setUploadImageApi('image-knock-clipper-main-section')
						setEditMainSectionApi('edit-knock-clipper-main-section')
						setResetMainSectionApi('knock-clipper-main-section')
						break;
					default:
						break;
				}
			}

		}
		update()
	}, [mainSectionPageId])

	const editMainSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			if (typeof (formValues.mainImageUrl) === 'object') {
				fetch(
					`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/upload/${uploadImageApi}`,
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
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${editMainSectionApi}`,
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

	const resetMainSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-main?pageId=${resetMainSectionApi}&sectionId=${OnLiveMainSectionChange.sectionId}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					if ('success' in result && !result.success)
						throw new Error(result.message);
					window.location.reload()
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
			<div
				className='mx-auto my-4 sm:w-11/12'
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

					{mainSectionPageId !== "home-page" ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='tradeMark'
						type='text'
						placeholder='*trade mark'
						autoComplete='trade mark'
						minLength={3}
					/> : ''}

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
						name={formValues.buttonText ? 'buttonText' : "button"}
						type='text'
						placeholder='*button text'
						autoComplete='button Text'
						minLength={3}
					/>
					{mainSectionPageId === "home-page" ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='buttonUrl'
						type='text'
						placeholder='*button url'
						autoComplete='button url'
						minLength={3}
					/> : ''}
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

					<div>
						<label >Upload new image</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editMainSection.isLoading}
							onClick={resetMainSection.mutate}
						>
							Reset
						</Button>
					</div>

					<div className='flex justify-end'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							disabled={editMainSection.isLoading}
							onClick={editMainSection.mutate}
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
			</div>
		</Dialog>
	);
};

// Home page -------------------------------------------
const EditHomePageSecondSection = ({ OnLiveSecondSectionChange, setPreviewImage, setOnLiveSecondSectionChange, productShowCase, isOpen, setIsOpen }) => {

	const [editSectionAPI, setEditSectionAPI] = useState('')
	const [resetSectionAPI, setResetSectionAPI] = useState('')
	const [editSectionUploadImageAPI, setEditSectionUploadImageAPI] = useState('')

	const [formValues, setFormValues] = useState({
		h2: '',
		p: '',
		tradeMark: '',
		button: '',
		buttonUrl: '',
		imageUrl: '',
		sectionId: OnLiveSecondSectionChange.sectionId
	});

	let formData = new FormData()
	formData.append('imageUrl', formValues.imageUrl)
	formData.append('sectionId', formValues.sectionId)

	useEffect(() => {

		if (productShowCase) {
			setFormValues(oldValue => {
				return {
					...productShowCase,
					sectionId: OnLiveSecondSectionChange.sectionId
				}
			})
		}

	}, [productShowCase])

	useEffect(() => {
		setOnLiveSecondSectionChange(formValues)
	}, [formValues, productShowCase])

	useEffect(() => {
		if (OnLiveSecondSectionChange.sectionId) {
			switch (OnLiveSecondSectionChange.sectionId) {
				case 'secondSection':
					setEditSectionAPI('edit-homepage')
					setEditSectionUploadImageAPI('image-homepage')
					setResetSectionAPI('second-section-homepage')
					break;
				case 'forthSection-knock':
					setEditSectionAPI('edit-knockpage')
					setEditSectionUploadImageAPI('image-knockpage')
					setResetSectionAPI('forth-section-knock')
					break;
				case 'thirdSection-knockclipper':
					setEditSectionAPI('edit-knockclipperpage')
					setEditSectionUploadImageAPI('image-knockclipperpage')
					setResetSectionAPI('third-section-knockclipper')
					break;
				case 'iosSection-knockpage':
					setEditSectionAPI('edit-knockpage')
					setEditSectionUploadImageAPI('image-knockpage')
					setResetSectionAPI('iosSection-section-knock')
					break;
				case 'lastSection-dtkpage':
					setEditSectionAPI('edit-DTK')
					setEditSectionUploadImageAPI('image-DTK')
					setResetSectionAPI('last-section-DTK')
					break;

				default:
					break;
			}
		}
	}, [OnLiveSecondSectionChange.sectionId])

	const accessToken = getGetAccessTokenFromCookie();


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			delete formValues.mainImageUrl

			if (typeof (formValues.imageUrl) === 'object') {
				fetch(
					`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/upload/${editSectionUploadImageAPI}`,
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

						return result
					})

			}

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${editSectionAPI}`,
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

	const resetMainSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-home-page?sectionId=${resetSectionAPI}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					if ('success' in result && !result.success)
						throw new Error(result.message);
					window.location.reload()
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
				title: 'Edit showcase section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
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
					{OnLiveSecondSectionChange.sectionId === 'secondSection' || 'thirdSection-knockclipper' ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='tradeMark'
						type='text'
						placeholder='*trade mark'
						autoComplete='trade mark'
						minLength={3}
					/> : ''}
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
						name='button'
						type='text'
						placeholder='*button text'
						autoComplete='button Text'
						minLength={3}
					/>
					{OnLiveSecondSectionChange.sectionId === 'secondSection' || 'lastSection-dtkpage' ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='buttonUrl'
						type='text'
						placeholder='*button url'
						autoComplete='button url'
						minLength={3}
					/> : ''}

					<div>
						<label >Upload new image</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetMainSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditHomePageThirdSection = ({ OnLiveAboutSectionChange, setOnLiveAboutSectionChange, aboutSection, isOpen, setIsOpen }) => {


	const [formValues, setFormValues] = useState({
		h2: '',
		tradeMark: '',
		p: '',
		sectionId: OnLiveAboutSectionChange.sectionId
	});

	useEffect(() => {
		if (aboutSection) {
			setFormValues({
				...aboutSection,
				sectionId: OnLiveAboutSectionChange.sectionId
			})
		}
	}, [aboutSection])


	useEffect(() => {
		setOnLiveAboutSectionChange(formValues)
	}, [formValues, setOnLiveAboutSectionChange])



	const accessToken = getGetAccessTokenFromCookie();

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-homepage`,
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

	const resetMainSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-home-page?sectionId=third-section-homepage`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit about section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
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
						name='tradeMark'
						type='text'
						placeholder='*trade mark'
						autoComplete='trade mark'
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
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
							onClick={resetMainSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							disabled={editSection.isLoading}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditHomePageForthSection = ({ OnLivelatestSamplesChange, setOnLivelatestSamplesChange, latestSamples, isOpen, setIsOpen }) => {

	const [paragraphObject, setParagraphObject] = useState(null)
	const [h2Object, seth2Object] = useState(null)

	const [formValues, setFormValues] = useState({
		h2: '',
		tradeMark: '',
		p: '',
		button: "",
		buttonUrl: "",
		sectionId: OnLivelatestSamplesChange.sectionId
	});

	useEffect(() => {
		if (latestSamples) {
			setFormValues({
				...latestSamples,
				sectionId: OnLivelatestSamplesChange.sectionId
			})
			setParagraphObject(oldValue => {
				return {
					...oldValue,
					p1: latestSamples.p[0],
					p2: latestSamples.p[1]
				}
			})
			seth2Object(oldValue => {
				return {
					...oldValue,
					hTag1: latestSamples.h2[0],
					hTag2: latestSamples.h2[1]
				}
			})
		}

	}, [latestSamples])

	useEffect(() => {
		if (paragraphObject || h2Object) {
			const myArrayPtag = Object.values(paragraphObject).map((value) => String(value));
			const myArrayH2tag = Object.values(h2Object).map((value) => String(value));

			setFormValues(oldValue => {
				return {
					...oldValue,
					p: myArrayPtag,
					h2: myArrayH2tag
				}
			})
		}
	}, [paragraphObject, h2Object])

	useEffect(() => {
		setOnLivelatestSamplesChange(formValues)
	}, [formValues, setOnLivelatestSamplesChange])


	const accessToken = getGetAccessTokenFromCookie();

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-homepage`,
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

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-home-page?sectionId=forth-section-homepage`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit latest samples section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>
					<FormField
						values={h2Object}
						setValues={seth2Object}
						name='hTag1'
						type='text'
						placeholder='*h2'
						autoComplete='h2'
						minLength={3}
					/>

					<FormField
						values={h2Object}
						setValues={seth2Object}
						name='hTag2'
						type='text'
						placeholder='*h2'
						autoComplete='h2'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='tradeMark'
						type='text'
						placeholder='*trade mark'
						autoComplete='trade mark'
						minLength={3}
					/>

					<FormField
						values={paragraphObject}
						setValues={setParagraphObject}
						name='p1'
						type='text'
						placeholder='*p1'
						autoComplete='p1'
						minLength={3}
					/>
					<FormField
						values={paragraphObject}
						setValues={setParagraphObject}
						name='p2'
						type='text'
						placeholder='*p2'
						autoComplete='p2'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='button'
						type='text'
						placeholder='*button text'
						autoComplete='button'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='buttonUrl'
						type='text'
						placeholder='*button url'
						autoComplete='button link'
						minLength={3}
					/>
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const ChangeSamplesBox = ({ isOpen, setIsOpen, products, formValues, setFormValues }) => {

	const accessToken = getGetAccessTokenFromCookie();

	useEffect(() => {
		if (formValues.sampleBoxHandle) {
			const editBox = async () => {
				await axios.put(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/change-sample-box`, formValues, {
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					}
				})

			}
			editBox()
		}
	}, [formValues.sampleBoxHandle])


	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Change samples boxs'
			}}
		>


			{products.map((el) => (
				<div key={el.id} className={classes.selectBox} >
					<div>
						<Image alt={'select box'} src={el.images[0].src} width={100} height={100} />
						<div>
							<h2  > {el.title} </h2>
							<p>{el.vendor}</p>
						</div>
					</div>
					<div>
						<Button onClick={() => {
							setFormValues(oldValue => {
								return {
									...oldValue,
									sampleBoxHandle: el.handle
								}
							})
						}} >
							Select
						</Button>
					</div>
				</div>
			))}

		</Dialog>
	);
}

// Knock page -------------------------------------------


const EditKnockPageSecondSection = ({ formValues, setFormValues, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const [API_URL_RESET, setAPI_URL_RESET] = useState('')

	const accessToken = getGetAccessTokenFromCookie();

	useEffect(() => {

		if (formValues.sectionId) {
			switch (formValues.sectionId) {
				case 'secondSection-knock-clipper':
					setAPI_URL('edit-knockclipperpage')
					setAPI_URL_RESET('knockclipperpage')
					break;

				default:
					setAPI_URL('edit-knockpage')
					setAPI_URL_RESET('knockpage')
					break;
			}
		}

	}, [formValues.sectionId])

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL}`,
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

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-${API_URL_RESET}?sectionId=secondSection`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='p'
						type='text'
						placeholder='*p'
						autoComplete='p'
						minLength={3}
					/>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							disabled={resetSection.isLoading}
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							disabled={editSection.isLoading}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};


const EditKnockPageThirdSection = ({ formValues, setFormValues, shapesId, isOpen, setIsOpen }) => {

	const accessToken = getGetAccessTokenFromCookie();

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-knockpage?shapesId=${shapesId}`,
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

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-knockpage?sectionId=thirdSection&shapesId=${shapesId}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>



					{shapesId ?
						<>
							<FormField
								values={formValues}
								setValues={setFormValues}
								name='h3'
								type='text'
								placeholder='*h3'
								autoComplete='h3'
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
						</> : <FormField
							values={formValues}
							setValues={setFormValues}
							name='h2'
							type='text'
							placeholder='*h2'
							autoComplete='h2'
							minLength={3}
						/>}
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditKnockPageReviewsSection = ({ formValues, setFormValues, reviewId, setPreviewImage, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const [API_URL_IMAGE, setAPI_URL_IMAGE] = useState('')
	const accessToken = getGetAccessTokenFromCookie();

	let formData = new FormData()
	formData.append('imageUrl', formValues.imageUrl)
	formData.append('sectionId', formValues.sectionId)
	formData.append('reviewId', formValues.id)


	useEffect(() => {

		if (formValues.sectionId) {
			switch (formValues.sectionId) {
				case 'sixSection-knock':
					setAPI_URL('edit-knockpage')
					setAPI_URL_IMAGE('image-knockpage')
					break;
				case 'reviewSection-dtkpage':
					setAPI_URL('edit-DTK')
					setAPI_URL_IMAGE('image-DTK')
					break;

				default:
					break;
			}
		}

	}, [formValues.sectionId])

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			if (typeof (formValues.imageUrl) === 'object') {
				fetch(
					`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/upload/${API_URL_IMAGE}`,
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
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL}?reviewId=${reviewId}`,
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

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-review?pageId=${formValues.sectionId}&reviewId=${formValues.id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>



					<FormField
						values={formValues}
						setValues={setFormValues}
						name='review'
						type='text'
						placeholder='*review'
						autoComplete='review'
						minLength={3}
					/>

					<FormField
						values={formValues}
						setValues={setFormValues}
						name='reviewBy'
						type='text'
						placeholder='*review by'
						autoComplete='review by'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='alt'
						type='text'
						placeholder='*image alt'
						autoComplete='image alt'
						minLength={3}
					/>

					<div>
						<label >Upload new image</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditRequirementSection = ({ formValues, setFormValues, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const [API_URL_RESET, setAPI_URL_RESET] = useState('')
	const [requirementId, setRequirementId] = useState('')

	const accessToken = getGetAccessTokenFromCookie();

	useEffect(() => {
		if (formValues) {
			switch (formValues.sectionId) {
				case 'sevenSection-knock':
					setAPI_URL('edit-knockpage')
					setAPI_URL_RESET('reset-knockpage')
					break;
				case 'forthSection-knockclipper':
					setAPI_URL('edit-knockclipperpage')
					setAPI_URL_RESET('reset-knockclipperpage')
					break;

				default:
					break;
			}

			if (formValues.requireId) {
				setRequirementId(formValues.requireId)
			}
		}
	}, [formValues])


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL}?requirdId=${requirementId}`,
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


	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL_RESET}?requirdId=${requirementId}&sectionId=requirement-section&type=${formValues.macOrPc}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>

					{formValues.isHeader ?
						<>
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
						</>

						: <FormField
							values={formValues}
							setValues={setFormValues}
							name='li'
							type='text'
							placeholder='*li'
							autoComplete='li'
							minLength={3}
						/>}
					<div className='flex justify-end mt-4'>
						<Button
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end '>
						<Button
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditYoutubeSection = ({ formValues, setFormValues, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const [API_URL_RESET, setAPI_URL_RESET] = useState('')
	const accessToken = getGetAccessTokenFromCookie();


	useEffect(() => {
		if (formValues) {
			switch (formValues.sectionId) {
				case 'eightSection-knock':
					setAPI_URL('edit-knockpage')
					setAPI_URL_RESET('reset-knockpage')
					break;
				case 'fifthSection-knockclipper':
					setAPI_URL('edit-knockclipperpage')
					setAPI_URL_RESET('reset-knockclipperpage')
					break;


				default:
					break;
			}
		}
	}, [formValues])



	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL}`,
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

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL_RESET}?sectionId=youtube-section`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
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
						name='youtubeUrl'
						type='text'
						placeholder='*youtube url'
						autoComplete='youtube url'
						minLength={3}
						labelTextVariants='change'
					/>

					<FormField
						values={formValues}
						setValues={setFormValues}
						name='youtubeImageUrl'
						type='text'
						placeholder='*youtube image url'
						autoComplete='youtube image url'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='youtubeUrl2'
						type='text'
						placeholder='*youtube url 2'
						autoComplete='youtube url 2'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='youtubeImageUrl2'
						type='text'
						placeholder='*youtube image url'
						autoComplete='youtube image url'
						minLength={3}
					/>

					<FormField
						values={formValues}
						setValues={setFormValues}
						name='button'
						type='text'
						placeholder='*button'
						autoComplete='button'
						minLength={3}
					/>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditKnockPageArtistSection = ({ formValues, setFormValues, artistId, setPreviewImage, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const [API_URL_IMAGE, setAPI_URL_IMAGE] = useState('')
	const accessToken = getGetAccessTokenFromCookie();

	let formData = new FormData()
	formData.append('imageUrl', formValues.imageUrl)
	formData.append('sectionId', formValues.sectionId)
	formData.append('artistId', formValues.id)


	useEffect(() => {

		if (formValues.sectionId) {
			switch (formValues.sectionId) {
				case 'sixSection-knock':
					setAPI_URL('edit-knockpage')
					setAPI_URL_IMAGE('image-knockpage')
					break;
				case 'artistSection-dtkpage':
					setAPI_URL('edit-DTK')
					setAPI_URL_IMAGE('image-DTK')
					break;

				default:
					break;
			}
		}

	}, [formValues.sectionId])

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			if (typeof (formValues.imageUrl) === 'object') {
				fetch(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/upload/${API_URL_IMAGE}`,
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
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/${API_URL}?artistId=${artistId}`,
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

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-DTK?artistId=${artistId}&sectionId=${formValues.sectionId}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>



					<FormField
						values={formValues}
						setValues={setFormValues}
						name='name'
						type='text'
						placeholder='*name'
						autoComplete='name'
						minLength={3}
					/>

					<div>
						<label >Upload new image {'(100px width - 100px height)'}</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

const EditFAQSection = ({ formValues, setFormValues, listId, isOpen, setIsOpen }) => {

	const accessToken = getGetAccessTokenFromCookie();


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-FAQ?listId=${listId}`,
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
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>
					{
						listId ? <FormField
							values={formValues}
							setValues={setFormValues}
							name='li'
							type='text'
							placeholder='*li'
							autoComplete='li'
							minLength={3}
						/> :
							<>
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

								{listId ? <FormField
									values={formValues}
									setValues={setFormValues}
									name='h3'
									type='text'
									placeholder='*h3'
									autoComplete='h3'
									minLength={3}
								/> : ''}
							</>}


					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
};

// DTK product 

const EditDTKSection = ({ formValues, setFormValues, featureId, youtubeId, filesIncludeId, descriptionId, isOpen, setIsOpen }) => {

	const accessToken = getGetAccessTokenFromCookie();


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-DTK-product?featureId=${featureId}&youtubeId=${youtubeId}&filesIncludeId=${filesIncludeId}&descriptionId=${descriptionId}`,
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
			setTimeout(() => {
				toast(result.message)
				window.location.reload()
			}, 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit section'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>

					{descriptionId ?
						<>
							<FormField
								values={formValues}
								setValues={setFormValues}
								name='h3'
								type='text'
								placeholder='*text'
								autoComplete='text'
								minLength={3}
							/>
							<FormField
								values={formValues}
								setValues={setFormValues}
								name='text1'
								type='text'
								placeholder='*text'
								autoComplete='text'
								minLength={3}
							/>
							<FormField
								values={formValues}
								setValues={setFormValues}
								name='text2'
								type='text'
								placeholder='*text'
								autoComplete='text'
								minLength={3}
							/>
						</>
						: ''
					}
					{filesIncludeId ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='li'
						type='text'
						placeholder='*li'
						autoComplete='li'
						minLength={3}
					/> : ''}

					{youtubeId ? <>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='src'
							type='text'
							placeholder='*src'
							autoComplete='src'
							minLength={3}
						/>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='srcImage'
							type='text'
							placeholder='*src image'
							autoComplete='src image'
							minLength={3}
						/>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='title'
							type='text'
							placeholder='*title'
							autoComplete='title'
							minLength={3}
						/>
					</> : ""}
					{
						featureId ? <FormField
							values={formValues}
							setValues={setFormValues}
							name='li'
							type='text'
							placeholder='*li'
							autoComplete='li'
							minLength={3}
						/> : ''
					}

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
};

const AddDTKfeatures = ({ formValues, setFormValues, type, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const accessToken = getGetAccessTokenFromCookie();


	useEffect(() => {
		if (type) {
			switch (type) {
				case 'features':
					setAPI_URL("feature")
					break;
				case 'files Included':
					setAPI_URL("files-included")
					break;
				case 'youtube':
					setAPI_URL("youtube-video")
					break;
				default:
					break;
			}
		}
	}, [type])




	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/add-DTK-product-${API_URL}`,
				{
					method: 'POST',
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
			setTimeout(() => {
				toast(result.message)
				window.location.reload()
			}, 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Add ' + type
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>

					{type === 'features' ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='li'
						type='text'
						placeholder='*li'
						autoComplete='li'
						minLength={3}
					/> : ''}

					{type === 'files Included' ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='li'
						type='text'
						placeholder='*li'
						autoComplete='li'
						minLength={3}
					/> : ''}

					{type === 'youtube' ? <>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='src'
							type='text'
							placeholder='*src embed link'
							autoComplete='src'
							minLength={3}
						/>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='srcImage'
							type='text'
							placeholder='*src background image'
							autoComplete='srcImage'
							minLength={3}
						/>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='title'
							type='text'
							placeholder='*title'
							autoComplete='title'
							minLength={3}
						/>
					</> : ''}

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
};

const Addreviews = ({ formValues, setFormValues, formData, setPreviewImage, isOpen, setIsOpen }) => {

	const [API_URL, setAPI_URL] = useState('')
	const accessToken = getGetAccessTokenFromCookie();


	useEffect(() => {

		if (formValues.sectionId) {
			switch (formValues.sectionId) {
				case 'sixSection-knock':
					setAPI_URL('knockpage')
					break;
				case 'reviewSection-dtkpage':
					setAPI_URL('DTK')
					break;

				default:
					break;
			}
		}

	}, [formValues.sectionId])

	const addReview = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/add-review-${API_URL}`,
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
				});
		},
		onSuccess: (result) =>
			setTimeout(() => {
				toast(result.message)
				window.location.reload()
			}, 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'add review'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={addReview.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={addReview.isLoading}
				>



					<FormField
						values={formValues}
						setValues={setFormValues}
						name='review'
						type='text'
						placeholder='*review'
						autoComplete='review'
						minLength={3}
					/>

					<FormField
						values={formValues}
						setValues={setFormValues}
						name='reviewBy'
						type='text'
						placeholder='*review by'
						autoComplete='review by'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='alt'
						type='text'
						placeholder='*image alt'
						autoComplete='image alt'
						minLength={3}
					/>

					<div>
						<label >Upload new image</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={addReview.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{addReview.isError && (
					<div className='text-bg-secondary-2'>
						<p>{addReview.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
};

const Addartist = ({ formValues, setFormValues, setPreviewImage, isOpen, setIsOpen }) => {

	const accessToken = getGetAccessTokenFromCookie();

	let formData = new FormData();
	formData.append("imageUrl", formValues.imageUrl);
	formData.append("sectionId", formValues.sectionId);
	formData.append("name", formValues.name);

	const addArtist = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/add-DTK-product-artist`,
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
				title: 'add artist'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={addArtist.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={addArtist.isLoading}
				>



					<FormField
						values={formValues}
						setValues={setFormValues}
						name='name'
						type='text'
						placeholder='*name'
						autoComplete='name'
						minLength={3}
					/>

					<div>
						<label >Upload new image {'(100px width - 100px height)'}</label>
						<UploadInput setPreviewImage={setPreviewImage} setFormValues={setFormValues} />
					</div>

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={addArtist.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{addArtist.isError && (
					<div className='text-bg-secondary-2'>
						<p>{addArtist.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
};

const EditDTKmainSection = ({ isOpen, setIsOpen, setFormValues, formValues, paragraphId }) => {
	const accessToken = getGetAccessTokenFromCookie();



	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-DTK?paragraphId=${paragraphId}`,
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
			setTimeout(() => {
				toast(result.message)
			}, 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	const resetSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-DTK?paragraphId=${paragraphId}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'Authorization': accessToken
					},
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
			setTimeout(() => {
				toast(result.message)
			}, 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit section'
			}}
		>
			<div
				className='mx-auto my-4 sm:w-11/12'
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>

					{paragraphId ?
						<>
							<FormField
								values={formValues}
								setValues={setFormValues}
								name='p'
								type='text'
								placeholder='*p'
								autoComplete='p'
								minLength={3}
							/>
							{paragraphId === 3 ? <FormField
								values={formValues}
								setValues={setFormValues}
								name='tradeMark'
								type='text'
								placeholder='*trade mark'
								autoComplete='trade mark'
								minLength={3}
							/> : ''}
						</> : <>
							<FormField
								values={formValues}
								setValues={setFormValues}
								name='br'
								type='text'
								placeholder='*br'
								autoComplete='br'
								minLength={3}
							/>

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
								name='tradeMark'
								type='text'
								placeholder='*trade mark'
								autoComplete='trade mark'
								minLength={3}
							/>
						</>
					}
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							onClick={resetSection.mutate}
						>
							Reset
						</Button>
					</div>
					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							onClick={editSection.mutate}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</div>
		</Dialog>
	);
}

// Terms of service

const EditTermsOfService = ({ formValues, setFormValues, isOpen, setIsOpen }) => {
	const accessToken = getGetAccessTokenFromCookie();


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-terms-of-service`,
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
			setTimeout(() => toast(result.message, { type: 'success' }), 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit section'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>

					{!formValues.textId ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='h3'
						type='text'
						placeholder='*h3'
						autoComplete='h3'
						minLength={3}
					/> : ''}

					{formValues.textId ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='text'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/> : ''}

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
}

// Shipping 

const EditShippingPolicy = ({ formValues, setFormValues, listId, isOpen, setIsOpen }) => {
	const accessToken = getGetAccessTokenFromCookie();


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-shipping-policy`,
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
			setTimeout(() => toast(result.message, { type: 'success' }), 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit section'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>

					{listId ? <FormField
						values={formValues}
						setValues={setFormValues}
						name='li'
						type='text'
						placeholder='*li'
						autoComplete='li'
						minLength={3}
					/> :
						<>
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
								name='h2s'
								type='text'
								placeholder='*h2s'
								autoComplete='h2s'
								minLength={3}
							/>

							<FormField
								values={formValues}
								setValues={setFormValues}
								name='p2'
								type='text'
								placeholder='*p'
								autoComplete='p'
								minLength={3}
							/>
						</>}

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
}

// Shipping 

const EditRefundPolicy = ({ formValues, setFormValues, isOpen, setIsOpen }) => {
	const accessToken = getGetAccessTokenFromCookie();


	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-refund-policy`,
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
			setTimeout(() => toast(result.message, { type: 'success' }), 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit section'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
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

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
}

// Privacy 

const EditPrivacyPolicy = ({ formValues, setFormValues, isOpen, setIsOpen }) => {
	const accessToken = getGetAccessTokenFromCookie();


	const formInputRender = () => {
		switch (formValues.sectionId) {

			case 'collecting':
				return <>
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
						name='u'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='u2'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
				</>

			case 'collecting-li':
			case 'collecting-li2':
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='strong'
						type='text'
						placeholder='*strong'
						autoComplete='strong'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='text'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
				</>
			case 'minors':
			case 'lawful':
			case 'retention':
			case 'do-not-track':
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='h3'
						type='text'
						placeholder='*h3'
						autoComplete='h3'
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
				</>
			case 'sharing-ul':
			case 'behavioural-ul':
			case 'lawfulBasis-ul':
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='li'
						type='text'
						placeholder='*li'
						autoComplete='li'
						minLength={3}
					/>
					{formValues.sectionId === 'lawfulBasis-ul' ? '' : <FormField
						values={formValues}
						setValues={setFormValues}
						name='a'
						type='text'
						placeholder='*a'
						autoComplete='a'
						minLength={3}
					/>}
				</>
			case "behavioural":
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='h3'
						type='text'
						placeholder='*h3'
						autoComplete='h3'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='p2'
						type='text'
						placeholder='*p'
						autoComplete='p'
						minLength={3}
					/>
				</>
			case "behavioural-p":
			case "automatic-p":
			case "automatic-ul":
			case "ccpa-p":
			case "cookies-p":
			case "analytics-p":
			case "contact-p":
				return <>
					{formValues.sectionId === 'automatic-p' ||
						formValues.sectionId === 'ccpa-p' ||
						formValues.sectionId === 'automatic-ul' ||
						formValues.sectionId === 'contact-p' ?
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='text'
							type='text'
							placeholder='*text'
							autoComplete='text'
							minLength={3}
						/>
						:
						<>
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
								name='a'
								type='text'
								placeholder='*a'
								autoComplete='a'
								minLength={3}
							/>
						</>}
				</>
			case "behavioural-ul2":
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='em'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='li'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
				</>
			case 'personal':
			case 'changes':
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='h2'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='p'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
				</>
			case 'yourrights-p':
			case 'contact-p2':
				return <>
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
						name='em'
						type='text'
						placeholder='*em'
						autoComplete='em'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='a'
						type='text'
						placeholder='*a link'
						autoComplete='a link'
						minLength={3}
					/>
				</>
			case 'necessary-th':
			case 'analytics-th':
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='strong'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='strong2'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
				</>
			case 'necessary-tr':
			case 'analytics-tr':
				return <>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='em'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
					<FormField
						values={formValues}
						setValues={setFormValues}
						name='td'
						type='text'
						placeholder='*text'
						autoComplete='text'
						minLength={3}
					/>
				</>
			case 'contact-em':
				return <FormField
					values={formValues}
					setValues={setFormValues}
					name='em'
					type='text'
					placeholder='*text'
					autoComplete='text'
					minLength={3}
				/>

			default:
				break;
		}
	}

	const editSection = useMutation({
		mutationFn: (event) => {
			event.preventDefault();

			return fetch(
				`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-privacy-policy`,
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
			setTimeout(() => toast(result.message, { type: 'success' }), 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title: 'Edit section'
			}}
		>
			<form
				className='mx-auto my-4 sm:w-11/12'
				onSubmit={editSection.mutate}
			>
				<fieldset
					className='mt-2 space-y-4'
					disabled={editSection.isLoading}
				>


					{formValues.sectionId === "head" ? <>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='head'
							type='text'
							placeholder='*head'
							autoComplete='head'
							minLength={3}
						/>
						<FormField
							values={formValues}
							setValues={setFormValues}
							name='head2'
							type='text'
							placeholder='*head'
							autoComplete='head'
							minLength={3}
						/>
					</> : ''}
					{
						formInputRender()
					}

					<div className='flex justify-end mt-4'>
						<Button
							type='submit'
							classesIntent={{ w: 'full' }}
							className='mt-4'
							disabled={editSection.isLoading}
						>
							Submit
						</Button>
					</div>
				</fieldset>
				{editSection.isError && (
					<div className='text-bg-secondary-2'>
						<p>{editSection.error.message}</p>
					</div>
				)}
			</form>
		</Dialog>
	);
}



export {
	EditBanner, EditMainSection, EditHomePageSecondSection, EditHomePageThirdSection,
	EditHomePageForthSection, ChangeSamplesBox, EditKnockPageSecondSection,
	EditKnockPageThirdSection, EditKnockPageReviewsSection, EditRequirementSection,
	EditYoutubeSection, EditKnockPageArtistSection, EditFAQSection, EditDTKSection,
	AddDTKfeatures, Addreviews, Addartist, EditTermsOfService, EditShippingPolicy, EditRefundPolicy, EditPrivacyPolicy,
	EditDTKmainSection
}
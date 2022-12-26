import Button from "@components/shared/core/Button";
import FormField from "@components/shared/core/FieldForm";
import { useEffect, useState } from "react";
import Dialog from ".";
import { SketchPicker } from 'react-color';
import { useMutation } from "@tanstack/react-query";
import { getApiUrl } from "lib/getApiUrl";
import { getGetAccessTokenFromCookie } from "@utils/core/hooks";
import { toast } from "react-toastify";



const EditBanner = ({setOnLiveBannerChange,banner,isOpen,setIsOpen})=> {

	
	const [formValues, setFormValues] = useState({
		text: banner ? banner.text : '',
		textColor: banner ? banner.textColor : '',
		background:banner ?  banner.background :''
	});

	useEffect(()=>{
		setOnLiveBannerChange(formValues)
	},[formValues , setOnLiveBannerChange])

	const accessToken = getGetAccessTokenFromCookie();

	const subscribeToNewsLetters = useMutation({
		mutationFn: (event) => {
			event.preventDefault();
			return fetch(
				`${getApiUrl()}/ui/edit-banner`,
				{
					method: 'PUT',
					headers: { 'Content-type': 'application/json' ,
					'Authorization':accessToken },
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
			setTimeout(() => toast(result.message) , 0),
		onError: (result) =>
			setTimeout(() => toast(result.message, { type: 'error' }), 0)
	});

	return (
		<Dialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			header={{
				title:'Edit the banner'
			}}
		>
				<form
					className='mx-auto my-4 sm:w-11/12'
					onSubmit={subscribeToNewsLetters.mutate}
				>
					<fieldset
						className='mt-2 space-y-4'
						disabled={subscribeToNewsLetters.isLoading}
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
						
						<div className="flex flex-col" >
							 <label >Change background</label>
							<SketchPicker color={formValues.background}  onChange={(color) => {
								setFormValues(prev => {
									return {
										...prev,
										background:color.hex
									}
								})
							}} />
						</div>

						<div className="flex flex-col" >
							 <label >Change text color</label>
							<SketchPicker color={formValues.textColor}  onChange={(color) => {
								setFormValues(prev => {
									return {
										...prev,
										textColor:color.hex
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


export default EditBanner;

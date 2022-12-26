import type { NextApiRequest, NextApiResponse } from 'next';

import { z } from 'zod';

import axios from 'axios';


const SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
	process.env.SENDINBLUE_API_SMTP;



const subscribeToNewsLetters = async (
	req: NextApiRequest & { params: Record<string, any> },
	res: NextApiResponse
) => {
	const email = z.string().email().parse(req.body.email);

	let apiInstance = new SibApiV3Sdk.ContactsApi();

	try {
		let createContact = new SibApiV3Sdk.CreateContact();

		createContact.email = email;
		createContact.listIds = [51];
		const response = await apiInstance.createContact(createContact);

		return res.status(200).json({
			success: true,
			message: 'You have been subscribed successfully!',
			response
		});
	} catch (error) {
		res.statusCode = error.status;
		throw new Error('You are already subscribed to the newsletter');
	}
};

const supportForm = async (
	req: NextApiRequest & { params: Record<string, any> },
	res: NextApiResponse
) => {
	const input = z
		.object({
			email: z.string().email(),
			subject: z.string(),
			message: z.string(),
			fullName: z.string().min(2),
			countryCode: z.string().min(3)
		})
		.parse(req.body);

	const email = await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
		{
			sender: {
				email: input.email,
				name: input.fullName
			},
			subject: input.subject,
			htmlContent: `<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8" />
							<meta http-equiv="X-UA-Compatible" content="IE=edge" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<link rel="preconnect" href="https://fonts.googleapis.com" />
							<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
							<link
							href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap"
							rel="stylesheet"
							/>
							<title>Contact Email</title>
						</head>
						<style>
							body {
							font-family: "Lato", sans-serif;
							}
							p {
							color: black;
							text-align: left;
							font-family: "Lato", sans-serif;
							line-height: 1.6;
							font-size: 14px;
							padding: 0px 0 0;
							margin: 0;
							}
							a{
							color: #4E7FA1;
							}
						</style>

						<body>
							<table style="width: 100%; height: 100%; padding: 20px 0">
							<tbody >
								<tr>
								<td style="height: 1%">
									<table
									style="
										background-color: #ffffff;
										width: 100%;
										height: 100%;
										max-width: 500px;
										margin: 0 auto;
										position: relative;
										border: 2px solid #e3e3e3;
										border-radius: 10px;
									"
									>
									<tbody>
										<tr>
										<td style="height: 1%; padding: 10px 30px 0">
											<p style="font-size: 14px">
											You received a new message from your online store's
											contact <br />
											form
											</p>
											<hr
											style="height: 2px; border: none; background: #e3e3e3"
											/>
										</td>
										</tr>

										<tr>
										<td style="height: 1%; padding: 10px 30px">
											<p style="font-weight: 900 ;" >
											Country Code:
											</p>
											<p style="font-weight: 500 ;"  >${input.countryCode}</p>
										</td>
										</tr>
										<tr>
										<td style="height: 1%;  padding: 10px 30px">
											<p style="font-weight: 900 ;" >
											Name:
											</p>
											<p style="font-weight: 500 ;" >
											${input.fullName}
											</p>
										</td>
										</tr>
										<tr>
										<td style="height: 1%; padding: 10px 30px">
											<p style="font-weight: 900 ;">
											Email:
											</p>
											<p style="font-weight: 500 ;"  >
											<a href="mailto:${input.email}"> ${input.email} </a>
											</p>
										</td>
										</tr>
										<tr>
										<td style="height: 1%; padding: 0 30px">
											<p style="font-weight: 900 ;" >
											Body:
											</p>
											<p  style="padding-bottom: 20px ; font-weight: 500 ;" > ${input.message} </p>
										</td>
										</tr>
										<tr>
										<td  style="height: 1%; padding: 0 30px">
											<p style="font-weight: 900 ;" >
											Thank you
											</p>
											<p style="font-weight: 500 ; padding-bottom: 20px ;" >${input.fullName}</p>
										</td>
										</tr>
									</tbody>
									</table>
								</td>
								</tr>
							</tbody>
							</table>
						</body>
						</html>
				`,

			to: [
				{
					email: process.env.NEXT_PUPLIC_FORMSUBMIT_EMAIL,
				}
			]
		}
	);

	if (email) {
		return res.status(200).json({
			success: true,
			message: 'The form was sent successfully!',
			email
		});
	}
};

const redeemCode = async (
	req: NextApiRequest & { params: Record<string, any> },
	res: NextApiResponse
) => {
	const data = req.body;

	const response = await axios.post(
		`https://redeem2.${process.env.REDEEM_DOMAIN}/api/price-rules`,
		data,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (response.data.verified === false) {
		res.statusCode = 404;
		throw new Error('INVALID CODE!');
	}

	return res.status(200).json({
		success: true,
		message: 'VALID CODE',
		data: response.data
	});
};

const createOrderRedeemCode = async (
	req: NextApiRequest & { params: Record<string, any> },
	res: NextApiResponse
) => {
	const input = z
		.object({
			redeemCode: z.string().min(4),
			firstName: z.string().min(2),
			lastName: z.string().min(2),
			email: z.string().email(),
			variantId: z.string(),
			productId: z.string(),
			price: z.number()
		})
		.parse(req.body);

	const isRedeemCodeWork = await axios.post(
		`https://redeem2.${process.env.REDEEM_DOMAIN}/api/price-rules`,
		{
			data: {
				customer_code: input.redeemCode,
				product_id: input.productId,
				variant_id: input.variantId
			}
		},
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	if (isRedeemCodeWork.data.verified === false) {
		res.statusCode = 404;
		throw new Error('INVALID CODE!');
	}

	const response = await axios.post(
		`https://redeem2.${process.env.REDEEM_DOMAIN}/api/create-order`,
		{
			data: {
				customer_code: input.redeemCode
			},
			order: {
				billing_address: {
					first_name: input.firstName,
					last_name: input.lastName
				},
				customer: {
					email: input.email,
					first_name: input.firstName,
					last_name: input.lastName
				},
				email: input.email,
				line_items: [
					{
						price: input.price,
						quantity: 1,
						variant_id: input.variantId
					}
				],
				shipping_address: {
					first_name: input.firstName,
					last_name: input.lastName
				}
			}
		},
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);


	return res.status(200).json({
		success: true,
		message:
			'Thanks for ordering from Plugins That Knock. Your payment has cleared',
		data: response.data
	});
};

const clientsController = {
	subscribeToNewsLetters,
	supportForm,
	redeemCode,
	createOrderRedeemCode
};

export default clientsController;

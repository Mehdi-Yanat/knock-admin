import nextConnect from '@utils/common/nextConnect';

import clientsController from 'server/controllers/clients';

const basePath = '/api/clients';

const clientsAPIRouteHandler = nextConnect({ attachParams: true })
	.post(`${basePath}/subscribe-newsletters`, clientsController.subscribeToNewsLetters)
	.post(`${basePath}/contact-us`, clientsController.supportForm)
	.post(`${basePath}/redeem-code`, clientsController.redeemCode)
	.post(`${basePath}/create-redeem-order`, clientsController.createOrderRedeemCode)
export default clientsAPIRouteHandler;

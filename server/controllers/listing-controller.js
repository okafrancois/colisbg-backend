const listingService = require('../services/listing-service')

module.exports.getListings = async (req, res) => {
    let response = {}
    try {
        const {page, limit} = req.params
        const pageAsInteger = parseInt(page);
        const limitAsInteger = parseInt(limit);
        const responseFromService = await listingService.getListings(req, pageAsInteger, limitAsInteger);
        response.status = 200
        response.message = 'Successfully got listings'
        response.body = responseFromService
    } catch (error) {
        console.log('Error in getListings - listingController.js')
        response.status = 400
        response.message = error.message
    }

    return res.status(response.status).send(response)
}

module.exports.createListing = async (req, res) => {
    let response = {}

    try {
        const responseFromService = await listingService.createListing(req)
        response.status = 200
        response.message = 'Successfully created listing'
        response.body = responseFromService
    } catch (error) {
        console.log('Error in createListing - listingController.js')
        response.status = 400
        response.message = error.message
    }

    return res.status(response.status).send(response)
}

module.exports.updateListing = async (req, res) => {
    let response = {}
    try {
        const responseFromService = await listingService.updateListing(req)
        response.status = 200
        response.message = 'Successfully updated listing'
        response.body = responseFromService
    } catch (error) {
        console.log('Error in updateListing - listingController.js')
        response.status = 400
        response.message = error.message
    }

    return res.status(response.status).send(response)
}

module.exports.deleteListing = async (req, res) => {
    let response = {}
    
    try {
        const responseFromService = await listingService.deleteListing(req)
        response.status = 200
        response.message = 'Successfully deleted listing'
        response.body = responseFromService
    } catch (error) {
        console.log('Error in deleteListing - listingController.js')
        response.status = 400
        response.message = error.message
    }

    return res.status(response.status).send(response)
}

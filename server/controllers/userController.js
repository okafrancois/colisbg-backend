const userService = require('../services/userService')

module.exports.createUser = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.createUser(req.body)
    response.status = 200
    response.message = 'User successfully created'
    response.body = responseFromService
  } catch (error) {
    console.error('Something went wrong in userController.js', error)
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.loginUser = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.loginUser(req.body)
    response.status = 200
    response.message = 'User successfully logged in'
    response.body = responseFromService
  } catch (error) {
    console.error('Error in loginUser (userController.js)')
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.getUserProfile = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.getUserProfile(req)
    response.status = 200
    response.message = 'Successfully got user profile data'
    response.body = responseFromService
  } catch (error) {
    console.log('Error in userController.js')
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.updateUserProfile = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.updateUserProfile(req)
    response.status = 200
    response.message = 'Successfully updated user profile data'
    response.body = responseFromService
  } catch (error) {
    console.log('Error in updateUserProfile - userController.js')
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.getListings = async (req, res) => {
    let response = {}

    try {
        const responseFromService = await userService.getListings(req)
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
        const responseFromService = await userService.createListing(req)
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
        const responseFromService = await userService.updateListing(req)
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
        const responseFromService = await userService.deleteListing(req)
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

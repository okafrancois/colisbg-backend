const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const tokenValidation = require('../middleware/tokenValidation')
const listingController = require('../controllers/listing-controller')

router.post('/user/signup', userController.createUser)

router.post('/user/login', userController.loginUser)

router.post(
  '/user/profile',
  tokenValidation.validateToken,
  userController.getUserProfile
)

router.put(
  '/user/profile',
  tokenValidation.validateToken,
  userController.updateUserProfile
)

router.get(
    '/user/listings/:page/:limit',
    tokenValidation.validateToken,
    userController.getListings
)

router.post(
    '/user/listings',
    userController.createListing
)

router.put(
    '/user/listings',
    tokenValidation.validateToken,
    userController.updateListing
)

router.delete(
    '/user/listings',
    tokenValidation.validateToken,
    userController.deleteListing
)

router.get(
    '/listings/:page/:limit',
    tokenValidation.validateToken,
    listingController.getListings
)

module.exports = router

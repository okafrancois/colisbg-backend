const Listing = require('../database/models/listing-model');
const jwt = require('jsonwebtoken');
const User = require("../database/models/userModel");

module.exports.createListing = async serviceData => {
    try {
        // Extract the userId value from the token
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
        const decodedJwtToken = jwt.decode(jwtToken);
        const userId = decodedJwtToken.id;

        const newListing = new Listing({
            weight: serviceData.body.weight,
            pricePerKilo: serviceData.body.pricePerKilo,
            destination: serviceData.body.destination,
            departureCountry: serviceData.body.departureCountry,
            departureCity: serviceData.body.departureCity,
            arrivalCountry: serviceData.body.arrivalCountry,
            arrivalCity: serviceData.body.arrivalCity,
            departureDate: serviceData.body.departureDate,
            arrivalDate: serviceData.body.arrivalDate,
            createdById: userId,
        });

        // Save and return the new Listing
        return await newListing.save();
    } catch (error) {
        console.error('Error in listingService.js', error);
        throw new Error(error);
    }
};

module.exports.getListings = async (serviceData, page = 1, limit = 10) => {
    try {
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
        const decodedJwtToken = jwt.decode(jwtToken);

        const totalDocuments = await Listing.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        const currentPage = page;
        const remainingPages = totalPages - currentPage;
        const listings = await Listing.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({createdAt: -1})
            .lean();

        return {listings, totalDocuments, totalPages, currentPage, limit, remainingPages};
    } catch (error) {
        console.error('Error in listingService.js', error);
        throw new Error(error);
    }
};

module.exports.updateListing = async serviceData => {
    try {
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
        const decodedJwtToken = jwt.decode(jwtToken)

        const updates = {}

        serviceData.body.entries().forEach(([key, value]) => {
            updates[key] = value
        })

        const listing = await Listing.findOneAndUpdate({
                _id: serviceData.body._id
            },
            updates,
            {new: true}
        )

        if (!listing) {
            throw new Error('Listing not found!')
        }

        return listing.toObject()

    } catch (error) {
        console.error('Error in listingService.js', error)
        throw new Error(error)
    }
}

module.exports.deleteListing = async serviceData => {
    try {
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
        const decodedJwtToken = jwt.decode(jwtToken)
        const user = await User.findOne({ _id: decodedJwtToken.id })

        if (!user) {
            throw new Error('User not found!')
        }

        const existingListing = await Listing.findOneAndDelete({
            _id: serviceData.body._id,
        })

        if (!existingListing) {
            throw new Error('Listing not found!')
        }

        return existingListing.toObject()
    } catch (error) {
        console.error('Error in ListingService.js', error)
        throw new Error(error)
    }
}

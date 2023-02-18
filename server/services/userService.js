const User = require('../database/models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Listing = require('../database/models/listing-model')
const mongoose = require("mongoose");

module.exports.createUser = async serviceData => {
  try {
    const user = await User.findOne({ email: serviceData.email })
    if (user) {
      throw new Error('Email already exists')
    }

    const hashPassword = await bcrypt.hash(serviceData.password, 12)

    const newUser = new User({
      email: serviceData.email,
      password: hashPassword,
      firstName: serviceData.firstName,
      lastName: serviceData.lastName,
      balance: serviceData.balance,
      transactions: []
    })

    return await newUser.save()
  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.getUserProfile = async serviceData => {
  try {
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
    const decodedJwtToken = jwt.decode(jwtToken)
    const user = await User.findOne({ _id: decodedJwtToken.id })

    if (!user) {
      throw new Error('User not found!')
    }

    const userData = user.toObject()

    // return only the data we need
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      balance: userData.balance
    }

  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.loginUser = async serviceData => {
  try {
    const user = await User.findOne({ email: serviceData.email })

    if (!user) {
      throw new Error('User not found!')
    }

    const isValid = await bcrypt.compare(serviceData.password, user.password)

    if (!isValid) {
      throw new Error('Password is invalid')
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY || 'default-secret-key',
      { expiresIn: '1d' }
    )

    return { token }
  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.updateUserProfile = async serviceData => {
  try {
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
    const decodedJwtToken = jwt.decode(jwtToken)
    const user = await User.findOneAndUpdate(
      { _id: decodedJwtToken.id },
      {
        firstName: serviceData.body.firstName,
        lastName: serviceData.body.lastName
      },
      { new: true }
    )

    if (!user) {
      throw new Error('User not found!')
    }

    return user.toObject()
  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.getListings = async (serviceData, page = 1, limit = 10) => {
    try {
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
        const decodedJwtToken = jwt.decode(jwtToken);

        const user = await User.findOne({ _id: decodedJwtToken.id }).populate('listings');

        if (!user) {
            throw new Error('User not found!');
        }

        const totalDocuments = await Listing.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        const currentPage = page;
        const remainingPages = totalPages - currentPage;
        const items = await Listing.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({createdAt: -1})
            .lean();

        return {items, totalDocuments, totalPages, currentPage, limit, remainingPages};
    } catch (error) {
        console.error('Error in listingService.js', error);
        throw new Error(error);
    }
};

module.exports.createListing = async serviceData => {
  try {
    const existingListing = await Listing.findOne({ _id: serviceData.body._id });

    if (existingListing) {
      throw new Error('Listing already exists');
    }

    // Extract the userId value from the token
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);
    const userId = decodedJwtToken.id;
    const user = await User.findOne({ _id: userId });

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
    })


    // Add the new transaction to the user's transactions array
    user.listings.push(newListing);

    // Save the user model with the updated balance and transactions array
    await user.save();

    // Save and return the new transaction
    return await newListing.save();
  } catch (error) {
    console.error('Error in userService.js', error);
    throw new Error(error);
  }
}

module.exports.deleteListing = async serviceData => {
    try {
        const listing = await Listing.findOne({ _id: serviceData.params.id });

        if (!listing) {
        throw new Error('Listing not found!');
        }

        // Extract the userId value from the token
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
        const decodedJwtToken = jwt.decode(jwtToken);
        const userId = decodedJwtToken.id;

        if (listing.createdById !== userId) {
        throw new Error('You are not authorized to delete this listing!');
        }

        return await Listing.deleteOne({ _id: serviceData.params.id });
    } catch (error) {
        console.error('Error in userService.js', error);
        throw new Error(error);
    }
}

module.exports.updateListing = async serviceData => {
    try {
        const listing = await Listing.findOne({ _id: serviceData.params.id });

        if (!listing) {
        throw new Error('Listing not found!');
        }

        // Extract the userId value from the token
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
        const decodedJwtToken = jwt.decode(jwtToken);
        const userId = decodedJwtToken.id;

        if (listing.createdById !== userId) {
        throw new Error('You are not authorized to update this listing!');
        }

        const updates = {}
        const allowedUpdates = ['weight', 'pricePerKilo', 'destination', 'departureCountry', 'departureCity', 'arrivalCountry', 'arrivalCity', 'departureDate', 'arrivalDate'];
        const updatesKeys = Object.keys(serviceData.body);

        updatesKeys.forEach(update => {
            if (allowedUpdates.includes(update)) {
                updates[update] = serviceData.body[update];
            }
        })

        return await Listing.findOneAndUpdate(
        { _id: serviceData.params.id },
        {
            ...updates
        },
        { new: true }
        );
    } catch (error) {
        console.error('Error in userService.js', error);
        throw new Error(error);
    }
}

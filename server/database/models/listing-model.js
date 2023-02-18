const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema(
    {
        weight: Number,
        pricePerKilo: Number,
        destination: String,
        departureCountry: String,
        departureCity: String,
        arrivalCountry: String,
        arrivalCity: String,
        departureDate: String,
        arrivalDate: String,
        createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        toObject: {
            transform: (doc, ret, options) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

module.exports = mongoose.model('Listing', listingSchema)

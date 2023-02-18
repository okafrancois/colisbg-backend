const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        tel: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
        },
        listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
},
    {
        timestamps: true,
        toObject: {
            transform: (doc, ret, options) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

module.exports = mongoose.model('User', userSchema)

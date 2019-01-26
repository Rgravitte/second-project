const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealSchema = new Schema({
  isAccepted: {type: Boolean, default: false},
  offers: [{type: Schema.Types.ObjectId, ref: 'Offers'}]
})


const Deals = mongoose.model("Deals", dealSchema);


module.exports = Deals;
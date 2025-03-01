 const mongoose = require('mongoose');
 //Scheme Details
 const Schemes = new mongoose.Schema({
    name:        { type: String },
    Category:    { type: String },
    availabe:    { type: Boolean },
    title:       { type: String },
    link:        { type: String},
    Description: { type: String},
    id:          { type: Number, unique: true },
    Applicaion:  { type: String },
    start_date:  { type: String },
    end_date:    { type: String }

});

const Scheme = mongoose.model("schemes",Schemes);
module.exports = Scheme;
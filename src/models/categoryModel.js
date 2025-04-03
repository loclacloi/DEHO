const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema ( {

    name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true })


const category = mongoose.model("categories", categorySchema) ||  mongoose.model.categorySchema

module.exports = category
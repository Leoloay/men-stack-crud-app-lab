const mongoose = require("mongoose")

const quoteSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    isItMotivational: Boolean,
    quotee: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const Quote = mongoose.model("Quote", quoteSchema)

module.exports = Quote

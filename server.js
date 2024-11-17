const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const Quote = require("./models/quotes")

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

app.get("/", async (req, res) => {
  await res.render("index.ejs")
})

app.get("/quotes", async (req, res) => {
  const quotes = await Quote.find()
  res.render("quotesctrl/show.ejs", { quotes })
})

app.get("/quotes/new", (req, res) => {
  res.render("quotesctrl/new.ejs")
})

app.post("/quotes/new", async (req, res) => {
  try {
    if (req.body.isItMotivational === "on") {
      req.body.isItMotivational = true
    } else {
      req.body.isItMotivational = false
    }
    await Quote.create(req.body)
    res.redirect("/quotes")
  } catch (err) {
    console.log(err)
    res.redirect("/")
  }
})

app.get("/quotes/:_id", async (req, res) => {
  const foundQuote = await Quote.findById(req.params._id)
  res.render("quotesctrl/display.ejs", { quote: foundQuote })
})

app.delete("/quotes/:_id", async (req, res) => {
  await Quote.findByIdAndDelete(req.params._id)
  res.redirect("/quotes")
})

app.get("/quotes/:_id/edit", async (req, res) => {
  const foundQuote = await Quote.findById(req.params._id)
  res.render("quotesctrl/edit.ejs", { quote: foundQuote })
})

app.put("/quotes/:_id", async (req, res) => {
  req.body.isItMotivational = req.body.isItMotivational === "on"

  await Quote.findByIdAndUpdate(req.params._id, req.body)

  res.redirect(`/quotes/${req.params._id}`)
})

app.listen(3001, () => {
  console.log("Listening on port 3001")
})

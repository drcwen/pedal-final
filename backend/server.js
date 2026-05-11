const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")

const { authMiddleware } = require("./routes/authMiddleware")

const app = express()

app.use(cors({
  origin: "http://localhost:5173"
}))

app.use(express.json())

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Authorized",
    user: req.user
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
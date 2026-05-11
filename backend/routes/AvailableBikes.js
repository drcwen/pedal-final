const express = require("express")
const { supabase } = require("../services/supabase")
const { authenticateUser } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bikes")
      .select("*")
      .eq("is_available", true)

    if (error) {
      return res.status(400).json({
        error: error.message
      })
    }

    res.json({
      user: req.user.id,
      availableBikes: data
    })

  } catch (err) {
    res.status(500).json({
      error: "Server error"
    })
  }
})

module.exports = router
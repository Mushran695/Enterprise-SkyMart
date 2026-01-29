export const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  if (email !== "admin@gmail.com" || password !== "admin123") {
    return res.status(401).json({ success: false })
  }

  res.json({
    success: true,
    token: "ADMIN_TOKEN",
    user: { email, role: "admin" }
  })
}

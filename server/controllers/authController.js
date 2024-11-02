const bcrypt = require('bcryptjs');
const db = require('../db');

exports.register = async (req, res) => {
  const { fname, lname, phone, email, id, age, password } = req.body;
  try {
    
    const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const [existingId] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (existingId.length > 0) {
      return res.status(400).json({ message: "ID already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    await db.query(
      "INSERT INTO users (id, fname, lname, phone, email, age, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, fname, lname, phone, email, age, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists with the given email
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = existingUser[0];

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If successful, respond with success message
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
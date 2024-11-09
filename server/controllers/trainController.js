const db = require('../db');
const bcrypt = require('bcryptjs');

exports.searchTrains = async (req, res) => {
  const { date, sourceLoc, destination } = req.body;
  try {
    const query = `SELECT trainid, trainname, day, source_loc, destination, seats 
                   FROM trains 
                   WHERE (day = ? OR ? IS NULL) 
                   AND (source_loc = ? OR ? IS NULL) 
                   AND (destination = ? OR ? IS NULL)`;
    const [trains] = await db.query(query, [date, date, sourceLoc, sourceLoc, destination, destination]);
    
    if (trains.length === 0) {
      return res.status(404).json({ message: "No trains found for the given criteria." });
    }
    res.status(200).json({ trains });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.bookTrain = async (req, res) => {
  const { userId, trainId, seatsToBook, password } = req.body;
  const connection = await db.getConnection(); // Get a connection from the pool
  try {
    await connection.beginTransaction(); // Begin transaction

    const [users] = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const [trainData] = await connection.query("SELECT seats FROM trains WHERE trainid = ?", [trainId]);
    if (trainData.length === 0 || trainData[0].seats < seatsToBook) {
      await connection.rollback(); // Rollback if insufficient seats
      return res.status(400).json({ message: "Insufficient seats available" });
    }

    await connection.query("UPDATE trains SET seats = seats - ? WHERE trainid = ?", [seatsToBook, trainId]);
    await connection.query("INSERT INTO bookings (trainid, userid, no_of_seats) VALUES (?, ?, ?)", [trainId, userId, seatsToBook]);

    await connection.commit(); // Commit transaction
    res.status(200).json({ message: "Booking successful!" });
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    console.error("Error:", error);
    res.status(500).json({ message: "Booking failed" });
  } finally {
    connection.release(); // Always release the connection back to the pool
  }
};
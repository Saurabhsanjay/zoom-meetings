// Import database connection configuration
const db = require("../config/dbConnection");
const { ZOOM_API_KEY, ZOOM_API_SECRET } = process.env;

//import required modules
const axios=require('axios')
const jwt=require('jsonwebtoken')

// function for creating meetings
async function createMeeting(req, res) {
  const { title, time, duration, videoOn, audioOn } = req.body;



  try {
    // Convert datetime value to the expected format
    const formattedTime = new Date(time)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Generate Zoom JWT token for authentication
    const payload = {
      iss: ZOOM_API_KEY,
      exp: Date.now() + 3600,
    };
    const token = jwt.sign(payload, ZOOM_API_SECRET);

    // Make Zoom API request to create a new meeting
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: title,
        start_time: formattedTime, 
        duration: duration,
        settings: {
          host_video: videoOn,
          participant_video: videoOn,
          mute_upon_entry: audioOn,
          audio: audioOn,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Save meeting data to MySQL database
    const query = `INSERT INTO meetings (title, time, duration, videoOn, audioOn, joinUrl) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      title,
      formattedTime, 
      duration,
      videoOn,
      audioOn,
      response.data.join_url,
    ];
    await db.query(query, values);

    res.status(200).json({
      success: true,
      message: "Meeting created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create meeting.",
      error: error.message,
    });
  }
}



// function for retrieving all meetings
function getAllMeetings(req, res) {
  db.query("SELECT * FROM meetings", (err, rows) => {
    if (err) throw err;
    if (rows.length <= 0) {
      return res.status(404).send("No Meetings Found");
    }
    res.send(rows);
  });
}

module.exports = { createMeeting, getAllMeetings };

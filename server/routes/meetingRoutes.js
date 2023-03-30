//import necessary modules
const express = require("express");
const router = express.Router();
const zoomController =require('../controllers/zoomController')

//route for get all meetings list
router.get('/getall-meeetings',zoomController.getAllMeetings)


//route for create new meeting
router.post('/create-meeting',zoomController.createMeeting)

module.exports = router;

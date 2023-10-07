const express = require('express');
const router = express.Router();
// Import the Notes Models Here.
const notes = require('../models/Notes');
const fetchuser = require('../middlewares/fetchuser');
// MY EXPRESS VALIDATOR IMPORT
const { body } = require('express-validator');
const { query, validationResult } = require('express-validator');


// =====> Route-1: To Create a user.
router.post('/createnotes', fetchuser,[
    body('title', 'Please enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
] , async(req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Notes Creation 
        const { title, description, tag } = req.body;
        let note = new notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.send({ savedNote })
        // Notes Creation End
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({error: "Internal Server error"})
    }
})
// Route: 1 END

//=====> ROUTE: 2. To Find the user notes Fetch all the saved notes

router.get('/fetchnotes', fetchuser, async (req, res)=> {
    try {
        let note = await notes.find({ user: req.user.id });
        res.send({ note })
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({error: "Internal Server error"})
    }
})
// ====> ROUTE: 2 END

// ======> ROUTE: 3 To update the existing Note Data ===> Login required
router.put('/updatenote/:id', fetchuser, async(req, res)=> {
    const { title, description, tag } = req.body
    // Create a note Object
    const newNote = {};
    if(title){
        newNote.title = title
    }
    if(description){
        newNote.description = description
    }
    if(tag){
        newNote.tag = tag
    }

    // Find the note to be updated and update it.
    let note = await notes.findById(req.params.id);
    if(!note) {
        return res.status(404).send("Not Found");
    }
    if(note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.json({ note })
})
// ====> ROUTE: 3 END

// ======> ROUTE: 4 To Delete the existing Note ==>  Login required
router.delete('/deletenote/:id', fetchuser, async(req, res)=> {
    try {
        // Find the note to be delete and delete it.
        let note = await notes.findById(req.params.id);
        if(!note) {
            return res.status(404).send("Not Found");
        }
        // Allow deletion only if the user owns this note.
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
    
        note = await notes.findByIdAndDelete(req.params.id);
        res.json({"success": "Note has been Deleted", note: note})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// ====> ROUTE: 4 END

module.exports = router;
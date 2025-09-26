const express = require('express');
const router = express.Router();
const multer = require('multer');    //This library helps us to add the images,files and many more
const { getBucket } = require('../db/gridFS');
const { ObjectId } = require('mongodb');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), (req, res) => {

    const bucket = getBucket();
    
    if(!req.file)
      return res.status(400).json({ msg: "No file uploaded" });

    const stream = bucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
    });

    stream.end(req.file.buffer);

    stream.on('finish', () => {
    res.json({ fileId: stream.id, message: "File uploaded successfully" });
  });
});

router.get('/:id', (req, res) => {
  const bucket = getBucket();
  try {
    const id = new ObjectId(req.params.id);
    bucket.openDownloadStream(id)
      .on('error', err => res.status(404).json({ msg: 'File not found.' }))
      .pipe(res);
  } catch (error) {
    res.status(400).json({ msg: "Invalid ObjectId" });
  }
});


module.exports = router;


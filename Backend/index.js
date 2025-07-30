const express = require("express");
const multer = require("multer");
const cors = require("cors");
const docxToPDF = require("docx-pdf");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(cors());

// settting up the file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Helper to clean up old files
function cleanupDirectory(dirPath, maxFiles =10) {
    fs.readdir(dirPath, (err, files) => {
        if (err) return;
        if (files.length > maxFiles) {
            // Sort files by creation time (oldest first)
            files = files
                .map(file => ({
                    name: file,
                    time: fs.statSync(path.join(dirPath, file)).ctime.getTime()
                }))
                .sort((a, b) => a.time - b.time)
                .map(f => f.name);

            // Delete oldest files
            const filesToDelete = files.slice(0, files.length - maxFiles);
            filesToDelete.forEach(file => {
                fs.unlink(path.join(dirPath, file), () => {});
            });
        }
    });
}

app.post("/convertFile", upload.single("file"), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file  uploaded",
            });
        }
        // Defining outout file path
        let outoutPath = path.join(
            __dirname,
            "files",
            `${req.file.originalname}.pdf`
        );
        docxToPDF(req.file.path, outoutPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error converting docx to pdf",
                });
            }
            res.download(outoutPath, () => {
                console.log("file downloaded");
                // Clean up after download
                cleanupDirectory(path.join(__dirname, "uploads"));
                cleanupDirectory(path.join(__dirname, "files"));
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
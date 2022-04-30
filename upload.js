const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
    callback(null, 'public/uploads/')
 },
 filename: (req, file, callback) => {
    var filetype = file.mimetype;
    var fileformate = filetype.split("/")[1];
    callback(null, Date.now() + '.' + fileformate);
 }
});

let upload = multer({ storage: storage });

module.exports = upload;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
//Controller
var upload_1 = require("./routes/upload");
var download_1 = require("./routes/download");
var router = express_1.Router();
exports.router = router;
router.use('/upload', upload_1.uploadRouter);
router.use('/download', download_1.downloadRouter);

const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const rootDir = require('../helper').getRootDir();
const devicesService = require('./devices');

/* GET api/reports/ */
/* get reports' names array */
function getReportsList(cb) {
    const filesPath = path.join(rootDir, 'public', 'reports');
    const readableStream = fs.readdir(filesPath, cb); //fs.createWriteStream(path);
}

/* GET api/reports/:filename */
/* get report file */
function getReport(res, filename) {
    const reportName = filename + '.pdf';

    res.sendFile(path.join(rootDir, 'public', 'reports', reportName));
}

/* POST api/reports/ */
/* create report and send back new report .pdf file */
function createReport(res, devices, filename) {
    getReportsList((err, dirReportsNamesArr) => {
        console.log('here?');
        filename = generateUniqueFileName(filename, dirReportsNamesArr);
 
        console.log('filename');
        console.log(filename);
        //res.json({ filename });
       
        const filePath = path.join(rootDir, 'public', 'reports', filename);
 
        createReportFile(devices, filePath, () => {
            //res.sendFile(filePath);
            const message = 'Report "' + filename + '" has been successfully created';
            res.json({ message });
        });
    });
}
 
function generateUniqueFileName(filename, filenames) {
    let i = 2;
    let newFilename = filename;
    let isExistingFileName = checkExistingFileName(newFilename, filenames);
 
    while(isExistingFileName) {
        newFilename = filename + '_(' + i + ')';
        isExistingFileName = checkExistingFileName(newFilename, filenames);
        i++;
    }
 
    return newFilename + '.pdf';
}
 
function checkExistingFileName(filename, filenames) {
    if (filenames.indexOf(filename + '.pdf') === -1) {
        return false;
    } else {
        return true;
    }
}

/* DELETE api/reports/:filename */
/* delete report */
function deleteReport(filename, cb) {
    const reportName = filename + '.pdf';
    const filePath = path.join(rootDir, 'public', 'reports', reportName);

    //const deleteStream = 
    fs.rm(filePath, cb);

    //deleteStream.on('finish', cb)
}

/* create report file and then call a callback function */
function createReportFile(reportData, path, cb) {
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc);
	generateDevicesTable(doc, reportData);

	doc.end();
    const writeStream = fs.createWriteStream(path);
	doc.pipe(writeStream);
    writeStream.on('finish', cb);
}

/* generate header (title, author) of the future report */
function generateHeader(doc) {
    doc.fontSize(10)
       .text('Devices', 50, 57, { align: 'left' })
       .text('a.horovenko', 0, 57, { align: 'right' });
    

       //text(col6, 0, y, { align: 'right' })
    generateHr(doc, 70);
}

/* generate table */
function generateDevicesTable(doc, reportData) {
    let i,
		deviceTableTop = 100;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
		deviceTableTop,
        '#',
        'Brand',
        'Model',
        'Title',
        'IP',
        'Counters'
    );
    doc.font("Helvetica");
    generateHr(doc, deviceTableTop + 20);

	for (i = 0; i < reportData.length; i++) {
		const item = reportData[i];
		const position = deviceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
            i + 1,
			item.manufacturer.brand.title,
			item.manufacturer.model.title,
			item.title,
			item.ip,
			item.countersAll
		);
        generateHr(doc, position + 20);
	}
}

/* generate table row */
function generateTableRow(doc, y, col1, col2, col3, col4, col5, col6) {
	doc.fontSize(14)
	   .text(col1, 50, y)
	   .text(col2, 80, y)
       .text(col3, 150, y)
       .text(col4, 220, y, {width: 170})
	   .text(col5, 400, y)
	   .text(col6, 0, y, { align: 'right' });
}

/* generate horizontal line */
function generateHr(doc, y) {
    doc.strokeColor("#aaaaaa")
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(562, y)
       .stroke();
}

module.exports = {
    createReport,
    deleteReport,
    getReport,
    getReportsList
}
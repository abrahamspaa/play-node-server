const { readFile, existsSync, statSync } = require('fs');
const { parse: urlParse } = require('url');
const { createServer } = require('http');
const { join } = require('path');

const port = process.argv[2] || 2727;
const uiCodePath = '/frontend';

/**
 * 
 * @param {Object} response 
 * @param {String} message 
 */
const pageNotFound = (response, message = 'Page not found') => {
	response.writeHead(400, { 'Content-Type': 'text/plain' });
	response.write(message);
	response.end();
	return;
};

/**
 * 
 * @param {Object} response 
 * @param {string} message 
 */
const internalServerError = (response, message = 'Internal server error') => {
	response.writeHead(500, { 'Content-Type': 'text/plain' });
	response.write(message);
	response.end();
	return;
};

const successResponse = (response, data = {}) => {
	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.write(data);
	response.end();
	return;
};

createServer((request, response) => {
	// Getting the URL
	let fileName = join(`${process.cwd()}/${uiCodePath}`, urlParse(request.url).pathname);

	// Checking for the folder or file exists
	if(!existsSync(fileName)) {
		return pageNotFound(response);
	}

	if (statSync(fileName).isDirectory()) {
		fileName += '/index.html';
	}

	readFile(fileName, (error, data) => {
		return error ? internalServerError(response) : successResponse(response, data);
	});
	
}).listen(port);

console.log("Static file server running at\n  => http://localhost:%s/ \nCTRL + C to shutdown", port);
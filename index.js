const fs = require('fs');
const _ = require('lodash');
const trans = require('bitmap-transformations');

// Global Options
if (!options) {
  var options = {
    size: 2,
    startOfPixelData: 10,
    width: 18,
    height: 22,
    numOfColors: 46
  };
}

// Returns new bitmap given a bitmap and a transformation
var createNewFile = function(ogBitmap, transformation) {

  switch (transformation) {
    case 'grayscale':
      transformation = trans.grayscale;
      break;
    case 'sepia':
      transformation = trans.sepia;
      break;
  }

  var bitmapData = getBitMapData(ogBitmap);
  var transformedBitmap = transformation(bitmapData);
  var newFile = writeNewBitMap(ogBitmap, transformedBitmap);
  return newFile;
}

// Writes file to system given a bitmap and options
var writeFile = function(file, options) {
  var writeStream = fs.createWriteStream(options.fileToCreate);
  writeStream.write(file);
  writeStream.end();
}

// Returns raw bitmap color info
var getBitMapData = function(bitmap) {
  var toReturn = [];
  _.forEach(bitmap, function(data, index) {
    if (index > bitmap.readUInt32LE(options.startOfPixelData) - 1) {
      toReturn.push(data);
    }
  });
  return toReturn;
};

// Return a new bitmap with a given bitmaps meta data
var writeNewBitMap = function(bitmap, bitmapToWrite) {
  var newBitMap = bitmap;
  _.forEach(bitmapToWrite, function(el, index) {
    newBitMap[index + bitmap.readUInt32LE(options.startOfPixelData)] = el;
  })
  debugger;
  return newBitMap;
};

// Logs bitmap meta data
var readBitMapHeader = function(bitmap) {
  _.forEach(options, function(el, index) {
    var toLog = bitmap.readUInt32LE(el);
    console.log(index + ": " + toLog);
  });
};

module.exports = {
	writeNewBitMap: writeNewBitMap,
	readBitMapHeader: readBitMapHeader,
	getBitMapData: getBitMapData,
	writeFile: writeFile,
	createNewFile: createNewFile
};
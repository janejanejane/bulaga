'use strict';

var fs = require( 'fs' );
var fileLoc = './stream/image_stream';

var snapper = {
    picture: function( spawn, format, callback ) {
        var args = [ fileLoc + format + '.jpg' ];
	var process = spawn( 'fswebcam', args );
	process.on( 'close', function( data ) {
	    console.log( 'close code', data );
	    if ( data === 0 ) {
		return callback( null, 'created' );
	    } else {
		return callback( 'error creation' );
	    }
	});
    },
    upload: function( s3, params, callback ) {
	var self = this;
	console.log( 'inside upload to s3' );
	console.log( 'Params: ', params );
	s3.putObject( params, function( err, data ) {
	    if ( err ) {
		console.log( 'Error uploading: ', err );
		return callback( err );
	    } else {
		console.log( 'Successfully uploaded!', data );
		return callback( null, data );
	    }
	});
    },
    read: function( filename, callback ) {
	fs.readFile( fileLoc + filename + '.jpg', function( err, data ) {
	    if ( err ) {
		console.log( 'Error reading: ', err );
		return callback( err );
	    }
	    console.log( 'Successfully read!' );
	    return callback( null, data );
	});
    },
    delete: function( filename, callback ) {
	fs.unlink( fileLoc + filename + '.jpg', function( err ) {
	    if ( err ) {
	        console.log( 'Error deleting: ', err );
		return callback( err );
	    }
	    console.log( 'Successfully deleted!' );
	    return callback( null, 'done' );
	});
    }
};

module.exports = snapper;

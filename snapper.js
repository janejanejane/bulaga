'use strict';

var fs = require( 'fs' );
var fileLoc = './stream/image_stream';

var snapper = {
    picture: function( spawn, format ) {
        var args = [ fileLoc + format + '.jpg' ];
	var process = spawn( 'fswebcam', args );
	process.on( 'close', function( data ) {
	    console.log( 'close code', data );
	});
    },
    upload: function( s3, params ) {
	var self = this;
	console.log( 'upload to s3' );
	s3.getSignedUrl( 'putObject', params, function( err, data ) {
	    if ( err ) {
		console.log( 'Error uploading: ', err );
	    } else {
		console.log( 'Successfully uploaded!' );
		self.delete( params.Key );
	    }
	});
    },
    delete: function( file ) {
	fs.unlink( fileLoc + file + '.jpg', function( err ) {
	    if ( err ) {
	        console.log( 'Error deleting: ', err );
	    }
	    console.log( 'Successfully deleted!' );
	});
    }
};

module.exports = snapper;

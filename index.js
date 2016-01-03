'use strict';
require( 'dotenv' ).load();

var spawn = require( 'child_process' ).spawn;
var moment = require( 'moment' );
var async = require( 'async' );
var aws = require( 'aws-sdk' );

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var snapper = require( './snapper' );
aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: 'ap-northeast-1'
});
var s3 = new aws.S3();
var params = {
    Bucket: S3_BUCKET,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
};

// call spawn of child_process to execute snapshot command
setInterval( function() {
    var filename = moment().format();
    var location = filename.split( 'T' );
    params.Key = location[ 0 ] + '/' + location[ 1 ];

    async.waterfall([
	function takeSnapshot( callback ) {
	    snapper.picture( spawn, filename, function( err, data ) {
		if ( err ) {
		    return callback( err );
		}
		callback( null, data );
	    });
	},
	function readSavedSnapshot( status, callback ) {
	    if ( status === 'created' ) {
		snapper.read( filename, function( err, data ) {
		    if ( err ) {
		        return callback( err );
		    }
		    callback( null, data );	    
		});
	    } else {
		return callback( status );
	    }
	},
	function uploadSnapshotToS3( buffer, callback ) {
	    params.Body = buffer;
    	    snapper.upload( s3, params, function( err, data ) {
	        if ( err ) {
		    return callback( err );
		}
		callback( null, data );
	    });
	},
	function deleteLocalSnapshot( uploadObj, callback ) {
	    snapper.delete( filename, function( err, data ) {
		if( err ) {
		    return callback( err );
		}
		callback( null, 'done' );
	    });
	}
    ], function ( err, result ) {
	if ( err ) {
	    console.log( 'waterfall error: ', err );
	} else {
	    console.log( 'waterfall result: ', result );
	}
    });

    console.log( 'inside interval' );
}, 1000);


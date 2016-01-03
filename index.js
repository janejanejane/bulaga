'use strict';
require( 'dotenv' ).load();

var spawn = require( 'child_process' ).spawn;
var moment = require( 'moment' );
var aws = require( 'aws-sdk' );

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var snapper = require( './snapper' );
aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
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
    snapper.picture( spawn, filename );
    params.Key = filename;
    snapper.upload( s3, params );
    console.log( 'inside interval' );
}, 1000 );


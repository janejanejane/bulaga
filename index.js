'use strict';

var spawn = require( 'child_process' ).spawn;
var moment = require( 'moment' );
var process;

var snapper = require( './snapper' );

snapper.picture( spawn, process, moment().format() );

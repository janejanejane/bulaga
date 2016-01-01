'use strict';

var snapper = {
    picture: function( spawn, process, format ) {
        var args = [ './stream/image_stream' + format + '.jpg' ];
        process = spawn( 'fswebcam', args );
    }
};

module.exports = snapper;

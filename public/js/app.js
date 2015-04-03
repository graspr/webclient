require.config({
    baseUrl: 'js/',
    paths: {
        // the left side is the module ID,
        // the right side is the path to the file
        jquery: 'lib/jquery-1.11.1',
        socketio: 'lib/socket.io-1.2.0',
        three: 'lib/three.min',
        datgui: 'lib/dat.gui.min',
        orbitcontrols: 'lib/orbitcontrols',
        stats: 'lib/stats'
    },
    shim: {
    	three: {
    		exports: 'THREE'
    	},
    	orbitcontrols: {
    		deps: ['three']
    	},
    	datgui: {
    		deps: ['three'],
    		exports: 'dat'
    	},
    	stats: {
    		deps: ['three'],
    		exports: 'Stats'
    	}
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['main']);
define([
	'three',
	'datgui',
	'dataprovider',
	'stats',
	'orbitcontrols'
], function (THREE, dat, dataprovider, Stats) {
	'use strict';

	var camera, scene, renderer, controls;
	var mesh_main, mesh_seg1, mesh_seg2, mesh_seg3;
	var values_main, seg1State, seg2State, seg3State;
	var _stats;

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var MAX_ANGLE = 1 * Math.PI;

	var PalmState = function () {
		this.xrot = Math.PI;
		this.yrot = 0.0;
		this.jointAngle = 0.0;
		this.x = 400.0;
		this.y = 0.0;
		this.z = 0.0;
	};

	var JointState = function () {
		this.xrot = 0.0;
		this.yrot = 0.0;
		this.jointAngle = 0.0;
		this.x = 400.0;
		this.y = 0.0;
		this.z = 0.0;
		this.minVal = 0;
		this.maxVal = 65535;
	};



	init();
	animate();

	function init_state() {
		values_main = new PalmState();
		seg1State = new JointState();
		seg2State = new JointState();
		seg3State = new JointState();
	}

	function init_gui() {

		function createJointGUI(segment, number) {
			var jointGUI = gui.addFolder('Finger Joint ' + number);
			// jointGUI.add( segment, "xrot", 0.0, MAX_ANGLE, 0.001 );
			// jointGUI.add( segment, "x", 0.0, 600.0, 0.001 );

			jointGUI.add(segment, "jointAngle", -(Math.PI/4), MAX_ANGLE, 0.001 ).listen();
			jointGUI.add(segment, "minVal", 0, 65535, 1);
			jointGUI.add(segment, "maxVal", 0, 65535, 1);


			// jointGUI.open();
		}

		function createPalmGUI() {
			var palmGui = gui.addFolder('Palm');
			// palmGui.add( values_main, "xrot", 0.0, MAX_ANGLE, 0.001 );
			palmGui.add( values_main, "jointAngle", 0.0, MAX_ANGLE, 0.001 );
			// palmGui.add( values_main, "x", 0.0, 600.0, 0.001 );
			// palmGui.open();
		}

		var gui = new dat.GUI();

		createPalmGUI();
		createJointGUI(seg1State, 1);
		createJointGUI(seg2State, 2);
		createJointGUI(seg3State, 3);
	}

	function init_stats() {
		_stats = new Stats();
		_stats.setMode(0); // 0: fps, 1: ms
		// align top-left
		_stats.domElement.style.position = 'absolute';
		_stats.domElement.style.left = '0px';
		_stats.domElement.style.top = '0px';
		document.body.appendChild( _stats.domElement );
	}

	function init_renderer() {
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
	}

	function init_camera() {
		camera = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 10000);
		camera.position.z = 715;
		// camera.position.x = 1300;
		// camera.position.y = 16;

		controls = new THREE.OrbitControls( camera );
		controls.damping = 0.2;
		controls.noRotate = true;
		controls.panLeft(-1300);	
		controls.addEventListener( 'change', render );
	}

	function init_scene() {
		scene = new THREE.Scene();

		var geometry = new THREE.BoxGeometry( 400, 100, 100 );
		// var geometry = new THREE.CylinderGeometry( 50, 50, 400, 32 );
		var texture = THREE.ImageUtils.loadTexture( 'js/crate.gif' );
		texture.anisotropy = renderer.getMaxAnisotropy();
		var material = new THREE.MeshBasicMaterial( { map: texture } );

		mesh_main = new THREE.Mesh( geometry, material );

		mesh_seg1 = new THREE.Mesh( geometry, material );
		mesh_seg2 = new THREE.Mesh( geometry, material );
		mesh_seg3 = new THREE.Mesh( geometry, material );

		scene.add( mesh_main );
		mesh_main.add( mesh_seg1 );
		mesh_seg1.add( mesh_seg2 );
		mesh_seg2.add( mesh_seg3 );

		mesh_main.rotation.z = Math.PI/4;
	    var center = mesh_main.position;
	    mesh_main.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -(center.x-200), -center.y, -center.z ) );
	}

	function init() {
		init_state();
		init_gui();
		init_stats();
		init_renderer();
		init_camera();
		init_scene();

		window.addEventListener( 'resize', onWindowResize, false );
	}

	function scaleAngle(input) {
		return (input/65535) * MAX_ANGLE;
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function render() {
		renderer.render( scene, camera );
		// _stats.update();
	}

	function updatePoseFromData() {
		mesh_seg1.rotation.z = scaleAngle(dataprovider.data[7]);
		seg1State.jointAngle = scaleAngle(dataprovider.data[7]); //updates dat.gui

		mesh_seg2.rotation.z = scaleAngle(dataprovider.data[11]);
		seg2State.jointAngle = scaleAngle(dataprovider.data[11]); //updates dat.gui

		mesh_seg3.rotation.z = scaleAngle(dataprovider.data[15]);
		seg3State.jointAngle = scaleAngle(dataprovider.data[15]); //updates dat.gui
	}

	function updatePoseFromGUI() {

		mesh_main.rotation.x = values_main.xrot;
		mesh_main.rotation.y = values_main.yrot;
		mesh_main.rotation.z = values_main.jointAngle;
		mesh_main.position.x = values_main.x;
		mesh_main.position.y = values_main.y;
		mesh_main.position.z = values_main.z;

		mesh_seg1.rotation.x = seg1State.xrot;
		mesh_seg1.rotation.y = seg1State.yrot;
		// mesh_seg1.rotation.z = seg1State.jointAngle;
		mesh_seg1.position.x = seg1State.x;
		mesh_seg1.position.y = seg1State.y;
		mesh_seg1.position.z = seg1State.z;

		mesh_seg2.rotation.x = seg2State.xrot;
		mesh_seg2.rotation.y = seg2State.yrot;
		// mesh_seg2.rotation.z = seg2State.jointAngle;
		mesh_seg2.position.x = seg2State.x;
		mesh_seg2.position.y = seg2State.y;
		mesh_seg2.position.z = seg2State.z;

		mesh_seg3.rotation.x = seg3State.xrot;
		mesh_seg3.rotation.y = seg3State.yrot;
		// mesh_seg3.rotation.z = seg3State.jointAngle;
		mesh_seg3.position.x = seg3State.x;
		mesh_seg3.position.y = seg3State.y;
		mesh_seg3.position.z = seg3State.z;
	}

	function animate() {

		requestAnimationFrame( animate );
		_stats.begin();
		controls.update();

		updatePoseFromGUI();
		updatePoseFromData();

		renderer.render( scene, camera );
		_stats.end();

	}

});

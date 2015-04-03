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
	var values_main, values_seg1, values_seg2, values_seg3, values_scalar;
	var _stats;

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var MAX_ANGLE = 1 * Math.PI;


	init();
	animate();


	function init_gui() {

		var gui = new dat.GUI();

		var MainEffector = function () {
			this.xrot = Math.PI;
			this.yrot = 0.0;
			this.jointAngle = 0.0;
			this.x = 400.0;
			this.y = 0.0;
			this.z = 0.0;
		};

		var Seg1Effector = function () {
			this.xrot = 0.0;
			this.yrot = 0.0;
			this.jointAngle = 0.0;
			this.x = 400.0;
			this.y = 0.0;
			this.z = 0.0;
		};

		var Seg2Effector = function () {
			this.xrot = 0.0;
			this.yrot = 0.0;
			this.jointAngle = 0.0;
			this.x = 400.0;
			this.y = 0.0;
			this.z = 0.0;
		};

		var Seg3Effector = function () {
			this.xrot = 0.0;
			this.yrot = 0.0;
			this.jointAngle = 0.0;
			this.x = 400.0;
			this.y = 0.0;
			this.z = 0.0;
		};

		var ScalarEffector = function () {
			this.xscale = 1.0;
		};

		values_main = new MainEffector();
		values_seg1 = new Seg1Effector();
		values_seg2 = new Seg2Effector();
		values_seg3 = new Seg3Effector();
		values_scalar = new ScalarEffector();


		var palmGui = gui.addFolder('Palm');
		// palmGui.add( values_scalar, "xscale", 0.0, 1.0, 0.001);
		palmGui.add( values_main, "xrot", 0.0, MAX_ANGLE, 0.001 );
		palmGui.add( values_main, "jointAngle", 0.0, MAX_ANGLE, 0.001 );
		// palmGui.add( values_main, "x", 0.0, 600.0, 0.001 );
		palmGui.open();

		var jointOneGui = gui.addFolder('Finger Joint 1');
		// jointOneGui.add( values_seg1, "xrot", 0.0, MAX_ANGLE, 0.001 );
		jointOneGui.add( values_seg1, "jointAngle", -(Math.PI/4), MAX_ANGLE, 0.001 ).listen();
		// jointOneGui.add( values_seg1, "x", 0.0, 600.0, 0.001 );
		jointOneGui.open();

		var jointTwoGui = gui.addFolder('Finger Joint 2');
		// jointTwoGui.add( values_seg2, "xrot", 0.0, MAX_ANGLE, 0.001 );
		jointTwoGui.add( values_seg2, "jointAngle", 0.0, MAX_ANGLE, 0.001 );
		// jointTwoGui.add( values_seg2, "x", 0.0, 600.0, 0.001 );
		jointTwoGui.open();

		var jointThreeGui = gui.addFolder('Finger Joint 3');
		// jointThreeGui.add( values_seg3, "xrot", 0.0, MAX_ANGLE, 0.001 );
		jointThreeGui.add( values_seg3, "jointAngle", 0.0, MAX_ANGLE, 0.001 );
		// jointThreeGui.add( values_seg3, "x", 0.0, 600.0, 0.001 );
		jointThreeGui.open();
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

	function animate() {

		requestAnimationFrame( animate );
		_stats.begin();
		controls.update();
		// console.log('Mesh Rotation', mesh.rotation);
		// console.log('camera.position', camera.position);
		// mesh.rotation.x += 0.005;
		// mesh.rotation.y += 0.01;

		mesh_main.rotation.x = values_main.xrot;
		mesh_main.rotation.y = values_main.yrot;
		mesh_main.rotation.z = values_main.jointAngle;
		mesh_main.position.x = values_main.x;
		mesh_main.position.y = values_main.y;
		mesh_main.position.z = values_main.z;

		mesh_seg1.rotation.x = values_seg1.xrot;
		mesh_seg1.rotation.y = values_seg1.yrot;
		mesh_seg1.rotation.z = values_seg1.jointAngle;
		mesh_seg1.position.x = values_seg1.x;
		mesh_seg1.position.y = values_seg1.y;
		mesh_seg1.position.z = values_seg1.z;

		// mesh_seg1.rotation.z = scaleAngle(dataprovider.data[0]);
		// values_seg1.jointAngle = scaleAngle(dataprovider.data[0]); //updates dat.gui



		mesh_seg2.rotation.x = values_seg2.xrot;
		mesh_seg2.rotation.y = values_seg2.yrot;
		mesh_seg2.rotation.z = values_seg2.jointAngle;
		mesh_seg2.position.x = values_seg2.x;
		mesh_seg2.position.y = values_seg2.y;
		mesh_seg2.position.z = values_seg2.z;

		mesh_seg3.rotation.x = values_seg3.xrot;
		mesh_seg3.rotation.y = values_seg3.yrot;
		mesh_seg3.rotation.z = values_seg3.jointAngle;
		mesh_seg3.position.x = values_seg3.x;
		mesh_seg3.position.y = values_seg3.y;
		mesh_seg3.position.z = values_seg3.z;

		renderer.render( scene, camera );
		_stats.end();

	}

});

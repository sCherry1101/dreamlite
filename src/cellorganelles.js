import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// the DIV from the page

var container = document.getElementById( 'nucleus_dia' );


// a scene

var scene = new THREE.Scene();
    scene.background = new THREE.Color( 'gainsboro' );


// camera that uses the container's size

var camera = new THREE.PerspectiveCamera( 30, container.clientWidth/ container.clientHeight );
    camera.position.set( 2, 5, 10 );
    camera.lookAt( scene.position );


// renderer that uses the container's size and is inserted in it

var renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( container.clientWidth-16, container.clientHeight-16 );
    renderer.setAnimationLoop( animationLoop );
    container.appendChild( renderer.domElement );


// various stuff, not interesting

var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;

var ambientLight = new THREE.AmbientLight( 'white', 0.5 );
    scene.add( ambientLight );

var light = new THREE.DirectionalLight( 'white', 0.5 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

var cube = new THREE.Mesh(
			new THREE.BoxGeometry( 1, 1, 1 ),
    	new THREE.MeshPhongMaterial( {color:'tan', shininess: 10} )
    );	
		scene.add( cube );

scene.add( new THREE.AxesHelper(2) );


function animationLoop( t )
{
    cube.rotation.x = Math.sin( t/700 );
    cube.rotation.y = Math.sin( t/900 );

    controls.update( );
		light.position.copy( camera.position );
    renderer.render( scene, camera );
}

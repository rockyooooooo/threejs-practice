import * as THREE from "three"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

let mixer
const clock = new THREE.Clock()

const renderer = new THREE.WebGLRenderer({ antialias: true })
// renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 15)
camera.lookAt(0, 0, 0)

// This makes the model looks better, don't know why yet
const pmremGenerator = new THREE.PMREMGenerator( renderer )
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfe3dd)
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

// Lights
// const pointLight = new THREE.PointLight(0xffffff, 1)
// pointLight.position.set(3, 3, 3)
// const ambientLight = new THREE.AmbientLight(0xffffff, 10)
// scene.add(pointLight, ambientLight)
// const lightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(lightHelper)

// Allow  using mouse to control the camera 
const controls = new OrbitControls(camera, renderer.domElement)
// controls.target.set( 0, 0.5, 0 );
// controls.update();
controls.enablePan = false;
controls.enableDamping = true; // This makes the oribit control smooother

// Decode the compressed meshes data
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' )

const loader = new GLTFLoader();
// loader.setDRACOLoader( dracoLoader )
loader.load('../models/porsche-911/scene.gltf', function (gltf) {
	const model = gltf.scene
	model.position.set(5, -1.1, 0)
	scene.add(model)

	animate()

	console.log('3D model loaded.')
}, undefined, function (error) {
	console.error(error)
});
loader.load('../models/sketchfab_3d_editor_challenge_littlest_tokyo/scene.gltf', function (gltf) {
	const model = gltf.scene
	model.position.set(1, 1, 0)
	model.scale.set(0.01, 0.01, 0.01)
	scene.add(model)

	// If the model has animation, need to do this
	mixer = new THREE.AnimationMixer( model )
	mixer.clipAction( gltf.animations[ 0 ] ).play()

	animate()

	console.log('3D model loaded.')
}, undefined, function (error) {
	console.error(error)
});

function animate () {
	// Invoke `animate` continuously
	requestAnimationFrame(animate)
	controls.update()
	const delta = clock.getDelta()
	// Update the model animation
	mixer.update(delta)
	renderer.render(scene, camera)
}


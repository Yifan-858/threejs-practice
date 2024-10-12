import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

import "./style.css";
import * as THREE from "three";

//initialize the scene
const scene = new THREE.Scene();

let randomMesh;
let rotatingMeshes = [];

//add material
const textureLoader = new THREE.TextureLoader();
const colorTest = textureLoader.load("material/texture-map/Clay-color-map.jpg");
const roughnessTest = textureLoader.load(
  "material/texture-map/Clay-roughness-map.jpg"
);
const displaymentTest = textureLoader.load(
  "material/texture-map/Clay-displayment-map.jpg"
);

const cubeMaterial = new THREE.MeshPhysicalMaterial();
cubeMaterial.color = new THREE.Color(0xef5930);
cubeMaterial.clearcoat = 1;

const faceMaterial = new THREE.MeshPhysicalMaterial();
faceMaterial.color = new THREE.Color(0x000);
faceMaterial.clearcoat = 1;

const testMaterial = new THREE.MeshPhysicalMaterial();
testMaterial.map = colorTest;
testMaterial.roughnessMap = roughnessTest;
testMaterial.displacementMap = displaymentTest;
testMaterial.displacementScale = 0.3;

//add head geometry
const sphereGeometry = new THREE.SphereGeometry(0.6, 40, 40);
const sphereMesh = new THREE.Mesh(sphereGeometry, testMaterial);

const emojiGeometry = new THREE.SphereGeometry(0.3, 40, 40);
let sphereMesh2 = new THREE.Mesh(emojiGeometry, faceMaterial);

sphereMesh2.position.z = 0.8;

const loader = new GLTFLoader();
loader.load("clay.glb", function (glb) {
  console.log(glb);
  const model = glb.scene;
  scene.add(model);
  model.position.set(0, 0, 0);
});

//add emoji to face
sphereMesh.add(sphereMesh2);
// scene.add(sphereMesh);

//add random geo to scene
const plusButton = document.querySelector("#plus-button");
const inputText = document.querySelector("#input-text");

const addRandomMesh = () => {
  const randomMeshArr = [
    new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
      cubeMaterial
    ),
    new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 25), cubeMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 20), cubeMaterial),
  ];
  const i = Math.floor(Math.random() * 3);
  randomMesh = randomMeshArr[i];
  scene.add(randomMesh);

  rotatingMeshes.push(randomMesh);
  console.log(rotatingMeshes);
};

const handleClick = () => {
  if (inputText.value.trim() === "") {
    inputText.classList.add("error");
    setTimeout(() => {
      inputText.classList.remove("error");
    }, 1000);
    return;
  }

  inputText.value = "";
  addRandomMesh();
};

plusButton.addEventListener("click", handleClick);

scene.background = new THREE.Color(0xeee1d4);

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 5, 1);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  4000
);

camera.position.z = 15;

//get html element
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

//make the image smooth
const maxPixelRatico = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxPixelRatico);

//add control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; //call .update () in render loop

//initiate render size
renderer.setSize(window.innerWidth, window.innerHeight);

//window event, spare the resizing being called every frame
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); //needed for the para update for camera
  renderer.setSize(window.innerWidth, window.innerHeight); //update
});

const renderloop = () => {
  rotatingMeshes.forEach((mesh, index) => {
    mesh.rotation.y += 0.01;

    mesh.position.x = Math.sin(mesh.rotation.y) * (2 + index);
    mesh.position.z = Math.cos(mesh.rotation.y) * (2 + index);
  });

  if (rotatingMeshes.length >= 2) {
    faceMaterial.color.set(0x456456);
  }

  controls.update(); // for controls.enableDamping
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();

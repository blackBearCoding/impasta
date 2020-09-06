import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import './DrawingState.css';

export default function DrawingState(props) {
  const canvasContainer = useRef();

  useEffect(() => {
    const width = canvasContainer.current.offsetWidth;
    const height = canvasContainer.current.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height, false);
    canvasContainer.current.appendChild(renderer.domElement);

    const geometry = new THREE.CylinderGeometry(2, 2, 0.1, 100); //new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const plate = new THREE.Mesh(geometry, material);
    plate.rotation.x = Math.PI / 2;
    scene.add(plate);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.z = -0.55;
    scene.add(cube);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(200, 400, -300);
    scene.add(spotLight);

    camera.position.z = -5;
    camera.rotation.x = -Math.PI; 

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  });

  return (
    <div className="drawing-state-container">
      <span>It's your turn!</span>
      <div className="drawing-state-canvas" ref={canvasContainer}></div>
      <button onClick={props.handleDrawingSubmit}>Submit</button>
    </div>
  );
}

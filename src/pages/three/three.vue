<template>
  <div class="three" ref="three"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import Vue from "vue";
export default Vue.extend({
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    let t=this.$refs.three as any
    t.append(renderer.domElement)
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
    },
  },
});
</script>
<style lang="scss" scoped>
.three {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}
</style>

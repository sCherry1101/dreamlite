<script>
  import * as THREE from "three";
  import { onMount, setContext } from "svelte";

  let { children } = $props();

  let canvas;
  let container = $state({ width: 0, height: 0 });
  let context   = $state({ scene: null, camera: null, renderer: null });

  setContext("three", {
    get camera() {
      context.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
      context.camera.position.set(5, 5, 10);
      return context.camera;
    },
    get renderer() {
      context.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas
      })
      context.renderer.setSize(1, 1);
      return context.renderer
    },
    get scene() {
      context.scene = new THREE.Scene()
      context.scene.background = new THREE.Color(0x0a0e17);
      return context.scene
    }
  });

  $effect(() => {
    if (context.renderer && context.camera) {
      context.camera.aspect = container.width / container.height;
      context.camera.updateProjectionMatrix();
      context.renderer.setSize(container.width - 16, container.height - 16);
    }
  });
</script>

<div bind:clientWidth={container.width} bind:clientHeight={container.height} class="w-full h-screen min-h-[500px]">
  <canvas bind:this={canvas}>
    <p>Canvas is not supported!</p>
  </canvas>
  {@render children()}
</div>

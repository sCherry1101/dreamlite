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
      context.camera.position.set(4, 4, 8);
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
      context.scene.background = new THREE.Color(0x010103);
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

<div bind:clientWidth={container.width} bind:clientHeight={container.height} w-full h-screen>
  <canvas bind:this={canvas}>
    <p>Canvas is not supported!</p>
  </canvas>
  {@render children()}
</div>

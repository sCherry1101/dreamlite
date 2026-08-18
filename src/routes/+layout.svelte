<script>
  import "$asset/stylesheet/global.css"
  import "$asset/stylesheet/layout.css"

  import "$lib/themes/default.css"
  import "$lib/themes/light.css"
  import "$lib/themes/stardust.css"

  import Navbar from "$component/Navbar"

  let { children } = $props()
</script>

<Navbar />

<div class="page">
  <main class="page__content" w-screen-2xl>
    {@render children()}
  </main>
</div>
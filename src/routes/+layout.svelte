<script>
	import 'uno.css'
	import "$asset/stylesheet/global.css"

	import Navbar from "$component/Navbar"

	let { children } = $props();
</script>

<Navbar/>
<div class="page">
  <main class="page__content" w-screen-2xl>
    {@render children()}
  </main>
</div>

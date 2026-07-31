<script>
  import { getContext } from 'svelte'
  import '/src/lib/assets/stylesheet/global.css'

  let { key, children } = $props()
  let { current } = getContext('tabs_active')
</script>

{#if current == key}
  {@render children?.()}
{/if}

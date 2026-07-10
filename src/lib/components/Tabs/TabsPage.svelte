<script>
  import { getContext } from 'svelte'
  import './styling.css'

  let { key, children } = $props()
  let { current } = getContext('tabs_active')
</script>

{#if current == key}
  {@render children?.()}
{/if}

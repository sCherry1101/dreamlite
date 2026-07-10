<script>
  import { setContext } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  let { sections, children, active = $bindable() } = $props();
  setContext('tabs_active', {
    get current() { return active }
  })
</script>

<div class="tabs">
  <ol class="tabs__tablist" role="tablist">
    {#each Object.entries(sections) as [id, title]}
      <button class="tabs__tab"
        role="tab"
        aria-selected={active === id}
        class:active={active === id}
        onclick={() => active = id}
      >
        {title}
      </button>
    {/each}
  </ol>
  <div class="tabs__tabpanel" role="tabpanel">
    {#key active}
      {@render children?.()}
    {/key}
  </div>
</div>

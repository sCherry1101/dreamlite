<script>
  import { setContext } from 'svelte'
  import Button from '../Button'

  let { sections, children, active = $bindable() } = $props();
  setContext('tabs_active', {
    get current() { return active }
  })
</script>

<div class="tabs">
  <ol class="tabs__tablist" role="tablist">
    {#each Object.entries(sections) as [id, title]}
      <li class="tabs__tab-item">
        <Button
          variant={active === id ? 'primary' : 'ghost'}
          size="sm"
          onclick={() => active = id}
          aria-selected={active === id}
          role="tab"
          class={active === id ? 'tabs__tab--active' : ''}
        >
          {title}
        </Button>
      </li>
    {/each}
  </ol>
  <div class="tabs__tabpanel" role="tabpanel">
    {#key active}
      {@render children?.()}
    {/key}
  </div>
</div>

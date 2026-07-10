<script>
  import './styling.css'
  import elements from "$lib/data/elements.json"
  import ElementCard from './ElementCard.svelte'

  let active = $state('H');
  let elementInfo = $derived(elements[active])

  const periodics = ([i, e]) => !((e.atomic_number > 57 && e.atomic_number <= 71) || (e.atomic_number > 89 && e.atomic_number <= 103)) && i != "$schema"
  const nonperiodics = ([_, e]) => (e.atomic_number >= 57 && e.atomic_number <= 71) || (e.atomic_number >= 89 && e.atomic_number <= 103)
</script>

<div class="element-display">
  <div>
    <ElementCard element={elementInfo} onclick />
    <p>Atomic Mass: {elementInfo.atomic_mass}</p>
  </div>
</div>
<div class="periodic-table">
  <div class="periodic-table__list" grid="cols-18" max-w-8xl>
    {#each Object.entries(elements).filter(periodics) as [id, element]}
      <div style:grid-column={element.group} style:grid-row={element.period}>
        {#if element.atomic_number == 57 || element.atomic_number == 89}
          <ElementCard
            element={{
              name: `${element.atomic_number}-${element.atomic_number + 14}`,
              period: element.period,
              group: element.group
            }}
            disabled={true}
          />
        {:else}
          <ElementCard {element} onclick={() => active = id} />
        {/if}
      </div>
    {/each}
  </div>
  <div class="periodic-table__list" grid="cols-15" max-w-7xl>
    {#each Object.entries(elements).filter(nonperiodics) as [id, element]}
      <div style:grid-row={element.period}>
        <ElementCard {element} onclick={() => active = id} />
      </div>
    {/each}
  </div>
</div>

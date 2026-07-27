<script>
  import './styling.css'
  import Arch from './arch'
  import Tabs from '$component/Tabs'
  import InfoCard from '$lib/data/arch.json'

  const views = {
    oldArch: "Ancient Architecture",
    modernArch: "Modern Architecture"
  }
  let active = $state('oldArch')
  let info = $derived(InfoCard[active]);
</script>

<section class="arch" md="block" lg="flex">
  <article class="arch_view">
    <Tabs.Root sections={views} bind:active={active}>
      <Arch.Canvas>
        <Tabs.Page key="oldArch"><Arch.Old/></Tabs.Page>
        <Tabs.Page key="modernArch"><Arch.Mod/></Tabs.Page>
      </Arch.Canvas>
    </Tabs.Root>
  </article>
  <aside class="arch__info">
    <h1 class="arch__title">{info.title}</h1>
    <p class="arch__description">{info.function}</p>
    <ul class="arch__list">
      {#each info.facts as fact}
        <li>{fact}</li>
      {/each}
    </ul>
  </aside>
</section>

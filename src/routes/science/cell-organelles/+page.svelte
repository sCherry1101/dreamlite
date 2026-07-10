<script>
  import './styling.css'

  import Organelle from './Canvas'
  import Tabs from '$component/Tabs'
  import InfoCard from '$lib/data/organelles.json'

  const views = {
    ac: "Animal Cell",
    nu: "Nucleus",
    mi: "Mitochondria",
    er: "Endoplasmic Reticulum",
    ga: "Golgi Apparatus",
    ly: "Lysosomes",
    pc: "Plant Cell",
    va: "Vacuoles",
  }
  let active = $state('ac')
  let info = $derived(InfoCard[active]);
</script>

<section class="organelles" md="block" lg="flex">
  <article class="organelles__view">
    <Tabs.Root sections={views} bind:active={active}>
      <Organelle.Canvas>
        <Tabs.Page key="ac"><Organelle.AnimalCell/></Tabs.Page>
        <Tabs.Page key="nu"><Organelle.Nucleus/></Tabs.Page>
        <Tabs.Page key="mi"><Organelle.Mitochondria/></Tabs.Page>
        <Tabs.Page key="er"><Organelle.EndoplasmicReticulum/></Tabs.Page>
        <Tabs.Page key="ga"><Organelle.Golgi/></Tabs.Page>
        <Tabs.Page key="ly"><Organelle.Lysosomes/></Tabs.Page>
        <Tabs.Page key="pc"><Organelle.PlantCell/></Tabs.Page>
        <Tabs.Page key="va"><Organelle.Vacuoles/></Tabs.Page>
      </Organelle.Canvas>
    </Tabs.Root>
  </article>
  <aside class="organelles__info">
    <h1 class="organelles__title">{info.title}</h1>
    <p class="organelles__description">{info.function}</p>
    <ul class="organelles__list">
      {#each info.facts as fact}
        <li>{fact}</li>
      {/each}
    </ul>
  </aside>
</section>

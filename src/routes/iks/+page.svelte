<script>
  import './styling.css'
  import Organelle from './Canvas'
  import Tabs from '$component/Tabs'

  const views = {
     oldArch: "old_arch",
     modernArch: "mod_arch"
  }
  let active = $state('ac')
  let info = $derived(InfoCard[active]);
</script>

<section class="arch" md="block" lg="flex">
  <article class="arch_view">
    <Tabs.Root sections={views} bind:active={active}>
      <Arch.Canvas>
        <Tabs.Page key="oldArch"><Arch.Old/></Tabs.Page>
        <Tabs.Page key="mod_Arch"><Arch.Mod/></Tabs.Page>
      </Arch.Canvas>
    </Tabs.Root>
  </article>
</section>

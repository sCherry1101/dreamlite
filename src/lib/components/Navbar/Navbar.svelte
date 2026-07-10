<script>
  import './styling.css'

  let links = {
    GitHub: {
      icon: "lucide:github",
      url: "https://github.com/sCherry1101/dreamlite"
    }
  }
</script>

<div class="navbar">
  <div class="navbar__content" w-screen-2xl>
    <div class="navbar__brand mr-auto">
      <p>Dreamlite</p>
    </div>
    <nav class="navbar__end">
      <ul class="navbar__routes">
        {#each Object.entries(links) as [title, link]}
          <li class="navbar__link">
            <i class={link.icon}></i>
            <a href={link.url} target="_blank">{title}</a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</div>

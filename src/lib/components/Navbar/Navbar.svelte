<script>
  import { slide } from 'svelte/transition'
  import '/src/lib/assets/stylesheet/global.css'
  import Button from '../Button'

  let {
    brand = 'Dreamlite',
    brandUrl = '/',
    links = [
      { label: 'Science', href: '/science', icon: 'lucide:flask-conical' },
      { label: 'Maths', href: '/maths', icon: 'lucide:calculator' },
      { label: 'GitHub', href: 'https://github.com/sCherry1101/dreamlite', icon: 'lucide:github', external: true }
    ]
  } = $props();

  let mobileMenuOpen = $state(false);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }
  
    let theme = 'default';

    function setTheme(newTheme) {
        theme = newTheme;

        if (newTheme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.dataset.theme = newTheme;
        }
    }

</script>

<header class="navbar">
  <div class="navbar__container">

    <a href={brandUrl} class="navbar__brand" onclick={closeMenu}>
      <span class="navbar__brand-text">{brand}</span>
    </a>

    <nav class="navbar__nav-desktop">
      <ul class="navbar__links">
        {#each links as link}
          <li>
            <Button
              href={link.href}
              variant="ghost"
              size="sm"
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              icon={link.icon}
            >
              {link.label}
            </Button>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="theme-switcher">
      <button
        class="theme-button"
        onclick={() => setTheme('default')}
      >
        Default
      </button>

      <button
        class="theme-button"
        onclick={() => setTheme('light')}
      >
        Light
      </button>

      <button
        class="theme-button"
        onclick={() => setTheme('stardust')}
      >
        Stardust
      </button>
    </div>

  </div>
</header>
<script>
  import '/src/lib/assets/stylesheet/global.css'
  import Button from '../Button'

  let {
    brand = 'Dreamlite',
    brandUrl = '/',
    links = [
      {
        label: 'Science',
        href: '/science',
        icon: 'lucide:flask-conical'
      },
      {
        label: 'Maths',
        href: '/maths',
        icon: 'lucide:calculator'
      },
      {
        label: 'GitHub',
        href: 'https://github.com/sCherry1101/dreamlite',
        icon: 'lucide:github',
        external: true
      },
      {
        label: 'About',
        href: '/about',
        icon: 'lucide:info'
      }
    ]
  } = $props()

  let theme = $state('default')

  function setTheme(newTheme) {
    theme = newTheme

    if (newTheme === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.dataset.theme = newTheme
    }
  }
</script>

<header class="navbar">
  <div class="navbar__container">

    <!-- Brand -->
    <a href={brandUrl} class="navbar__brand">
      <span class="navbar__brand-text">{brand}</span>
    </a>

    <!-- Navigation -->
    <nav class="navbar__nav-desktop">

      <!-- Theme controls -->
      <div class="theme-switcher">
        <button
          class="theme-button"
          class:active={theme === 'default'}
          onclick={() => setTheme('default')}
        >
          Default
        </button>

        <button
          class="theme-button"
          class:active={theme === 'light'}
          onclick={() => setTheme('light')}
        >
          Light
        </button>

        <button
          class="theme-button"
          class:active={theme === 'stardust'}
          onclick={() => setTheme('stardust')}
        >
          Stardust
        </button>
      </div>

      <span class="navbar__divider"></span>

      <!-- Page links -->
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

  </div>
</header>
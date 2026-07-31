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

    <button 
      class="navbar__toggle" 
      aria-label="Toggle Menu" 
      aria-expanded={mobileMenuOpen}
      onclick={toggleMenu}
    >
      <div class="navbar__toggle-icon" class:navbar__toggle-icon--active={mobileMenuOpen}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  </div>

  {#if mobileMenuOpen}
    <div class="navbar__mobile-menu" transition:slide={{ duration: 250 }}>
      <nav class="navbar__nav-mobile">
        <ul class="navbar__mobile-links">
          {#each links as link}
            <li>
              <a
                href={link.href}
                class="navbar__mobile-link"
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onclick={closeMenu}
              >
                {#if link.icon}
                  <i class="navbar__mobile-icon {link.icon}"></i>
                {/if}
                <span>{link.label}</span>
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</header>

<script>
  import '/src/lib/assets/stylesheet/global.css'

  let {
    href = undefined,
    variant = 'primary',
    size = 'md',
    disabled = false,
    icon = undefined,
    iconPosition = 'left',
    onclick = undefined,
    class: customClass = '',
    children,
    ...restProps
  } = $props();
</script>

{#if href}
  <a
    {href}
    class="btn btn--{variant} btn--{size} {customClass}"
    class:btn--disabled={disabled}
    aria-disabled={disabled}
    onclick={(e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onclick?.(e);
    }}
    {...restProps}
  >
    {#if icon && iconPosition === 'left'}
      <i class="btn__icon {icon}"></i>
    {/if}
    
    {#if children}
      <span class="btn__text">{@render children()}</span>
    {/if}

    {#if icon && iconPosition === 'right'}
      <i class="btn__icon {icon}"></i>
    {/if}
  </a>
{:else}
  <button
    type={restProps.type || 'button'}
    class="btn btn--{variant} btn--{size} {customClass}"
    {disabled}
    {onclick}
    {...restProps}
  >
    {#if icon && iconPosition === 'left'}
      <i class="btn__icon {icon}"></i>
    {/if}
    
    {#if children}
      <span class="btn__text">{@render children()}</span>
    {/if}

    {#if icon && iconPosition === 'right'}
      <i class="btn__icon {icon}"></i>
    {/if}
  </button>
{/if}

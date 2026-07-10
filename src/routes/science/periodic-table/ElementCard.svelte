<script>
  let { element, onclick, disabled = false } = $props()
</script>

<button {onclick} {disabled}
  class="element-card {element.category}"
  md="min-w-[55px]"
  lg="min-w-[90px]"
>
  <span class="element-card__atomic-number">
    {element.atomic_number}
  </span>
  <p class="element-card__symbol text-xs" sm="text-sm" md="text-md" lg="text-xl">
    {element.symbol}
  </p>
  <p class="element-card__name">
    {element.name}
  </p>
</button>

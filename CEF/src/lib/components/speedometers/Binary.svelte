<script>
  export let speed = 1;
</script>

<svg viewBox="0 0 132 18" class="ring ring-[#03ff00]" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="132" height="18" class="fill-[#000000]" />
  <text x="130" y="16" text-anchor="end" class="fill-[#03ff00] font-mono"
    >{Math.floor(speed).toString(2).padStart(11, '0')}</text
  >
</svg>

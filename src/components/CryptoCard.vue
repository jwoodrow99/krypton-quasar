<template>
  <!-- <q-card-section>
    <img width="" :src="crypto.image">
  </q-card-section> -->

  <div class="text-h6">{{crypto.name}} [{{crypto.symbol}}]</div>
  <p>Current Price: {{crypto.current_price}} (USD)</p>
  <p>Market Cap: {{crypto.market_cap}}</p>
  <p>24H Volume: {{crypto.total_volume}}</p>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CryptoCard',
    props: {
        crypto: Object,
    },
    data(){
      return {
      }
    },
    methods: {
    },
    watch: {},
    mounted(){
    },
    unmounted(){
    }
  });
</script>

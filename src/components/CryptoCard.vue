<template>
    <q-card>
        <q-card-section>
          <img width="" :src="crypto.image">
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{crypto.name}} [{{crypto.symbol}}]</div>
          <p>Current Price: {{crypto.current_price}} (USD)</p>
          <p>Market Cap: {{crypto.market_cap}}</p>
          <p>24H Volume: {{crypto.total_volume}}</p>
        </q-card-section>

        <q-card-section>
          <q-btn v-on:click="save_to_analyze()">Analyze</q-btn>
        </q-card-section>
    </q-card>
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
      save_to_analyze(){
        console.log(this.crypto);
      }
    },
    watch: {},
    mounted(){
    },
    unmounted(){
    }
  });
</script>

<template>
  <q-scroll-area style="height: 100%; max-width: 100%;">
    <q-card v-for="coinMarket in coinMarketData" :key="coinMarket.id">
      <q-card-section>
        <CryptoCard :crypto="coinMarket"/>
      </q-card-section>

      <q-card-actions>
        <q-btn v-on:click="analyze(coinMarket)" label="Analyze" />
      </q-card-actions>
    </q-card>
  </q-scroll-area>
</template>

<script>
  import { defineComponent } from 'vue';
  import CryptoCard from './CryptoCard.vue';

  export default defineComponent({
    name: 'WatchList',
    components: {
      CryptoCard
    },
    props: [
      'cryptoList',
    ],
    data(){
      return {
        coinMarketData: {}
      }
    },
    methods: {
      analyze(crypto){
        this.$emit('analyze', crypto);
      }
    },
    watch: {},
    mounted(){
      this.$api.get(`/coins/markets?vs_currency=usd&ids=${this.cryptoList.join()}`).then((response) => {
        this.coinMarketData = response.data;
      });
    },
    unmounted(){
    }
  });
</script>

<style lang="scss" scoped>
  .q-card{
    margin: 10px;
  }
</style>
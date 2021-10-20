<template>
  <q-scroll-area style="height: 100%; max-width: 100%;">
    <q-card v-for="coinMarket in coinMarketData" :key="coinMarket.id">
      <q-card-section>
        <CryptoCard :crypto="coinMarket"/>
      </q-card-section>

      <q-card-actions>
        <q-btn v-on:click="analyze(coinMarket)" label="Analyze" />
        <q-btn v-on:click="remove(coinMarket)" label="Remove" />
      </q-card-actions>
    </q-card>
  </q-scroll-area>
</template>

<script>
  import { defineComponent } from 'vue';
  import CryptoCard from './CryptoCard.vue';
  import {ls_set, ls_get} from '../utility/localDB';

  export default defineComponent({
    name: 'WatchList',
    components: {
      CryptoCard
    },
    props: [],
    data(){
      return {
        cryptoList: null,
        coinMarketData: []
      }
    },
    methods: {
      analyze(crypto){
        this.$emit('analyze', crypto);
      },
      remove(crypto){
        let watchlist = ls_get('watchlist');

        // remove from state crypto watch list
        this.cryptoList = watchlist.filter((listItem) => {
          if(listItem != crypto.id){
            return listItem;
          }
        });

        // remove market data
        this.coinMarketData = this.coinMarketData.filter((listItem) => {
          if(listItem.id != crypto.id){
            return listItem;
          }
        });

        ls_set('watchlist', this.cryptoList);
      }
    },
    watch: {},
    mounted(){
      this.cryptoList = ls_get('watchlist');

      if(this.cryptoList == null){
        ls_set('watchlist', ['bitcoin', 'ethereum', 'tether', 'cardano', 'ripple', 'dogecoin', 'polkadot', 'uniswap', 'solana', 'chainlink', 'litecoin']);
      }

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
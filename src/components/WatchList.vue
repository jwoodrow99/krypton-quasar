<template>
  <q-scroll-area style="height: 100%; max-width: 100%;">

    <q-card>
      <q-select v-model="selectedCrypto" :options="coinMarketOptions">
        <template v-slot:append>
          <q-avatar v-if="selectedCrypto">
            <img :src="selectedCrypto.image">
          </q-avatar>
        </template>
      </q-select>
    </q-card>

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
        coinMarketData: [],
        coinMarketOptions: [],
        selectedCrypto: null,
      }
    },
    watch: {
      selectedCrypto: function(crypto) {
        console.log(crypto);
        this.$emit('analyze', crypto);
      },
    },
    methods: {
      remove(crypto){
        let watchlist = ls_get('watchlist');

        // remove from state crypto watch list
        this.cryptoList = watchlist.filter((listItem) => {
          if(listItem.id != crypto.id){
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
        ls_set('watchlist', [
          {
            "id": "bitcoin",
            "symbol": "btc",
            "name": "Bitcoin",
          },
          {
            "id": "ethereum",
            "symbol": "eth",
            "name": "Ethereum",
          },
          {
            "id": "binancecoin",
            "symbol": "bnb",
            "name": "Binance Coin",
          },
        ]);

        this.cryptoList = ls_get('watchlist');
      }

      let mapedCryptoList = this.cryptoList.map((crypto) => {
        return crypto.id;
      });

      this.$api.get(`/coins/markets?vs_currency=usd&ids=${mapedCryptoList.join()}`).then((response) => {
        this.coinMarketData = response.data;

        this.coinMarketOptions = this.coinMarketData.map((crypto) => {
          let newCrypto = crypto;
          newCrypto.label = crypto.name;
          newCrypto.value = crypto.name;
          return newCrypto;
        });
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
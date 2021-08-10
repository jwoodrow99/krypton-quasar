<template>
  <q-page>
    <q-card v-for="crypto in data" :key="crypto.id">
      <q-card-section>
        <CryptoCard :crypto="crypto"/>
      </q-card-section>

      <q-card-actions>
        <q-btn v-if="!watchlist.includes(crypto.id)" v-on:click="test(crypto)" label="Add To Watch List" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import CryptoCard from '../components/CryptoCard.vue';
  import {ls_set, ls_get} from '../utility/localDB';

  export default defineComponent({
    name: 'AllCrypto',
    components: {
      CryptoCard
    },
    props: [],
    data(){
      return {
        data: [],
        watchlist: [],
        current_page: 1
      }
    },
    methods: {
      test(val){
        ls_set('watchlist', ['bitcoin', 'ethereum', 'tether', 'cardano', 'ripple', 'dogecoin', 'polkadot', 'uniswap', 'solana', 'chainlink', 'litecoin']);
      }
    },
    watch: {},
    mounted(){
      this.watchlist = ls_get('watchlist');

      this.$api.get(`/coins/markets?vs_currency=usd&per_page=50&page=${this.current_page}`).then((response) => {
        this.data = response.data;
      });
    },
    unmounted(){

    }
  });
</script>

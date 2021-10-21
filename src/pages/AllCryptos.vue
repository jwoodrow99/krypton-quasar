<template>
  <q-page>
    <q-card v-for="crypto in data" :key="crypto.id">
      <q-card-section>
        <CryptoCard :crypto="crypto"/>
      </q-card-section>

      <q-card-actions>
        <q-btn v-if="!wallet.includes(crypto.id)" v-on:click="addToWallet(crypto)" label="Add To Wallet" />
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
        wallet: [],
        current_page: 1
      }
    },
    methods: {
      test(val){
        console.log(val);
      },
      addToWallet(crypto){
        let rawWallet = ls_get('wallet');

        rawWallet.push({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          image: crypto.image,
          amount: 0
        });

        ls_set('wallet', rawWallet);

        this.wallet = rawWallet.map((crypto) => {
          return crypto.id;
        });
      }
    },
    watch: {},
    mounted(){

      let rawWallet = ls_get('wallet');

      this.wallet = rawWallet.map((crypto) => {
        return crypto.id;
      });

      this.$api.get(`/coins/markets?vs_currency=usd&per_page=50&page=${this.current_page}`).then((response) => {
        this.data = response.data;
      });
    },
    unmounted(){

    }
  });
</script>

<template>
  <q-page>
    <!-- <q-card v-for="crypto in data" :key="crypto.id">
      <q-card-section>
        <CryptoCard :crypto="crypto"/>
      </q-card-section>

      <q-card-actions>
        <q-btn v-if="!wallet.includes(crypto.id)" v-on:click="addToWallet(crypto)" label="Add To Wallet" />
      </q-card-actions>
    </q-card> -->

      <!-- @virtual-scroll="onScroll" -->
      <q-table
        class="my-sticky-dynamic"
        style="height: 80vh"
        title="Cryptos"
        :rows="data"
        :columns="columns"
        row-key="id"
        virtual-scroll
        :virtual-scroll-item-size="250"
        :virtual-scroll-sticky-size-start="250"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        
        selection="multiple"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-logo="props">
          <q-td :props="props">
            <div>
              <q-img style="width: 35px;" :src="props.row.image" />
            </div>
            <div class="my-table-details">
              {{ props.row.details }}
            </div>
          </q-td>
        </template>
      </q-table>

      <q-btn v-on:click="nextPage()" label="Load More..." />
      <q-btn v-on:click="syncWallet()" label="Sync Wallet" />
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import CryptoCard from '../components/CryptoCard.vue';
  import {ls_set, ls_get} from '../utility/localDB';

  export default defineComponent({
    name: 'AllCrypto',
    components: {
      //CryptoCard
    },
    props: [],
    data(){
      return {
        data: [],
        wallet: [],
        current_page: 1,
        columns: [
          { name: 'logo', align: 'center', label: 'Logo', field: '' },
          { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
          { name: 'symbol', align: 'center', label: 'Symbol', field: 'symbol' },
          { name: 'price', align: 'center', label: 'Price (USDT)', field: 'current_price', sortable: true },
          { name: 'cap', align: 'center', label: 'Market Cap', field: 'market_cap', sortable: true },
          { name: 'volume', align: 'center', label: 'Volume (24H)', field: 'total_volume', sortable: true },
        ],
        selected: [],
      }
    },
    methods: {
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
      },
      nextPage(){
        this.current_page++;

        // this.$api.get(`/coins/markets?vs_currency=usd&per_page=250&page=${this.current_page}`).then((response) => {
        //   this.data = this.data.concat(response.data);
        // });

        this.$api.get(`/exchanges/binance/tickers?page=${this.current_page}`).then((binancePairs) => {
          let usdtPairs = binancePairs.data.tickers.filter((cryptoPair) => {
            if (cryptoPair.target == 'USDT'){
              return cryptoPair;
            }
          });

          let pairCoinArray = usdtPairs.map((pair) => {
            return pair.coin_id;
          });

          this.$api.get(`/coins/markets?vs_currency=usd&ids=${pairCoinArray}`).then((response) => {
            this.data = this.data.concat(response.data);
          });
        });
      },
      onScroll(){
        console.log('test');
      },
      syncWallet(){
        let rawWallet = ls_get('wallet');

        let symbolList = rawWallet.map((crypto) => {
           return crypto.symbol;
        });

        this.selected.forEach((crypto) => {
          if(!symbolList.includes(crypto.symbol)){
            rawWallet.push({
              id: crypto.id,
              name: crypto.name,
              symbol: crypto.symbol,
              image: crypto.image,
              amount: 0
            });
          }
        });

        ls_set('wallet', rawWallet);

        this.wallet = rawWallet.map((crypto) => {
          return crypto.id;
        });
      },
    },
    watch: {},
    mounted(){

      let rawWallet = ls_get('wallet');

      this.wallet = rawWallet.map((crypto) => {
        return crypto.id;
      });

      this.$api.get(`/exchanges/binance/tickers?page${this.current_page}`).then((binancePairs) => {
        let usdtPairs = binancePairs.data.tickers.filter((cryptoPair) => {
          if (cryptoPair.target == 'USDT'){
            return cryptoPair;
          }
        });

        let pairCoinArray = usdtPairs.map((pair) => {
          return pair.coin_id;
        });

        this.$api.get(`/coins/markets?vs_currency=usd&ids=${pairCoinArray}`).then((response) => {
          this.data = response.data;

          let rawWallet = ls_get('wallet');

          let symbolList = rawWallet.map((crypto) => {
              return crypto.symbol;
          });

          this.data.forEach((crypto) => {
            if(symbolList.includes(crypto.symbol)){
              this.selected.push(crypto);
            }
          });
        });
      });
    },
    unmounted(){

    }
  });
</script>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
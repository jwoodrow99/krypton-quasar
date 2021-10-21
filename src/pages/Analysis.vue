<template>
  <q-page>
    <div class="row">
      <div class="col-9">
        <q-card style="height: 80vh">
          <div class="test" style="height: 100%">
            <TradingView style="height: 100%" :key="tradingViewOptions.symbol" :options="tradingViewOptions" /> <!-- :options="tradingViewOptions" -->
          </div>
        </q-card>
      </div>
      <div class="col-3">
        <!-- <WatchList @analyze="analyzeCrypto($event)" /> -->

        <q-card>
          <q-select outlined v-model="crypto" :options="walletOptions" @update="select()">
            <template v-slot:append>
              <q-avatar v-if="crypto">
                <img :src="crypto.image">
              </q-avatar>
            </template>
          </q-select>
          <q-btn v-on:click="select()" label="select"/>
        </q-card>

        <q-btn v-on:click="getPrice()" label="get price" />
      </div>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import {ls_set, ls_get} from '../utility/localDB';
  import TradingView from '../components/TradingView';

  export default defineComponent({
    name: 'Analysis',
    components: {
      TradingView,
    },
    props: [],
    data(){
      return {
        tradingViewOptions: {
          symbol: 'BINANCE:ETHUSDT',
          theme: 'dark',
          autosize: true,
          allow_symbol_change: false,
          withdateranges: true,
          hide_side_toolbar: false,
          details: true,
          show_popup_button: true,
          studies: [
            'BB@tv-basicstudies',
            'MACD@tv-basicstudies'
          ]
        },
        crypto: {},
        wallet: [],
      }
    },
    methods: {
      analyzeCrypto(val){
        let stableCoins = ['usdt', 'dai'];
        if(stableCoins.includes(val.symbol)){
          this.tradingViewOptions.symbol = `COINBASE:${val.symbol}USD`;
        } else {
          this.tradingViewOptions.symbol = `BINANCE:${val.symbol.toUpperCase()}USDT`;
        }
      },
      select(){
        this.analyzeCrypto(this.crypto);
      },
      getPrice(){
        this.$axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${this.crypto.symbol.toUpperCase()}USDT`).then((response) => {
          console.log(response.data);
        });
      }
    },
    watch: {},
    mounted(){

      let wallet = ls_get('wallet');
      if(wallet == null){
        ls_set('wallet', [
          {
            "id": "tether",
            "symbol": "usdt",
            "name": "Tether",
            "amount": 10000,
            "image": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707"
          },
          {
            "id": "bitcoin",
            "symbol": "btc",
            "name": "Bitcoin",
            "amount": 0.005,
            "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
          },
          {
            "id": "ethereum",
            "symbol": "eth",
            "name": "Ethereum",
            "amount": 0.2,
            "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"
          },
          {
            "id": "binancecoin",
            "symbol": "bnb",
            "name": "Binance Coin",
            "amount": 0.5,
            "image": "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615"
          },
        ]);
        wallet = ls_get('wallet');
      }

      this.wallet = wallet;

      this.walletOptions = wallet.filter((crypto) => {
        if (!['usdt', 'dai', 'busd', 'usdc'].includes(crypto.symbol)){
          crypto.label = crypto.name;
          return crypto;
        }
      });

      this.crypto = this.walletOptions[0];
      this.analyzeCrypto(this.crypto);
    },
    unmounted(){
    }
  });
</script>

<style lang="scss" scoped>
  .selected{
    background-color: lightgray;
  }
</style>

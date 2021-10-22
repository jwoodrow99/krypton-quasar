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
          <q-card-section>
            <q-select outlined v-model="crypto" :options="walletOptions" @update="select()">
              <template v-slot:append>
                <q-avatar v-if="crypto">
                  <img :src="crypto.image">
                </q-avatar>
              </template>
            </q-select>
            <q-btn v-on:click="select()" label="select"/>
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section>
            <div><strong>Buy</strong></div>
            <div>Available: {{funds}} USDT</div>
            <q-input outlined type="number" v-model="buyUSDT" label="USDT" />
            <div>{{crypto.symbol}} aprox: {{buyCrypto}}</div>
            <q-btn v-on:click="buy()" style="background: SpringGreen; color: white; width: 100%;" label="BUY" />
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section>
            <div><strong>Sell</strong></div>
            <div>Available: {{crypto.amount}} {{crypto.symbol}}</div>
            <q-input outlined type="number" v-model="sellCrypto" :label="crypto.symbol" />
            <div>USDT aprox: {{sellUSDT}}</div>
            <q-btn v-on:click="sell()" style="background: Tomato; color: white; width: 100%;" label="SELL" />
          </q-card-section>
        </q-card>

        <q-btn v-on:click="refreshPrice()" label="Refresh Aprox" />

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
        funds: {},
        crypto: {},
        wallet: [],
        sellCrypto: 0,
        buyUSDT: 0,
      }
    },
    computed: {
      buyCrypto: function(){
        if(this.buyUSDT > 0){
          return Number(this.buyUSDT) / Number(this.crypto.market);
        } else {
          return 0;
        }
      },
      sellUSDT: function(){
        if(this.sellCrypto > 0){
          return Number(this.sellCrypto) * Number(this.crypto.market);
        } else {
          return 0;
        }
      },
    },
    watch: {
      buyUSDT: function (val) {
        console.log(val);
      },
      sellCrypto: function (val) {
        console.log(val);
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
        this.crypto.symbol = this.crypto.symbol.toUpperCase();
        this.analyzeCrypto(this.crypto);
        this.refreshPrice();
      },
      refreshPrice(){
        this.$axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${this.crypto.symbol.toUpperCase()}USDT`).then((response) => {
          this.crypto.market = response.data.price;
        });
      },
      buy(){
        this.$axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${this.crypto.symbol.toUpperCase()}USDT`).then((response) => {
          this.crypto.market = response.data.price;

          if(this.funds >= this.buyUSDT){

            let wallet = ls_get('wallet');

            let newWallet = wallet.map((crypto) => {
              if(crypto.symbol.toUpperCase() == 'USDT'){
                crypto.amount -= Number(this.buyUSDT);
              } else if(crypto.symbol.toUpperCase() == this.crypto.symbol.toUpperCase()){
                crypto.amount += Number(this.buyUSDT) / Number(this.crypto.market);
              }
              return crypto;
            });

            ls_set('wallet', newWallet);

            this.wallet = newWallet;

            this.walletOptions = newWallet.filter((crypto) => {
              if(crypto.symbol == 'usdt'){
                this.funds = crypto.amount;
              }

              if(this.crypto.symbol.toUpperCase() == crypto.symbol.toUpperCase()){
                this.crypto = crypto;
              }

              if (!['usdt', 'dai', 'busd', 'usdc'].includes(crypto.symbol)){
                crypto.label = crypto.name;
                crypto.symbol = crypto.symbol.toUpperCase();
                return crypto;
              }
            });
          }

          this.buyUSDT = 0;
        });
      },
      sell(){
        this.$axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${this.crypto.symbol.toUpperCase()}USDT`).then((response) => {
          this.crypto.market = response.data.price;

          if(this.crypto.amount >= this.sellCrypto){

            let wallet = ls_get('wallet');

            let newWallet = wallet.map((crypto) => {
              if(crypto.symbol.toUpperCase() == 'USDT'){
                crypto.amount += Number(this.sellCrypto) * Number(this.crypto.market);
              } else if(crypto.symbol.toUpperCase() == this.crypto.symbol.toUpperCase()){
                crypto.amount -= Number(this.sellCrypto);
              }
              return crypto;
            });

            ls_set('wallet', newWallet);

            this.wallet = newWallet;

            this.walletOptions = newWallet.filter((crypto) => {
              if(crypto.symbol == 'usdt'){
                this.funds = crypto.amount;
              }

              if(this.crypto.symbol.toUpperCase() == crypto.symbol.toUpperCase()){
                this.crypto = crypto;
              }

              if (!['usdt', 'dai', 'busd', 'usdc'].includes(crypto.symbol)){
                crypto.label = crypto.name;
                crypto.symbol = crypto.symbol.toUpperCase();
                return crypto;
              }
            });
          }

          this.sellCrypto = 0;
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
            "amount": 0,
            "image": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707"
          },
          {
            "id": "bitcoin",
            "symbol": "btc",
            "name": "Bitcoin",
            "amount": 0,
            "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
          },
          {
            "id": "ethereum",
            "symbol": "eth",
            "name": "Ethereum",
            "amount": 0,
            "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"
          },
          {
            "id": "binancecoin",
            "symbol": "bnb",
            "name": "Binance Coin",
            "amount": 0,
            "image": "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615"
          },
        ]);
        wallet = ls_get('wallet');
      }

      this.wallet = wallet;

      this.walletOptions = wallet.filter((crypto) => {
        if(crypto.symbol == 'usdt'){
          this.funds = crypto.amount;
        }

        if (!['usdt', 'dai', 'busd', 'usdc'].includes(crypto.symbol)){
          crypto.label = crypto.name;
          crypto.symbol = crypto.symbol.toUpperCase();
          return crypto;
        }
      });

      this.crypto = this.walletOptions[0];
      this.analyzeCrypto(this.crypto);
      this.refreshPrice();

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

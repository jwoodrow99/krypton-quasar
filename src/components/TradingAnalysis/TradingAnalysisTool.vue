<template>
  <q-card>
    <q-card-section>
        <div>Trading Analysis Tool</div>
    </q-card-section>
  </q-card>
</template>

<script>
  export default {
    name: 'TradingAnalysisTool',
    props: {

    },
    data() {
      return {
        current_page: 1,
        data: [],
      };
    },

    methods: {
      async getAllCryptoData(){
        let returned = 0;
        let data = [];
        let cnt = 1;

        do {
          let cryptoData = await this.getCryptoData(cnt);
          returned = cryptoData.length;
          data = data.concat(cryptoData);
          cnt++;
        } while (returned != 0);

        // for(let i = 1; i <= 15; i++){
        //   let cryptoData = await this.getCryptoData(i);
        //   returned = cryptoData.length;
        //   data = data.concat(cryptoData);
        //   console.log(returned);
        // }

        console.log(data);
      },
      async getCryptoData(page){
        let binancePairs = await this.$api.get(`/exchanges/binance/tickers?page=${page}`);
        if(binancePairs.data.tickers.length > 0){
          let usdtBinancePairs = binancePairs.data.tickers.filter((cryptoPair) => {
            if (cryptoPair.target == 'USDT'){
              return cryptoPair;
            }
          });

          let usdtBinancePairsArray = usdtBinancePairs.map((pair) => {
            return pair.coin_id;
          });

          let coinData = await this.$api.get(`/coins/markets?vs_currency=usd&ids=${usdtBinancePairsArray}`);

          return coinData.data;
        } else {
          return [];
        }
      }
    },
    mounted() {
      this.getAllCryptoData();
      console.log('TradingAnalysisTool');
    },
  }
</script>
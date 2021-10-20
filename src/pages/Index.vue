<template>
  <q-page>
    <q-card>

      <q-card-section>
        <div class="text-h6">ApexChart Example</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{gecko_says}}
      </q-card-section>

      <q-separator inset />

      <apexchart 
      width="500" 
      type="bar" 
      :options="options" 
      :series="series"
      ></apexchart>

    </q-card>

    <q-card style="height: 50vh">
      <div class="test" style="height: 100%">
        <TradingView style="height: 100%" :key="tradingViewOptions.symbol"/> <!-- :options="tradingViewOptions" -->
      </div>
    </q-card>

    <q-card>
      <q-btn label="Etherium" v-on:click="changeCurrency('ETH')"/>
      <q-btn label="Bitcoin" v-on:click="changeCurrency('BTC')"/>
    </q-card>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import TradingView from '../components/TradingView';

  export default defineComponent({
    name: 'PageIndex',
    components: {
      TradingView,
    },
    props: [],
    data(){
      return { 
        tradingViewOptions: {
          symbol: 'BINANCE:ETHUSDT',
          theme: 'dark',
          autosize: false,
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
        options: {
          chart: {
            id: 'vuechart-example'
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          }
        },
        series: [{
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }],
        gecko_says: '',
        coin_list: {}
      }
    },
    methods: {
      changeCurrency(code){
        this.tradingViewOptions.symbol = `BINANCE:${code}USDT`;
      }
    },
    watch: {},
    mounted(){
      this.$api.get('/ping').then((response) => {
        this.gecko_says = response.data.gecko_says;
      });

      this.$api.get('/coins/list').then((response) => {
        this.coin_list = response.data;
      });
    },
    unmounted(){

    }
  });
</script>

<template>
  <q-page>
    <div class="row">
      <div class="col-9">
        <q-card>
          <q-card-section class="row">
            <div class="text-h6">Trading chart of {{crypto?.name}} [{{crypto?.symbol?.toUpperCase()}}]</div>
          </q-card-section>

          <q-card-section>
            <q-btn :class="(currentView == 'daily100')?'selected':''" v-on:click="daily(100)">Daily (100 Days)</q-btn>
            <q-btn :class="(currentView == 'hourly30')?'selected':''" v-on:click="hourly(30)">Houry (30 Days)</q-btn>
            <q-btn :class="(currentView == 'hourly10')?'selected':''" v-on:click="hourly(10)">Houry (10 Days)</q-btn>
            <q-btn :class="(currentView == 'today')?'selected':''" v-on:click="today()">Today (5 Minutes)</q-btn>
          </q-card-section>

          <q-card-section>
            <div class="chart_container">
              <q-circular-progress
              class="loading"
              v-if="loading"
              indeterminate
              size="50px"
              />

              <apexchart
              :class="(loading)?'blur':''"
              height="500px"
              type="line" 
              :options="chart.options" 
              :series="chart.series"
              @animationEnd="chartRender($event)"
              ></apexchart>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3">
        <WatchList @analyze="analyzeCrypto($event)" :cryptoList="['bitcoin', 'ethereum', 'tether', 'cardano', 'ripple', 'dogecoin', 'polkadot', 'uniswap', 'solana', 'chainlink', 'litecoin']"/>
      </div>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import WatchList from '../components/WatchList.vue';

  export default defineComponent({
    name: 'Analysis',
    components: {
      WatchList
    },
    props: [],
    data(){
      return {
        chart: {
          options: {
            chart: {
              id: 'Analysis'
            },
            xaxis: {
              categories: []
            }
          },
          series: [{
            name: 'price',
            data: []
          }],
        },
        dailyData: {},
        hourlyData: {},
        todayData: {},
        loading: false,
        currentView: '',
        watchList: ['bitcoin', 'ethereum', 'tether', 'cardano', 'ripple', 'dogecoin', 'polkadot', 'uniswap', 'solana', 'chainlink', 'litecoin'],
        crypto: {}
      }
    },
    methods: {
      chartRender(val){
        this.loading = false;
      },
      analyzeCrypto(val){
        this.crypto = val;

        if(this.currentView == 'daily100'){
          this.daily(100);
        } else if(this.currentView == 'hourly30') {
          this.hourly(30);
        } else if(this.currentView == 'hourly10') {
          this.hourly(10);
        } else if(this.currentView == 'today') {
          this.today();
        }
      },
      async daily(days){
        this.loading = true;
        this.currentView = `daily${days}`

        // Calculate & Display daily average prices over the past 100 days
        let response = await this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=${days}`);
        this.dailyData = response.data;

        this.chart.options.xaxis.categories = this.dailyData.prices.map((price) => {
          return price[0];
        });

        this.chart.series[0].data = this.dailyData.prices.map((price) => {
          return Math.round(price[1] * 10000) / 10000;
        });
      },
      async hourly(days){
        this.loading = true;
        this.currentView = `hourly${days}`

        // Display hourly prices over the past 30 days
        let response = await this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=${days}`);
        this.hourlyData = response.data;

        this.chart.options.xaxis.categories = this.hourlyData.prices.map((price) => {
          return price[0];
        });

        this.chart.series[0].data = this.hourlyData.prices.map((price) => {
          return Math.round(price[1] * 10000) / 10000;
        });
      },
      async today(){
        this.loading = true;
        this.currentView = `today`

        // Display hourly prices over the past 30 days
        let response = await this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=1`)
        this.todayData = response.data;

        this.chart.options.xaxis.categories = this.todayData.prices.map((price) => {
          return price[0];
        });

        this.chart.series[0].data = this.todayData.prices.map((price) => {
          return Math.round(price[1] * 10000) / 10000;
        });
      },
    },
    watch: {},
    mounted(){
      this.$api.get(`/coins/markets?vs_currency=usd&ids=${this.watchList[0]}`).then((response) => {
        this.crypto = response.data[0];
        this.daily(100);
      });
    },
    unmounted(){
    }
  });
</script>

<style lang="scss" scoped>
  .loading{
    position: absolute;
    left: calc(50% - 50px);
    top: calc(50% - 50px);
    z-index: 1;
  }

  .blur{
    opacity: 50%;
  }

  .selected{
    background-color: lightgray;
  }
</style>

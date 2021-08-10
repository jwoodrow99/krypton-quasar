<template>
  <q-page>
    <div class="row">
      <div class="col-9">
        <q-card>
          <q-card-section class="row">
            <div class="text-h6">Trading chart of {{crypto.name}} [{{crypto.symbol.toUpperCase()}}]</div>
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
        <WatchList @analyze="analyzeCrypto($event)"/>
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
        crypto: {
          id: "cardano",
          symbol: "ada",
          name: "Cardano",
          image: "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
          current_price: 1.44,
          market_cap: 46161102968,
          market_cap_rank: 5,
          fully_diluted_valuation: 64779652161,
          total_volume: 1778221970,
          high_24h: 1.44,
          low_24h: 1.36,
          price_change_24h: 0.061843,
          price_change_percentage_24h: 4.48382,
          market_cap_change_24h: 1962621949,
          market_cap_change_percentage_24h: 4.44047,
          circulating_supply: 32066390668.4135,
          total_supply: 45000000000.0,
          max_supply: 45000000000.0,
          ath: 2.45,
          ath_change_percentage: -41.13287,
          ath_date: "2021-05-16T07:44:28.033Z",
          atl: 0.01925275,
          atl_change_percentage: 7377.28821,
          atl_date: "2020-03-13T02:22:55.044Z",
          roi: null,
          last_updated: "2021-08-07T03:22:43.512Z"
        }
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
        this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=${days}`).then((response) => {
          this.dailyData = response.data;

          this.chart.options.xaxis.categories = this.dailyData.prices.map((price) => {
            return price[0];
          });

          this.chart.series[0].data = this.dailyData.prices.map((price) => {
            return Math.round(price[1] * 10000) / 10000;
          });
        });
      },
      async hourly(days){
        this.loading = true;
        this.currentView = `hourly${days}`

        // Display hourly prices over the past 30 days
        this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=${days}`).then((response) => {
          this.hourlyData = response.data;

          this.chart.options.xaxis.categories = this.hourlyData.prices.map((price) => {
            return price[0];
          });

          this.chart.series[0].data = this.hourlyData.prices.map((price) => {
            return Math.round(price[1] * 10000) / 10000;
          });
        });
      },
      async today(){
        this.loading = true;
        this.currentView = `today`

        // Display hourly prices over the past 30 days
        this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=1`).then((response) => {
          this.todayData = response.data;

          this.chart.options.xaxis.categories = this.todayData.prices.map((price) => {
            return price[0];
          });

          this.chart.series[0].data = this.todayData.prices.map((price) => {
            return Math.round(price[1] * 10000) / 10000;
          });
        });
      },
    },
    watch: {},
    mounted(){
      this.daily(100);
      this.loading = false;
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

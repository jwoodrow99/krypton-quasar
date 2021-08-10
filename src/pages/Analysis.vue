<template>
  <q-page>
    <div class="row">
      <div class="col-9">
        <q-card>
          <q-card-section>
            <div class="text-h6">Trading chart of {{crypto.name}} [{{crypto.symbol.toUpperCase()}}]</div>
          </q-card-section>

          <q-card-section>
            <q-btn v-on:click="daily(100)">Daily (100 Days)</q-btn>
            <q-btn v-on:click="hourly(30)">Houry (30 Days)</q-btn>
            <q-btn v-on:click="hourly(10)">Houry (10 Days)</q-btn>
            <q-btn v-on:click="today()">Today (5 Minutes)</q-btn>
          </q-card-section>

          <q-card-section>
            <apexchart
            height="500px"
            type="line" 
            :options="chart.options" 
            :series="chart.series"
            ></apexchart>
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
      analyzeCrypto(val){
        this.crypto = val;
        this.daily(100);
      },
      async daily(days){
        // Calculate & Display daily average prices over the past 100 days
        this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=${days}`).then((response) => {
          this.dailyData = response.data;
          console.log(this.dailyData);

          this.chart.options.xaxis.categories = this.dailyData.prices.map((price) => {
            return price[0];
          });

          this.chart.series[0].data = this.dailyData.prices.map((price) => {
            return Math.round(price[1] * 10000) / 10000;
          });
        });
      },
      async hourly(days){
        // Display hourly prices over the past 30 days
        this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=${days}`).then((response) => {
          this.hourlyData = response.data;
          console.log(this.hourlyData);

          this.chart.options.xaxis.categories = this.hourlyData.prices.map((price) => {
            return price[0];
          });

          this.chart.series[0].data = this.hourlyData.prices.map((price) => {
            return Math.round(price[1] * 10000) / 10000;
          });
        });
      },
      async today(){
        // Display hourly prices over the past 30 days
        this.$api.get(`/coins/${this.crypto.id}/market_chart?vs_currency=usd&days=1`).then((response) => {
          this.todayData = response.data;
          console.log(this.todayData);

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
    },
    unmounted(){

    }
  });
</script>

<template>
  <q-page>
    <iframe src="https://cointelegraph.com/category/top-10-cryptocurrencies" title="Coin Telegraph: Top 10 Cryptocurrencies" width="500px" height="500px"></iframe>
    <iframe width="560" height="315" :src="letestAltcoinDailyURI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <!-- <TradingAnalysisTool/> -->
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import TradingAnalysisTool from '../components/TradingAnalysis/TradingAnalysisTool';

  export default defineComponent({
    name: 'PageIndex',
    components: {
      // TradingAnalysisTool,
    },
    props: [],
    data(){
      return {
        letestAltcoinDailyURI: "",
      }
    },
    methods: {
    },
    watch: {},
    async mounted(){
      let res = await this.$axios("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCbLhGKVY-bJPcawebgtNfbw");
      this.letestAltcoinDailyURI = `https://youtube.com/embed/${res.data.items[0].guid.slice(9, res.data.items[0].guid.length)}`;
    },
    unmounted(){

    }
  });
</script>

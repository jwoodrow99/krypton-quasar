<template>
  <q-page>
    <iframe src="https://cointelegraph.com/category/top-10-cryptocurrencies" title="Coin Telegraph: Top 10 Cryptocurrencies" width="500px" height="500px"></iframe>
    <TradingAnalysisTool/>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import TradingAnalysisTool from '../components/TradingAnalysis/TradingAnalysisTool';

  export default defineComponent({
    name: 'PageIndex',
    components: {
      TradingAnalysisTool,
    },
    props: [],
    data(){
      return {
      }
    },
    methods: {
    },
    watch: {},
    async mounted(){

    },
    unmounted(){

    }
  });
</script>

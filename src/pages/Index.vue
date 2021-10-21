<template>
  <q-page>
    <iframe src="https://cointelegraph.com/category/top-10-cryptocurrencies" title="Coin Telegraph: Top 10 Cryptocurrencies" width="500px" height="500px"></iframe>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import axios from 'axios'

  export default defineComponent({
    name: 'PageIndex',
    components: {
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

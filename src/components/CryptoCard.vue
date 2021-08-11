<template>
  <div class="row">

    <div class="img col-1">
      <q-img style="width:100px" :src="crypto.image" />
    </div>

    <div class="content col">
      <div class="text-h6">{{crypto.name}} [{{crypto.symbol}}]</div>
      <p>Current Price: {{crypto.current_price}} (USD)</p>
      <p>Market Cap: {{crypto.market_cap}}</p>
      <p>24H Volume: {{crypto.total_volume}}</p>
    </div>

  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CryptoCard',
    props: {
        crypto: Object,
    },
    data(){
      return {
      }
    },
    methods: {
    },
    watch: {},
    mounted(){
    },
    unmounted(){
    }
  });
</script>

<style lang="scss" scoped>
  .content{
    margin-left: 15px;
  }

  .img{
    display: flex;
    align-items: center;
  }
</style>

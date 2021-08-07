<template>
  <q-page>
    <CryptoCard v-for="crypto in data" :key="crypto.id" :crypto="crypto"/>
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import CryptoCard from '../components/CryptoCard.vue';

  export default defineComponent({
    name: 'AllCrypto',
    components: {
      CryptoCard
    },
    props: [],
    data(){
      return {
        data: [],
        current_page: 1
      }
    },
    methods: {},
    watch: {},
    mounted(){
      this.$api.get(`/coins/markets?vs_currency=usd&per_page=50&page=${this.current_page}`).then((response) => {
        this.data = response.data;
        console.log(this.data[0]);
      });
    },
    unmounted(){

    }
  });
</script>

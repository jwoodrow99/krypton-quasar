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
  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'PageIndex',
    props: [],
    data(){
      return { 
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
    methods: {},
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

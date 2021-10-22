<template>
  <q-page>

    <div>
      <h1>${{total}} (USDT)</h1>
    </div>

    <div>
      <q-input outlined type="number" v-model="aditionalFunds" label="Add Funds" />
      <q-btn v-on:click="addFunds()" label="Deposit" />
    </div>

    <div>
      <q-table
        title="Wallet"
        :rows="wallet"
        :columns="columns"
        row-key="id"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-logo="props">
          <q-td :props="props">
            <div>
              <q-img style="width: 35px;" :src="props.row.image" />
            </div>
            <div class="my-table-details">
              {{ props.row.details }}
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script>
  import { defineComponent } from 'vue';
  import {ls_set, ls_get} from '../utility/localDB';

  export default defineComponent({
    name: 'wallet',
    components: {
    },
    props: [],
    data(){
      return {
        wallet: [],
        total: 0,
        aditionalFunds: 0,
        columns: [
          { name: 'logo', align: 'center', label: 'Logo', field: '' },
          { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
          { name: 'symbol', align: 'center', label: 'Symbol', field: 'symbol' },
          { name: 'price', align: 'center', label: 'Price (USDT)', field: 'market', sortable: true },
          { name: 'total', align: 'center', label: 'Total', field: 'amount', sortable: true },
          { name: 'value', align: 'center', label: 'Value (USDT)', field: 'value', sortable: true },
        ]
      }
    },
    methods: {
      addFunds(){
        let total = 0;

        this.wallet.map((crypto) => {
          if(crypto.id == 'tether'){
            crypto.amount = Number(crypto.amount) + Number(this.aditionalFunds);
          }

          total = Number(total) + Number(crypto.amount);

          return crypto;
        });

        ls_set('wallet', this.wallet);
        this.aditionalFunds = 0;
        this.total = total;
      },
    },
    watch: {},
    async mounted(){
      let wallet = ls_get('wallet');

      this.wallet = await Promise.all(wallet.map(async (crypto) => {
        if(crypto.symbol == 'usdt') {
          crypto.market = 1;
        } else if (!['dai', 'busd', 'usdc'].includes(crypto.symbol)){
          let res = await this.$axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${crypto.symbol.toUpperCase()}USDT`);
          crypto.market = res.data.price;
        } 

        crypto.value = (Number(crypto.amount) * Number(crypto.market)).toFixed(2);
        this.total += Number(crypto.value);
        return crypto;
      }));

      this.total = this.total.toFixed(2);

    },
    unmounted(){

    }
  });
</script>

<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Krypton
        </q-toolbar-title>

        <q-space />

        <q-btn flat v-on:click="this.$router.push('/')">
          Home
        </q-btn>

        <q-btn flat v-on:click="this.$router.push('/analysis')">
          Analysis
        </q-btn>

        <q-btn flat v-on:click="this.$router.push('/all_cryptos')">
          All Cryptos
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'MainLayout',
    components: {},
    data(){
      return {
        coin_list: {}
      }
    },
    methods: {
    }
  });
</script>

<template>
  <v-app :dark="dark">
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>DIET</span>
        <span class="font-weight-light">MIND</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <FoodSelect />
    </v-content>
  </v-app>
</template>

<script>
import FoodSelect from './components/FoodSelect'

export default {
  name: 'App',
  components: {
   FoodSelect
  },
  data () {
    return {
      dark: true
    }
  }
}
</script>

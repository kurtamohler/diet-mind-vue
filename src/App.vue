<template>
  <v-app :dark="darkTheme">
    <v-navigation-drawer
      v-model="settingsOpen"
      :hidden="!settingsOpen"
      right
      app
      class="px-4"
    >
      <v-switch
        v-model="darkTheme"
        label="Dark Theme"
      ></v-switch>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>DIET</span>
        <span class="font-weight-light blue--text">MIND</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="settingsOpen = !settingsOpen">
        <v-icon>mdi-settings</v-icon>
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
  watch: {
    darkTheme: {
      handler() {
        localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme))
      }
    }
  },
  mounted() {
    if (localStorage.getItem('darkTheme')) {
      this.darkTheme = JSON.parse(localStorage.getItem('darkTheme'))
    }
  },
  data () {
    return {
      darkTheme: true,
      settingsOpen: false
    }
  }
}
</script>

<style>
  /*
    By default, vuetify always shows a scrollbar, even if it
    isn't needed. This fixes that.
  */
  html {
    overflow-y: auto
  }
</style>

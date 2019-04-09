<template>
  <v-app :dark="darkTheme">
    <!-- Settings menu -->
    <v-navigation-drawer
      v-model="settingsOpen"
      :hidden="!settingsOpen"
      right
      app
      class="pa-4"
      disable-resize-watcher
    >
      <h2>Settings</h2>
      <v-switch
        v-model="darkTheme"
        label="Dark Theme"
      ></v-switch>
    </v-navigation-drawer>

    <!-- navigation bar -->
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


      <v-tabs>
        <v-tab ripple>
          Food
        </v-tab>
        <v-tab ripple>
          Nutrition
        </v-tab>
        <v-tab-item>
          <FoodSelect @foodsSelected="foodsSelected" />
        </v-tab-item>
        <v-tab-item>
          <NutritionSelect @nutrientsSelected="nutrientsSelected" />
        </v-tab-item>
      </v-tabs>

    </v-content>
  </v-app>
</template>

<script>
import FoodSelect from './components/FoodSelect'
import NutritionSelect from './components/NutritionSelect'

export default {
  name: 'App',
  components: {
    FoodSelect,
    NutritionSelect
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
      settingsOpen: false,
      selectedFoods: [],
      selectedNutrients: []
    }
  },

  methods: {
    foodsSelected: function(selectedFoods) {
      console.log('foods emitted')
      this.selectedFoods = selectedFoods
      // console.log(JSON.parse(JSON.stringify(this.selectedFoods, null, true)))
    },

    nutrientsSelected: function(selectedNutrients) {
      console.log('nutrients emitted')
      this.selectedNutrients = selectedNutrients
      // console.log(JSON.parse(JSON.stringify(this.selectedNutrients, null, true)))
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

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
          Menu
        </v-tab>
        <v-tab ripple>
          Nutrition
        </v-tab>
        <v-tab ripple>
          Diet
        </v-tab>
        <v-tab-item>
          <FoodSelect
            @foodsSelected="foodsSelected"
          />
        </v-tab-item>
        <v-tab-item>
          <NutritionSelect
            @nutrientsSelected="nutrientsSelected"
          />
        </v-tab-item>
        <v-tab-item>
          <DietOptimizer
            v-bind:foods="foods"
            v-bind:nutrients="nutrients"
          />
        </v-tab-item>
      </v-tabs>

    </v-content>
  </v-app>
</template>

<script>
import FoodSelect from './components/FoodSelect'
import NutritionSelect from './components/NutritionSelect'
import DietOptimizer from './components/DietOptimizer'

export default {
  name: 'App',
  components: {
    FoodSelect,
    NutritionSelect,
    DietOptimizer
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
      foods: [],
      nutrients: {}
    }
  },

  methods: {
    foodsSelected: function(foods) {
      this.foods = foods
    },

    nutrientsSelected: function(nutrients) {
      this.nutrients = nutrients
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

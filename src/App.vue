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
    <v-toolbar app dense extension-height="30">
      <v-toolbar-title class="headline text-uppercase">
        <span>DIET</span>
        <span class="font-weight-light blue--text">MIND</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="settingsOpen = !settingsOpen">
        <v-icon>mdi-settings</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          height="30"
          v-model="selectedTab"
          centered
          color="transparent"
          grow
        >
          <v-tab href="#tab-1">
            Menu
          </v-tab>
          <v-tab href="#tab-2">
            Nutrition
          </v-tab>
          <v-tab href="#tab-3">
            Diet
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-content>
      <v-tabs-items
        v-model="selectedTab"
      >
        <v-tab-item value="tab-1">
          <FoodSelect
            @foodsSelected="foodsSelected"
          />
        </v-tab-item>
        <v-tab-item value="tab-2">
          <NutritionSelect
            @nutrientsSelected="nutrientsSelected"
          />
        </v-tab-item>
        <v-tab-item value="tab-3">
          <DietOptimizer
            v-bind:foods="foods"
            v-bind:nutrients="nutrients"
          />
        </v-tab-item>
      </v-tabs-items>
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
      nutrients: {},
      selectedTab: 'tab-1'
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

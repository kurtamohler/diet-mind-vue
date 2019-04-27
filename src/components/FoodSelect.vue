<template>
  <v-container>

    <!-- Selected foods list -->
    <v-card>
      <!-- <v-card-title class="headline font-weight-regular">Your Menu</v-card-title> -->
      <v-layout row align-center>

        <v-flex xs2 xs1>
          <v-btn
            icon
            small
            @click="menuCollapsed = !menuCollapsed"
          >
            <v-icon
              class="darken-2"
              color="blue"
            >
              {{menuCollapsed ? "mdi-dots-vertical": "mdi-dots-horizontal"}}
            </v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs10 sm11>
          <!--
          <v-btn
            icon
            small
          >
            <v-icon
              class="darken-2"
              color="blue"
              small
            >mdi-content-save-edit</v-icon>
          </v-btn>

          <v-btn
            icon
            small
          >
            <v-icon
              class="darken-2"
              color="blue"
              small
            >mdi-book-open</v-icon>
          </v-btn>
          -->

          <v-btn
            small
            color="info"
            @click="loadDefaultFoods"
          >
           Load default
          </v-btn>
          <v-btn
            small
            color="error"
            @click="clearFoods"
          >
          Clear
          </v-btn>
        </v-flex>

      </v-layout>

      <div
        :hidden="!menuCollapsed"
      >
        <v-divider></v-divider>
        <v-layout
        >
          <v-flex>
            <v-btn
              block
              small
              @click="menuCollapsed = false"
            >
              <v-icon>
                mdi-arrow-collapse-down
              </v-icon>
              Expand
              <v-icon>
                mdi-arrow-collapse-down
              </v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div
        :hidden="menuCollapsed"
      >
        <v-layout row wrap
        >
          <v-flex xs12
            v-for="(food, ind) in selectedFoods"
            :key="ind"
          >
            <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex xs2 sm1>
                <v-btn icon small @click="unselectFood(ind)" :data="food">
                  <v-icon color="blue">mdi-close</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs10 sm11>
                <Food
                  :food="food"
                  showMinMaxSettings
                ></Food>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </v-card>

    <!-- Food search bar -->
    <v-card class="mt-2">
      <v-layout row wrap>
        <v-flex xs12 class="px-4">
          <v-switch
            v-model="searchStandardReference"
            label="Standard reference foods only"
            @change="debouncedSearchFoods"
          >
          </v-switch>
        </v-flex>
        <v-flex xs12 class="px-4">
          <v-text-field
            label="Search foods (key words or UPC)"
            @input="debouncedSearchFoods"
            v-model="foodSearchTerm"
            id="#food-search-text-field"
            :loading="searchIsLoading"
            clearable
            clear-icon="mdi-close"
          ></v-text-field>
        </v-flex>
        <v-flex xs12
          v-for="(food, ind) in foodSearchResults"
          :key="ind"
        >
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex  xs2 sm1>
              <v-btn icon small @click="selectFood(food)" :data="food">
                <v-icon color="blue">mdi-plus</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs10 sm11>
              <Food :food="food"></Food>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>

  </v-container>
</template>


<script>
import Vue from 'vue'
import Food from './Food'
import * as ndb from '../assets/js/ndb.js'
let defaultFoods = require('../assets/json/default_menu.json')

// TODO: I want to scroll to the food search input when a
//       new list of search results comes in
// import VueScrollTo from 'vue-scrollto'

export default {
  components: {
    Food
  },

  data: function () {
    return {
      foodSearchTerm: '',
      foodSearchResults: [],
      selectedFoods: [],
      searchIsLoading: false,
      menuCollapsed: false,
      searchStandardReference: true
    }
  },

  watch: {
    selectedFoods: {
      handler() {
        localStorage.setItem('selectedFoods', JSON.stringify(this.selectedFoods))
        this.debouncedEmitSelectedFoods()
      },
      deep: true
    }
  },

  created() {
    this.debouncedSearchFoods = Vue.lodash.debounce(this.searchFoods, 500)

    this.debouncedEmitSelectedFoods = Vue.lodash.debounce(this.emitSelectedFoods, 500)
  },

  mounted() {
    if (localStorage.getItem('selectedFoods')) {
      let selectedFoodsStr = localStorage.getItem('selectedFoods')
      let selectedFoodsJSON = JSON.parse(selectedFoodsStr)

      for (let ind = 0; ind < selectedFoodsJSON.length; ind++) {
        this.selectedFoods.push(new ndb.Food(selectedFoodsJSON[ind]))
      }
    }
  },

  methods: {

    emitSelectedFoods: function() {
      this.$emit('foodsSelected', this.selectedFoods)
    },

    updateSearchResults: function(foods) {
      // if (foods.length == 0) {
      //   console.warn('failed search term: ' + this.foodSearchTerm)
      //   console.warn(foods)
      // }
      this.foodSearchResults = foods
      this.searchIsLoading = false
    },

    searchFoods: function() {
      // VueScrollTo.scrollTo(event.target)

      if (this.foodSearchTerm) {
        this.searchIsLoading = true
        let options = {}

        if (this.searchStandardReference) {
          options['ds'] = 'Standard Reference'
        }

        ndb.search_foods(
          this.foodSearchTerm,
          this.updateSearchResults,
          options
        )

      } else {
        this.foodSearchResults = []
      }
    },

    selectFood: function(food) {
      this.foodSearchTerm = ''
      this.foodSearchResults = []

      // Load the food's nutrients before adding it to selected foods array
      food.load_nutrients(() => {
        this.selectedFoods.push(food)
      })
    },

    unselectFood: function(ind) {
      this.selectedFoods.splice(ind, 1)
    },

    loadDefaultFoods: function() {
      this.clearFoods()

      for (let foodInd in defaultFoods) {
        let food = new ndb.Food(JSON.parse(JSON.stringify(defaultFoods[foodInd])))
        this.selectedFoods.push(food)
      }
    },

    clearFoods: function() {
      this.selectedFoods = []
    }
  }

}
</script>

<style>

</style>

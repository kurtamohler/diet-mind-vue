<template>
  <v-container>

    <!-- Selected foods list -->
    <v-card>
      <v-card-title class="headline font-weight-regular">Your Menu</v-card-title>
      <v-layout row wrap>
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
              <Food :food="food"></Food>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>

    <!-- Food search bar -->
    <v-card class="my-2">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            class="mx-4 mt-2"
            label="Search foods (key words or UPC)"
            v-on:input="debouncedSearchFoods"
            v-model="foodSearchTerm"
            id="#food-search-text-field"
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
      selectedFoods: []
    }
  },

  watch: {
    selectedFoods: {
      handler() {
        localStorage.setItem('selectedFoods', JSON.stringify(this.selectedFoods))
      },
      deep: true
    }
  },

  mounted() {
    if (localStorage.getItem('selectedFoods')) {
      var selectedFoodsJSON = JSON.parse(localStorage.getItem('selectedFoods'))

      for (var ind = 0; ind < selectedFoodsJSON.length; ind++) {
        this.selectedFoods.push(new ndb.Food(selectedFoodsJSON[ind]))
      }

      this.$emit('foodsSelected', this.selectedFoods)
    }
  },

  created: function() {
    this.debouncedSearchFoods = Vue.lodash.debounce(this.searchFoods, 500)

    // ndb.load_all_nutrients(function (nutrients) {
    //   console.log(JSON.stringify(nutrients, null, 2))
    // })
  },

  methods: {

    updateSearchResults: function(foods) {
      // if (foods.length == 0) {
      //   console.warn('failed search term: ' + this.foodSearchTerm)
      //   console.warn(foods)
      // }
      this.foodSearchResults = foods
    },

    searchFoods: function() {
      // VueScrollTo.scrollTo(event.target)

      if (this.foodSearchTerm) {
        ndb.search_foods(
          this.foodSearchTerm,
          this.updateSearchResults
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
        this.$emit('foodsSelected', this.selectedFoods)
      })
    },

    unselectFood: function(ind) {
      this.selectedFoods.splice(ind, 1)
      this.$emit('foodsSelected', this.selectedFoods)
    }
  }

}
</script>

<style>

</style>

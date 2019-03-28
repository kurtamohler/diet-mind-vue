<template>
  <v-container>
    <v-card>
      <v-card-title class="headline font-weight-regular">Your Menu</v-card-title>
    </v-card>

    <!-- Selected foods -->
    <v-card>
      <v-layout row wrap>
        <v-flex xs12
          v-for="(food, ind) in selectedFoods"
          :key="ind"
        >
          <v-layout row wrap>
            <v-flex xs2 sm1>
              <v-btn icon small @click="unselectFood(ind)" :data="food">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs10 sm11>
              <Food :food="food"></Food>
            </v-flex>
          </v-layout>
          <v-divider v-if="ind + 1 < selectedFoods.length" :key="`divider-${ind}`"></v-divider>
        </v-flex>
      </v-layout>
    </v-card>

    <!-- Food search results -->
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            label="Search for foods (you can try a UPC!)"
            v-on:input="debouncedSearchFoods"
            v-model="foodSearchTerm"
            id="#food-search-text-field"
          ></v-text-field>
        </v-flex>
        <v-flex xs12
          v-for="(food, ind) in foodSearchResults"
          :key="ind"
        >
          <v-layout row wrap>
            <v-flex  xs2 sm1>
              <v-btn icon small @click="selectFood(food)" :data="food">
                <v-icon color="blue">mdi-plus-circle</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs10 sm11>
              <Food :food="food"></Food>
            </v-flex>
          </v-layout>
          <v-divider v-if="ind + 1 < selectedFoods.length" :key="`divider-${ind}`"></v-divider>
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
      this.selectedFoods = JSON.parse(localStorage.getItem('selectedFoods'))
    }
  },
  created: function() {
    this.debouncedSearchFoods = Vue.lodash.debounce(this.searchFoods, 500)
  },
  methods: {
    updateSearchResults: function(response) {
      if (response.hasOwnProperty('list')) {
        var resp_list = response.list

        if (resp_list.hasOwnProperty('item')) {
          this.foodSearchResults = resp_list.item
          return
        }
      }

      console.warn('failed search term: ' + this.foodSearchTerm)
      console.warn(response)
      this.foodSearchResults = []
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
      this.selectedFoods.push(food)
    },
    unselectFood: function(ind) {
      this.selectedFoods.splice(ind, 1)
    }
  }

}
</script>

<style>

</style>

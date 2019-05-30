<!--
  Template to display nutrients from a food
-->
<template>
  <v-layout column>
    <v-flex xs12 sm6 lg4 v-for="(nutrients_info, nutrient_group) in nutrientGroups"
      :key="nutrient_group"
    >
      <v-card class="ma-1" elevation="2">
        <div class="light-blue darken-2 pa-2 white--text">
          <v-layout row wrap align-center>
            <v-flex xs7>
              <b>{{nutrient_group}}</b>
            </v-flex>
            <v-flex xs5>
              Amount
            </v-flex>
          </v-layout>
        </div>
        <div
          v-for="(nutrient_info) in nutrients_info"
          :key="nutrient_info['id']"
        >
          <v-divider></v-divider>
          
          <NutritionDisplayRow
            :nutrient="nutrients[nutrient_info['id']]"
            :nutrientInfo="nutrient_info"
          >
          </NutritionDisplayRow>
        </div>
      </v-card>

    </v-flex>
  </v-layout>
</template>


<script>
// import Vue from 'vue'
import NutritionDisplayRow from './NutritionDisplayRow'
let nutrientGroups = require('../assets/json/nutrient_groups.json')

export default {
  components: {
    NutritionDisplayRow
  },
  props: [
    'nutrients'
  ],

  data: function () {
    return {
      nutrientGroups: nutrientGroups
    }
  },
}
</script>

<style>

</style>

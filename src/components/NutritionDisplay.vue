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
            <!--
            <v-flex xs2>
              %DV
            </v-flex>
            -->
          </v-layout>
        </div>
        <div
          v-for="(nutrient_info) in nutrients_info"
          :key="nutrient_info['id']"
        >
          <v-divider></v-divider>
          <v-layout
            row
            wrap
            align-center
            class="pa-1"
            :class="{dark: false}"
          >
            <v-flex xs7 class="pr-1">
              {{
                nutrient_info['name']
              }}
            </v-flex>
            <v-flex xs5>
              {{
                nutrients[nutrient_info['id']] ?
                nutrients[nutrient_info['id']].value : '-'
              }}
              {{
                nutrients[nutrient_info['id']] ?
                nutrients[nutrient_info['id']].unit : ''
              }}
            </v-flex>
            <!--
            <v-flex xs2>
              ___%
            </v-flex>
            -->
          </v-layout>
        </div>
      </v-card>

    </v-flex>
  </v-layout>
</template>


<script>
// import Vue from 'vue'
let nutrientGroups = require('../assets/json/nutrient_groups.json')

export default {
  props: ['nutrients'],

  data: function () {
    return {
      nutrientGroups: nutrientGroups
    }
  }
}
</script>

<style>

</style>

<template>
  <v-container>
    <v-card>
      <v-card-title class="headline font-weight-regular">
        Your Nutrients
      </v-card-title>
    </v-card>
      <v-layout column>
        <v-flex xs12 sm6 lg4 v-for="(nutrients_info, nutrient_group) in nutrientGroups"
          :key="nutrient_group"
        >
          <v-card class="mt-2" elevation="2">
            <div class="light-blue darken-2 pa-2 white--text">
              <v-layout row wrap align-center>
                <v-flex xs4>
                  <b>{{nutrient_group}}</b>
                </v-flex>
                <v-flex xs3>
                  Min
                </v-flex>
                <v-flex xs3>
                  Max
                </v-flex>
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
                <v-flex xs4 class="pr-1">
                  {{
                    nutrient_info['name']
                  }}, {{nutrientReqs[nutrient_info['id']].unit}}
                </v-flex>

                <v-flex xs3>
                  <v-text-field
                    v-model="nutrientReqs[nutrient_info['id']].min_value"
                    type="number"
                  ></v-text-field>
                </v-flex>

                <v-flex xs3>
                  <v-text-field
                    v-model="nutrientReqs[nutrient_info['id']].max_value"
                    type="number"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </div>
          </v-card>

        </v-flex>
      </v-layout>
  </v-container>
</template>


<script>
// import Vue from 'vue'

var nutrientGroups = require('../assets/json/nutrient_groups.json')
var defaultNutrientReqs = require('../assets/json/nutrient_requirements_dv.json')


export default {
  components: {
  },

  data: function () {
    return {
      nutrientReqs: {},
      nutrientGroups: nutrientGroups
    }
  },

  mounted() {
  },

  created: function() {
    // this.debouncedSearchFoods = Vue.lodash.debounce(this.searchFoods, 500)
    this.nutrientReqs = defaultNutrientReqs

    for (var group_name in this.nutrientGroups) {
      var group = this.nutrientGroups[group_name]
      // console.log(group)

      for (var ind in group) {
        var id = group[ind].id
        var name = group[ind].name
        if (!this.nutrientReqs.hasOwnProperty(id)) {

          // TODO: something is wrong if this happens

          console.log(id + ': ' + name)



          // this.nutrientReqs[id] = {
          //   "name": name,
          //   "active": false,
          //   "min_value": 0,
          //   "has_max_value": false,
          //   "max_value": 0
          // }
        }
      }
    }
  },

  methods: {

  }

}
</script>

<style>

</style>

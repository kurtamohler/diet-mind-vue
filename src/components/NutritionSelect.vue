<template>
  <v-container>
    <!--
    <v-card>
      <v-card-title class="headline font-weight-regular">
        Your Nutrients
      </v-card-title>
    </v-card>
    -->

    <v-layout column>
      <v-flex xs12 sm6 lg4
        v-for="(nutrients_info, nutrient_group) in nutrientGroups"
        :key="nutrient_group"
      >
        <v-card class="mb-2" elevation="2">
          <div class="light-blue darken-2 pa-2 white--text">
            <v-layout row wrap align-center>
              <v-flex xs4>
                <b>{{nutrient_group}}</b>
              </v-flex>
              <v-flex xs4>
                Min
              </v-flex>
              <v-flex xs4>
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
              <v-flex xs4 class="px-2" style="word-wrap: break-word">
                {{
                  nutrient_info['name']
                }}, {{
                  nutrientReqs[nutrient_info['id']].unit
                }}
              </v-flex>

              <v-flex xs4 class="pl-2 pr-3">
                <v-text-field
                  v-model="nutrientReqs[nutrient_info['id']].min_value"
                  type="number"
                  class="noIncButtons"
                >
                  <template v-slot:append>
                    <v-btn
                      icon
                      small
                      @click="nutrientReqs[nutrient_info['id']].min_value = 0"
                      class="pa-0 ma-0"
                    >
                      <v-icon
                        small
                      >mdi-close</v-icon>
                    </v-btn>

                  </template>
                  
                </v-text-field>
              </v-flex>


              <v-flex xs2>
                <v-text-field
                  v-model="nutrientReqs[nutrient_info['id']].max_value"
                  type="number"
                  :disabled="!nutrientReqs[nutrient_info['id']].has_max_value"
                  class="noIncButtons"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 class="px-2">
                <v-switch
                  v-model="nutrientReqs[nutrient_info['id']].has_max_value"
                  style="transform: scale(0.8); transform-origin: left"
                ></v-switch>
              </v-flex>
            </v-layout>
          </div>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import Vue from 'vue'

var nutrientGroups = require('../assets/json/nutrient_groups.json')

var defaultNutrientReqs = require('../assets/json/nutrient_requirements_dv.json')

export default {
  data: function () {
    return {
      nutrientReqs: {},
      nutrientGroups: nutrientGroups
    }
  },

  watch: {
    nutrientReqs: {
      handler() {
        this.debouncedEmitNutrients()
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedEmitNutrients = Vue.lodash.debounce(this.emitNutrients, 500)

    this.nutrientReqs = defaultNutrientReqs

    /*
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
    */
  },

  methods: {
    emitNutrients: function() {
      this.$emit('nutrientsSelected', this.nutrientReqs)
    }
  }
}
</script>

<style>
.noIncButtons input[type='number'] {
    -moz-appearance:textfield;
}
.noIncButtons input::-webkit-outer-spin-button,
.noIncButtons input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

</style>

<template>
  <v-container>
    <v-layout column>
      <v-flex xs4>
        <v-card class="mb-2" elevation="2">
          <v-btn
            small
            @click="loadDefaultNutrients"
            color="info"
          >Load default</v-btn>
          <v-btn
            small
            @click="clearNutrients"
            color="error"
          >Clear</v-btn>
        </v-card>
      </v-flex>
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

let nutrientGroups = require('../assets/json/nutrient_groups.json')

let defaultNutrientReqs = require('../assets/json/nutrient_requirements_dv.json')
let blankNutrientReqs = require('../assets/json/nutrient_requirements_base.json')

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
        localStorage.setItem('selectedNutrients', JSON.stringify(this.nutrientReqs))
        this.debouncedEmitNutrients()
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedEmitNutrients = Vue.lodash.debounce(this.emitNutrients, 500)

    if (localStorage.getItem('selectedNutrients')) {
      this.nutrientReqs = JSON.parse(localStorage.getItem('selectedNutrients'))

    } else {
      this.clearNutrients()
    }

    // TODO: should check if this.nutrientGroups is set up correctly
  },

  methods: {
    emitNutrients: function() {
      this.$emit('nutrientsSelected', this.nutrientReqs)
    },

    loadDefaultNutrients: function() {
      this.nutrientReqs = JSON.parse(JSON.stringify(defaultNutrientReqs))

    },

    clearNutrients: function() {
      this.nutrientReqs = JSON.parse(JSON.stringify(blankNutrientReqs))
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

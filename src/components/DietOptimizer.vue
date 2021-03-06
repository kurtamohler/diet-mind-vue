<template>
  <v-container>

    <!--
    <v-card class="mb-2">
      <v-card-title class="headline font-weight-regular">
        Objectives
      </v-card-title>
      
      <v-divider />

      <v-layout row class="px-4">
        <v-flex xs6>
          <v-radio-group v-model="minimizeObjective">
            <v-radio
              v-for="isMin in [true, false]"
              :key="isMin"
              :label="isMin ? 'minimize' : 'maximize'"
              :value="isMin"
            ></v-radio>
          </v-radio-group>
        </v-flex>

        <v-flex xs6>
          <v-radio-group v-model="selectedObjective">
            <v-radio
              v-for="objective in objectives"
              :key="objective"
              :label="objective"
              :value="objective"
            ></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-card>
    -->

    <v-btn
      block
      class="light-blue darken-2 white--text"
      @click="clearAndOptimizeDiet"
    >
      Optimize!
    </v-btn>


    <div
      v-show="optimizerResultLoading"
    >
      <p>Optimizing...</p>
      <v-progress-linear
        indeterminate
        height="2"
      >
      </v-progress-linear>
    </div>

    <v-card
      class="mt-2"
      v-show="optimizerResultReady && optimizerResultFeasible"
    >
      <FoodList
        :foods="optimizedFoods"
      ></FoodList>
    </v-card>

    <v-card
      v-show="!optimizerResultFeasible"
      class="mt-2 pa-2"
    >
      Not feasible. Try adding more variety to your menu or slackening your nutrition constraints.
      <div>
        Try one of the following suggestions:
        <div
          v-for="(constraint, idx) in infeasibleConstraints.foods"
          :key="'foodConstraint'+idx"
        >
          <v-divider></v-divider>
          {{constraint.type == "min" ? "lower minimum" : "raise maximum"}} of food "{{constraint.name}}"
        </div>
        <div
          v-for="(constraint, idx) in infeasibleConstraints.nutrients"
          :key="'nutrientConstraint'+idx"
        >
          <v-divider></v-divider>
          {{constraint.type == "min" ? "lower minimum" : "raise maximum"}} of nutrient "{{constraint.name}}"
          {{constraint.type == "min" ? "or try adding a food that is high in this nutrient" : ""}}
        </div>
      </div>
    </v-card>

    <v-card
      v-if="optimizerResultFeasible && optimizerResultReady"
      class="mt-2"
    >
      <v-card-title class="headline font-weight-regular">
        Total Nutrients
      </v-card-title>
      <v-divider />
      <NutritionDisplay
        :nutrients="optimizedNutrients"
      ></NutritionDisplay>
    </v-card>

  </v-container>
</template>

<script>
import Vue from 'vue'
import FoodList from './FoodList'
import NutritionDisplay from './NutritionDisplay'
import * as diet_optimizer from '../assets/js/diet_optimizer.js'

export default {
  components: {
    FoodList,
    NutritionDisplay
  },

  props: {
    foods: {
      type: Array,
      default: function(){return []}
    },

    nutrients: {
      type: Object,
      default: function(){return {}}
    }
  },

  created() {
    this.debouncedOptimizeDiet = Vue.lodash.debounce(this.optimizeDiet, 100)
  },

  mounted() {
  },

  data: function() {
    return {
      foodAmounts: [],
      objectives: [
        'food weight',
        'calories'
      ],
      selectedObjective: 'food weight',
      minimizeObjective: true,
      optimizerResultReady: false,
      optimizedFoods: [],
      optimizerResultFeasible: true,
      optimizerResultLoading: false,
      optimizedNutrients: {},
      infeasibleConstraints: {
        'foods': [],
        'nutrients': []
      }

    }
  },

  watch: {
    foods: {
      handler() {
        this.optimizerResultFeasible = true
        this.optimizerResultReady = false
      },
      deep: true
    },

    nutrients: {
      handler() {
        this.optimizerResultFeasible = true
        this.optimizerResultReady = false
      },
      deep: true
    }
  },

  methods: {
    clearAndOptimizeDiet: function() {
      this.optimizerResultReady = false
      this.optimizerResultFeasible = true
      this.optimizerResultLoading = true
      this.debouncedOptimizeDiet()
    },

    optimizeDiet: function() {
      let optimizerResult = diet_optimizer.optimize_diet(
        this.foods,
        this.nutrients
      )

      this.optimizedFoods = []
      this.optimizedNutrients = {}

      if (optimizerResult.feasible) {
        this.displayFeasibleSolution(optimizerResult)

      } else {
        this.optimizerResultFeasible = false
        this.infeasibleConstraints = optimizerResult.infeasibleConstraints
      }
    },

    displayFeasibleSolution: function(optimizerResult) {

      for (let foodInd in this.foods) {
        let food = this.foods[foodInd]


        if (optimizerResult[foodInd]) {
          let optimizedFoodEntry = {
            'unit': food.serving_unit,
            'name': food.name,
            'info': food,
          }
          let servings = optimizerResult[foodInd]
          let foodAmount = servings * food.serving_amount

          optimizedFoodEntry['amount'] = foodAmount
            
          // Calculate the totals for all nutrients
          for (let nutrientID in food.nutrients) {
            let nutrient = food.nutrients[nutrientID]
            if (!this.optimizedNutrients.hasOwnProperty(nutrientID)) {
              this.optimizedNutrients[nutrientID] = {
                'name': nutrient.name,
                'unit': nutrient.unit,
                'value': 0,
                'food_contrib': []
              }

              let nutrient_req = this.nutrients[nutrientID]
              let optimized_nutrient = this.optimizedNutrients[nutrientID]

              // Add nutrient requirements because we will need to display them with the final report
              if (nutrient_req) {
                optimized_nutrient['has_max_value'] = nutrient_req['has_max_value']
                optimized_nutrient['max_value'] = nutrient_req['max_value']
                optimized_nutrient['min_value'] = nutrient_req['min_value']
                
              } else {
                optimized_nutrient['has_max_value'] = false
                optimized_nutrient['max_value'] = 0
                optimized_nutrient['min_value'] = 0
              }
            }

            let food_nutrient_amount = nutrient.value * servings

            if (food_nutrient_amount > 0) {
              this.optimizedNutrients[nutrientID].value += food_nutrient_amount

              this.optimizedNutrients[nutrientID].food_contrib.push({
                'name': food.name,
                'weight': foodAmount.toFixed(2) + ' ' + food.serving_unit,
                'amount': food_nutrient_amount
              })

            }
          }

          // Convert food_contrib to percentages
          for (let nutrientID in food.nutrients) {
            let nutrient = this.optimizedNutrients[nutrientID]
            for (let foodContribIdx in this.optimizedNutrients[nutrientID].food_contrib) {
              let percentage = 100.0 * nutrient.food_contrib[foodContribIdx].amount / nutrient.value
              nutrient.food_contrib[foodContribIdx].percentage = percentage.toFixed(2)
            }

            // Sort percentages in ascending order
            nutrient.food_contrib.sort(function(a, b) {
              return b.percentage - a.percentage
            })
          }

          this.optimizedFoods.push(optimizedFoodEntry)
        }
      }

      // Trim extra decimals from nutrient amounts
      for (let nutrientID in this.optimizedNutrients) {
        let nutrient = this.optimizedNutrients[nutrientID]

        nutrient.value = nutrient.value.toFixed(2)
      }

      this.optimizerResultReady = true
      this.optimizerResultLoading = false
    }
  }
}
</script>

<style>
</style>
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
      @click="optimizeDiet"
    >
      Optimize!
    </v-btn>

    <v-card
      :hidden="!optimizerResultReady"
      class="mt-2"
    >
      <v-layout row wrap>
        <v-flex xs12 class="pa-2">
          total weight: {{totalWeight.toFixed(2)}} g
        </v-flex>
        <v-flex xs3 class="pa-2">
          <h3>Amount</h3>
        </v-flex>
        <v-flex xs9 class="pa-2">
          <h3>Food</h3>
        </v-flex>

        <v-flex xs12
          v-for="(food, ind) in optimizedFoods"
          :key="ind"
        >
          <v-divider></v-divider>
          <v-layout row align-center>
            <v-flex xs3 class="px-2">
              {{food.amount}} {{food.unit}}
            </v-flex>
            <v-flex xs9 class="px-2">
              <Food :food="food.info"></Food>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>

    <v-card
      v-if="!optimizerResultFeasible"
      class="mt-2 pa-2"
    >
      Not feasible. Try adding more variety to your menu or slackening your nutrition constraints.
      <div>
        Try one of the following suggestions:
        <div
          v-for="(constraint, idx) in infeasibleConstraints.foods"
          :key="idx"
        >
          <v-divider></v-divider>
          {{constraint.type == "min" ? "lower minimum" : "raise maximum"}} of food "{{constriant.name}}"
        </div>
        <div
          v-for="(constraint, idx) in infeasibleConstraints.nutrients"
          :key="idx"
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
import Food from './Food'
import NutritionDisplay from './NutritionDisplay'
import * as diet_optimizer from '../assets/js/diet_optimizer.js'

export default {
  components: {
    Food,
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
      optimizedNutrients: {},
      totalWeight: 0,
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
    optimizeDiet: function() {
      this.optimizerResultReady = false
      this.optimizerResultFeasible = true

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
      this.totalWeight = 0

      for (let foodInd in this.foods) {
        let food = this.foods[foodInd]


        if (optimizerResult[foodInd]) {
          let optimizedFoodEntry = {
            'unit': food.serving_unit,
            'name': food.name,
            'info': food
          }
          let servings = optimizerResult[foodInd]
          let foodWeight = servings * food.serving_amount

          optimizedFoodEntry['amount'] = foodWeight.toFixed(2)
          this.totalWeight += foodWeight
            
          // Calculate the totals for all nutrients
          for (let nutrientID in food.nutrients) {
            let nutrient = food.nutrients[nutrientID]

            if (!this.optimizedNutrients.hasOwnProperty(nutrientID)) {
              this.optimizedNutrients[nutrientID] = {
                'name': nutrient.name,
                'unit': nutrient.unit,
                'value': 0
              }
            }

            this.optimizedNutrients[nutrientID].value +=
              nutrient.value * servings
          }
          this.optimizedFoods.push(optimizedFoodEntry)

        // } else {
        //   this.optimizedFoods[foodInd]['amount'] = 0
        }

      }

      // Trim extra decimals from nutrient amounts
      for (let nutrientID in this.optimizedNutrients) {
        let nutrient = this.optimizedNutrients[nutrientID]

        nutrient.value = nutrient.value.toFixed(2)
      }

      this.optimizerResultReady = true
    }
  }
}
</script>

<style>
</style>
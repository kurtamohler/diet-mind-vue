<template>
  <v-container>

    <v-card hidden>
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

    <v-btn
      block
      class="mt-2 light-blue darken-2 white--text"
      @click="optimizeDiet"
    >
      Optimize!
    </v-btn>

    <v-card
      :hidden="!optimizeResultReady"
      style="word-wrap: break-word"
    >
      <v-layout row wrap>
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
      :hidden="!optimizeResultNotFeasible"
      class="mt-2 pa-2"
    >
      Not feasible. Try adding more variety to your menu or slackening your nutrition constraints.
    </v-card>


  </v-container>
</template>

<script>
import Food from './Food'
import * as diet_optimizer from '../assets/js/diet_optimizer.js'

export default {
  components: {
    Food
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
      optimizeResult: '',
      optimizeResultReady: false,
      optimizedFoods: [],
      optimizeResultNotFeasible: false
    }
  },

  watch: {
    foods: {
      handler() {
        // console.log(JSON.parse(JSON.stringify(this.foods, null, false)))
        this.optimizeResultNotFeasible = false
        this.optimizeResultReady = false
      },
      deep: true
    },
    nutrients: {
      handler() {
        // console.log(this.nutrients)
        this.optimizeResultNotFeasible = false
        this.optimizeResultReady = false
      },
      deep: true
    }
  },

  methods: {
    optimizeDiet: function() {
      this.optimizeResultReady = false
      this.optimizeResultNotFeasible = false

      this.optimizeResult = diet_optimizer.optimize_diet(
        this.foods,
        this.nutrients
      )

      // console.log(this.optimizeResult)

      this.optimizedFoods = []


      if (this.optimizeResult.feasible) {
        for (var foodInd in this.foods) {
          var food = this.foods[foodInd]

          this.optimizedFoods[foodInd] = {
            'unit': food.serving_unit,
            'name': food.name,
            'info': food
          }

          if (this.optimizeResult[foodInd]) {
            this.optimizedFoods[foodInd]['amount'] = 
              (this.optimizeResult[foodInd] * food.serving_amount).toFixed(2)

          } else {
            this.optimizedFoods[foodInd]['amount'] = 0
          }
        }


        this.optimizeResultReady = true

      } else {
        this.optimizeResultNotFeasible = true
      }

    }
  }
}
</script>


<style>
</style>
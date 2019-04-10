<template>
  <v-container>

    <v-card>
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

    <v-card style="word-wrap: break-word">
      {{optimizeResult}}
    </v-card>

  </v-container>
</template>

<script>
import * as diet_optimizer from '../assets/js/diet_optimizer.js'

export default {
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
      optimizeResult: ''
    }
  },

  watch: {
    foods: {
      handler() {
        // console.log(JSON.parse(JSON.stringify(this.foods, null, false)))
      },
      deep: true
    },
    nutrients: {
      handler() {
        // console.log(this.nutrients)
      },
      deep: true
    }
  },

  methods: {
    optimizeDiet: function() {
      this.optimizeResult = JSON.stringify(diet_optimizer.optimize_diet(
        this.foods,
        this.nutrients
      ))
    }
  }
}
</script>


<style>
</style>
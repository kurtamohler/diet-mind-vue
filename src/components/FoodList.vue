<template>
  <v-layout row wrap>
    <v-flex xs12 class="pa-2">
      total weight: {{totalAmount.toFixed(2)}} g
    </v-flex>
    <v-flex xs3 class="pa-2">
      <h3>Amount</h3>
    </v-flex>
    <v-flex xs9 class="pa-2">
      <h3>Food</h3>
    </v-flex>

    <v-flex xs12
      v-for="(food, ind) in foods"
      :key="ind"
    >
      <v-divider></v-divider>
      <v-layout row align-center>
        <v-flex xs3 class="px-2">
          {{food.amount.toFixed(2)}} {{food.unit}}
        </v-flex>
        <v-flex xs9 class="px-2">
          <Food :food="food.info"></Food>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Food from './Food'

export default {
  components: {
    Food
  },

  props: {
    foods: {
      type: Array,
      default: function(){return []}
    }
  },

  computed: {
    totalAmount: function() {
      let amount = 0.0

      for (let foodInd in this.foods) {
        amount += this.foods[foodInd].amount
      }

      return amount
    }
  }
}
</script>

<style>
</style>
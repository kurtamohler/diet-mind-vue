<template>
  <div
    @click="show_contrib = !show_contrib"
    v-ripple
  >
    <v-layout
      row
      wrap
      align-center
      class="pa-2"
      :class="{dark: false}"
    >
      <v-flex xs7 class="pr-1">
        {{
          nutrient_info['name']
        }}
      </v-flex>
      <v-flex xs5>
        {{
          nutrient ?
          nutrient.value : '-'
        }}
        {{
          nutrient ?
          nutrient.unit : ''
        }}
      </v-flex>
    </v-layout>
    <v-card
      v-if="show_contrib && nutrient && nutrient.food_contrib"
      class="mx-4 mb-3 blue lighten-4 black--text"
    >
      <div class="light-blue darken-2 px-2 py-1 white--text">
        <h4>Food Contributions</h4>
      </div>
      <div
        v-for="(food, ind) in nutrient.food_contrib"
        :key="ind"
      >
      <v-divider class="grey lighten-1"></v-divider>
        <v-layout
          row wrap
          align-center
          class="pa-2"
        >
          <v-flex xs7 class="pr-2">
            {{food.name}}
          </v-flex>

          <v-flex xs5 class="pl-1">
            {{food.percentage}} %
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [
    'nutrient',
    'nutrient_info'
  ],

  data: function () {
    return {
      'show_contrib': false
    }
  },
} 
</script>

<style>
</style>
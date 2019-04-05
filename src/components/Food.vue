<template>
  <div>
    <v-layout row wrap align-center class="py-1">
      <v-flex xs10 sm11>
        <div class="text-sm-left">
          {{food.name}}
        </div>
      </v-flex>
      <v-flex xs2 sm1>
        <v-btn small icon @click="toggleDetails">
          <v-icon small>{{collapsed ? collapsedTrueIcon : collapsedFalseIcon}}</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <div
      :hidden="collapsed"
    >
      <h3 class="pb-1 pt-2">Nutrition</h3>
      <b>Serving size {{food.amount}} {{food.unit}}</b>
      <NutritionDisplay
        v-if="food.nutrients_loaded"
        :nutrients="food.nutrients" />
    </div>
  </div>
</template>


<script>
  import NutritionDisplay from './NutritionDisplay'
  export default {
    props: ['food'],

    components: {
      NutritionDisplay
    },

    data: function() {
      return {
        collapsed: true,
        collapsedTrueIcon: "mdi-dots-horizontal",
        collapsedFalseIcon: "mdi-dots-vertical"
      }
    },

    methods: {
      toggleDetails: function() {
        // console.log(JSON.parse(JSON.stringify(this.food.nutrients)))
        // console.log(JSON.stringify(this.food.nutrients, null, 2))


        // Load nutrients in case they haven't been yet
        this.food.load_nutrients(() => {
          this.collapsed = !this.collapsed

        })

      }
    }
  }
</script>


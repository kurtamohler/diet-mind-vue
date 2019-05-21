<template>
  <div
  >
    <v-layout
      @click="show_contrib = !show_contrib"
      v-ripple
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
      class="mx-4 mb-3"
    >
      <div class="light-blue darken-2 px-2 py-1 white--text">
        <h4>Foods containing this nutrient</h4>
      </div>
      <div
        class="pa-2"
        v-if="nutrient.value == 0"
      >
        None
      </div>

      <div
        class="py-2"
        v-if="nutrient.value > 0"
      >
        <pie-chart
          :data="contrib_chart_data"
          :library="contrib_chart_options"
        >
        </pie-chart>
      </div>

      <div
        v-for="(food, ind) in nutrient.food_contrib"
        :key="ind"
      >
        <v-divider></v-divider>
        <v-layout
          row wrap
          align-center
          class="pa-2"
        >
          <v-flex xs9 class="pr-2">
            {{food.name}} ({{food.weight}})
          </v-flex>

          <v-flex xs3 class="pl-1">
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
      'show_contrib': false,
      'contrib_chart_data': null,
      'contrib_chart_options': null
    }
  },

  mounted() {
    if (this.nutrient && this.nutrient.food_contrib) {
      this.fillContribChartData()
      this.fillContribChartOptions()
    }
  },

  methods: {
    limitStrLen(str, l=20){
      if (str.length > l) {
        return str.substring(0, l) + '...'
      } else {
        return str
      }
    },
    fillContribChartData() {
      let chart_data = []

      let str_limit = 100

      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          str_limit = 20
          break;
        case 'sm':
          str_limit = 60
          break;
      }

      for (let ind in this.nutrient.food_contrib) {
        let food = this.nutrient.food_contrib[ind]

        chart_data.push([
          this.limitStrLen(food.name, str_limit)+ ' (' + food.weight + ')',
          food.percentage
        ])
      }

      this.contrib_chart_data = chart_data


    },
    fillContribChartOptions() {
      let chart_options = {
        legend: {
          display: false
        }
      }

      this.contrib_chart_options = chart_options
    }
  }
} 
</script>

<style>
</style>
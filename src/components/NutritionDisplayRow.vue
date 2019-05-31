<template>
  <div>
    <v-card
      @click="showDetails = !showDetails"
      :ripple="(nutrient && nutrient.food_contrib) ? true : false"
      flat
      class="pa-0 ma-0"
    >
      <v-layout
        row
        wrap
        align-center
        class="pa-2"
      >
        <v-flex xs7 class="pr-1">
          {{
            nutrientInfo['name']
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
    </v-card>


    <v-dialog
      v-if="nutrient && nutrient.food_contrib"
      v-model="showDetails"
      scrollable
    >

    <!-- Table and pie chart of which foods contribute most to this nutrient amount -->
      <v-card
      >
        <v-card-title
          class="grey darken-4"
        >
          <v-layout
            row wrap
            align-center
          >
            <v-flex xs10>
              <div>
              <h2 class="white--text">
                {{nutrientInfo['name']}},
                {{nutrient.value}}
                {{nutrient.unit}}
              </h2>
              </div>
            </v-flex>

            <v-flex class="text-xs-right" xs2>
              <v-btn
                @click="showDetails=false"
                icon
              >
                <v-icon
                  color="red"
                  class="darken-2"
                  large
                >
                  mdi-close
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-card-title
          class="pb-1 pt-3"
        >
          <v-layout row wrap>
            <v-flex xs12 pb-0>
              <h4>{{minValueReport}}</h4>
            </v-flex>

            <v-flex xs12
              v-if="nutrient.has_max_value"
              pb-2
            >
              <h4>{{maxValueReport}}</h4>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-card-title
          class="light-blue darken-2 px-2 py-1 white--text"
        >
          <div class="px-2 py-1">
            <h3>Food sources</h3>
          </div>
        </v-card-title>

        <v-card-text>
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
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  props: [
    'nutrient',
    'nutrientInfo'
  ],

  data: function () {
    return {
      'showDetails': false,
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

  computed: {
    minValueReport: function() {
      return this.genValueReqReport(
        this.nutrient.min_value,
        this.nutrient.value,
        'min'
      )
    },

    maxValueReport: function() {
      return this.genValueReqReport(
        this.nutrient.max_value,
        this.nutrient.value,
        'max'
      )
    }
  },

  methods: {
    genValueReqReport(reqVal, val, label) {
      let percentage = 100.0 * val / reqVal 

      // report = report + ' (' + percentage.toFixed(2) + ' %)'

      return percentage.toFixed(2) + '% of ' + label + ' (' + reqVal.toString() + ' ' + this.nutrient.unit + ')'

    },
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
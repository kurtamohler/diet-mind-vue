<template>
  <div>
    <v-layout row wrap align-center class="py-1">
      <v-flex xs10 sm11>
        <div class="text-sm-left">
          {{food.name}}
        </div>
      </v-flex>
      <v-flex xs2 sm1>
        <v-btn
          v-if="!loadingDetails"
          small
          icon
          @click="toggleDetails"
          class="text-xs-right"
        >
          <v-icon small>
            {{
              collapsed ?
              collapsedTrueIcon : collapsedFalseIcon
            }}
          </v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- Show a loading bar when food details are loading -->
    <div
      class="mr-5"
    >
      <v-progress-linear
        v-if="loadingDetails"
        indeterminate
        height="2"
      >
      </v-progress-linear>
    </div>

    <div v-if="showMinMaxSettings || !collapsed">
      Serving size {{food.serving_amount}} {{food.serving_unit}}
    </div>

    <div
      v-if="showMinMaxSettings"
    >
      <v-layout row align-center>
        <v-flex
          xs4
          sm2
          class="px-2"
        >
          <v-text-field
            v-model="food.servings_range[0]"
            type="number"
            label="min servings"
            class="noIncButtons"
          >
          </v-text-field>
        </v-flex>
        <v-flex
          xs4
          sm2
          class="px-2"
        >
          <v-text-field
            v-model="food.servings_range[1]"
            :disabled="!food.has_max_servings"
            :hidden="!food.has_max_servings"
            type="number"
            label="max servings"
            class="noIncButtons"
          >
          </v-text-field>
        </v-flex>
        <v-flex
          xs4

          class="px-2"
        >
          <v-switch
            label="use max"
            v-model="food.has_max_servings"
            height="0"
            style="transform: scale(0.8); transform-origin: left"
          ></v-switch>
        </v-flex>
      </v-layout>
    </div>

    <div
      :hidden="collapsed"
    >
      <h3 class="pb-1 pt-2">Nutrition</h3>
      <NutritionDisplay
        class="pb-2"
        v-if="food.nutrients_loaded"
        :nutrients="food.nutrients" />
    </div>
  </div>
</template>


<script>
  import NutritionDisplay from './NutritionDisplay'

  export default {
    props: {
      food: {
        type: Object
      },
      showMinMaxSettings: {
        type: Boolean,
        default: false
      }
    },

    components: {
      NutritionDisplay
    },

    data: function() {
      return {
        collapsed: true,
        collapsedTrueIcon: "mdi-dots-horizontal",
        collapsedFalseIcon: "mdi-dots-vertical",
        loadingDetailsIcon: "mdi-loading",
        loadingDetails: false
      }
    },

    methods: {
      toggleDetails: function() {
        // console.log(JSON.parse(JSON.stringify(this.food)))


        // console.log(JSON.stringify(this.food.nutrients, null, 2))


        if (this.collapsed) {
          this.loadingDetails = true

          // Load nutrients in case they haven't been yet
          this.food.load_nutrients(() => {
            this.loadingDetails = false
            this.collapsed = false

          })
        } else {
          this.collapsed = true
        }

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

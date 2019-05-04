<template>
  <div>
    <v-layout row wrap class="py-1">
      <v-flex xs10 sm11>
        <div
          class="text-sm-left py-2"
        >
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
          <v-icon
            class="darken-2"
            color="blue"
            small
          >
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

    <v-layout row wrap align-center>
      <v-flex
        xs12
        sm4
        v-if="showMinMaxSettings || !collapsed"
      >
        Serving size {{food.serving_amount}} {{food.serving_unit}}
      </v-flex>

      <v-flex
        xs12
        sm8
        v-if="showMinMaxSettings"
      >
        <MinMaxSelect
          :min="food.servings_range[0]"
          :max="food.servings_range[1]"
          :hasMax="food.has_max_servings"
          minLabel="min servings"
          maxLabel="max servings"
          @min-changed="onMinChanged"
          @max-changed="onMaxChanged"
          @has-max-changed="onHasMaxChanged"
        />
      </v-flex>
    </v-layout>

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
import MinMaxSelect from './MinMaxSelect'

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
    NutritionDisplay,
    MinMaxSelect
  },

  data: function() {
    return {
      collapsed: true,
      collapsedTrueIcon: "mdi-dots-vertical",
      collapsedFalseIcon: "mdi-dots-horizontal",
      loadingDetailsIcon: "mdi-loading",
      loadingDetails: false
    }
  },

  methods: {
    toggleDetails: function() {
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
    },

    onMinChanged: function(newVal) {
      this.$set(
        this.food.servings_range, 0, newVal
      )
    },

    onMaxChanged: function(newVal) {
      this.$set(
        this.food.servings_range, 1, newVal
      )
    },

    onHasMaxChanged: function(newVal) {
      this.food.has_max_servings = newVal
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


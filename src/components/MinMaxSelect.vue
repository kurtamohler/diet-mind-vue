<template>
  <v-layout row align-center>
    <v-flex xs4 class="px-2">
      <v-text-field
        v-model="minVal"
        type="number"
        :label="minLabel"
        class="noIncButtons"
        @blur="verifyMin"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
    </v-flex>

    <v-flex xs4 class="px-2">
      <v-text-field
        v-model="maxVal"
        :disabled="!hasMaxVal"
        type="number"
        :label="maxLabel"
        class="noIncButtons"
        @blur="verifyMax"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
    </v-flex>

    <v-flex xs4 class="px-2">
      <v-switch
        v-model="hasMaxVal"
        label="use max"
        height="0"
        @change="hasMaxChanged"
        class="scale80percent"
      ></v-switch>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: [
    'min',
    'max',
    'hasMax',
    'minLabel',
    'maxLabel'
  ],
  data: function() {
    return {
      minVal: this.min,
      maxVal: this.max,
      hasMaxVal: this.hasMax
    }
  },

  watch: {
    min: function(newVal) {
      this.minVal = newVal
    },

    max: function(newVal) {
      this.maxVal = newVal
    },

    hasMax: function(newVal) {
      this.hasMaxVal = newVal
    }
  },

  methods: {
    // Ensure min servings is positive and not greater than
    // the max servings. Change it if needed.
    verifyMin: function() {
      let min = parseFloat(this.minVal)
      let max = parseFloat(this.maxVal)

      if (isNaN(min) || min < 0) {
        this.minVal = '0'

      } else if (min > max) {
        // this.minVal = this.maxVal
        this.maxVal = this.minVal
        this.$emit('max-changed', this.minVal)
      }

      this.$emit('min-changed', this.minVal)

    },

    // Ensure max servings is positive and not less than
    // the min servings. Change it if needed.
    verifyMax: function() {
      let min = parseFloat(this.minVal)
      let max = parseFloat(this.maxVal)

      if (this.hasMaxVal) {

        if (isNaN(max)){
          this.maxVal = this.minVal

        } else if (max < 0) {
          this.maxVal = 0
        }

        if (max < min) {
          this.minVal = this.maxVal
          this.$emit('min-changed', this.minVal)
        }
      }

      this.$emit('max-changed', this.maxVal)
    },

    hasMaxChanged: function() {
      if (this.hasMaxVal) {
        this.verifyMax()
      }

      this.$emit('has-max-changed', this.hasMaxVal)
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

.scale80percent {
  transform: scale(0.8);
  transform-origin: left;
}
</style>
<template>
  <v-layout row align-center>
    <v-flex xs5 class="pr-2">
      <v-text-field
        v-model="minVal"
        type="number"
        :label="minLabel"
        class="noIncButtons"
        @blur="verifyMin"
        clear-icon="mdi-close"
      >
        <template v-slot:append>
          <v-btn
            icon
            small
            class="pa-0 ma-0"
            style="width:16px"
            @click="clearMin"
          >
            <v-icon
              small
            >mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-flex>

    <v-flex xs5 class="pr-2">
      <div
        @click="enableMaxVal"
      >
        <v-text-field
          v-model="maxVal"
          :disabled="!hasMaxVal"
          type="number"
          :label="maxLabel"
          class="noIncButtons"
          @blur="verifyMax"
          clear-icon="mdi-close"
          ref="maxValInput"
        >
          <template v-slot:append>
            <v-btn
              icon
              small
              class="pa-0 ma-0"
              style="width:16px"
              @click="clearMax"
            >
              <v-icon
                small
              >mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </v-flex>

    <v-flex xs2>
      <v-switch
        v-model="hasMaxVal"
        height="0"
        @change="onHasMaxChanged"
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

      } else if (this.hasMaxVal && min > max) {
        // this.minVal = this.maxVal
        this.maxVal = this.minVal
        this.$emit('max-changed', this.minVal)
      }

      this.$emit('min-changed', this.minVal)

    },

    // Ensure max servings is positive and not less than
    // the min servings. Change it if needed.
    verifyMax: function(allowChangeMin=true) {
      let min = parseFloat(this.minVal)
      let max = parseFloat(this.maxVal)

      if (this.hasMaxVal) {
        if (isNaN(max) || max < 0) {
          this.maxVal = 0
          max = 0
        }

        if (max < min) {
          if (allowChangeMin) {
            this.minVal = this.maxVal
            this.$emit('min-changed', this.minVal)

          } else {
            this.maxVal = this.minVal
          }
        }
      }

      this.$emit('max-changed', this.maxVal)
    },

    onHasMaxChanged: function() {
      if (this.hasMaxVal) {
        this.verifyMax(false)
      }

      this.$emit('has-max-changed', this.hasMaxVal)
    },

    clearMin: function() {
      this.minVal = ''
    },

    clearMax: function() {
      this.maxVal = ''
    },

    enableMaxVal: function() {
      if (!this.hasMaxVal) {
        this.hasMaxVal = true
        this.onHasMaxChanged()

        // TODO: for some reason this does not work
        this.$refs.maxValInput.focus()
      }
    }
  }
}
</script>


<style scoped>
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
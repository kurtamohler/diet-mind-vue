<template>
  <v-container>

    <!-- Selected foods list -->
    <v-card>
      <v-card-title class="headline font-weight-regular">Your Nutrients</v-card-title>
      <v-layout row wrap>
        <v-flex xs12
          v-for="(nutrient, ind) in nutrients"
          :key="ind"
        >
        </v-flex>
      </v-layout>
    </v-card>

  </v-container>
</template>


<script>
// import Vue from 'vue'

export default {
  components: {
  },

  data: function () {
    return {
      nutrients: []
    }
  },

  watch: {
  },

  mounted() {
  },

  created: function() {
    // this.debouncedSearchFoods = Vue.lodash.debounce(this.searchFoods, 500)
  },

  methods: {

  }

}
</script>

<style>

</style>

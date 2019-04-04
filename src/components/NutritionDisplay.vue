<!--
  Template to display nutrients from a food
-->
<template>
  <div>
<!--     <div
      v-for="(nutrient, id) in nutrients"
      :key="id"
    >
      <v-divider></v-divider>
      <v-layout row wrap align-center>
        <v-flex class="pr-2" xs4>
          <b>{{nutrient.name}}</b>
        </v-flex>
        <v-flex xs6>
          {{nutrient.value}}
          {{nutrient.unit}}
        </v-flex>
      </v-layout>
    </div>
 --> 

  <div v-for="(nutrients_info, nutrient_group) in nutrientGroups"
    :key="nutrient_group"
  >
    <h4 class="pt-2 pb-1">{{nutrient_group}}</h4>
    <div
      v-for="(nutrient_info) in nutrients_info"
      :key="nutrient_info['id']"
      class="ml-1"
    >
      <v-divider></v-divider>
      <v-layout row wrap align-center>
        <v-flex class="pr-2" xs4>
          {{
            nutrient_info['name']
          }}
        </v-flex>
        <v-flex xs6>
<!--           {{nutrient.value}}
          {{nutrient.unit}}
 -->     
          {{
            nutrients[nutrient_info['id']] ?
            nutrients[nutrient_info['id']].value : '0'
          }}
          {{
            nutrients[nutrient_info['id']] ?
            nutrients[nutrient_info['id']].unit : ''
          }}
        </v-flex>
      </v-layout>
    </div>

  </div>


  </div>
</template>


<script>
// import Vue from 'vue'
var nutrientGroups = require('../assets/json/nutrient_groups.json')

export default {
  props: ['nutrients'],
  components: {
  },

  data: function () {
    return {
      nutrientGroups: nutrientGroups
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

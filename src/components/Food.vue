<template>
  <div>
    <v-layout row wrap align-center>
      <v-flex xs10 sm11>
        <h4 class="text-sm-left">
          {{food.name}}
        </h4>
      </v-flex>
      <v-flex xs2 sm1>
        <v-btn small icon @click="toggleDetails">
          <v-icon small>{{collapsed ? collapsedTrueIcon : collapsedFalseIcon}}</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <div
      :hidden="collapsed"
      v-for="(nutrient, ind) in food.nutrients"
      :key="ind"
    >
      <v-divider></v-divider>
      <v-layout row wrap align-center>
        <v-flex xs4>
          <h4>{{nutrient.name}}</h4>
        </v-flex>
        <v-flex xs4>
          {{nutrient.value}}
        </v-flex>
        <v-flex>
          {{nutrient.unit}} / {{nutrient.measures[0].qty}} {{nutrient.measures[0].label}}
        </v-flex>

      
      </v-layout>
    </div>
  </div>
</template>


<script>
  export default {
    props: ['food'],
    data: function() {
      return {
        collapsed: true,
        collapsedTrueIcon: "mdi-dots-horizontal",
        collapsedFalseIcon: "mdi-dots-vertical"
      }
    },
    methods: {
      toggleDetails: function() {
        this.collapsed = !this.collapsed

        // Load nutrients in case they haven't been yet
        this.food.load_nutrients()
      }
    }
  }
</script>


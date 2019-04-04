<template>
  <div>
    <v-layout row wrap align-center class="py-1">
      <v-flex xs10 sm11>
        <h3 class="text-sm-left">
          {{food.name}}
        </h3>
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
      <h3 class="pb-1">Nutrition</h3>
      <b v-if="food.amount">Amount:
          {{food.amount}} {{food.unit}}
      </b>
      <div
        v-for="(nutrient, ind) in food.nutrients"
        :key="ind"
      >
        <v-divider></v-divider>
        <v-layout row wrap align-center>
          <v-flex xs4>
            <b>{{nutrient.name}}</b>
          </v-flex>
          <v-flex xs4>
            {{nutrient.value}}
            {{nutrient.unit}}
          </v-flex>
        </v-layout>
      </div>
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
        // console.log(JSON.parse(JSON.stringify(this.food)))

        this.collapsed = !this.collapsed

        // Load nutrients in case they haven't been yet
        this.food.load_nutrients()

      }
    }
  }
</script>


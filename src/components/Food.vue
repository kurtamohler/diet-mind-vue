<template>
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
      <v-flex xs12>
        <div :hidden="collapsed">
          <p>[product details will go here]</p>
        </div>
      </v-flex>
    </v-layout>
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
        console.log(JSON.stringify(this.food))
      }
    }
  }
</script>


<script lang="ts">

import { defineComponent } from "vue"
import { currPlayerStore } from "./currPlayerStore"


export default defineComponent({
  props:{
    dimensions : {
      type : Number,
      required : true
    },
    lowestWaffleReference : {
      type : String,
      required : true
    },
    originalNestingLevel : {
      type : Number,
      required : true
    },
  },
  setup(){
    const currentPlayerStore = currPlayerStore
    return {currentPlayerStore}
  },
  data(){

    return {
      // 0 is unclaimed; -1 is X; 1 is O
    }
  },
  mounted() {
    this.currentPlayerStore.$subscribe(()=>{
      this.$forceUpdate()
    })
  },
  computed:{

    square_status: function() {
      let getGameArrPos : number = this.lowestWaffleReference!.length === 0? 0 : parseInt(this.lowestWaffleReference!,9)
      //console.log(this.lowestWaffleReference)
      return this.currentPlayerStore.gameState[getGameArrPos]

    },

    isXClaimed: function (){
      let xString : string = "";
      for (let i = 0; i < this.square_status.length; i++) {
        if (this.square_status[i] === -1) xString += (i+1).toString()
      }
      //console.log(xString)
      const winners = ["123","147","159","258","357","369","456","789"]
      for (const w of winners){
        let wins = true
        for (const ch of w){
          //console.log(w)
          if(!xString.includes(ch)){
            wins = false
          }
        }
        if (wins) {
          return true
        }
      }
      return false
    },

    isOClaimed: function (){
      let oString : string = "";
      for (let i = 0; i < this.square_status.length; i++) {
        if (this.square_status[i] === 1) oString += (i+1).toString()
      }

      const winners = ["123","147","159","258","357","369","456","789"]
      for (const w of winners){
        let wins = true
        for (const ch of w){
          if(!oString.includes(ch)){
            wins = false
          }
        }
        if (wins) {
          return true
        }
      }
      return false
    },

    isTied : function (){
      // if square status is full (aka if it does not contain 0 (unclaimed space)) & not claimed by o or x
      return (!this.square_status.includes(0) && !(this.isOClaimed || this.isXClaimed))
    },

    //is this Waffle one that can be played on
    isNextWaffleSoft : function (){
      let lowestWaffleReferenceSubstring : string = this.lowestWaffleReference!
          .substring(this.lowestWaffleReference!.length-this.currentPlayerStore.nextWaffle.length,this.lowestWaffleReference!.length)
      return lowestWaffleReferenceSubstring === this.currentPlayerStore.nextWaffle
    },
    //is this waffle one that should be highlighted
    isNextWaffleHard : function (){
      return this.originalNestingLevel !== 1 ? this.lowestWaffleReference === this.currentPlayerStore.nextWaffle : false
    },
    //is this waffle already claimed
    isWaffleAlreadyClaimed : function (){
      //check this waffle
      if (this.isOClaimed || this.isXClaimed) return true
      //check waffle layers that encompass this one
      for (let i = 1; i<=this.lowestWaffleReference.length; i++){
        if (currPlayerStore.isClaimed(this.lowestWaffleReference.substring(i))!==0) return true
      }
      return false
    },

    // dimensions for square css
    squaredim : function (){
      return (98/3)*(this.dimensions/100)
    },
    spacingdim : function (){
      return (this.dimensions/100)
    }

  },
  methods:{
    waffleSquareClick(squareNumber : number){
      // no need to check for tie: all squares in waffle will fail first 2 conditions
      if ((squareNumber>=0) && (squareNumber<=8) && (this.square_status[squareNumber] === 0)
          && this.isNextWaffleSoft && !this.isWaffleAlreadyClaimed){
        currPlayerStore.loadingPlayerBoard = true
        setTimeout(()=>{
          this.square_status[squareNumber] = this.currentPlayerStore.player
          this.currentPlayerStore.addHistory(squareNumber.toString()+this.lowestWaffleReference)
          this.currentPlayerStore.changePlayer()
          currPlayerStore.loadingPlayerBoard = false
        },0)
      }
    }
  }
})

</script>

<template>

  <div class="lowest-waffle">
    <div class="lowest-waffle-container">
      <img v-if="square_status[0]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(0)" alt="unclaimed"/>
      <img v-else-if="square_status[0]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(0)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(0)" alt="unclaimed"/>

      <img v-if="square_status[1]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(1)" alt="unclaimed"/>
      <img v-else-if="square_status[1]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(1)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(1)" alt="unclaimed"/>

      <img v-if="square_status[2]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(2)" alt="unclaimed"/>
      <img v-else-if="square_status[2]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(2)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(2)" alt="unclaimed"/>

      <img v-if="square_status[3]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(3)" alt="unclaimed"/>
      <img v-else-if="square_status[3]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(3)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(3)" alt="unclaimed"/>

      <img v-if="square_status[4]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(4)" alt="unclaimed"/>
      <img v-else-if="square_status[4]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(4)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(4)" alt="unclaimed"/>

      <img v-if="square_status[5]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(5)" alt="unclaimed"/>
      <img v-else-if="square_status[5]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(5)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(5)" alt="unclaimed"/>

      <img v-if="square_status[6]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(6)" alt="unclaimed"/>
      <img v-else-if="square_status[6]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(6)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(6)" alt="unclaimed"/>

      <img v-if="square_status[7]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(7)" alt="unclaimed"/>
      <img v-else-if="square_status[7]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(7)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(7)" alt="unclaimed"/>

      <img v-if="square_status[8]===-1 && !currentPlayerStore.reset" src="../assets/cross.png" class="lowest-waffle-square" @click="waffleSquareClick(8)" alt="unclaimed"/>
      <img v-else-if="square_status[8]===1 && !currentPlayerStore.reset" src="../assets/circle.png" class="lowest-waffle-square" @click="waffleSquareClick(8)" alt="unclaimed"/>
      <img v-else src="../assets/greypng.png" class="lowest-waffle-square" @click="waffleSquareClick(8)" alt="unclaimed"/>

    </div>
    <img v-show="isXClaimed" src="../assets/bigCross.png" class="lowest-waffle-container-overlay x" alt="unclaimed"/>
    <img v-show="isOClaimed" src="../assets/bigCircle.png" class="lowest-waffle-container-overlay o" alt="unclaimed"/>
    <div v-show="isTied" class="lowest-waffle-container-overlay tie-shade"/>
    <div v-show="isNextWaffleHard" class="lowest-waffle-container-overlay agree-halo"/>
  </div>


</template>

<style scoped>

.lowest-waffle{
  position: relative;
  text-align: center;
  display: table;
}

.lowest-waffle-container{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: black;
  column-gap: v-bind(spacingdim + "vmin");
  row-gap: v-bind(spacingdim + "vmin");
}

.lowest-waffle-square{
  display: block;
  background-color: #ffffff;
  color: black;
  text-align: center;
  vertical-align: middle;
  height: v-bind(squaredim + "vmin");
  aspect-ratio: 1;
}

.lowest-waffle-container-overlay{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: table-cell;
  align-items: center;
  font-size: v-bind(dimensions + "rem");
  pointer-events: none;
}
.x{
  color: green;
}
.o{
  color: orange;
}
.agree-halo{
  box-shadow: 0 0 v-bind(squaredim/9 + "vmin") v-bind(squaredim/9 + "vmin") greenyellow;
  z-index: 10;
}
.tie-shade{
  background-color: #80808080;
}

</style>
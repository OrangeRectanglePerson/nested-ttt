<script lang="ts">

import {defineComponent} from "vue";

import LowestWaffle from "./LowestWaffle.vue";
import {currPlayerStore} from "./currPlayerStore";


export default defineComponent({
  props: {
    nestingLevel : {
      type : Number,
      required : true
    },
    originalNestingLevel : {
      type : Number,
      required : true
    },
    dimensions : {
      type : Number,
      required : true
    },
    lowestWaffleReference : {
      default: "",
      type: String,
    },
  },
  setup(){
    const currentPlayerStore = currPlayerStore
    return {currentPlayerStore}
  },
  components:{
    LowestWaffle,
  },
  data(){
    return {

    }
  },
  created() {
    //console.log(this.nestingLevel)
    //console.log(this.originalNestingLevel)
    //console.log(this.nestingLevel == this.originalNestingLevel)
    //if(this.nestingLevel == this.originalNestingLevel) {
    //  this.currentPlayerStore.gameStateInit(this.originalNestingLevel!)
    //  //console.log(this.currentPlayerStore.gameState)
    //}
  },
  mounted() {


  },
  beforeUpdate() {

  },
  computed:{
    thisLvDims : function (){
      //console.log(this.originalNestingLevel)
      //console.log(this.nestingLevel)
      //console.log(Math.pow(3, this.originalNestingLevel!-this.nestingLevel!))
      return 98*((this.dimensions!/(Math.pow(3, this.originalNestingLevel!-this.nestingLevel!)))/100)
    },
    thisLvSeparatorDims : function (){
      return (this.dimensions!/(Math.pow(3, this.originalNestingLevel!-this.nestingLevel!)))/100
    },
    bgColor : function (){
      let r : number = Math.random()*255
      let g : number = Math.random()*255
      let b : number = Math.random()*255
      let a : number = Math.random()*255
      return "rgba("+r.toString()+","+g.toString()+","+b.toString()+",0.5)"
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
    currPlayerSymbol : function (){
      switch (currPlayerStore.player){
        case 1:
          return 'o';
        case -1:
          return 'x';
        default:
          return 'u';
      }
    }

  },
  methods:{

    isXClaimed(whichSquare:string) {
      return currPlayerStore.isClaimed(whichSquare)===-1
    },
    isOClaimed(whichSquare:string) {
      return currPlayerStore.isClaimed(whichSquare)===1
    },
    isTied(whichSquare:string){
      return currPlayerStore.isTied(whichSquare)
    }

  }
})

</script>


<template>
  <div v-if="nestingLevel>0" class="nesting-waffle">
    <div v-if="nestingLevel>1" class="nesting-waffle-container">
      <NestingWaffle :lowest-waffle-reference="'0'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'1'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'2'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'3'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'4'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'5'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'6'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'7'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
      <NestingWaffle :lowest-waffle-reference="'8'+lowestWaffleReference" :nesting-level="nestingLevel-1" :original-nesting-level="originalNestingLevel" :dimensions="dimensions" />
    </div>
    <LowestWaffle v-else
                  :lowest-waffle-reference="lowestWaffleReference"
                  :dimensions="thisLvDims"
                  :original-nesting-level="originalNestingLevel" />

    <img v-if="nestingLevel>1" v-show="isXClaimed(lowestWaffleReference)" src="../assets/bigCross.png" class="nesting-waffle-container-overlay x" alt="unclaimed"/>
    <img v-if="nestingLevel>1" v-show="isOClaimed(lowestWaffleReference)" src="../assets/bigCircle.png" class="nesting-waffle-container-overlay o" alt="unclaimed"/>
    <div v-if="nestingLevel>1" v-show="isTied(lowestWaffleReference)" class="nesting-waffle-container-overlay tie-shade"/>
    <div v-if="nestingLevel>1" v-show="isNextWaffleHard" class="nesting-waffle-container-overlay agree-halo"/>
  </div>
  <p v-else>TTC Board is not available.</p>
  <p v-if="nestingLevel===originalNestingLevel" style="margin-top: 2em">Current Player: {{currPlayerSymbol}}</p>
  <button class="resetButton" v-if="nestingLevel===originalNestingLevel" @click="currentPlayerStore.resetGame()">Reset</button>
</template>




<style scoped>

.nesting-waffle{
  position: relative;
  text-align: center;
  display: table;
}

.nesting-waffle-container{
  display: grid;
  grid-template-columns: auto auto auto;
  background-color: v-bind(bgColor);
  column-gap: v-bind(thisLvSeparatorDims + "vmin");
  row-gap: v-bind(thisLvSeparatorDims + "vmin");

}

.nesting-waffle-container-overlay{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: table-cell;
  align-items: center;
  font-size: v-bind(thisLvDims + "rem");
  pointer-events: none;
}
.x{
  color: green;
}
.o{
  color: orange;
}
.agree-halo{
  box-shadow: 0 0 v-bind(thisLvDims/90 + "vmin") v-bind(thisLvDims/90 + "vmin") greenyellow;
  z-index: 10;
}
.tie-shade{
  background-color: #80808080;
}

.resetButton{
  width: 10vmax;
  margin: 1vh auto;
  border: .2em darkred solid;
}
.resetButton:hover{
  border-color: orangered;
}
</style>
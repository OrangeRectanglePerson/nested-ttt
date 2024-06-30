<script  lang="ts">
import LowestWaffle from "./components/LowestWaffle.vue";
import NestingWaffle from "./components/NestingWaffle.vue";
import {defineComponent} from "vue";
import {currPlayerStore} from "./components/currPlayerStore";
import MultiplayerSignIn from "./components/MultiplayerSignIn.vue";
import {multiplayerStore} from "./components/multiplayerStore";

export default defineComponent({
  props:{

  },
  components:{
    MultiplayerSignIn,
    LowestWaffle,
    NestingWaffle
  },
  data(){
    return {
      isProdMode : import.meta.env.PROD as boolean,

      singlePlayerMode : true as boolean,

      NestingLevel : 3 as number,
      Dimensions : 100 as number,
      HistoryInput : "" as string,
      showDOMLoading : false as boolean,

      historyInputStatus : 1 as number,
    }
  },
  setup(){
    let playerStore = currPlayerStore
    let mpStore = multiplayerStore
    return{ playerStore, mpStore }

  },
  created(){
    this.playerStore.gameStateInit(this.NestingLevel)
  },
  beforeMount() {
    this.mpStore.$subscribe(()=>{
      if ((!this.mpStore.signedIn) && this.singlePlayerMode) this.playerStore.gameStateInit(this.NestingLevel)
    })
    this.playerStore.$subscribe(()=>{
      this.showDOMLoading = this.playerStore.loadingPlayerBoard
      //console.log(this.showDOMLoading)
    })
  },
  mounted() {

  },
  beforeUpdate() {
    //console.log("before update")
  },
  updated() {
    //console.log("updated")
  },
  computed:{
    maxWidth () {
      return this.Dimensions+"vmin"
    }

  },
  methods:{

    async copyHistory(){
      await navigator.clipboard.writeText(this.playerStore.history);
    },

    switchPlayerMode(){
      this.singlePlayerMode=!this.singlePlayerMode
      this.mpStore.gameCode = ""
      this.playerStore.gameStateInit(3)
    },

    nestinglevelchange(){
      this.playerStore.loadingPlayerBoard = true
      setTimeout(()=>{
        this.playerStore.gameStateInit(this.NestingLevel).finally(() => {
          this.playerStore.loadingPlayerBoard = false
        })
      },0)
    }

  }
})
</script>

<template>
  <div>
    <a target="_blank">
      <img src="./assets/ttt.png" class="logo" alt="tic tac toe" />
    </a>
  </div>

  <h1>Nested Tic-Tac-Toe</h1>

  <p class="desc">Play nested tic tac toe (on the same machine) with your friend!</p>
  <p class="more-to-come">Online multiplayer coming soon.</p>

  <button @click="switchPlayerMode" :disabled="isProdMode">{{ singlePlayerMode?"Single-Player Mode":"Multiplayer mode" }}</button>

  <div v-if="singlePlayerMode" class="singleplayer">
    <p>Length of sides (in % of shortest viewport dimension):</p>
    <input type="number" class="dimensions-selector" min="50" max="200" v-model.number="Dimensions">
    <p>Level of Nesting (1 to 4):</p>
    <!--
    we need to use gameStateInit to update the gameState first to accommodate a more nested ttc game before updating playerStore.nestingLevel.
    This is to ensure that the nesting-waffle element does to update before the gameState can accommodate a more nested waffle.
    Doing otherwise results in a crash as vue cannot render the waffles that are based on squarestates that dont exist yet in the gameState array.
    Making the gameStateInit function async will allow the nesting waffle to go into its inactive state as gameState is initiated.
    --->
    <input type="number" class="nesting-level-selector"
           min="1" max="4" placeholder="3"
           v-model.number="NestingLevel"
           @change="nestinglevelchange">
    <p style="margin: 1vh auto 2vh auto">{{showDOMLoading? "TTT Board updating. Please be patient." : "~"}}</p>
    <nesting-waffle :nesting-level="playerStore.nestingLevel" :original-nesting-level="playerStore.nestingLevel" :dimensions="Dimensions"/>
    <p class="gameHistory" ref="gameHistory">{{playerStore.history}}</p>
    <button class="copy-history-button" @click="copyHistory()">Copy History</button>
    <textarea cols="50" rows="10" class="save-history-input" v-model.trim="HistoryInput"/>
    <button class="save-history-button" @click="historyInputStatus = playerStore.loadGame(HistoryInput)">Enter Game History</button>
    <p v-if="historyInputStatus === 0">Valid History!</p>
    <p v-else-if="historyInputStatus > 0">Accepting other history</p>
    <p v-else style="font-size: large; background-color: rgba(137,34,34,0.7)">History Parsing Error! Error: {{historyInputStatus}}</p>
  </div>

  <div v-else class="multiplayer">
    <p>MULTIPLAYER</p>
    <MultiplayerSignIn class="multiplayersignin"/>
    <div>
      <p>Game Code: {{ mpStore.gameCode   }}</p>
      <p>O Key: {{ mpStore.gameOKey   }}</p>
      <p>X Key: {{ mpStore.gameXKey   }}</p>
      <p>View Key: {{ mpStore.gameViewKey}}</p>
      <p>Nesting Level: {{ playerStore.nestingLevel}}</p>
    </div>
    <nesting-waffle v-if="mpStore.signedIn && !mpStore.waitingForServerResponse" :key="mpStore.multiplayerTTCBoardKey.toString()" :nesting-level="playerStore.nestingLevel" :original-nesting-level="playerStore.nestingLevel" :dimensions="Dimensions"/>
    <div v-else>
      <p>Multiplayer TTC Board is not available at the moment.</p>
    </div>
  </div>


</template>

<style scoped>
@media (prefers-color-scheme: light) {
  p{
    color: black;
  }
  textarea{
    background-color: lavenderblush;
  }
  button{
    background-color: lavender;
  }
}

button{
  width: 20vmax;
  margin: 1vh auto;
}

input{
  width: 10vmax;
  margin: 1vh auto;
}

.logo {
  height: 10em;
  padding: 0;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.dimensions-selector{
  margin-bottom: 1em
}

.gameHistory{
  margin: 1em auto;
  max-width: v-bind(maxWidth);
}

.save-history-input{
  display: block;
  position: relative;
  width: 70%;
  left: 15%;
  resize: none;
}


.singleplayer{
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: auto;
}

.multiplayer{
  display: block;
}

.multiplayersignin{
  position: relative;
  height: 350px;
  justify-self: center;
  width: 70%;
  left: 15%;
}

</style>

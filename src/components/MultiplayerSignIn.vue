<script lang="ts">
import {defineComponent} from 'vue'
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import {multiplayerStore} from "./multiplayerStore";
import {currPlayerStore} from "./currPlayerStore";

export default defineComponent({
  name: "MultiplayerSignIn",
  computed: {
    multiplayerStore() {
      return multiplayerStore
    }
  },
  components:{vSelect},
  data(){
    return{
      newGameMode : true as boolean,
      nestingLevelSelected : 1 as number,
      HistoryInput : "o" as string,

      GameCodeInput : "" as string,
      UserCodeInput : "" as string,
      playerTypeSelected : 'viewer' as 'o'|'x'|'viewer',

      SignInStatus  : "Awaiting Actions" as string,
    }
  },
  methods:{
    async makeNewGame(){
      this.SignInStatus = await multiplayerStore.newGame(this.nestingLevelSelected, this.HistoryInput).finally(() => {
        multiplayerStore.waitingForServerResponse = false
      } );
    },
    async enterExistingGame(){
      let playerTypeNumber : 0|1|-1 = 0;
      switch (this.playerTypeSelected){
        case "o":
          playerTypeNumber = 1;
          break;
        case "x":
          playerTypeNumber = -1;
          break
        case "viewer":
          playerTypeNumber = 0;
          break
      }
      this.SignInStatus = await multiplayerStore.enterExistingGame(this.GameCodeInput, this.UserCodeInput, playerTypeNumber)
          .finally(() => {
            multiplayerStore.waitingForServerResponse = false
          })
    },

    switchNewGameMode(){
      this.newGameMode=!this.newGameMode
      currPlayerStore.resetGame() //reset to prevent shenanigans
      multiplayerStore.gameCode = ''
    }
  }
})
</script>

<template>
  <div class="multiplayer-signin-component-div">

    <button style="position:absolute; top:5%; height: 10%; padding:0; margin: 0; font-size: 16pt" @click="switchNewGameMode" >
      {{ newGameMode ? "New Game" : "Existing Game" }}
    </button>

    <div class="nesting-selector-div">
      <h4 class="nesting-prompt">{{ newGameMode ? "Nesting Level" : "Player Type" }}:</h4>
      <v-select v-if="newGameMode" :options="[1,2,3,4]" v-model="nestingLevelSelected" class="nesting-selector"/>
      <v-select v-else :options="['o','x','viewer']" v-model="playerTypeSelected" class="nesting-selector"/>
    </div>

    <div v-if="newGameMode" class="newgame-input-div">
      <h4 class="newgame-history-input-prompt">Game History:</h4>
      <textarea cols="50" rows="4" class="newgame-history-input" v-model.trim="HistoryInput" placeholder="Preexisting game history here. Blank is taken as new game."/>
    </div>
    <div v-else class="newgame-input-div">
      <div style="position: absolute; top: 0; height: 50%; width: 100%">
        <h4 style="margin: 0; display: inline-block; position: absolute; left: 10%; width: 30%">Game Code:</h4>
        <input style="display: inline-block; position: absolute; left: 40%; max-width: 50%" size="65" v-model.trim="GameCodeInput" placeholder="Enter Game Code Here"/>
      </div>

      <div style="position: absolute; bottom: 0; height: 50%; width: 100%">
        <h4 style="margin: 0; display: inline-block; position: absolute; left: 10%; width: 30%">User Code:</h4>
        <input style="display: inline-block;  position: absolute; left: 40%; max-width: 50%" size="65" v-model.trim="UserCodeInput" placeholder="Enter User Code Here"/>
      </div>

    </div>


    <button v-if="newGameMode" @click="makeNewGame" :disabled="multiplayerStore.waitingForServerResponse">
      {{ multiplayerStore.waitingForServerResponse ? "Waiting for server response" : "Create Game" }}</button>
    <button v-else @click="enterExistingGame" :disabled="multiplayerStore.waitingForServerResponse">
      {{ multiplayerStore.waitingForServerResponse ? "Waiting for server response" : "Enter Game" }}</button>

    <p style="position: absolute; bottom: 5%; height: 7.5%; margin: 0;">{{SignInStatus}}</p>

  </div>
</template>

<style scoped>

.multiplayer-signin-component-div{
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 3px green solid;
}

.multiplayer-signin-component-div>.nesting-selector-div{
  position: absolute;
  width: 100%;
  height: 20%;
  top: 20%;
  align-items: center;
  display: flex;
}
.multiplayer-signin-component-div>.nesting-selector-div>.nesting-prompt{
  display: inline-block;
  position: absolute;
  left: 10%;
  width: 30%;
  padding: 0;
  margin: 0;
}
.multiplayer-signin-component-div>.nesting-selector-div>.nesting-selector{
  display: inline-block;
  position: absolute;
  right: 10%;
  width: 50%;
}
.multiplayer-signin-component-div>.nesting-selector-div>:deep(.nesting-selector){
  --vs-controls-color: #664cc3;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}

.multiplayer-signin-component-div>.newgame-input-div{
  position: absolute;
  width: 100%;
  height: 30%;
  top: 40%;
  align-items: center;
  display: flex;
}
.multiplayer-signin-component-div>.newgame-input-div>.newgame-history-input-prompt{
  display: inline-block;
  position: absolute;
  left: 10%;
  width: 20%;
  padding: 0;
  margin: 0;
}
.multiplayer-signin-component-div>.newgame-input-div>.newgame-history-input{
  display: inline-block;
  position: absolute;
  right: 10%;
  width: 60%;
  resize: none;
}

.multiplayer-signin-component-div>button{
  position: absolute;
  width: 50%;
  height: 12.5%;
  padding: 0;
  margin: 0;
  bottom: 15%;
  left: 25%;
}

</style>
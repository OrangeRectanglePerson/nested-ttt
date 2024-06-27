import {defineStore} from "pinia";
import {currPlayerStore} from "./currPlayerStore";
import {globalPiniaInstance} from "../global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const multiplayerStore = defineStore({
    id:"multiplayerStore",
    state: ()=>({
        gameCode    : "" as string,
        gameOKey    : "" as string,
        gameXKey    : "" as string,
        gameViewKey : "" as string,

        multiplayerTTCBoardKey : 0 as number,
        waitingForServerResponse : false as boolean,
    }),
    getters:{
        signedIn: (state) => {return state.gameCode !== ""}
    },
    actions:{
        async newGame(nesting_level : number, game_history : string){
            this.waitingForServerResponse = true
            this.gameCode = ""
            this.gameOKey = ""
            this.gameXKey = ""
            this.gameViewKey = ""
            return fetch(`${BACKEND_URL}/new_game`, {
                method: "POST",
                body: JSON.stringify({
                    nesting_level: nesting_level,
                    game_history: game_history
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then((response) => {
                    if (!response.ok) return Promise.reject(response)
                    else return response.text()
                })
                .then((json_text) => {
                    let json_response = JSON.parse(json_text)

                    this.gameCode = json_response["gameCode"]
                    this.gameOKey = json_response["gameOKey"]
                    this.gameXKey = json_response["gameXKey"]
                    this.gameViewKey = json_response["gameViewKey"]

                    //console.log(json_response["gameState"])
                    currPlayerStore.gameState = json_response["gameState"]
                    currPlayerStore.nestingLevel = json_response["nestingLevel"]
                    currPlayerStore.history = json_response["history"]
                    currPlayerStore.nextWaffle = json_response["nextWaffle"]
                    currPlayerStore.player = json_response["currPlayer"]
                    currPlayerStore.reset = false

                    //rekey
                    this.multiplayerTTCBoardKey += 1

                    return "New Game made"

                })
                .catch(error => {
                    console.log(error.toString())
                    return "Could not make new game"
                })
        },

        async enterExistingGame(game_code : string, game_key : string, player_type : -1|0|1){
            this.waitingForServerResponse = true
            return fetch(`${BACKEND_URL}/enter_game`, {
                method: "POST",
                body: JSON.stringify({
                    game_code: game_code,
                    game_key: game_key,
                    player: player_type,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then((response) => {
                    if (!response.ok) return Promise.reject(response)
                    else return response.text()
                })
                .then((json_text) => {
                    let json_response = JSON.parse(json_text)

                    this.gameCode = json_response["gameCode"]
                    this.gameOKey = json_response["gameOKey"]
                    this.gameXKey = json_response["gameXKey"]
                    this.gameViewKey = json_response["gameViewKey"]

                    //console.log(json_response["gameState"])
                    currPlayerStore.gameState = json_response["gameState"]
                    currPlayerStore.nestingLevel = json_response["nestingLevel"]
                    currPlayerStore.history = json_response["history"]
                    currPlayerStore.nextWaffle = json_response["nextWaffle"]
                    currPlayerStore.player = json_response["currPlayer"]
                    currPlayerStore.reset = false

                    //rekey
                    this.multiplayerTTCBoardKey += 1

                    return "Entered Existing Game"

                })
                .catch(error => {
                    console.log(error.toString())
                    return "Could not enter existing game"
                })
        },

    },
})(globalPiniaInstance)
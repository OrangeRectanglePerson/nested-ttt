import {defineStore} from "pinia";
import {text} from "stream/consumers";
import {globalPiniaInstance} from "../global";

export const currPlayerStore = defineStore({
    // id is required so that Pinia can connect the store to the devtools
    id: 'currPlayer',
    state: () =>({
        player          : 1 as number,
        reset           : true as boolean,
        gameState       : [[]] as number[][],
        nestingLevel    : 3 as number,
        history         : "o " as string,
        nextWaffle      : "" as string,
        loadingPlayerBoard : false as boolean,
    }),
    getters: {},
    actions:{
        changePlayer() {
            this.reset = false
            this.player = -this.player
        },
        resetGame() {
            this.gameStateInit(this.nestingLevel)
        },
        async gameStateInit(_nestingLevel : number){
            this.player = 1
            this.reset = true
            this.nextWaffle = ""
            this.history = "o "
            this.gameState = [[]] as number[][]
            for (let i = 0; i < Math.pow(9,_nestingLevel-1); i++) {
                this.gameState[i] = [0,0,0,0,0,0,0,0,0]
                //console.log(i)
            }
            this.nestingLevel = _nestingLevel
            //console.log(_nestingLevel)
            //console.log(this.nestingLevel)
            //console.log(this.gameState)
        },
        addHistory(move:string){
            this.history += move+" "
            let protoNextWaffle: string =  move.substring(0,this.nestingLevel-1)
            //console.log(protoNextWaffle)
            //console.log(this.isOClaimed(protoNextWaffle))
            while(this.nestingLevel>1 && (this.isXClaimed(protoNextWaffle)||this.isOClaimed(protoNextWaffle))){
                protoNextWaffle = protoNextWaffle.substring(0,protoNextWaffle.length-1)
            }
            this.nextWaffle = protoNextWaffle
        },

        loadGame(history:string){
            let historyList : string[] = history.split(" ")

            // check for error in input history

            if(!(historyList.at(0) === 'x' || historyList.at(0) === 'o')) return -1;
            if(historyList.slice(1).length < 1) return -2;
            if(historyList.length > 2)
            for (let i = 2; i < historyList.length; i++) {
                if(historyList[i].length !== historyList[i-1].length) return -5;
            //    if(historyList[i].substring(1) !== historyList[i-1].substring(0,historyList[i-1].length-1)) return -6;
            }

            this.gameStateInit(historyList[1].length)
            if(historyList.at(0) === 'x') {
                this.changePlayer()
                this.history = "x "
            }
            // parse history
            for (let i = 1; i < historyList.length; i++) {
                let currMove = historyList[i]
                let lowestWaffleReference = currMove.substring(1)
                let getGameArrPos : number = lowestWaffleReference.length === 0? 0 : parseInt(lowestWaffleReference,9)
                let squareStatus = this.gameState[getGameArrPos]
                let squareNumber = parseInt(currMove.at(0)!)!
                squareStatus[squareNumber] = this.player
                this.addHistory(currMove)
                this.changePlayer()
            }

            return 0;

        },




        isXClaimed(whichSquare:string) {
            //console.log(this.currentPlayerStore.gameState)
            if (whichSquare.length === this.nestingLevel!-1) {
                console.log(whichSquare)
                let getGameArrPos : number = parseInt(whichSquare,9)
                console.log(getGameArrPos)

                let square_status : number[] = this.gameState[getGameArrPos]

                let xString: string = "";
                for (let i = 0; i < 9; i++) {
                    if (square_status[i] === -1) xString += (i + 1).toString()
                }
                //console.log(xString)
                const winners = ["123", "147", "159", "258", "357", "369", "456", "789"]
                for (const w of winners) {
                    let wins = true
                    for (const ch of w) {
                        //console.log(w)
                        if (!xString.includes(ch)) {
                            wins = false
                        }
                    }
                    if (wins) {
                        return true
                    }
                }
                return false
            } else {
                let xString: string = "";

                for (let i = 0; i <= 8; i++) {
                    if (this.isXClaimed(i.toString()+whichSquare)) xString += (i + 1).toString()

                }

                const winners = ["123", "147", "159", "258", "357", "369", "456", "789"]
                for (const w of winners) {
                    let wins = true
                    for (const ch of w) {
                        //console.log(w)
                        if (!xString.includes(ch)) {
                            wins = false
                        }
                    }
                    if (wins) {
                        return true
                    }
                }
                return false
            }
        },
        isOClaimed(whichSquare:string) {
            if (whichSquare.length === this.nestingLevel!-1) {
                let getGameArrPos : number = parseInt(whichSquare,9)
                let square_status : number[] = this.gameState[getGameArrPos]

                let oString: string = "";
                for (let i = 0; i < square_status.length; i++) {
                    if (square_status[i] === 1) oString += (i + 1).toString()
                }
                //console.log(xString)
                const winners = ["123", "147", "159", "258", "357", "369", "456", "789"]
                for (const w of winners) {
                    let wins = true
                    for (const ch of w) {
                        //console.log(w)
                        if (!oString.includes(ch)) {
                            wins = false
                        }
                    }
                    if (wins) {
                        return true
                    }
                }
                return false
            } else {
                let oString: string = "";

                for (let i = 0; i <= 8; i++) {
                    if (this.isOClaimed(i.toString()+whichSquare)) oString += (i + 1).toString()
                }
                //console.log(oString)
                const winners = ["123", "147", "159", "258", "357", "369", "456", "789"]
                for (const w of winners) {
                    let wins = true
                    for (const ch of w) {
                        //console.log(w)
                        if (!oString.includes(ch)) {
                            wins = false
                        }
                    }
                    if (wins) {
                        return true
                    }
                }
                return false
            }
        },
    }
})(globalPiniaInstance)
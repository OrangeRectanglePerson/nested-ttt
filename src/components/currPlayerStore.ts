import {defineStore} from "pinia";
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
            //also sets up next move
            this.history += move+" "
            let protoNextWaffle: string =  move.substring(0,this.nestingLevel-1)
            //History stores move position in a "reverse" order.
            //The least significant digit encodes which 1st level square (largest hash layer) the move was placed in,
            //the most significant digit encodes which lowest level square the move was placed in.
            //A move's next waffle can be obtained by truncating the least significant digit.
            //However, if that space is already claimed, we truncate the most significant digit from the protoNextWaffle
            //to get one waffle level higher.

            //Truncate the protoNextWaffle to the highest unclaimed level.
            //Check current waffle level and if it is claimed, set substring to one level up. Check all the way though
            //the layers until all levels are checked through to not miss any level's claim.
            let substring_to : number = 0
            for (let i = 0; i<=protoNextWaffle.length; i++){
                if (currPlayerStore.isClaimed(protoNextWaffle.substring(i))!==0) {
                    substring_to = i+1
                }
            }

            this.nextWaffle = protoNextWaffle.substring(substring_to)
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




        isClaimed(whichSquare:string) : 1|0|-1{
            //console.log(this.currentPlayerStore.gameState)
            if (whichSquare.length === this.nestingLevel!-1) {
                //console.log(whichSquare)
                let getGameArrPos : number = parseInt(whichSquare,9)
                //console.log(getGameArrPos)

                let square_status : number[] = this.gameState[getGameArrPos]

                let xString: string = "";
                let oString: string = "";
                for (let i = 0; i < 9; i++) {
                    if (square_status[i] === 1) oString += (i + 1).toString()
                    if (square_status[i] === -1) xString += (i + 1).toString()
                }
                //console.log(xString)
                const winners = ["123", "147", "159", "258", "357", "369", "456", "789"]
                for (const w of winners) {
                    let xWins = true
                    let oWins = true
                    for (const ch of w) {
                        //console.log(w)
                        if (!xString.includes(ch)) {
                            xWins = false
                        }
                        if (!oString.includes(ch)) {
                            oWins = false
                        }
                    }
                    if(oWins) {
                        return 1
                    }
                    if (xWins) {
                        return -1
                    }
                }
                return 0
            } else {
                let xString: string = "";
                let oString: string = "";

                for (let i = 0; i <= 8; i++) {
                    const claimedStatus = this.isClaimed(i.toString()+whichSquare)
                    if (claimedStatus===1) oString += (i + 1).toString()
                    else if (claimedStatus===-1) xString += (i + 1).toString()
                }

                const winners = ["123", "147", "159", "258", "357", "369", "456", "789"]
                for (const w of winners) {
                    let xWins = true
                    let oWins = true
                    for (const ch of w) {
                        //console.log(w)
                        if (!xString.includes(ch)) {
                            xWins = false
                        }
                        if (!oString.includes(ch)) {
                            oWins = false
                        }
                    }
                    if(oWins) {
                        return 1
                    }
                    if (xWins) {
                        return -1
                    }
                }
                return 0
            }
        },

        isTied(whichSquare:string) {
            //check if all squares are taken & x or o arent claiming this square
            if (this.isClaimed(whichSquare)!==0) { return false }
            //if checking the highest waffle level (blank string input):
            if(whichSquare.length === 0 ) { return !this.gameState.flat().includes(0) }
            //if this is already checking the lowest level waffle:
            if (whichSquare.length===this.nestingLevel!-1){
                return (!this.gameState[parseInt(whichSquare,9)].includes(0))
            }
            //if we need to check multiple mini waffles:
            //make an array of all gamestate smallest waffles to check:
            let wafflesToCheck : number[] = []
            for (let i = 0; i < 9**(this.nestingLevel-whichSquare.length-1); i++) {
                wafflesToCheck.push(i*(9**whichSquare.length) + parseInt(whichSquare,9))
                //console.log(whichSquare)
            }

            //check for unfilled squares
            for (const waffleIndex of wafflesToCheck) {
                //console.log(waffleIndex)
                if (this.gameState[waffleIndex].includes(0)) { return false }
            }
            //if no unfilled squares, waffle is tied
            return true
        },
    }
})(globalPiniaInstance)
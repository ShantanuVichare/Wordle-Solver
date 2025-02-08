
export { default as WORDLE_LIST } from './wordleList.json'

export const ALPHABETS = new Set('qwertyuiopasdfghjklzxcvbnm')

export const WORD_LENGTH = 5


export const CharState = {
    UNMATCHED: {
        name: 'UNMATCHED',
        bootstrapVariant: 'secondary',
        // color: 'lightgrey',
        // borderColor: 'darkgrey',
        color: 'darkgrey',
        getNextState: () => CharState.EXISTS
    },
    EXISTS: {
        name: 'EXISTS',
        bootstrapVariant: 'warning',
        // color: 'LightGoldenRodYellow',
        // borderColor: 'GoldenRod',
        color: 'GoldenRod',
        getNextState: () => CharState.MATCHED
    },
    MATCHED: {
        name: 'MATCHED',
        bootstrapVariant: 'success',
        // color: 'PaleGreen',
        // borderColor: 'green',
        color: 'green',
        getNextState: () => CharState.UNMATCHED
    },
}

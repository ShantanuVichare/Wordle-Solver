
export { default as WORDLE_LIST } from './wordleList.json'

export const ALPHABETS = 'qwertyuiopasdfghjklzxcvbnm'.split('')

export const WORD_LENGTH = 5


export const CharState = {
    UNMATCHED: {
        name: 'UNMATCHED',
        color: 'lightgrey',
        borderColor: 'darkgrey',
        getNextState: () => CharState.EXISTS
    },
    EXISTS: {
        name: 'EXISTS',
        color: 'LightGoldenRodYellow',
        borderColor: 'GoldenRod',
        getNextState: () => CharState.MATCHED
    },
    MATCHED: {
        name: 'MATCHED',
        color: 'PaleGreen',
        borderColor: 'green',
        getNextState: () => CharState.UNMATCHED
    },
}

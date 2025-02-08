
export { default as WORDLE_LIST } from './wordleList.json'

export const ALPHABETS = new Set('qwertyuiopasdfghjklzxcvbnm')

export const WORD_LENGTH = 5


export const CharState = {
    UNMATCHED: {
        key: 'UNMATCHED',
        bootstrapVariant: 'secondary',
        // color: 'lightgrey',
        // borderColor: 'darkgrey',
        color: 'darkgrey',
        nextStateKey: 'EXISTS',
        isState: (state) => state.key === 'UNMATCHED',
    },
    EXISTS: {
        key: 'EXISTS',
        bootstrapVariant: 'warning',
        // color: 'LightGoldenRodYellow',
        // borderColor: 'GoldenRod',
        color: 'GoldenRod',
        nextStateKey: 'MATCHED',
        isState: (state) => state.key === 'EXISTS',
    },
    MATCHED: {
        key: 'MATCHED',
        bootstrapVariant: 'success',
        // color: 'PaleGreen',
        // borderColor: 'green',
        color: 'green',
        nextStateKey: 'UNMATCHED',
        isState: (state) => state.key === 'MATCHED',
    },
}


import WORDLE_LIST_RAW from './wordleList.json'
export const WORDLE_LIST = WORDLE_LIST_RAW.map((word) => word.toLowerCase())

export const ALPHABETS = new Set('qwertyuiopasdfghjklzxcvbnm')

export const WORD_LENGTH = 5

export const LINK = {
    WORDLE_TODAY: 'https://www.nytimes.com/games/wordle/index.html',
    WORDLE_ARCHIVE: 'https://wordlearchive.com/',
}

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

import { useState } from 'react'

import { CharState, WORDLE_LIST } from '../constants'

const useWordleSolver = () => {

    const [suggestions, setSuggestions] = useState(WORDLE_LIST)

    return {
        solveForStates: (wordStates) => {
            let searchSpace = WORDLE_LIST
            
            const positionValidations = []
            const countValidations = []
            wordStates.forEach((wordState) => {
                const totalCount = {}
                const minCount = {}
                wordState.chars.forEach(({ char, state }, charIndex) => {
                    totalCount[char] = (totalCount[char] || 0) + 1
                    minCount[char] = (minCount[char] || 0)
                    if (CharState.MATCHED.isState(state)) {
                        minCount[char] += 1
                        positionValidations.push(s => s[charIndex] === char)
                    }
                    if (CharState.EXISTS.isState(state)) {
                        minCount[char] += 1
                        positionValidations.push(s => s[charIndex] !== char)
                    }
                })
                Object.keys(totalCount).forEach(char => {
                    if (totalCount[char] > minCount[char]) {
                        countValidations.push(s => s.split(char).length - 1 == minCount[char])
                    } else {
                        countValidations.push(s => s.split(char).length - 1 >= minCount[char])
                    }
                })
            })
            searchSpace = searchSpace.filter(s => {
                return [
                    ...positionValidations,
                    ...countValidations
                ].every(condition => condition(s))
            })
            setSuggestions(searchSpace)
        },
        getSuggestions: () => suggestions,
        messify: () => {
            setSuggestions(WORDLE_LIST.slice(0, Math.floor(Math.random() * WORDLE_LIST.length)))
        }
    };
}

export default useWordleSolver

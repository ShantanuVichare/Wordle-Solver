import { useState } from 'react'

import { CharState, WORDLE_LIST } from '../constants'

const useWordleSolver = () => {

    const [suggestions, setSuggestions] = useState(WORDLE_LIST)

    return {
        solveForStates: (wordStates) => {
            let searchSpace = WORDLE_LIST
            const mDict = {}
            const eDict = {}
            const uDictPos = {} // track unmatched chars by position
            const uDictAll = {} // track chars unmatched completely
            const freq = {}

            wordStates.forEach((wordState) => {
                wordState.chars.forEach(({ char, state }, charIndex) => {
                    if (state === CharState.MATCHED) {
                        mDict[char] ? mDict[char][charIndex] = true : mDict[char] = { [charIndex]: true }
                    }
                    if (state === CharState.EXISTS) {
                        eDict[char] ? eDict[char][charIndex] = true : eDict[char] = { [charIndex]: true }
                    }
                    if (state === CharState.UNMATCHED) {
                        // if char wasn't matched or existed in this guess, exclude fully
                        const wasUsed = wordState.chars.some(({ char: c, state: st }) => c === char && (st === CharState.MATCHED || st === CharState.EXISTS))
                        if (wasUsed) {
                            uDictPos[char] ? uDictPos[char][charIndex] = true : uDictPos[char] = { [charIndex]: true }
                        } else {
                            uDictAll[char] = true
                        }
                    }
                    if (state === CharState.MATCHED || state === CharState.EXISTS) {
                        freq[char] = (freq[char] || 0) + 1
                    }
                })
                searchSpace = searchSpace.filter(s => {
                    const filterConditions = []
                    Object.keys(mDict).forEach(c => Object.keys(mDict[c]).forEach(i => filterConditions.push(s => s[i] === c)))
                    Object.keys(eDict).forEach(c => Object.keys(eDict[c]).forEach(i => filterConditions.push(s => s[i] !== c && s.includes(c))))
                    // exclude letters fully if in uDictAll
                    if (Object.keys(uDictAll).some(c => s.includes(c))) return false
                    // exclude positions for letters in uDictPos
                    for (const c of Object.keys(uDictPos)) {
                        for (const i of Object.keys(uDictPos[c])) {
                            if (s[i] === c) return false
                        }
                    }
                    // check total occurrences
                    for (const c of Object.keys(freq)) {
                        const count = s.split("").filter(x => x === c).length
                        if (count < freq[c]) return false
                    }
                    return s.split("").every(c => !uDictAll[c]) &&
                        filterConditions.every(condition => condition(s))
                })
            })
            setSuggestions(searchSpace)
        },
        getSuggestions: () => suggestions,
        messify: () => {
            setSuggestions(WORDLE_LIST.slice(0, Math.floor(Math.random() * list.length)))
        }
    };
}

export default useWordleSolver

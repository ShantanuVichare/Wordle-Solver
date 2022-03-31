import { useRef, useState } from 'react'

import { WORDLE_LIST, ALPHABETS } from '../constants'

const useWordleSolver = () => {

    const searchSpace = useRef([...WORDLE_LIST])
    const mDict = useRef({})
    const uDict = useRef({})
    const cDict = useRef({})
    const [suggestions, setSuggestions] = useState([...WORDLE_LIST])

    return {
        update: (matched, unMatched, charMatched) => {

            matched.forEach((c, i) => ALPHABETS.includes(c) && (mDict.current[c] ? mDict.current[c][i] = true : mDict.current[c] = { [i]: true }))
            charMatched.forEach((c, i) => ALPHABETS.includes(c) && (cDict.current[c] ? cDict.current[c][i] = true : cDict.current[c] = { [i]: true }))

            unMatched.forEach((c) => ALPHABETS.includes(c) && (uDict.current[c] = true))

            searchSpace.current = searchSpace.current.filter(s => {
                const filterConditions = []
                Object.keys(mDict.current).forEach(c => Object.keys(mDict.current[c]).forEach(i => filterConditions.push(s => s[i] === c)))
                Object.keys(cDict.current).forEach(c => Object.keys(cDict.current[c]).forEach(i => filterConditions.push(s => s[i] !== c && s.includes(c))))

                return s.split("").every(c => !uDict.current[c]) &&
                    filterConditions.every(condition => condition(s))
            })
        },
        getSuggestions: () => suggestions,
        init: () => {
            searchSpace.current = [...WORDLE_LIST]
            mDict.current = {}
            cDict.current = {}
            uDict.current = {}
        },
        complete: () => {
            setSuggestions(searchSpace.current)
        },
        messify: () => {
            searchSpace.current = [...WORDLE_LIST].slice(0, Math.floor(Math.random() * WORDLE_LIST.length))
        }
    };
}

export default useWordleSolver

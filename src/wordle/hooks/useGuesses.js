import { useState, useEffect } from 'react'

import { CharState } from '../constants'

const useGuesses = () => {
    const [wordStates, setWordStates] = useState(() => {
        const savedWordStates = localStorage.getItem('wordStates')
        return savedWordStates ? JSON.parse(savedWordStates) : []
    })

    useEffect(() => {
        localStorage.setItem('wordStates', JSON.stringify(wordStates))
    }, [wordStates])

    return {
        getWordState: (index) => wordStates[index],
        addWord: (wordString) => {
            const index = wordStates.length
            const newWordState = {
                index: index,
                text: wordString,
                chars: wordString.split('').map((c) => ({
                    char: c,
                    state: CharState.UNMATCHED
                }))
            }
            setWordStates([...wordStates, newWordState])
            return index
        },
        updateCharState: (wordIndex, charIndex) => {
            const updatedWordStates = [...wordStates]
            const updatedCharState = updatedWordStates[wordIndex].chars[charIndex]
            updatedCharState.state = CharState[updatedCharState.state.nextStateKey]
            setWordStates(updatedWordStates)
        },
        resetWordStates: (endIdx=0) => setWordStates(wordStates.slice(0, endIdx)),
        wordStates,
    }
}

export default useGuesses

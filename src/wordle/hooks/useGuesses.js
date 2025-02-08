import { useState } from 'react'

import { CharState } from '../constants'

const useGuesses = () => {
    const [wordStates, setWordStates] = useState([])

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
            updatedCharState.state = updatedCharState.state.getNextState()
            setWordStates(updatedWordStates)
        },
        resetWordStates: (endIdx=0) => setWordStates(wordStates.slice(0, endIdx)),
        wordStates,
    }
}

export default useGuesses

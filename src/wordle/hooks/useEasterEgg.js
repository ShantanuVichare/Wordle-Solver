import { useRef } from 'react'

const useEasterEgg = (callback) => {

    const counter = useRef(0)
    const MAX_COUNT = 3

    return {
        getClick: () => {
            if (counter.current >= MAX_COUNT) {
                callback()
            } else {
                console.log(counter.current)
                counter.current += 1
                setTimeout(() => counter.current -= 1, 1500)
            }
        },
    }
}

export default useEasterEgg

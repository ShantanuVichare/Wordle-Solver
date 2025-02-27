import { useRef } from 'react'

const useEasterEgg = (callback) => {

    const progress = useRef(0)

    return {
        getClick: () => {
            console.debug('EasterEgg progress', progress.current)
            if (progress.current >= 1.0) {
                callback()
            } else {
                progress.current += 1/3
                setTimeout(() => progress.current -= 1/3, 1500)
            }
        },
    }
}

export default useEasterEgg

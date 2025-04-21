import { useState, useEffect } from 'react'

const INITIAL_DELAY = 0 // Optional delay before making the API call

const useCheatCode = () => {

    const [cheatCode, setCheatCode] = useState(null)

    useEffect(() => {
        // check if solution is available 
        // Make a call to the API to get the solution
        // Example: https://www.nytimes.com/svc/wordle/v2/2025-04-21.json
        // Example response: {"id":2328,"solution":"spate","print_date":"2025-04-21","days_since_launch":1402,"editor":"Tracy Bennett"}

        const date = new Date()
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        // Initially, we will wait before making the API call to get the solution
        new Promise(resolve => setTimeout(resolve, INITIAL_DELAY))
            .then(() => {
                return fetch(`/wordle-solution/${year}/${month}/${day}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    cache: 'no-cache',
                })

                // For testing, we can mock the above fetch call
                return {
                    ok: true,
                    json: async () => ({ solution: 'cheat' })
                }

            })
            .then(response => {
                if (!response.ok) {
                    throw 'Non-ok response received:' + JSON.stringify(response)
                }
                return response.json();
            })
            .then(data => data.solution)
            .then(solution => {
                console.debug('Cheat solution:', solution);
                setCheatCode(solution)
            })
            .catch(error => {
                console.error('There was a problem fetching the Cheat solution:', error);
                console.debug('You can get the Cheat solution from:', `https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`);
            });
    }, [])


    return {
        isCheatCodeActive: !!cheatCode,
        getCheatCode: () => cheatCode,
    };
}

export default useCheatCode

const input = require('prompt-sync')()
const print = console.log

const alphs = 'qwertyuiopasdfghjklzxcvbnm'.split('')
const li = require('./src/wordle/wordleList.json')

let ss = [...li]
let blacks = []
// greens = [null, null, null, null, null]
// yellows = [[], [], [], [], []]

let filterConditions = []

try {
    while (true) {
        print(`Print ${ss.length} words? Press [y] or [Enter] to skip`)
        const printWords = input().toLowerCase() === 'y'
        if (printWords) print(ss)

        print('End guessing? Press [y] or [Enter] to skip')
        const endGuessing = input().toLowerCase() === 'y'
        if (endGuessing) {
            print('Ended')
            break
        }


        print('Enter Unmatched:')
        const unmatched = (input(`.....\r`) + '.....').slice(0, 5).toLowerCase().split('')
        console.log('Unmatched:', unmatched.map(c => alphs.includes(c) ? c : '_').join(''))
        blacks = [...new Set([...blacks, ...unmatched.filter(c => alphs.includes(c))])]


        print('Enter Matched:')
        const matched = (input(`.....\r`) + '.....').slice(0, 5).toLowerCase().split('')
        console.log('Matched:', matched.map(c => alphs.includes(c) ? c : '_').join(''))
        matched.forEach((c, i) => {
            if (alphs.includes(c)) {
                filterConditions.push(s => s[i] === c)
            }
        })


        print('Enter chars matched:')
        const cmatched = (input(`.....\r`) + '.....').slice(0, 5).toLowerCase().split('')
        console.log('Chars matched:', cmatched.map(c => alphs.includes(c) ? c : '_').join(''))
        cmatched.forEach((c, i) => {
            if (alphs.includes(c)) {
                filterConditions.push(s => s[i] !== c && s.includes(c))
            }
        })

        ss = ss.filter(s => s.split("").every(c => !blacks.includes(c)) && filterConditions.every(condition => condition(s)))

    }
} catch (e) {
    print('Ended')
}

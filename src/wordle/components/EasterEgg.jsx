import React, { useEffect, useRef, useState } from 'react';
import { useEasterEgg } from '../hooks';

const isDarkReaderActive = () => {
    return document.documentElement.hasAttribute('data-darkreader-scheme');
}


const TextChar = ({ char, eggTriggered }) => {
    const [text, setText] = useState(char);
    const [color, setColor] = useState('Black');
    const intervalId = useRef(null);

    useEffect(() => {
        if (eggTriggered) {
            // create an interval to randomly generate colors from {black, GoldenRod, green}
            if (!intervalId.current) {
                const id = setInterval(() => {
                    const colors = ['Black', 'GoldenRod', 'Green'];
                    {
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        setColor(randomColor);
                    }
                }, 250);
                intervalId.current = id;
            }
            setText(char.toUpperCase());
        } else {
            // clear the interval and set color to black
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;

                setColor('Green');
                // setText(<s>{char.toUpperCase()}</s>);
                setTimeout(() => {
                    setColor('Black');
                    setText(char);
                }, 1500);
            }
        }
    }, [eggTriggered]);

    return (
        <span style={{ color: color }}>
            {char === ' ' ? '\u00A0' : text}
        </span>
    );
}


const EasterEgg = () => {

    const [eggTriggered, setEggTriggered] = useState(false)
    const EasterEgg = useEasterEgg(() => {
        setEggTriggered(true)
        setTimeout(() => setEggTriggered(false), 4000)
    })

    return (
        <div style={{ userSelect: 'none' }} onClick={() => EasterEgg.getClick()}>
            <h1 className="text-center mb-5">
                {
                    "Wordle Solver".split('').map((char, index) => (
                        <TextChar key={index} char={char} eggTriggered={eggTriggered} />
                    ))
                }
            </h1>
        </div>
    );
};

export default EasterEgg;
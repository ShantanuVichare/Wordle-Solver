import React, { useEffect, useRef, useState } from 'react';
import { useEasterEgg } from '../hooks';

const isDarkReaderActive = () => {
    return document.documentElement.hasAttribute('data-darkreader-scheme');
}


const TextChar = ({ char, eggTriggered }) => {
    const [text, setText] = useState(char);
    const [color, setColor] = useState('');
    const [blockRender, setBlockRender] = useState(false);
    const intervalId = useRef(null);

    useEffect(() => {
        if (eggTriggered) {
            setBlockRender(true);
            // create an interval to randomly generate colors from {black, GoldenRod, green}
            if (!intervalId.current) {
                const id = setInterval(() => {
                    const colors = ['', 'GoldenRod', 'Green'];
                    {
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        setColor(randomColor);
                    }
                }, 500);
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
                    setBlockRender(false);
                    setColor('');
                    setText(char);
                }, 2000);
            }
        }
    }, [eggTriggered]);

    return (
        <span style={{ backgroundColor: color,  minWidth: blockRender ? '1em' : '', margin: blockRender ? '0 2px' : '0', display: 'inline-block' }}>
            {char === ' ' ? '\u00A0' : text}
        </span>
    );
}


const EasterEgg = () => {

    const [eggTriggered, setEggTriggered] = useState(false)
    const { registerAction } = useEasterEgg(() => {
        setEggTriggered(true)
        setTimeout(() => setEggTriggered(false), 4000)
    })

    return (
        <div style={{ userSelect: 'none', marginBottom: '2rem' }} onClick={() => {
            // registerAction()
            if (!eggTriggered) {
                setEggTriggered(true)
                setTimeout(() => setEggTriggered(false), 4000)
            }
        }}>
            {
                ['Wordle', 'Solver'].map((headingWord, index) => (
                    <h1 key={index} className="text-center" style={{ display: 'inline-block', margin: '0.1em 0.25em' }}>
                        {
                            headingWord.split('').map((char, index) => (
                                <TextChar key={index} char={char} eggTriggered={eggTriggered} />
                            ))
                        }
                    </h1>
                ))
            }
        </div>
    );
};

export default EasterEgg;
import React, { useCallback, useEffect, useState } from "react";
import { Container, Button, Modal, Form, Row, Col, InputGroup, ListGroup } from "react-bootstrap";

import { WORD_LENGTH, ALPHABETS } from '../constants';
import { useWordleSolver, useGuesses, useEasterEgg } from '../hooks'


import 'bootstrap/dist/css/bootstrap.min.css';


const DisplayWord = ({ wordState, getCharClickHandler }) => {
  console.debug('DisplayWord rendered')

  const getButtonStyle = (charState) => {
    return {
      // backgroundColor: charState.color,
      // borderStyle: 'solid',
      borderWidth: '0px',
      // borderColor: charState.borderColor,
      // color: 'black',
      height: '50px',
      width: '50px',
      margin: '2px',
      fontWeight: 'bold'
    }
  }

  return (
    <div>
      {
        wordState.chars.map(({ char, state }, charIndex) => (
          <Button variant={state.bootstrapVariant} 
            style={getButtonStyle(state)}
            key={charIndex}
            onClick={getCharClickHandler(charIndex)}
          >
            {char.toUpperCase()}
          </Button>
        ))
      }
    </div>
  )
}

const WordsSuggestionList = ({ isVisible, onHide, wordList, onWordSelect }) => {
  console.debug('WordsSuggestionList rendered')

  const [filterQuery, setFilterQuery] = useState('')
  wordList = wordList.filter(word => word.includes(filterQuery.toLowerCase()))

  const getWordClickHandler = (word) => () => {
    onWordSelect(word)
  };

  return (
    <Modal show={isVisible} onHide={onHide} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Suggestions</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center bg-light" >
        <ListGroup variant="flush">
          {wordList.map((word, si) => <Button variant="light" onClick={getWordClickHandler(word.toLowerCase())} key={si}>{word.toLowerCase()}</Button>)}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Form.Control type="text" size="md" value={filterQuery} onChange={(e) => {
          e.preventDefault()
          setFilterQuery(e.target.value)
        }} placeholder="Filter suggestions" />
      </Modal.Footer>
    </Modal>
  )
}


const WordleContainer = () => {
  console.debug('WordleContainer rendered')

  const [currentWord, setCurrentWord] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { addWord, updateCharState, resetWordStates, wordStates } = useGuesses()
  const wordleSolver = useWordleSolver()

  const [eggTriggered, setEggTriggered] = useState(false)
  const EasterEgg = useEasterEgg(() => {
    setEggTriggered(true)
    setTimeout(() => setEggTriggered(false), 3000)
  })

  const handleWordSubmit = useCallback((event) => {
    event.preventDefault();
    const word = currentWord
    if (word.length === WORD_LENGTH) {
      addWord(word.toLowerCase())
      setCurrentWord('')
    }
  }, [currentWord])

  const handleWordInput = useCallback((event) => {
    event.preventDefault();
    const word = event.target.value
    if (word.length <= WORD_LENGTH && [...word].every(c => ALPHABETS.has(c))) {
      setCurrentWord(word)
    }
  }, [])

  useEffect(() => {
    wordleSolver.solveForStates(wordStates)
  }, [wordStates])

  return (
    <Container className="mb-5" style={{ maxWidth: '800px' }}>
      <Container className="shadow-sm p-5 mb-4" style={{ userSelect: 'none' }} onClick={() => EasterEgg.getClick()}>
        <h1 className="text-center mb-5">
          {eggTriggered ? <s>Wordle Solver</s> : 'Wordle Solver'}
        </h1>

      <Row className="justify-content-center">
      <Col>
        <Button variant="outline-dark" href="https://www.nytimes.com/games/wordle/index.html" target="_blank">Play Today's Wordle</Button>
        </Col>
        <Col>
        <Button variant="outline-dark" href="https://wordlearchive.com/" target="_blank">Open Wordle Archive</Button>
        </Col>
      </Row>

      </Container>
      <Container>
        <Row className="justify-content-center">
          <Col>
            <Container className="shadow-sm p-4 mb-4" style={{ minWidth: `350px`, }} >
              <p className="mt-2">
                {
                  wordStates.length > 0 ? 
                    "Tap on character to change it's color" :
                    "Go ahead make a guess"
                }
              </p>
              {
                wordStates.map((wordState, wordIndex) => <DisplayWord
                  key={wordIndex}
                  wordState={wordState}
                  getCharClickHandler={(charIndex) => () => updateCharState(wordIndex, charIndex)}
                />)
              }
            </Container>
          </Col>
          <Col>
            <Container className="shadow-sm p-4 mb-4" style={{ minWidth: '350px' }}>
              <InputGroup className="mx-auto">
                <Form className="my-1 mx-1" onSubmit={handleWordSubmit}>
                  <Form.Control type="text" size="md" value={currentWord} onChange={handleWordInput} placeholder="Enter your Guess" />
                </Form>
                <Button className="my-1 mx-1" variant="outline-danger" onClick={() => resetWordStates() && wordleSolver.reset()}>Reset</Button>
              </InputGroup>
                {
                  wordStates.length > 0 &&
                  <InputGroup className="mt-3 mx-auto">
                    <Button className="my-1 mx-1" variant="outline-primary" onClick={() => resetWordStates(-1)} >Undo Word</Button>
                  </InputGroup>
                }
            </Container>

          </Col>
        </Row>
        {/* <Button className="m-1" onClick={() => {
        wordleSolver.messify()
        console.log('Messed up suggestions 😛')
      }}>Mess around</Button> */}

        <Button 
          variant={wordStates.length > 0 ? 'primary' : 'outline-secondary'} 
          size={wordStates.length > 0 && "lg"}
          onClick={() => setShowSuggestions(true)} 
        >
          {`View ${wordleSolver.getSuggestions().length} suggestions`}
        </Button>
        { showSuggestions && 
          <WordsSuggestionList
            isVisible={showSuggestions}
            onHide={() => setShowSuggestions(false)}
            wordList={wordleSolver.getSuggestions()}
            onWordSelect={(word) => {
              addWord(word)
              setShowSuggestions(false)
            }}
          />
        }
      </Container>
    </Container>

  )
}

export default WordleContainer;

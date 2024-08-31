import React, { useCallback, useEffect, useState } from "react";
import { Container, Button, Modal, Form, Row, Col, InputGroup, ListGroup } from "react-bootstrap";

import { CharState, WORD_LENGTH } from '../constants';
import { useWordleSolver, useGuesses, useEasterEgg } from '../hooks'


import 'bootstrap/dist/css/bootstrap.min.css';


const DisplayWord = ({ wordState, getCharClickHandler }) => {
  console.debug('DisplayWord rendered')

  const getButtonStyle = (charState) => {
    return {
      backgroundColor: charState.color,
      borderStyle: 'solid',
      borderWidth: '3px',
      borderColor: charState.borderColor,
      color: 'black',
      height: '50px',
      width: '50px',
      margin: '5px',
      fontWeight: 'bold'
    }
  }

  return (
    <div>
      {
        wordState.chars.map(({ char, state }, charIndex) => (
          <button key={charIndex} style={getButtonStyle(state)}
            onClick={getCharClickHandler(charIndex)}>
            {char.toUpperCase()}
          </button>
        ))
      }
    </div>
  )
}

const WordsSuggestionList = ({ isVisible, onHide, wordList }) => {
  console.debug('WordsSuggestionList rendered')

  const [filterQuery, setFilterQuery] = useState('')
  wordList = wordList.filter(word => word.includes(filterQuery.toLowerCase()))

  return (
    <Modal show={isVisible} onHide={onHide} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Suggestions</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center" >
        <ListGroup variant="flush">
          {wordList.map((word, si) => <ListGroup.Item key={si}>{word}</ListGroup.Item>)}
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
  }, [currentWord, addWord])

  const handleWordInput = useCallback((event) => {
    event.preventDefault();
    const word = event.target.value
    if (word.length <= WORD_LENGTH) {
      setCurrentWord(event.target.value)
    }
  }, [])

  const handleSuggestionListHide = useCallback(() => setShowSuggestions(false), [])

  useEffect(() => {
    wordleSolver.init()
    wordStates.forEach(wordState => {
      const matched = wordState.chars.map(({ char, state }) => state === CharState.MATCHED ? char.toLowerCase() : '-')
      const unMatched = wordState.chars.map(({ char, state }) => state === CharState.UNMATCHED ? char.toLowerCase() : '-')
      const charMatched = wordState.chars.map(({ char, state }) => state === CharState.EXISTS ? char.toLowerCase() : '-')
      wordleSolver.update(matched, unMatched, charMatched)
    })
    wordleSolver.complete()
  }, [wordStates, wordleSolver])

  return (
    <Container style={{ maxWidth: '800px' }}>
      <Container className="shadow-sm p-5 mb-5" style={{ userSelect: 'none' }} onClick={() => EasterEgg.getClick()}>
        {
          eggTriggered ?
            <h1>Made with ♥️ by Shaan</h1> :
            <h1>Wordle Solver</h1>
        }
      </Container>
      <Container>
        <Row className="justify-content-center">
          <Col className="mb-3">
            <Container className="shadow-sm p-4" style={{ minWidth: `350px`, }} >
              {/* <h2>Guesses</h2> */}
              {
                wordStates.length > 0 ?
                  <p>Tap on any character to change it's color</p> :
                  <p>Go ahead make a guess</p>
              }
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
            <Container style={{ minWidth: '360px' }}>
              <InputGroup className="mb-3 mx-auto">
                <Form className="my-1" onSubmit={handleWordSubmit}>
                  <Form.Control type="text" size="md" value={currentWord} onChange={handleWordInput} placeholder="Enter your Guess" />
                </Form>
                <Button className="my-1" variant="outline-danger" onClick={() => resetWordStates() && wordleSolver.reset()}>Reset</Button>
              </InputGroup>
            </Container>
          </Col>
        </Row>
        {/* <Button className="m-1" onClick={() => {
        wordleSolver.messify()
        console.log('Messed up suggestions 😛')
      }}>Mess around</Button> */}

        <Button variant={wordStates.length > 0 ? 'primary' : 'outline-secondary'} size={wordStates.length > 0 && "lg"} onClick={() => setShowSuggestions(true)} >
          {`View ${wordleSolver.getSuggestions().length} suggestions`}
        </Button>
        {showSuggestions && <WordsSuggestionList
          isVisible={showSuggestions}
          onHide={handleSuggestionListHide}
          wordList={wordleSolver.getSuggestions()}
        />}
      </Container>
    </Container>

  )
}

export default WordleContainer;

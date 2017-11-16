import '../css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Navbar from './Navbar';
import Board from './Board';

// import { DragDropContext } from 'react-beautiful-dnd';

// a little function to help us with reordering the result

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      board: {
        title: null
      }
    }
  }

  componentDidMount() {
    fetch('/api/v1/boards/1')
      .then(response => response.json())
      .then(board => this.setState({board: board.data}) )
  }

  render() {
    return (
      <div className="container">
        <Navbar />
        <Board board={this.state.board} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

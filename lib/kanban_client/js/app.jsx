import '../css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Navbar from './Navbar';
import Board from './Board';

import { DragDropContext } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
function reorder(list, startIndex, endIndex) {
  var result = Array.from(list);
  var [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      board: {}
    }

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    fetch('/api/v1/boards/1')
      .then(response => response.json())
      .then(json => this.setState({board: json.data}))
      .catch(console.error);
  }

  onDragEnd(result) {
    var { destination, source, type, draggableId } = result;

    // dropped outside the list
    if (destination) {
      return;
    }
  
    else if (destination.droppableId === source.droppableId) {
      // var reordered = reorder(
      //   this.store.,
      //   result.source.index,
      //   result.destination.index
      // );

      if (type === "COLUMN") {
        console.log("SHUFFLE LISTS")
      }
      else if (type === "CARD") {
        console.log("SHUFFLE CARDS")
      }
    }

    else {
      console.log("SHUFFLE CARDS AND LISTS")
    }
    console.log(result)
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="container">
          <Navbar />
          <Board board={this.state.board} />
        </div>
      </DragDropContext>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

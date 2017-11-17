import '../css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Navbar from './Navbar';
import Board from './Board';

import Store from './data-store';

import { DragDropContext } from 'react-beautiful-dnd';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.store = Store.init();

    this.state = {
      board: {},
      lists: [],
      cards: []
    }

    this.onDragEnd = this.onDragEnd.bind(this);
    this.reloadCards = this.reloadCards.bind(this);
  }

  componentDidMount() {
    this.store.getBoard(1)
      .then(board => {
        this.setState({ board: board })
        return board;
      })
      .then((board) => {
        return this.store.getLists(board.id)
      })
      .then(lists => {
        this.setState({ lists: lists })

        lists.forEach(list => {
          this.store.getCards(list.id)
            .then(cards => this.setState({ 
              cards: this.state.cards.concat(cards) 
            }));
        })
      })
  }

  onDragEnd(result) {
    var result = this.store.onDragEnd(result);

    if (result.type === "COLUMN") {
      this.setState({lists: result.collection});
    }
    else if (result.type === "CARD") {
      this.setState({cards: result.collection});
    }
  }

  reloadCards() {
    this.setState({
      cards: this.store.get("cards")
    });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="container">
          <Navbar />
          <Board 
            board={this.state.board}
            lists={this.state.lists}
            cards={this.state.cards}
            store={this.store}
            listCallbacks={{
              reloadCards: this.reloadCards
            }}
             />
        </div>
      </DragDropContext>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

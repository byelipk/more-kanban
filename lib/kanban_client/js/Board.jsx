import React from "react";

import List from "./List";
import Store from './data-store';

import { Droppable } from 'react-beautiful-dnd';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: {},
      lists: [],
      cards: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      board: nextProps.board,
      lists: nextProps.lists,
      cards: nextProps.cards
    });
  }

  render() {
    const droppableId = `BOARD-${this.state.board.id}`;

    return (
      <Droppable droppableId={droppableId} type="COLUMN" direction="horizontal" >
        {provided => (
          <div className="board-container" ref={provided.innerRef}>
            <h1 className="board-title">{this.state.board.title}</h1>
              <div className="board-body">
                  {this.state.lists.map(list => (
                    <List 
                      store={this.props.store}
                      listCallbacks={this.props.listCallbacks}
                      key={list.id} 
                      list={list} 
                      cards={this.state.cards.filter(card => card.list_id === list.id)}
                      />
                  ))}
              </div>
          </div>
        )}
      </Droppable>
    );
  }
}

export default Board;

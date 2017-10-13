import React from "react";

import BoardList from "./BoardList";

// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      fetch(`/api/v1/lists?board_id=${nextProps.board.id}`)
        .then(response => response.json())
        .then(lists => this.setState({ lists: lists.data }));
    }
  }

  render() {
    return (
      <div className="board-container">
        <h1 className="board-title">{this.props.board.title}</h1>
          <div className="board-body">
            {this.state.lists.map(list => (
              <BoardList key={list.id} list={list} />
            ))}
          </div>
      </div>
    );
  }
}

export default Board;

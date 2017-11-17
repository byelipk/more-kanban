import React from "react";

import List from "./List";

import { Droppable } from 'react-beautiful-dnd';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps && nextProps.board.id) {
      fetch("/api/v1/lists?board_id=" + nextProps.board.id)
        .then(response => response.json())
        .then(json => this.setState({lists: json.data}))
        .catch(console.error);
    }
  }

  render() {
    return (
      <Droppable droppableId="BOARD" type="COLUMN" direction="horizontal" >
        {provided => (
          <div className="board-container" ref={provided.innerRef}>
            <h1 className="board-title">{this.props.board.title}</h1>
              <div className="board-body">
                  {this.state.lists.map(list => (
                    <List key={list.id} list={list} />
                  ))}
              </div>
          </div>
        )}
      </Droppable>
    );
  }
}

export default Board;

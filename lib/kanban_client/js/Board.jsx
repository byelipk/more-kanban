import React from "react";

import BoardList from "./BoardList";

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function reorder(list, startIndex, endIndex) {
  var result = Array.from(list);
  var [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: []
    };

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
  
    var lists = reorder(
      this.state.lists,
      result.source.index,
      result.destination.index
    );
  
    this.setState({
      lists,
    });
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
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="BOARD" type="COLUMN" direction="horizontal" >
          {provided => (
            <div className="board-container" ref={provided.innerRef}>
              <h1 className="board-title">{this.props.board.title}</h1>
                <div className="board-body">
                    {this.state.lists.map(list => (
                      <BoardList key={list.id} list={list} />
                    ))}
                </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default Board;

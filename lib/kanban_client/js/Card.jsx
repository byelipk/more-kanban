import React from 'react';
import ListForm from './ListForm';

// import Store from './data-store';

import { Draggable } from 'react-beautiful-dnd';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.onclick  = this.onclick.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
    this.renderCard = this.renderCard.bind(this);

    this.state = {
      editing: false,
      card: props.card,
      uri: `/api/v1/cards/`
    }
  }

  onclick() {
    this.setState({editing: !this.state.editing});
  }

  onsubmit(value) {
    var card = this.state.card;

    if (value) {
      this.props.store.updateCard(card, value)
        .then(updatedCard => {
          this.setState({ card: updatedCard, editing: false })
        })
    }
  }

  renderCard(provided) {
    if (this.state.editing) {
      return (
        <ListForm
          onclose={this.onclick}
          onsubmit={this.onsubmit}
          value={this.props.card.body} />
      );
    } else {
      return (
        <div className="card" ref={provided.innerRef} style={provided.draggableStyle} {...provided.dragHandleProps}>
          <div className="card-body">
            <div className="card-details">
              {this.state.card.body}
            </div>
            <div className="card-actions">
              <button onClick={this.onclick}>
                <i className="far fa-edit"></i>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const draggableId = `CARD-${this.state.card.id}`;

    return (
      <Draggable draggableId={draggableId} type="CARD" >
        {(provided) => (
          <div>
            {this.renderCard(provided)}
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}

export default Card;

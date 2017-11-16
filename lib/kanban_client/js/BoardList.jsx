import React from 'react';

import ListForm from './ListForm';
import ListCard from './ListCard';

import { Draggable } from 'react-beautiful-dnd';

function getClassNames(isDragging) {
  return `list-inner ${isDragging ? 'is-dragging' : ''}`;
}

class BoardList extends React.Component {
  constructor(props) {
    super(props);

    this.toggleCreateCardForm = this.toggleCreateCardForm.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
    this.cardCreateFormOrCreateButton = this.cardCreateFormOrCreateButton.bind(this);

    this.state = {
      cards: [],
      creating: false,
      uri: '/api/v1/cards'
    }
  }

  componentDidMount() {
    fetch(`${this.state.uri}?list_id=${this.props.list.id}`)
      .then(response => response.json())
      .then(cards => this.setState({cards: cards.data}))
  }

  toggleCreateCardForm() {
    this.setState({creating: !this.state.creating});
  }

  onsubmit(value) {
    fetch(this.state.uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: { body: value, list_id: this.props.list.id } })
    })
    .then(response => response.json())
    .then(card => {
      this.setState({
        cards: this.state.cards.concat(card.data),
        creating: !this.state.creating
      });
    })
    .catch(error => console.error(error));
  }

  cardCreateFormOrCreateButton() {
    if (this.state.creating) {
      return (
        <ListForm
          onclose={this.toggleCreateCardForm}
          onsubmit={this.onsubmit} />
        );
    }

    return (
      <button
        className="btn btn-toggle"
        onClick={this.toggleCreateCardForm}>Add a card</button>
    );
  }


  render() {
    return (
      <Draggable draggableId={this.props.list.id} type="COLUMN" >
        {(provided, snapshot)=> (
          <div className="list-card">
            <div className={getClassNames(snapshot.isDragging)} ref={provided.innerRef} style={provided.draggableStyle}>
              <header className="list-header" {...provided.dragHandleProps}>
                <h3>{this.props.list.name}</h3>
              </header>
              <section className="list-content">
                {this.state.cards.map(card => <ListCard key={card.id} card={card} /> )}
              </section>
              <footer className="list-footer">
                {this.cardCreateFormOrCreateButton()}
              </footer>
            </div>
            {provided.placeholder}
          </div>
         )}
       </Draggable>
    );
  }
}

export default BoardList;
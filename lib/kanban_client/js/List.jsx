import React from 'react';

import Card from './Card';
import ListForm from './ListForm';

import Store from './data-store';

import { Draggable, Droppable } from 'react-beautiful-dnd';

function getClassNames(isDragging) {
  return `list-inner ${isDragging ? 'is-dragging' : ''}`;
}

class List extends React.Component {
  constructor(props) {
    super(props);

    this.toggleForm = this.toggleForm.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
    this.cardCreateFormOrCreateButton = this.cardCreateFormOrCreateButton.bind(this);

    this.state = {
      cards: [],
      creating: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({cards: nextProps.cards})
  }

  toggleForm() {
    this.setState({creating: !this.state.creating});
  }

  onsubmit(value) {
    if (value) {
      this.props.store.addCard({ 
        body: value, 
        list_id: this.props.list.id
      })
      .then(() => {
        this.props.listCallbacks.reloadCards();
        this.setState({
          creating: !this.state.creating
        });
      })
    }
  }

  cardCreateFormOrCreateButton() {
    if (this.state.creating) {
      return (
        <ListForm
          onclose={this.toggleForm}
          onsubmit={this.onsubmit} />
        );
    }

    return (
      <button
        className="btn btn-toggle"
        onClick={this.toggleForm}>Add a card</button>
    );
  }

  render() {
    const draggableId = `LIST-${this.props.list.id}`;
    const droppableId = `LIST-${this.props.list.id}`;

    return (
      <Draggable draggableId={draggableId} type="COLUMN" >
        {(provided, snapshot)=> (
          <div className="list-card">
            <div className={getClassNames(snapshot.isDragging)} ref={provided.innerRef} style={provided.draggableStyle}>
              <header className="list-header" {...provided.dragHandleProps}>
                <h3>{this.props.list.name}</h3>
              </header>

              <Droppable droppableId={droppableId} type="CARD" direction="vertical" >
                {(provided, snapshot) => (
                  <section className="list-content" ref={provided.innerRef}>
                    {this.state.cards.map(card => (
                      <Card 
                        key={card.id} 
                        card={card} 
                        store={this.props.store} /> 
                    ))}
                    {provided.placeholder}
                  </section>
                )}
              </Droppable>

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

export default List;
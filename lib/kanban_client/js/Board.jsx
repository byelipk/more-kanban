import React from 'react';

import ListForm from './ListForm';
import ListCard from './ListCard';

class BoardList extends React.Component {
  constructor(props) {
    super(props);

    this.toggleCreateCardForm = this.toggleCreateCardForm.bind(this);
    this.onsubmit = this.onsubmit.bind(this);

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

  render() {
    const cardCreateFormOrCreateButton = () => {
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
    return (
      <div className="list-card">
        <header className="list-header">
          <h3>{this.props.list.name}</h3>
        </header>
        <section className="list-content">
          {this.state.cards.map(card => <ListCard key={card.id} card={card} /> )}
        </section>
        <footer className="list-footer">
          {cardCreateFormOrCreateButton()}
        </footer>
      </div>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lists: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      fetch(`/api/v1/lists?board_id=${nextProps.board.id}`)
        .then(response => response.json())
        .then(lists => this.setState({lists: lists.data}))
    }
  }

  render() {
    return (
      <div className="board-container">
        <h1 className="board-title">
          {this.props.board.title}
        </h1>
        <div className="board-body">
          {this.state.lists.map(list => <BoardList key={list.id} list={list} />)}
        </div>
      </div>
    );
  }
}

export default Board;

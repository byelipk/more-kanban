import React from 'react';
import ListForm from './ListForm';

class ListCard extends React.Component {
  constructor(props) {
    super(props);

    this.onclick  = this.onclick.bind(this);
    this.onsubmit = this.onsubmit.bind(this);

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
    fetch(this.state.uri + this.state.card.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: { body: value } })
    })
    .then(response => response.json())
    .then(card => {
      this.setState({card: card.data, editing: !this.state.editing})
    })
    .catch(error => console.error(error));
  }

  render() {
    const cardEditFormOrCardBody = () => {
      if (this.state.editing) {
        return (
          <ListForm
            onclose={this.onclick}
            onsubmit={this.onsubmit}
            value={this.props.card.body} />
        );
      } else {
        return (
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
        );
      }
    };

    return (
      <div className="card">
        {cardEditFormOrCardBody()}
      </div>
    );
  }
}

export default ListCard;

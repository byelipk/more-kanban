import '../css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

  componentDidMount() {
    fetch("/api/v1/boards")
      .then(results => results.json())
      .then(boards  => console.log(boards));
  }

  render() {
    return (
      <h1>Hello lolz from react 😅</h1>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

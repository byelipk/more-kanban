import '../css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <h1>Hello lolz from react</h1>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

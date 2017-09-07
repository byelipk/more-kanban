import '../css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

const Navbar = function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-flex">
        <div className="navbar-left">
          <button><i className="fas fa-lg fa-arrow-left"></i></button>
          <button><i className="fas fa-lg fa-columns"></i></button>
          <button><i className="fas fa-lg fa-search"></i></button>
        </div>
        <div className="navbar-center">Kanban</div>
        <div className="navbar-right">
          <button><i className="fas fa-lg fa-plus"></i></button>
          <button><i className="fas fa-lg fa-info"></i></button>
          <button><i className="fas fa-lg fa-bell"></i></button>
          <button><i className="fas fa-lg fa-user-circle"></i></button>
        </div>
      </nav>
    </header>
  );
}

class App extends React.Component {
  render() {
    return (
      <Navbar />
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

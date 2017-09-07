import React from 'react';

class ListForm extends React.Component {

  constructor(props) {
    super(props);

    this.onclose = this.onclose.bind(this);
    this.focus = this.focus.bind(this);
    this.onchange = this.onchange.bind(this);
    this.onsubmit = this.onsubmit.bind(this);

    this.state = {
      value: props.value
    }
  }

  onclose() {
    this.props.onclose();
  }

  focus(input) {
    if (input) {
      input.focus();
    }
  }

  onchange(event) {
    this.setState({value: event.target.value});
  }

  onsubmit(event) {
    event.preventDefault();
    this.props.onsubmit(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.onsubmit}>
        <textarea
          ref={this.focus}
          value={this.state.value}
          onChange={this.onchange} />
        <input type="submit" value="Save" className="btn btn-submit" />
        <button onClick={this.onclose} type="button" className="btn btn-cancel">
          <i className="far fa-lg fa-times"></i>
        </button>
      </form>
    );
  }
}

ListForm.defaultProps = {
  value: ''
};

export default ListForm;

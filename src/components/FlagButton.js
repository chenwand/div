import React, { Component } from 'react';

class FlagButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e, id) {
    this.props.onFlagClick(e);
  }
  render() {
    var imguf = 'img/' + this.props.uf.id.toLowerCase() + '.png';
    return (
      <button
        onClick={e => this.handleClick(this.props.uf.id, e)}
        className="btn btn-light m-1 p-1"
        type="button"
        data-toggle="tooltip"
        data-placement="top"
        title={this.props.uf.nome.toUpperCase()}
        key={this.props.uf.id}
      >
        <img
          src={imguf}
          width="34"
          alt={this.props.uf.id}
          className="rounded mx-auto d-block float-left border"
        />
      </button>
    );
  }
}

export default FlagButton;

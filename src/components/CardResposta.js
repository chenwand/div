import React, { Component } from 'react';
import ProgressBar from './ProgressBar';

class CardResposta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votavel: props.cand,
      flags: []
    };
  }
  static defaultProps = {};

  renderEleito() {
    if (this.props.resp.e.toLowerCase() === 's') {
      return (
        <span className="badge badge-success badge-pill fontsize10">
          resposta eleita
        </span>
      );
    }
  }

  render() {
    const data = [
      {
        value: this.props.resp.pvap,
        total: this.props.resp.vap,
        hintfix: false,
        showtext: true
      }
    ];
    return (
      <div
        className="text-left border rounded p-2 mb-2 shadow"
        style={{ background: '#f8f9f7' }}
      >
        <div className="d-flex flex-column">
          <div className="media">
            <div className="media-body">
              <span className="badge badge-secondary float-right">
                {this.props.resp.seq}
              </span>
              <span className="fontsize12 font-weight-bold">
                {this.props.resp.n} - {this.props.resp.ds}
              </span>
              &nbsp;
              {this.renderEleito()}
              <br />
              <span className="fontsize12">
                <ProgressBar data={data} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardResposta;

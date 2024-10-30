import React, { Component } from 'react';
import ProgressBar from './ProgressBar';

class CardCandidato extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votavel: props.cand,
      flags: []
    };
  }
  static defaultProps = {};
  GetSortOrder(prop) {
    return function(a, b) {
      if (parseInt(a[prop], 10) > parseInt(b[prop], 10)) {
        return -1;
      } else if (parseInt(a[prop], 10) < parseInt(b[prop], 10)) {
        return 1;
      }
      return 0;
    };
  }
  renderFlags() {
    var imguf, percValidos;
    var rows = [];
    for (
      var i = 0;
      this.props.eleicoesFlag !== undefined &&
      i < this.props.eleicoesFlag.length;
      i++
    ) {
      if (
        this.props.eleicoesFlag[i].cand !== undefined &&
        this.props.eleicoesFlag[i].cand.length !== 0
      ) {
        this.props.eleicoesFlag[i].cand.sort(this.GetSortOrder('vap'));
        if (
          parseInt(this.props.eleicoesFlag[i].cand[0].sqcand, 10) ===
            parseInt(this.props.cand.sqcand, 10) &&
          (this.props.eleicoesFlag[i].cand[0].vap > 0)
        ) {
          imguf =
            'img/' + this.props.eleicoesFlag[i].cdabr.toLowerCase() + '.png';
          percValidos = this.props.eleicoesFlag[i].cand[0].pvap;
          rows.push(
            <span className="d-inline-flex" key={i}>
              <span
                className="d-flex flex-column border border-dark rounded ml-1 mt-1"
                data-toggle="tooltip"
                data-placement="top"
                title={this.props.eleicoesFlag[i].cdabr.toUpperCase()}
              >
                <img
                  src={imguf}
                  width="35"
                  height="24"
                  alt={this.props.eleicoesFlag[i].cdabr.toUpperCase()}
                  className="rounded-top"
                />
                <span className="bg-dark text-white rounded-bottom small fontsize10 text-center">
                  {percValidos.replace('.', ',')}%
                </span>
              </span>
            </span>
          );
        }
      } 
    }
    return rows;
  }
  render() {
    var classDestinacao =
      this.props.cand.dvt === 'Válido'
        ? 'badge badge-secondary badge-pill fontsize10'
        : 'badge badge-danger badge-pill fontsize10';
    var classSituacao =
      this.props.cand.e === 's'
        ? 'badge badge-success badge-pill fontsize10'
        : 'badge badge-secondary badge-pill fontsize10';
    const votos = this.props.cand.vap;
    const data = [
      {
        value: this.props.cand.pvap,
        total: votos,
        hintfix: false,
        showtext: true
      }
    ];
    const photourl =
      this.props.photoUrl +
      (this.props.cargo === '1' ? 'br' : this.props.uf) +
      '/' +
      this.props.cand.sqcand +
      '.jpeg';
    var mostrarSuplentes = this.props.cargo === '5' ? true : false;
    var mostrarVice =
      this.props.cargo === '1' ||
      this.props.cargo === '3' ||
      this.props.cargo === '11'
        ? true
        : false;
    return (
      <div
        className="text-left border rounded p-2 mb-2 shadow"
        style={{ minHeight: '8rem', background: '#f8f9f7' }}
      >
        <div className="d-flex flex-column">
          <div className="media">
            {this.props.mostrarFotos && (
              <img
                style={{ width: '80px' }}
                src={photourl}
                className="align-self-start mr-1 rounded border border-dark"
                alt=""
              />
            )}
            <div className="media-body">
              <span className="badge badge-secondary float-right">
                {this.props.cand.seq}
              </span>
              <span className="fontsize12 font-weight-bold">
                {this.props.cand.n} - {this.props.cand.nm}
              </span>&nbsp;
              <span className={classDestinacao}>{this.props.cand.dvt}</span>&nbsp;
              <span className={classSituacao}>{this.props.cand.st}</span>
              <br />
              {mostrarVice && (
                <span className="fontsize10">
                  {this.props.cand.vs[0].nm}
                  <br />
                </span>
              )}
              {mostrarSuplentes && (
                <span className="fontsize10">
                  {this.props.cand.vs[0].nm} / {this.props.cand.vs[1].nm}
                  <br />
                </span>
              )}

              <span className="fontsize10">{this.props.cand.sgp}<br />
              {this.props.cand.agr}</span>
              <br />
              <span className="fontsize12">
                <ProgressBar data={data} />
              </span>
              <span className="fontsize12 float-right">
                {this.renderFlags()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardCandidato;

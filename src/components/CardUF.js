import React, { Component } from 'react';
import ProgressBar from './ProgressBar';

class FotoCandidato extends React.Component {
  render() {
    const { candidato } = this.props;
    const classEleito =
      candidato.e === 'n' ? 'badge-secondary' : 'badge-success';
    const photourl =
      this.props.photoUrl + this.props.uf + '/' + candidato.sqcand + '.jpeg';

    return (
      <div className="card bg-dark text-white width40 text-left">
        <img className="card-img" src={photourl} alt={candidato.n} />
        <div className="card-img-overlay float-left text-left">
          <span
            className={'card-text align-bottom fontsize8 badge ' + classEleito}
          >
            {candidato.n}
          </span>
        </div>
      </div>
    );
  }
}
class CardUF extends Component {
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
  render() {
    var uf,
      uffoto,
      imgUrl,
      secoesTotalizadas,
      percentualSecoesTotalizadas,
      candidato1,
      candidato2,
      votosValidosCand1,
      votosValidosCand2,
      classStatusUF;
    const existemCandidatos =
      this.props.eleicao.cand !== undefined &&
      this.props.eleicao.cand.length !== 0
        ? true
        : false;
    if (this.props.eleicao !== undefined) {
      // this.props.eleicao.cand.sort(this.GetSortOrder('v'));
      uf = this.props.eleicao.cdabr.toLowerCase();
      uffoto = this.props.eleicao.carper === '1' ? 'br' : uf;
      imgUrl = 'img/' + uf + '.png';
      percentualSecoesTotalizadas = (
        (this.props.eleicao.st / this.props.eleicao.s) *
        100
      ).toFixed(2);
      secoesTotalizadas = parseInt(this.props.eleicao.st, 10);

      if (existemCandidatos) {
        candidato1 =
          this.props.eleicao.cand[0].n + '-' + this.props.eleicao.cand[0].nm;
        candidato2 =
          this.props.eleicao.cand[1].n + '-' + this.props.eleicao.cand[1].nm;
        votosValidosCand1 = (
          (this.props.eleicao.cand[0].vap / this.props.eleicao.vv) *
          100
        ).toFixed(2);
        votosValidosCand2 = (
          (this.props.eleicao.cand[1].vap / this.props.eleicao.vv) *
          100
        ).toFixed(2);
      }
      votosValidosCand1 = isNaN(votosValidosCand1) ? '0' : votosValidosCand1;
      votosValidosCand2 = isNaN(votosValidosCand2) ? '0' : votosValidosCand2;
      classStatusUF =
        (this.props.eleicao.md === 'S' || this.props.eleicao.md === 'E') ? 'primary' : classStatusUF;      
      classStatusUF = this.props.eleicao.tf !== 'n' ? 'success' : 'warning';
      classStatusUF = secoesTotalizadas === 0 ? 'light' : classStatusUF;
      classStatusUF =
        this.props.eleicao.esae === 's' ? 'danger' : classStatusUF;
    }
    var dadosSecoesTotalizadas = [
      {
        total: secoesTotalizadas,
        value: percentualSecoesTotalizadas,
        hintfix: false
      }
    ];
    var dadosEleitorado = [
      {
        total: this.props.eleicao.ea,
        value: this.props.eleicao.pea,
        hintfix: false
      }
    ];
    const photoUrl = this.props.photoUrl;
    return (
      <span className="d-inline-flex">
        <div
          className="text-left border rounded m-1 float-left shadow "
          style={{
            minWidth: '170px',
            minHeight: '10rem',
            maxHeight: '11rem',
            background: '#faf9f9'
          }}
        >
          <div className="d-flex flex-column">
            <div className="media pl-1">
              <h5>
                <span
                  className={
                    'fontsize14 mt-1 mr-1 pb-1 badge badge-' + classStatusUF
                  }
                >
                  <img
                    id={uf}
                    src={imgUrl}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={uf.toUpperCase()}
                    width="50"
                    className="align-self-start rounded border border-dark mb-1 mt-1"
                    alt={uf.toUpperCase()}
                  />
                  <br />
                  <span className="mt-1 mb-1 fontsize12">Seções</span>
                  <div className="mt-1 mb-1">
                    <ProgressBar data={dadosSecoesTotalizadas} />
                  </div>
                  <span className="mt-1 mb-1 fontsize12">Eleitorado</span>
                  <div className="mt-1 mb-1">
                    <ProgressBar data={dadosEleitorado} />
                  </div>
                </span>
              </h5>
              <div className="media-body">
                {existemCandidatos && (
                  <div
                    id="bar-chart"
                    style={{ maxWidth: '100px', maxHeight: '9rem' }}
                  >
                    <div className="graph">
                      <ul className="x-axis">
                        <li>
                          <span
                            data-toggle="tooltip"
                            data-placement="top"
                            title={candidato1}
                          >
                            <FotoCandidato
                              candidato={this.props.eleicao.cand[0]}
                              photoUrl={photoUrl}
                              uf={uffoto}
                            />
                          </span>
                        </li>
                        <li>
                          <span
                            data-toggle="tooltip"
                            data-placement="top"
                            title={candidato2}
                          >
                            <FotoCandidato
                              candidato={this.props.eleicao.cand[1]}
                              photoUrl={photoUrl}
                              uf={uffoto}
                            />
                          </span>
                        </li>
                      </ul>
                      <div className="bars">
                        <div className="bar-group">
                          <div
                            className="bar bar-2 stat-4 text-right"
                            style={{ height: `${votosValidosCand1}%` }}
                            data-toggle="tooltip"
                            data-placement="top"
                            title={votosValidosCand1.replace('.', ',') + '%'}
                          />
                          <span className="fontsize10 align-top text-right">
                            {votosValidosCand1.replace('.', ',')}%
                          </span>
                        </div>
                        <div className="bar-group">
                          <div
                            className="bar bar-1 stat-4"
                            style={{ height: `${votosValidosCand2}%` }}
                            data-toggle="tooltip"
                            data-placement="top"
                            title={votosValidosCand2.replace('.', ',') + '%'}
                          />
                          <span className="fontsize10 align-top text-right">
                            {votosValidosCand2.replace('.', ',')}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="fontsize12 text-center badge badge-secondary m-1">
              {this.props.eleicao.dt + ' ' + this.props.eleicao.ht}
            </span>
          </div>
        </div>
      </span>
    );
  }
}

export default CardUF;

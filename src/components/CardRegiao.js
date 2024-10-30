import React, { Component } from 'react';
import ProgressBar from './ProgressBar';

class FotoCandidato extends React.Component {
  render() {
    const { candidato } = this.props;
    const classEleito =
      candidato.e === 'n' ? 'badge-secondary' : 'badge-success';
    const photourl = this.props.photoUrl + 'br/' + candidato.sqcand + '.jpeg';
    //console.log(photourl);
    return (
      <span className="card bg-dark text-white width40 rounded mr-1">
        <img className="card-img" src={photourl} alt={candidato.n} />
        <div className="card-img-overlay float-right">
          <h6 className={'card-text fontsize10 badge ' + classEleito}>
            {candidato.n}
          </h6>
        </div>
      </span>
    );
  }
}
class CardRegiao extends Component {
  render() {
    if (
      this.props.regiao.cand === undefined ||
      this.props.regiao.cand[0] === undefined
    ) {
      return <p />;
    }
    var nomecandidato1,
      nomecandidato2,
      percvotosValidosCand1,
      percvotosValidosCand2;
    // console.log(this.props.regiao);
    nomecandidato1 = this.props.regiao.cand[0].nm;
    nomecandidato2 = this.props.regiao.cand[1].nm;
    percvotosValidosCand1 = (
      (this.props.regiao.cand[0].vap / this.props.regiao.vv) *
      100
    ).toFixed(2);
    percvotosValidosCand2 = (
      (this.props.regiao.cand[1].vap / this.props.regiao.vv) *
      100
    ).toFixed(2);

    percvotosValidosCand1 = isNaN(percvotosValidosCand1)
      ? '0,00'
      : percvotosValidosCand1;
    percvotosValidosCand2 = isNaN(percvotosValidosCand2)
      ? '0,00'
      : percvotosValidosCand2;

    var nomeRegiao = this.props.regiao.nm.toLowerCase();
    var percentualSecoesTotalizadas = (
      (this.props.regiao.st / this.props.regiao.s) *
      100
    ).toFixed(2);

    const secoes = this.props.regiao.s;
    const secoesTotalizadas = this.props.regiao.st;

    const secoesTotalizadasPercentual = (
      (secoesTotalizadas / secoes) *
      100
    ).toFixed(2);
    const chartdataSecoes = [
      {
        total: secoesTotalizadas,
        value: secoesTotalizadasPercentual,
        showtext: true
      }
    ];
    const eleitorado = this.props.regiao.e;
    const eleitoradoApurado = this.props.regiao.ea;

    const eleitoradoApuradoPercentual = (
      (eleitoradoApurado / eleitorado) *
      100
    ).toFixed(2);

    const chartdataEleitorado = [
      {
        total: eleitoradoApurado,
        value: eleitoradoApuradoPercentual,
        showtext: true
      }
    ];

    const comparecimento = this.props.regiao.c;
    const abstencao = this.props.regiao.a;
    const comparecimentoPercentual = (
      (comparecimento / eleitoradoApurado) *
      100
    ).toFixed(2);
    const abstencaoPercentual = ((abstencao / eleitoradoApurado) * 100).toFixed(
      2
    );
    const chartdataComparecimento = [
      { total: comparecimento, value: comparecimentoPercentual, showtext: true }
    ];
    const chartdataAbstencao = [
      { total: abstencao, value: abstencaoPercentual, showtext: true }
    ];
    const photoUrl = this.props.photoUrl;
    const classStatusUF =
      percentualSecoesTotalizadas === '100.00' ? 'success' : 'warning';
    return (
      <span className="d-inline-flex p-1 m-1 border rounded shadow float-left">
        <div className="p-1 ">
          <div
            className={
              'card border border-dark rounded width120 float-left badge badge-' +
              classStatusUF
            }
          >
            <img
              alt={nomeRegiao}
              width="100"
              className="card-img"
              src={'img/' + nomeRegiao + '.png'}
            />
            <div className="card-img-overlay fontsize14">
              {this.props.regiao.nm} {this.props.regiao.tf}
            </div>
          </div>
          <div className="float-right mb-1">
            <div className="d-flex flex-column p-1">
              <div className="width130 fontsize12">
                Eleitorado
                <ProgressBar data={chartdataEleitorado} />
                Comparecimento
                <ProgressBar data={chartdataComparecimento} />
                Abstenção
                <ProgressBar data={chartdataAbstencao} />
                Seções
                <ProgressBar data={chartdataSecoes} />
              </div>
            </div>
          </div>
          <div className="p-2">
            <div className="width200 p-1 text-left ">Candidatos</div>
            <span
              className="fontsize10 media text-left p-1 border mb-1 shadow"
              data-toggle="tooltip"
              data-placement="top"
              title={nomecandidato1}
            >
              <FotoCandidato
                candidato={this.props.regiao.cand[0]}
                photoUrl={photoUrl}
              />
              {this.props.regiao.cand[0].n} - {nomecandidato1}
              <br />
              {this.props.regiao.cand[0].cc.split('-')[0].trim()}
              <br />
              {String(this.props.regiao.cand[0].vap)
                .split(/(?=(?:...)*$)/)
                .join('.')}{' '}
              ({percvotosValidosCand1}
              %)
            </span>
            <span
              className="fontsize10 media text-left p-1 border mb-1 shadow"
              data-toggle="tooltip"
              data-placement="top"
              title={nomecandidato2}
            >
              <FotoCandidato
                candidato={this.props.regiao.cand[1]}
                photoUrl={photoUrl}
              />
              {this.props.regiao.cand[1].n} - {nomecandidato2}
              <br />
              {this.props.regiao.cand[1].cc.split('-')[0].trim()}
              <br />
              {String(this.props.regiao.cand[1].vap)
                .split(/(?=(?:...)*$)/)
                .join('.')}{' '}
              ({percvotosValidosCand2}
              %)
            </span>
          </div>
          <div className="d-flex fontsize12 text-center align-center badge badge-secondary m-1">
            <center>{this.props.regiao.dt + ' ' + this.props.regiao.ht}</center>
          </div>
        </div>
      </span>
    );
  }
}

export default CardRegiao;

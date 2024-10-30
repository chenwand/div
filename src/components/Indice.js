import React, { Component } from 'react';

class Indice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClickRegerar = this.handleClickRegerar.bind(this);
  }
  handleClickRegerar(e) {
    this.props.onRegerarIndiceClick(e);
  }
  GetSortOrderStr(prop) {
    return function(a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }
  renderIndice() {
    this.props.arquivos.sort(this.GetSortOrderStr('nomeArquivo'));
    var rows = [],
      tamanhoArquivo = '';
    for (var i = 0; i < this.props.arquivos.length; i++) {
      tamanhoArquivo = !isNaN(parseFloat(this.props.arquivos[i].tamanhoArquivo))
        ? String(parseFloat(this.props.arquivos[i].tamanhoArquivo).toFixed(3))
        : '';
      rows.push(
        <div
          className="row text-left fontsize11 bg-light ml-2 mr-2 m-1"
          key={i + 'b'}
        >
          <div className="col">
            <a href={this.props.arquivos[i].caminhoArquivo} target="_blank">
              {this.props.arquivos[i].nomeArquivo}
            </a>
          </div>
          <div className="col text-center">
            {this.props.arquivos[i].dataArquivo}
          </div>
          <div className="col text-center">
            {this.props.arquivos[i].dataIndice}
          </div>
          <div className="col text-right">{tamanhoArquivo}</div>
        </div>
      );
    }
    return rows;
  }
  render() {
    var classHeader, classBadge, classCollapse, mostrarBotaoRegerarIndice;
    if (this.props.codigoSituacao >= 1000) {
      classHeader = 'alert alert-success';
      classBadge = 'badge badge-success';
      classCollapse = 'collapse';
      mostrarBotaoRegerarIndice = false;
    } else {
      classHeader = 'alert alert-danger';
      classBadge = 'badge badge-danger';
      classCollapse = 'collapse show';
      mostrarBotaoRegerarIndice = true;
    }
    if (parseInt(this.props.codigoSituacao, 10) === 13) {
      mostrarBotaoRegerarIndice = false;
    }
    return (
      <div>
        <div
          className={classHeader}
          id="head"
          role="button"
          aria-expanded="false"
          aria-controls={'collapseExample' + this.props.codigoSituacao}
        >
          {this.props.descricaoSituacao}
          &nbsp;
          <span className={classBadge}>{this.props.arquivos.length}</span>
          <button
            type="button"
            data-toggle="collapse"
            href={'#collapse' + this.props.codigoSituacao}
            className="btn btn-light btn-sm float-right mb-2 mr-1 ml-1 fontsize12 shadow"
          >
            <i className="fas fa-angle-double-down" />
          </button>
          {mostrarBotaoRegerarIndice && (
            <button
              type="button"
              className="btn btn-light btn-sm float-right mb-2 fontsize12 shadow"
              onClick={e =>
                this.handleClickRegerar(this.props.codigoSituacao, e)
              }
            >
              <i className="fas fa-bolt" /> &nbsp;Reprocessar
            </button>
          )}
        </div>
        <div
          className={classCollapse}
          id={'collapse' + this.props.codigoSituacao}
        >
          <div className="row text-left fontsize11 font-weight-bold ml-2 mr-2 m-1">
            <div className="col">Nome do arquivo</div>
            <div className="col text-center">Data do arquivo</div>
            <div className="col text-center">Data no índice</div>
            <div className="col text-right">Tamanho em bytes</div>
          </div>

          {this.renderIndice()}

          <div className="row text-left fontsize11 font-weight-bold ml-2 mr-2 m-1 mb-4">
            <div className="col">Total: {this.props.arquivos.length}</div>
            <div className="col" />
            <div className="col" />
          </div>
        </div>
      </div>
    );
  }
}

export default Indice;

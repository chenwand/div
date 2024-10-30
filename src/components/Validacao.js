import React, { Component } from 'react';

class Validacao extends Component {
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
  renderValidacao() {
    this.props.arquivos.sort(this.GetSortOrderStr('caminhoArquivo'));
    var rows = [];
    for (var i = 0; i < this.props.arquivos.length; i++) {
      rows.push(
        <div
          className="row text-left fontsize11 bg-light ml-2 mr-2 m-1"
          key={i + 'b'}
        >
          <div className="col-9">
            <a href={this.props.arquivos[i].caminhoArquivo} target="_blank">
              {this.props.arquivos[i].caminhoArquivo}
            </a>
          </div>

          <div className="col-3 text-right">
            {this.props.arquivos[i].dataArquivo}
          </div>
        </div>
      );
    }
    return rows;
  }
  render() {
    var classHeader, classBadge, classCollapse;
    if (this.props.codigoSituacao >= 1000) {
      classHeader = 'alert alert-success';
      classBadge = 'badge badge-success';
      classCollapse = 'collapse';
    } else {
      classHeader = 'alert alert-danger';
      classBadge = 'badge badge-danger';
      classCollapse = 'collapse show';
    }
    return (
      <div>
        <div
          className={classHeader}
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
        </div>
        <div
          className={classCollapse}
          id={'collapse' + this.props.codigoSituacao}
        >
          <div className="row text-left fontsize11 font-weight-bold ml-2 mr-2 m-1">
            <div className="col-9">Arquivo</div>
            <div className="col-3 text-right">Data da totalização</div>
          </div>

          {this.renderValidacao()}

          <div className="row text-left fontsize11 font-weight-bold ml-2 mr-2 m-1 mb-4">
            <div className="col-12">Total: {this.props.arquivos.length}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Validacao;

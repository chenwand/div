import React, { Component } from 'react';

class FotoCandidato extends React.Component {
  render() {
    const { candidato } = this.props;
    const photourl =
      this.props.photoUrl +
      candidato.cdabr.toLowerCase() +
      '/' +
      candidato.sqcand +
      '.jpeg';
    return (
      <span className="card bg-dark text-white width60 rounded mr-1">
        <img className="card-img" src={photourl} alt={candidato.n} />
        <div className="card-img-overlay float-right" />
      </span>
    );
  }
}
class ResultadoPorPartido extends Component {
  GetSortOrderDesc(prop) {
    return function(a, b) {
      if (parseInt(a[prop], 10) > parseInt(b[prop], 10)) {
        return -1;
      } else if (parseInt(a[prop], 10) < parseInt(b[prop], 10)) {
        return 1;
      }
      return 0;
    };
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

  renderTabs() {
    var rows = [];
    var partidos = this.props.partidos;
    var listaPartidos = [];
    for (var key in partidos) {
      if (partidos.hasOwnProperty(key)) {
        listaPartidos.push(key);
      }
    }
    //    var property = partidos[key];
    listaPartidos.sort();
    for (var i = 0; i < listaPartidos.length; i++) {
      key = listaPartidos[i];
      rows.push(
        <a
          className="nav-link small"
          key={key}
          id={'v-pills-' + key + this.props.cargo + '-tab'}
          data-toggle="pill"
          href={'#v-pills-' + key + this.props.cargo}
          role="tab"
          aria-controls={'v-pills-' + key + this.props.cargo}
          aria-selected="false"
        >
          {key}{' '}
          <span className="badge badge-success">{partidos[key].vagas}</span>
        </a>
      );
    }

    return rows;
  }
  getCandidatosTodos() {
    var rows = [];
    var partidos = this.props.partidos;
    for (var key in partidos) {
      if (partidos.hasOwnProperty(key)) {
        rows.push(this.getCandidatosPorPartido(key));
      }
    }
    return rows;
  }
  getCandidatosPorPartido(partido) {
    var i,
      rows = [];
    var candidatos = [];
    if (partido === 'TODOS') {
      var partidos = this.props.partidos;
      for (var key in partidos) {
        if (partidos.hasOwnProperty(key)) {
          for (i = 0; i < partidos[key].candidatos.length; i++) {
            candidatos.push(partidos[key].candidatos[i]);
          }
        }
      }
    } else {
      candidatos = this.props.partidos[partido].candidatos;
    }
    var photoUrl = this.props.photoUrl;
    if (candidatos !== undefined) {
      var imgUrl, classSituacao;
      candidatos.sort(this.GetSortOrderStr('nm'));
      for (i = 0; i < candidatos.length; i++) {
        imgUrl = 'img/' + candidatos[i].cdabr.toLowerCase() + '.png';
        classSituacao =
          candidatos[i].svnom === 'n'
            ? 'badge badge-warning badge-pill fontsize10'
            : 'badge badge-danger badge-pill fontsize10';
        rows.push(
          <span
            className="fontsize12 media text-left p-2 border rounded shadow m-2"
            key={i}
          >
            {this.props.mostrarFotos && (
              <FotoCandidato candidato={candidatos[i]} photoUrl={photoUrl} />
            )}
            <span className="d-flex flex-column p-1">
              <div className="float-left">
                {candidatos[i].n} - {candidatos[i].nm}
                <span className={classSituacao}>{candidatos[i].dsit}</span>
                <span className="badge badge-success badge-pill fontsize10">
                  {candidatos[i].e === 's' ? 'eleito' : ''}
                </span>
              </div>
              <div className="float-left mt-1 pt-1">{candidatos[i].cc}</div>
              <div className="float-left">
                <img
                  src={imgUrl}
                  width="35"
                  height="24"
                  alt={candidatos[i].cdabr}
                  className="rounded border border-dark mt-1 mb-1"
                  data-toggle="tooltip"
                  data-placement="top"
                  title={candidatos[i].cdabr}
                />
              </div>
              <div className="float-left">
                {String(candidatos[i].v)
                  .split(/(?=(?:...)*$)/)
                  .join('.')}
              </div>
            </span>
          </span>
        );
      }
    }
    return rows;
  }
  renderPanels() {
    var rows = [];
    var partidos = this.props.partidos;

    for (var key in partidos) {
      if (partidos.hasOwnProperty(key)) {
        //var property = partidos[key];
        rows.push(
          <div
            className="tab-pane fade"
            key={key}
            id={'v-pills-' + key + this.props.cargo}
            role="tabpanel"
            aria-labelledby={'v-pills-' + key + this.props.cargo + '-tab'}
          >
            <div className="container m-1 mt-1 p-2">
              {this.getCandidatosPorPartido(key)}
            </div>
          </div>
        );
      }
    }
    return rows;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-3">
            <div
              className="nav flex-column nav-pills "
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <a
                className="nav-link active fontsize12"
                id={'v-pills-home-tab' + this.props.cargo}
                data-toggle="pill"
                href={'#v-pills-home' + this.props.cargo}
                role="tab"
                aria-controls={'v-pills-home' + this.props.cargo}
                aria-selected="true"
              >
                TODOS
              </a>
              {this.renderTabs()}
            </div>
          </div>
          <div className="col-9">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id={'v-pills-home' + this.props.cargo}
                role="tabpanel"
                aria-labelledby={'v-pills-home-tab' + this.props.cargo}
              >
                {this.getCandidatosPorPartido('TODOS')}
              </div>
              {this.renderPanels()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultadoPorPartido;

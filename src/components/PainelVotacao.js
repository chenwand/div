import React, { Component } from "react";
import CardCandidato from "./CardCandidato";
import CardResposta from "./CardResposta";
import EleicaoSelecionada from "./EleicaoSelecionada";
import CardUF from "./CardUF";
import CardRegiao from "./CardRegiao";
import ResultadoPorPartido from "./ResultadoPorPartido";
import { Icon } from "semantic-ui-react";

class Painel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vt: props.vt,
      votavel: props.vt.cand,
    };
  }
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
  GetSortOrderAsc(prop) {
    return function(a, b) {
      if (parseInt(a[prop], 10) > parseInt(b[prop], 10)) {
        return 1;
      } else if (parseInt(a[prop], 10) < parseInt(b[prop], 10)) {
        return -1;
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
  renderVt() {
    var rows = [];
    if (
      (this.props.vt.carg &&
        this.props.vt.carg.length > 0 &&
        this.props.vt.carg[0]) ||
      (this.props.vt.perg && this.props.vt.perg[0])
    ) {
      var eleicoesFlag =
        this.props.vt.carg && this.props.vt.carg[0].cd === "1"
          ? this.props.eleicoesFlag
          : [];
      if (
        this.props.tipoEleicao !== "5" &&
        this.props.tipoEleicao !== "6" &&
        this.props.tipoEleicao !== "7"
      ) {
        if (this.props.vt.carg[0].agr !== undefined) {
          var candidatos = [];
          var candidato = {};
          for (var i = 0; i < this.props.vt.carg[0].agr.length; i++) {
            if (this.props.vt.carg[0].agr[i].par !== undefined) {
              for (
                var j = 0;
                j < this.props.vt.carg[0].agr[i].par.length;
                j++
              ) {
                for (
                  var k = 0;
                  k < this.props.vt.carg[0].agr[i].par[j].cand.length;
                  k++
                ) {
                  candidato = this.props.vt.carg[0].agr[i].par[j].cand[k];
                  candidato.sgp =
                    this.props.vt.carg[0].agr[i].par[j].sg +
                    " - " +
                    this.props.vt.carg[0].agr[i].par[j].nm +
                    " - " +
                    this.props.vt.carg[0].agr[i].par[j].n;
                  candidato.agr =
                    this.props.vt.carg[0].agr[i].nm +
                    " (" +
                    this.props.vt.carg[0].agr[i].com +
                    ")";
                  candidatos.push(candidato);
                }
              }
            }
          }
          candidatos.sort(this.GetSortOrderDesc("seq")).reverse();
          for (k = 0; k < candidatos.length; k++) {
            rows.push(
              <CardCandidato
                cand={candidatos[k]}
                key={k}
                eleicoesFlag={eleicoesFlag}
                photoUrl={this.props.photoUrl}
                uf={this.props.uf.toLowerCase()}
                cargo={this.props.vt.carg[0].cd}
                mostrarFotos={this.props.mostrarFotos}
              />
            );
          }
        }
      } else {
        console.log(this.props.vt.perg[0]);
        this.props.vt.perg[0].resp.sort(this.GetSortOrderAsc("seq"));
        for (i = 0; i < this.props.vt.perg[0].resp.length; i++) {
          rows.push(
            <CardResposta key={i} resp={this.props.vt.perg[0].resp[i]} />
          );
        }
        console.log(this.props.vt.perg[0].resp);
      }
    }
    return rows;
  }

  renderVotacaoUF() {
    var rows = [];
    this.props.eleicoesFlag.sort(this.GetSortOrderStr("cdabr"));
    for (var i = 0; i < this.props.eleicoesFlag.length; i++) {
      rows.push(
        <CardUF
          key={i}
          eleicao={this.props.eleicoesFlag[i]}
          photoUrl={this.props.photoUrl}
          acompanhamentoBR={this.props.acompanhamentoBR.abr}
        />
      );
    }
    return rows;
  }

  renderVotacaoRegiao() {
    var rows = [];
    this.props.eleicoesFlag.sort(this.GetSortOrderStr("cdabr"));

    var regioes = {
      N: {
        nm: "Norte",
        cand: [],
        vv: 0,
        dt: "12/08/2018",
        ht: "11:59:00",
        e: 0,
        ea: 0,
        c: 0,
        a: 0,
        s: 0,
        st: 0,
        uf: ["AM", "AC", "AP", "PA", "RO", "RR", "TO"],
      },
      NE: {
        nm: "Nordeste",
        cand: [],
        vv: 0,
        dt: "12/08/2018",
        ht: "11:59:00",
        e: 0,
        ea: 0,
        c: 0,
        a: 0,
        s: 0,
        st: 0,
        uf: ["AL", "BA", "CE", "MA", "RN", "PB", "PE", "PI", "SE"],
      },
      CO: {
        nm: "Centro-oeste",
        cand: [],
        vv: 0,
        dt: "12/08/2018",
        ht: "11:59:00",
        e: 0,
        ea: 0,
        c: 0,
        a: 0,
        s: 0,
        st: 0,
        uf: ["DF", "GO", "MT", "MS"],
      },
      SE: {
        nm: "Sudeste",
        cand: [],
        vv: 0,
        dt: "12/08/2018",
        ht: "11:59:00",
        e: 0,
        ea: 0,
        c: 0,
        a: 0,
        s: 0,
        st: 0,
        uf: ["MG", "ES", "RJ", "SP"],
      },
      S: {
        nm: "Sul",
        cand: [],
        vv: 0,
        dt: "12/08/2018",
        ht: "11:59:00",
        e: 0,
        ea: 0,
        c: 0,
        a: 0,
        s: 0,
        st: 0,
        uf: ["SC", "RS", "PR"],
      },
      f: false,
    };
    var getObjectByValue = function(array, key, value) {
      return array.filter(function(object) {
        return object[key] === value;
      });
    };

    var j, eleicaoUF;
    if (regioes.f) {
      return;
    }
    regioes.f = true;

    for (var x in regioes) {
      for (var i in regioes[x].uf) {
        eleicaoUF = getObjectByValue(
          this.props.eleicoesFlag,
          "cdabr",
          regioes[x].uf[i]
        );
        if (eleicaoUF[0] !== undefined) {
          if (regioes[x].cand.length === 0) {
            for (j in eleicaoUF[0].cand) {
              let clone = JSON.parse(JSON.stringify(eleicaoUF[0].cand[j]));
              regioes[x].cand.push(clone);
            }
          } else {
            for (j = 0; j < eleicaoUF[0].cand.length; j++) {
              for (var c in regioes[x].cand) {
                if (regioes[x].cand[c].sqcand === eleicaoUF[0].cand[j].sqcand) {
                  regioes[x].cand[c].vap =
                    parseInt(regioes[x].cand[c].vap, 10) +
                    parseInt(eleicaoUF[0].cand[j].vap, 10);
                  //console.log(x+ "-"+regioes[x].uf[i]+"-"+regioes[x].cand[c].n+ "-"+eleicaoUF[0].cand[j].vap +"-"+eleicaoUF[0].cand[j].n+"-"+regioes[x].cand[c].sqcand+"-"+eleicaoUF[0].cand[j].sqcand);
                }
              }
            }
          }
          if (
            this.formataData(eleicaoUF[0].dt, eleicaoUF[0].ht) >
            this.formataData(regioes[x].dt, regioes[x].ht)
          ) {
            regioes[x].dt = eleicaoUF[0].dt;
            regioes[x].ht = eleicaoUF[0].ht;
          }
          regioes[x].cand.sort(this.GetSortOrderDesc("vap"));
          regioes[x].e.te = regioes[x].e.te + parseInt(eleicaoUF[0].e.te, 10);
          regioes[x].e.esna =
            regioes[x].e.esna + parseInt(eleicaoUF[0].e.esna, 10);
          regioes[x].e.c = regioes[x].e.c + parseInt(eleicaoUF[0].e.c, 10);
          regioes[x].e.a = regioes[x].e.a + parseInt(eleicaoUF[0].e.a, 10);
          regioes[x].v.vv = regioes[x].v.vv + parseInt(eleicaoUF[0].v.vv, 10);
          regioes[x].s.ts = regioes[x].s.ts + parseInt(eleicaoUF[0].s.ts, 10);
          regioes[x].s.st = regioes[x].s.st + parseInt(eleicaoUF[0].s.st, 10);
        }
      }
      rows.push(
        <CardRegiao
          regiao={regioes[x]}
          key={x}
          photoUrl={this.props.photoUrl}
        />
      );
    }

    return rows;
  }
  formataData(data, hora) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];
    var dataFormatada = new Date(
      ano + "-" + ("0" + mes).slice(-2) + "-" + ("0" + dia).slice(-2)
    );
    dataFormatada.setHours(hora.split(":")[0]);
    dataFormatada.setMinutes(hora.split(":")[1]);
    return dataFormatada;
  }
  renderComposicao() {
    var rows = [];
    var candidato, partido;
    var partidos = {};

    this.props.eleicoesFlag.sort(this.GetSortOrderStr("cdabr"));
    for (var i = 0; i < this.props.eleicoesFlag.length; i++) {
      for (
        var j = 0;
        j < this.props.eleicoesFlag[i].v &&
        this.props.eleicoesFlag[i].cand[j] !== undefined;
        j++
      ) {
        partido = this.props.eleicoesFlag[i].cand[j].cc.split("-")[0].trim();
        if (partidos[partido] === undefined) {
          partidos[partido] = {
            vagas: 0,
            candidatos: [],
          };
        }
        candidato = this.props.eleicoesFlag[i].cand[j];
        candidato.cdabr = this.props.eleicoesFlag[i].cdabr;
        partidos[partido].candidatos.push(candidato);
        partidos[partido].vagas++;
      }
    }
    rows.push(
      <ResultadoPorPartido
        key={j}
        partidos={partidos}
        photoUrl={this.props.photoUrl}
        cargo={this.props.eleicoesFlag[0].carper}
        mostrarFotos={this.props.mostrarFotos}
      />
    );
    return rows;
  }
  render() {
    if (this.props.vt.length === 0) {
      return <h5>carregando...</h5>;
    }
    const cargo = this.props.vt.carper;
    const showTabUF =
      (cargo === "1" || cargo === "3" || cargo === "5") &&
      this.props.eleicoesFlag !== undefined &&
      this.props.eleicoesFlag.length > 0
        ? true
        : false;
    const showTabRegiao =
      cargo === "1" &&
      this.props.eleicoesFlag !== undefined &&
      this.props.eleicoesFlag.length > 0
        ? true
        : false;
    const showTabPartido = false;
    const showEleicaoSelecionda =
      (this.props.vt.perg !== undefined && this.props.vt.perg.length > 0) ||
      (this.props.vt.carg !== undefined && this.props.vt.carg.length > 0)
        ? true
        : false;
    /*(cargo === '3' || cargo === '5' || cargo === '6' || cargo === '7' || cargo === '8') &&
      this.props.eleicoesFlag !== undefined &&
      this.props.eleicoesFlag.length > 0
        ? true
        : false;*/
    return (
      <div className="rounded">
        <center>
          {showEleicaoSelecionda && (
            <EleicaoSelecionada
              eleicao={this.props.vt}
              nmeleicao={this.props.nmeleicao}
              uf={this.props.uf}
            />
          )}
        </center>
        <nav>
          <div className="nav nav-tabs small" id="nav-tab" role="tablist">
            <a
              className="nav-item nav-link active"
              id={"nav-tab10" + cargo}
              data-toggle="tab"
              href={"#nav-10" + cargo}
              role="tab"
              aria-controls={"nav-10" + cargo}
              aria-selected="true"
            >
              <Icon name="users" /> Votação
            </a>
            {showTabUF && (
              <a
                className="nav-item nav-link"
                id={"nav-tab20" + cargo}
                data-toggle="tab"
                href={"#nav-20" + cargo}
                role="tab"
                aria-controls={"nav-20" + cargo}
                aria-selected="false"
              >
                <Icon name="table" /> Resultado por UF
              </a>
            )}
            {showTabRegiao && (
              <a
                className="nav-item nav-link"
                id={"nav-tab40" + cargo}
                data-toggle="tab"
                href={"#nav-40" + cargo}
                role="tab"
                aria-controls={"nav-40" + cargo}
                aria-selected="false"
              >
                <Icon name="map" /> Resultado por região
              </a>
            )}
            {showTabPartido && (
              <a
                className="nav-item nav-link"
                id={"nav-tab50" + cargo}
                data-toggle="tab"
                href={"#nav-50" + cargo}
                role="tab"
                aria-controls={"nav-50" + cargo}
                aria-selected="false"
              >
                <Icon name="map" /> Resultado por partido
              </a>
            )}
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent1">
          <div
            className="tab-pane fade show active m-1"
            id={"nav-10" + cargo}
            role="tabpanel"
            aria-labelledby={"nav-tab10" + cargo}
          >
            <center>{this.renderVt()}</center>
          </div>
          {showTabUF && (
            <div
              className="tab-pane fade"
              id={"nav-20" + cargo}
              role="tabpanel"
              aria-labelledby={"nav-tab20" + cargo}
            >
              <center>{this.renderVotacaoUF()}</center>
            </div>
          )}
          {showTabRegiao && (
            <div
              className="tab-pane fade"
              id={"nav-40" + cargo}
              role="tabpanel"
              aria-labelledby={"nav-tab40" + cargo}
            >
              <center>{this.renderVotacaoRegiao()}</center>
            </div>
          )}
          {showTabPartido && (
            <div
              className="tab-pane fade"
              id={"nav-50" + cargo}
              role="tabpanel"
              aria-labelledby={"nav-tab50" + cargo}
            >
              <center>{this.renderComposicao()}</center>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Painel;

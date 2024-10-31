import React, { Component } from "react";
import ProgressBar from "./ProgressBar";
import Chart from "./Chart1";

class EleicaoSelecionada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eleicao: props.eleicao,
    };
  }
  static defaultProps = {};
  componentWillMount() {
    this.getChartSecoes();
  }
  getChartSecoes() {
    this.setState({
      chartSecoes: {
        labels: ["não totalizadas", "totalizadas"],
        datasets: [
          {
            label: "Seções",
            data: [0, 0],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
          },
        ],
      },
      chartVotos: {
        labels: [
          "brancos",
          "nulos",
          "anulados",
          "anulados sub judice",
          "pendentes",
          "válidos",
        ],
        datasets: [
          {
            label: "",
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 109, 84, 0.2)",
            ],
          },
        ],
      },
      chartMunicipios: {
        labels: ["não iniciados", "em andamento", "finalizados"],
        datasets: [
          {
            label: "",
            data: [0, 0, 0],
            backgroundColor: [
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
          },
        ],
      },
    });
  }
  renderCargos() {
    if (this.props.eleicao !== undefined) {
      var rows = [<span className="small m-1">Cargos:</span>];
      for (var i = 0; i < this.props.eleicao.abr[0].cp.length; i++) {
        console.log(this.props.eleicao.abr[0].cp.length);
        rows.push(
          <span class="badge badge-warning ml-1">
            {this.props.eleicao.abr[0].cp[i].ds}
          </span>
        );
      }
    }
    return rows;
  }
  loadChartDatasets() {
    this.setState({
      chartSecoes: {
        ...this.state.chartSecoes,
        datasets: [
          {
            ...this.state.chartSecoes.datasets[0],
            data: [this.props.eleicao.s.snt, this.props.eleicao.s.st]
          }
        ]
      }
    });
    this.setState({
      chartSecoes: {
        ...this.state.chartSecoes,
        labels: ["não totalizadas", "totalizadas"]
      }
    });
    if (
      this.props.eleicao.carper === "6" ||
      this.props.eleicao.carper === "7" ||
      this.props.eleicao.carper === "8" ||
      this.props.eleicao.carper === "13"
    ) {
      this.setState({
        chartVotos: {
          ...this.state.chartVotos,
          datasets: [
            {
              ...this.state.chartVotos.datasets[0],
              data: [ 
                this.props.eleicao.v.vnom, 
                this.props.eleicao.v.vl, 
                this.props.eleicao.v.van, 
                this.props.eleicao.v.vansj, 
                this.props.eleicao.v.vb, 
                this.props.eleicao.v.vn 
              ]
            }
          ]
        }
      });
      this.setState({
        chartVotos: {
          ...this.state.chartVotos,
          labels: ["nominais", "legenda", "anulados", "anulados sub judice", "brancos", "nulos"]
        }
      });
    } else {
      this.setState({
        chartVotos: {
          ...this.state.chartVotos,
          datasets: [
            {
              ...this.state.chartVotos.datasets[0],
              data: [ 
                this.props.eleicao.v.vb, 
                this.props.eleicao.v.vn, 
                this.props.eleicao.v.van, 
                this.props.eleicao.v.vansj, 
                this.props.eleicao.v.vv 
              ]
            }
          ],
          labels: ["brancos", "nulos", "anulados", "anulados sub judice", "válidos"]
        }
      });
    }
    this.setState({
      chartVotos: {
        ...this.state.chartVotos,
        title: "Votos"
      }
    });
  }
  render() {
    this.loadChartDatasets();
    if (this.props.eleicao === undefined) {
      return null;
    }
    const secoes = this.props.eleicao.s.ts;
    const secoesTotalizadas = this.props.eleicao.s.st;
    const secoesTotalizadasPercentual = (
      (secoesTotalizadas / secoes) *
      100
    ).toFixed(2);
    const chartdataSecoes = [
      {
        total: secoesTotalizadas,
        value: secoesTotalizadasPercentual,
        showtext: true,
      },
    ];
    const eleitorado = this.props.eleicao.e.te;
    const eleitoradoApurado = this.props.eleicao.e.esa;
    const eleitoradoApuradoPercentual = (
      (eleitoradoApurado / eleitorado) *
      100
    ).toFixed(2);

    const chartdataEleitorado = [
      {
        total: eleitoradoApurado,
        value: eleitoradoApuradoPercentual,
        showtext: true,
      },
    ];
    const cssTotFinal = this.props.eleicao.tf === "s" ? "success" : "warning";
    const semAtribuicaodeEleitos =
      this.props.eleicao.esae === "s" ? true : false;
    const motivoSemAtribuicaodeEleitos =
      this.props.eleicao.esae === "s" ? this.props.eleicao.mnae : "";
    const matematicamenteDefinida =
      this.props.eleicao.md === "e"
        ? "Eleição matematicamente definida (Eleito)"
        : this.props.eleicao.md === "s"
        ? "Eleição matematicamente definida (Segundo turno)"
        : "";
    const containerInfo =
      this.props.eleicao.esae === "s"
        ? "m-1 p-1 rounded border border-danger"
        : "m-1 p-1 rounded border border-" + cssTotFinal;
    const classBadge =
      this.props.eleicao.esae === "s"
        ? "badge badge-danger text-center"
        : "text-center badge badge-" + cssTotFinal;
    const classMD =
      this.props.eleicao.md === "e" || this.props.eleicao.md === "s"
        ? " badge badge-info text-center"
        : " text-center badge badge-" + cssTotFinal;
    const comparecimento = this.props.eleicao.e.c;
    const abstencao = this.props.eleicao.e.a;
    const comparecimentoPercentual = (
      (isNaN(comparecimento / eleitoradoApurado)
        ? 0
        : comparecimento / eleitoradoApurado) * 100
    ).toFixed(2);
    const abstencaoPercentual = (
      (isNaN(abstencao / eleitoradoApurado)
        ? 0
        : abstencao / eleitoradoApurado) * 100
    ).toFixed(2);
    const chartdataComparecimento = [
      {
        total: comparecimento,
        value: comparecimentoPercentual,
        showtext: true,
      },
    ];
    const chartdataAbstencao = [
      { total: abstencao, value: abstencaoPercentual, showtext: true },
    ];
    const vagas =
      this.props.eleicao.carg && this.props.eleicao.carg.length > 0
        ? this.props.eleicao.carg[0].nv
        : 1;
    const totalVotos = this.props.eleicao.v.tv;
    const votosValidos =
      this.props.eleicao.v.vv !== undefined
        ? this.props.eleicao.v.vv
        : this.props.eleicao.v.vvc;
    const votosValidosPercentual = (
      (isNaN(votosValidos / totalVotos) ? 0 : votosValidos / totalVotos) * 100
    ).toFixed(2);
    const chartdataVotosValidos = [
      { total: votosValidos, value: votosValidosPercentual, showtext: true },
    ];
    var qe = (votosValidos / vagas).toFixed(2).replace(".", ",");
    const mostrarQE =
      this.props.eleicao.carg &&
      (this.props.eleicao.carg[0].cd === "6" ||
        this.props.eleicao.carg[0].cd === "7" ||
        this.props.eleicao.carg[0].cd === "8" ||
        this.props.eleicao.carg[0].cd === "13")
        ? true
        : false;
    return (
      <div className={containerInfo}>
        <div className="row p-1">
          <div className="row p-1 col-12  d-inline-flex  align-self-center justify-content-center">
            <span className={classBadge + " align-self-center"}>
              <span
                className="border-dark rounded"
                data-toggle="tooltip"
                data-placement="top"
                border="1"
                title={this.props.eleicao.cdabr.toUpperCase()}
              >
                <img
                  src={"img/" + this.props.uf.toLowerCase() + ".png"}
                  width="35"
                  height="24"
                  alt={this.props.eleicao.cdabr.toUpperCase()}
                  className="rounded border-dark border"
                />
                &nbsp;
                {this.props.nmeleicao.replace("&#186;", "º")}
              </span>
            </span>
          </div>
          <div className="fontsize12 text-left col-md-4 align-self-right justify-content-center">
            <div className="row p-1">
              <span className="col text-md-right">
                Eleitorado apurado: <ProgressBar data={chartdataEleitorado} />
              </span>
            </div>
            <div className="row p-1">
              <span className="col text-md-right">
                Comparecimento:
                <ProgressBar data={chartdataComparecimento} />
              </span>
            </div>
            <div className="row p-1">
              <span className="col text-md-right">
                Seções totalizadas: <ProgressBar data={chartdataSecoes} />
              </span>
            </div>
            <div className="row p-1">
              <span className="col text-md-right">
                Votos válidos:
                <ProgressBar data={chartdataVotosValidos} />
              </span>
            </div>
            {mostrarQE && (
              <div className="row p-1 fontsize10 text-center justify-content-center">
                <span className="col ">
                  Vagas: {vagas}
                  &nbsp;&nbsp;&nbsp; QE: {qe}
                </span>
              </div>
            )}
            <div className="row p-1">
              <div className="col justify-content-center text-center">
                <span className="fontsize10 text-center badge badge-light ">
                  Atualização: {this.props.eleicao.dt} {this.props.eleicao.ht}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4">
              <Chart chartData={this.state.chartVotos} displayTitle="false" />
            </div>
          </div>
        </div>
        {semAtribuicaodeEleitos && (
          <span className={classBadge}>
            <div>{motivoSemAtribuicaodeEleitos}</div>
          </span>
        )}
        {matematicamenteDefinida !== "" && (
          <span className={classBadge}>
            <div>{matematicamenteDefinida}</div>
          </span>
        )}
        &nbsp;
      </div>
    );
  }
}

export default EleicaoSelecionada;

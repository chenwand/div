import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Painel from "./components/PainelVotacao";
import Abrangencia from "./components/Abrangencia";
import Validacao from "./components/Validacao";

class App extends Component {
  constructor() {
    super();
    this.state = {
      chartSecoes: {},
      isLoading: false,
      isLoadingCargo: {
        "1": false,
        "3": false,
        "5": false,
        "6": false,
        "7": false,
        "8": false,
        "11": false,
        "13": false,
      },
      error: null,
      abrangenciaSelecionada: "aa",
      abrangenciasDisponiveis: [],
      configuracaoEleicao: {},
      eleicoesDisponiveis: [],
      eleicoesCarregadas: [],
      url: "https://resultados.tse.jus.br/",
      ambiente: "oficial",
      showFlags: true,
      mostrarFotos: true,
      mostrarEleicoesRecentes: false,
      chkValidacoes: true,
      municipiosConfigurados: [],
      erroValidacaoJSON: [],
      photoUrl: {},
      eleicoesConfiguradas: {},
    };
    this.handleAbrangenciaChange = this.handleAbrangenciaChange.bind(this);
    this.handleAmbienteChange = this.handleAmbienteChange.bind(this);
    this.handleShowFlagsChange = this.handleShowFlagsChange.bind(this);
    this.handleMostrarFotosChange = this.handleMostrarFotosChange.bind(this);
    this.handleMostrarEleicoesRecentesChange = this.handleMostrarEleicoesRecentesChange.bind(
      this
    );
    this.handleChkValidacoesChange = this.handleChkValidacoesChange.bind(this);
    this.handleEleicaoChange = this.handleEleicaoChange.bind(this);
    this.handleMunicipioChange = this.handleMunicipioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickCargo = this.handleClickCargo.bind(this);
  }
  handleClick = () => this.atualizar();

  handleClickCargo(e) {
    console.log(e.currentTarget.id);

    var idcargo = e.currentTarget.id;
    var isLoadingCargo = this.state.isLoadingCargo;
    isLoadingCargo[idcargo] = true;
    this.setState({ isLoadingCargo: isLoadingCargo });
    //this.carregaArquivosResultadoPorCargo(idcargo);
  }

  atualizar() {
    this.setState({
      erroValidacaoJSON: [],
    });
    if (
      this.state.eleicaoSelecionada.tp === "3" ||
      this.state.eleicaoSelecionada.tp === "4" ||
      this.state.eleicaoSelecionada.tp === "7"
    ) {
      this.carregaArquivoResultadoMunicipio(
        document.getElementById("comboMunicipio").value
      );
    } else {
      this.carregaArquivosResultadoPorEleicao(
        this.state.abrangenciaSelecionada,
        this.state.eleicaoSelecionada
      );
    }
  }

  handleEleicaoChange(e) {
    if (e.target.value !== "") {
      var pleito = e.target.value.split("-")[0];
      var cdeleicao = e.target.value.split("-")[1];
      var eleicao;
      var abrangenciaSelecionada = "aa";

      eleicao = this.state.configuracaoEleicao.pl[pleito].e[cdeleicao];

      if (eleicao.abr.length === 1) {
        abrangenciaSelecionada = eleicao.abr[0].cd.toLowerCase();
        this.setState({ abrangenciaSelecionada: abrangenciaSelecionada });
      }
      this.carregaArquivoConfiguracaoMunicipios(eleicao);

      this.setState({
        eleicaoSelecionada: eleicao,
        eleicoesCarregadas: [],
        municipioSelecionado: undefined,
        erroValidacaoJSON: [],
      });
      this.carregaArquivoAcompanhamentoBR(eleicao);
      document.getElementById("comboMunicipio").value = "";
      document.getElementById("comboMunicipio").style.display = "none";
    }
  }
  selecionaAbrangencia(abrangencia) {
    this.setState({
      abrangenciaSelecionada: abrangencia.toLowerCase(),
      eleicoesCarregadas: [],
      municipioSelecionado: undefined,
    });
    this.renderComboMunicipio();
    if (
      this.state.eleicaoSelecionada.tp === "1" ||
      this.state.eleicaoSelecionada.tp === "3" ||
      this.state.eleicaoSelecionada.tp === "8"
    ) {
      this.carregaArquivoAcompanhamentoUF(
        this.state.eleicaoSelecionada,
        abrangencia
      );
    }
  }
  handleAbrangenciaChange(abrangencia) {
    this.selecionaAbrangencia(abrangencia);
  }
  handleMunicipioChange(e) {
    if (e.target.value !== "") {
      this.setState({
        municipioSelecionado: this.state.municipiosConfigurados[e.target.value],
      });
      this.carregaArquivoResultadoMunicipio(e.target.value);
    }
  }

  handleAmbienteChange(e) {
    this.setState({
      eleicoes: {
        "1": [],
        "3": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "11": [],
        "13": [],
      },
      eleicaoSelecionada: undefined,
      abrangenciaSelecionada: "aa",
      erroValidacaoJSON: [],
      ambiente: e.target.value,
      isLoading: true,
      eleicoesConfiguradas: {},
      eleicoesCarregadas: [],
    });
    this.carregarArquivosConfiguracaoEleicao(e.target.value);
  }
  handleShowFlagsChange() {
    this.setState({ showFlags: !this.state.showFlags });
  }
  handleMostrarFotosChange() {
    this.setState({ mostrarFotos: !this.state.mostrarFotos });
  }
  handleMostrarEleicoesRecentesChange() {
    this.setState({
      mostrarEleicoesRecentes: !this.state.mostrarEleicoesRecentes,
    });
  }
  handleChkValidacoesChange() {
    this.setState({ chkValidacoes: !this.state.chkValidacoes });
  }
  handleSubmit(event) {
    event.preventDefault();
  }
  loadEleicoesCargoJSON(url) {
    fetch(url + "?v=" + Date.now())
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        var atualizou = false;
        data.cand.sort(this.GetSortOrder("seq"));
        var eleicoes = this.state.eleicoes[data.carper];
        eleicoes.push(data);

        if (this.state.chkValidacoes) {
          this.validarJSON(url, data);
        }
        if (data.cdabr.toLowerCase() === this.state.abrangenciaSelecionada) {
          var eleicoesCarregadas = this.state.eleicoesCarregadas;

          for (var i = 0; i < eleicoesCarregadas.length; i++) {
            if (eleicoesCarregadas[i].carper === data.carper) {
              eleicoesCarregadas[i] = data;
              atualizou = true;
            }
          }
          if (!atualizou) {
            eleicoesCarregadas.push(data);
          }
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  }
  loadEleicoesJSON(url) {
    fetch(url + "?v=" + Date.now())
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        if (
          this.state.eleicaoSelecionada.tp === "6" ||
          this.state.eleicaoSelecionada.tp === "5"
        ) {
          data.resp.sort(this.GetSortOrder("seq"));
        } else {
          data.cand.sort(this.GetSortOrder("seq"));
        }
        var eleicoesCarregadas = this.state.eleicoesCarregadas;
        var eleicoes = this.state.eleicoes[data.carper];
        eleicoes.push(data);
        if (this.state.chkValidacoes) {
          this.validarJSON(url, data);
        }
        //if (data.cdabr.toLowerCase() === this.state.abrangenciaSelecionada) {

        if (
          this.state.eleicaoSelecionada.abrangenciasDisponiveis.includes(
            data.cdabr.toLowerCase()
          )
        ) {
          for (
            var i = 0;
            i < this.state.eleicaoSelecionada.abr[0].cp.length;
            i++
          ) {
            if (
              data.carper === this.state.eleicaoSelecionada.abr[0].cp[i].cd &&
              this.state.abrangenciaSelecionada === data.cdabr.toLowerCase()
            ) {
              eleicoesCarregadas.push(data);
            }
            console.log(
              data.carper +
                " - " +
                data.cdabr +
                " - " +
                data.ele +
                " - esae:" +
                data.esae +
                " - md:" +
                data.md +
                " - tf:" +
                data.tf
            );
          }
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  }
  validarJSON(url, data) {
    const validacoes = {
      TOTAL_SECOES:
        "Total de seções é diferente de seções totalizadas + não totalizadas.",
      SECOES_TOTALIZACAO: "Existe seção não totalizada e totalização final.",
      COMPARECIMENTO_VOTOS: "Comparecimento é diferente de votos.",
      ELEITORADO_SECOES_INSTALADAS: "esi = c + a",
      NAO_EXISTEM_CANDIDATOS: "Não existem votáveis.",
      TOTAL_VOTOS:
        "Total de votos é diferente de válidos + brancos + nulos + anulados.",
      VALIDOS_NOMINAIS_LEGENDA:
        "Total de válidos é diferente de nominais + legenda.",
      VOTOS_VALIDOS_CANDIDATOS:
        "O total de votos dos candidatos mais legenda é diferente dos válidos da eleição.",
      VOTOS_NOMINAIS_CANDIDATOS:
        "O total de votos dos candidatos é diferente dos votos nominais da eleição. ",
      ELEITORADO_TOTALIZADAS_INSTALADAS: "est = esi + esni",
      ELEITORADO_TOTAL: "te = est + esnt",
      ELEITORADO_TOTALIZADAS_COMPARECIMENTO: "est = c + a + esni",
    };
    var erro = {};
    var erros = this.state.erroValidacaoJSON;
    if (
      parseInt(data.s.ts, 10) !==
      parseInt(data.s.st, 10) + parseInt(data.s.snt, 10)
    ) {
      erro = {
        codigoSituacao: 1,
        descricaoSituacao: validacoes.TOTAL_SECOES,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (parseInt(data.s.snt, 10) > 0 && data.tf === "s") {
      erro = {
        codigoSituacao: 2,
        descricaoSituacao: validacoes.SECOES_TOTALIZACAO,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.e.te, 10) !==
      parseInt(data.e.est, 10) + parseInt(data.e.esnt, 10)
    ) {
      erro = {
        codigoSituacao: 3,
        descricaoSituacao: validacoes.ELEITORADO_TOTAL,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.e.est, 10) !==
      parseInt(data.e.esi, 10) + parseInt(data.e.esni, 10)
    ) {
      erro = {
        codigoSituacao: 11,
        descricaoSituacao: validacoes.ELEITORADO_TOTALIZADAS_INSTALADAS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.e.esi, 10) !==
      parseInt(data.e.c, 10) + parseInt(data.e.a, 10)
    ) {
      erro = {
        codigoSituacao: 11,
        descricaoSituacao: validacoes.ELEITORADO_SECOES_INSTALADAS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.e.est, 10) !==
      parseInt(data.e.c, 10) +
        parseInt(data.e.a, 10) +
        parseInt(data.e.esni, 10)
    ) {
      erro = {
        codigoSituacao: 12,
        descricaoSituacao: validacoes.ELEITORADO_TOTALIZADAS_COMPARECIMENTO,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.e.c, 10) !==
        parseInt(data.v.tv, 10) + parseInt(data.e.esna, 10) &&
      data.carper !== "5"
    ) {
      erro = {
        codigoSituacao: 4,
        descricaoSituacao: validacoes.COMPARECIMENTO_VOTOS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.e.esi, 10) !==
      parseInt(data.e.c, 10) + parseInt(data.e.a, 10)
    ) {
      erro = {
        codigoSituacao: 5,
        descricaoSituacao: validacoes.ELEITORADO_SECOES_INSTALADAS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      this.state.eleicaoSelecionada.tp !== "5" &&
      this.state.eleicaoSelecionada.tp !== "6" &&
      data.carg.length < 1
    ) {
      erro = {
        codigoSituacao: 6,
        descricaoSituacao: validacoes.NAO_EXISTEM_CANDIDATOS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      (this.state.eleicaoSelecionada.tp === "5" ||
        this.state.eleicaoSelecionada.tp === "6") &&
      data.perg.length < 1
    ) {
      erro = {
        codigoSituacao: 6,
        descricaoSituacao: validacoes.NAO_EXISTEM_CANDIDATOS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }
    if (
      parseInt(data.v.tv, 10) !==
      parseInt(data.v.vb, 10) +
        parseInt(data.v.tvn, 10) +
        parseInt(data.v.vv, 10) +
        parseInt(data.v.van, 10) +
        parseInt(data.v.vansj, 10)
    ) {
      erro = {
        codigoSituacao: 7,
        descricaoSituacao: validacoes.TOTAL_VOTOS,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }

    if (
      parseInt(data.v.vv, 10) !==
      parseInt(data.v.vnom, 10) +
        parseInt(data.v.vl === undefined ? 0 : data.v.vl, 10)
    ) {
      erro = {
        codigoSituacao: 8,
        descricaoSituacao: validacoes.VALIDOS_NOMINAIS_LEGENDA,
        dataArquivo: data.dt + " " + data.ht,
        caminhoArquivo: url,
      };
      erros.push(erro);
    }

    if (this.state.eleicaoSelecionada.tp !== "6" && data.cand.length > 0) {
      var totalVotosCandidatos = 0;
      for (var i = 0; i < data.cand.length; i++) {
        if (data.cand[i].dvt === "Válido") {
          totalVotosCandidatos =
            totalVotosCandidatos + parseInt(data.cand[i].vap, 10);
        }
      }
      if (
        parseInt(data.vv, 10) !==
          totalVotosCandidatos +
            parseInt(data.v.vl === undefined ? 0 : data.v.vl, 10) &&
        data.dv === "s"
      ) {
        erro = {
          codigoSituacao: 9,
          descricaoSituacao: validacoes.VOTOS_VALIDOS_CANDIDATOS,
          dataArquivo: data.dt + " " + data.ht,
          caminhoArquivo: url,
        };
        erros.push(erro);
      }
      if (
        parseInt(data.v.vnom, 10) !== totalVotosCandidatos &&
        data.dv === "s"
      ) {
        erro = {
          codigoSituacao: 10,
          descricaoSituacao: validacoes.VOTOS_NOMINAIS_CANDIDATOS,
          dataArquivo: data.dt + " " + data.ht,
          caminhoArquivo: url,
        };
        erros.push(erro);
      }
    }
  }
  sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((parseInt(a[i], 10) || 0) + (parseInt(b[i], 10) || 0));
    }
    return c;
  }
  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele.apuracao.length !== value;
    });
  }

  loadEleicao(url) {
    fetch(url + "?v=" + Date.now())
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        var eleicoesCarregadas = this.state.eleicoesCarregadas;
        eleicoesCarregadas.push(data);
        if (this.state.chkValidacoes) {
          this.validarJSON(url, data);
        }
        this.setState({
          eleicoesCarregadas: eleicoesCarregadas,
          isLoading: false,
        });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  loadArquivoConfiguracaoEleicao(ambiente) {
    var arquivo = this.state.url + ambiente + "/comum/config/ele-c.json";

    console.log(arquivo);

    fetch(arquivo + "?v=" + Date.now())
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        data.pl.sort(this.GetSortOrderData("dt"));
        this.setState({
          eleicoesConfiguradas: data,
          isLoading: false,
          configuracaoEleicao: data,
        });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }
  carregarArquivosConfiguracaoEleicao(ambiente) {
    this.setState({ eleicoesDisponiveis: [] });
    this.loadArquivoConfiguracaoEleicao(ambiente);
  }

  carregaArquivosResultadoPorPleito(pleito) {
    var ambiente = this.state.ambiente;
    var eleicao = "";
    var abrangencia = "";
    var ano = "";
    var cargo = "";
    var arquivo = "";
    this.setState({ eleicoesCarregadas: [] });

    for (
      var i = 0;
      this.state.eleicoesConfiguradas[pleito] !== undefined &&
      i < this.state.eleicoesConfiguradas[pleito].length;
      i++
    ) {
      eleicao = this.state.eleicoesConfiguradas[pleito][i];
      ano = eleicao.ano;

      for (var j = 0; j < eleicao.cdabr.length; j++) {
        abrangencia = eleicao.cdabr[j].toLowerCase();

        for (var k = 0; k < eleicao.cargos.length; k++) {
          cargo =
            abrangencia === "df" && eleicao.cargos[k].cd === "7"
              ? 8
              : parseInt(eleicao.cargos[k].cd, 10);
          cargo = "c" + (cargo + 10000).toString().slice(-4);

          arquivo =
            this.state.url +
            ano +
            "/divulgacao/" +
            ambiente +
            "/" +
            eleicao.cd +
            "/dadosdivweb/" +
            abrangencia +
            "/" +
            abrangencia +
            "-" +
            cargo +
            "-e00" +
            eleicao.cd +
            "-w.js";
          console.log(arquivo);
          this.loadEleicoesJSON(arquivo);
        }
      }
    }
  }
  carregaArquivosResultadoPorEleicao(abrangencia, eleicao) {
    var ambiente = this.state.ambiente;
    var ano = this.state.configuracaoEleicao.c;
    var cargo = "";
    var cargos = eleicao.abr[0].cp;
    var arquivo = "";
    this.setState({ eleicoesCarregadas: [] });
    var photoUrl =
      this.state.url + ambiente + "/" + ano + "/" + eleicao.cd + "/fotos/";
    this.setState({ photoUrl: photoUrl });
    for (var j = 0; j < eleicao.abrangenciasDisponiveis.length; j++) {
      abrangencia = eleicao.abrangenciasDisponiveis[j].toLowerCase();
      var cargocorreto = true;
      for (var k = 0; k < cargos.length; k++) {
        cargo = parseInt(cargos[k].cd, 10);
        cargocorreto =
          (cargo === "8" && abrangencia !== "df") ||
          (cargo === "7" && abrangencia === "df")
            ? false
            : true;
        if (cargo === "8" && abrangencia !== "df") {
          cargo = "7";
        }
        cargo = "c" + (cargo + 10000).toString().slice(-4);
        arquivo =
          this.state.url +
          ambiente +
          "/" +
          ano +
          "/" +
          eleicao.cd +
          "/dados/" +
          abrangencia +
          "/" +
          abrangencia +
          "-" +
          cargo +
          "-e" +
          (parseInt(eleicao.cd, 10) + 1000000).toString().slice(-6) +
          "-u.json";
        if (cargocorreto) {
          console.log(arquivo);
          this.loadEleicoesJSON(arquivo);
        }
      }
    }
    this.carregaArquivoAcompanhamentoBR(eleicao);
  }

  carregaArquivoResultadoMunicipio(municipio, uf) {
    this.setState({ municipioSelecionado: municipio });
    var ambiente = this.state.ambiente;
    var ano = this.state.configuracaoEleicao.c;
    var cargo = "";
    var cargos = this.state.eleicaoSelecionada.abr[0].cp;
    var arquivo = "";
    var eleicao = this.state.eleicaoSelecionada;
    var abrangencia = uf !== undefined ? uf : this.state.abrangenciaSelecionada;
    this.setState({ eleicoesCarregadas: [] });
    var photoUrl =
      this.state.url + ambiente + "/" + ano + "/" + eleicao.cd + "/fotos/";
    this.setState({ photoUrl: photoUrl });
    for (var i = 0; i < cargos.length; i++) {
      cargo = "c" + (parseInt(cargos[i].cd, 10) + 10000).toString().slice(-4);
      arquivo =
        this.state.url +
        ambiente +
        "/" +
        ano +
        "/" +
        eleicao.cd +
        "/dados/" +
        abrangencia +
        "/" +
        abrangencia +
        municipio +
        "-" +
        cargo +
        "-e" +
        (parseInt(eleicao.cd, 10) + 1000000).toString().slice(-6) +
        "-u.json";
      console.log(arquivo);
      this.loadEleicao(arquivo);
    }
  }

  carregaArquivoAcompanhamentoUF(eleicao, abrangencia) {
    var ambiente = this.state.ambiente;
    var ano = this.state.configuracaoEleicao.c;
    var arquivo = "";
    arquivo =
      this.state.url +
      ambiente +
      "/" +
      ano +
      "/" +
      eleicao.cd +
      "/dados/" +
      abrangencia +
      "/" +
      abrangencia +
      "-e" +
      (parseInt(eleicao.cd, 10) + 1000000).toString().slice(-6) +
      "-ab.json";
    console.log(arquivo);
    this.setState({ acompanhamentoUF: [] });
    fetch(arquivo + "?v=" + Date.now())
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        this.setState({ acompanhamentoUF: data, isLoading: false });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }
  carregaArquivoAcompanhamentoBR(eleicao) {
    if (eleicao.tp === "1" || eleicao.tp === "3" || eleicao.tp === "8") {
      var ambiente = this.state.ambiente;
      var ano = this.state.configuracaoEleicao.c;
      var arquivo =
        this.state.url +
        ambiente +
        "/" +
        ano +
        "/" +
        eleicao.cd +
        "/dados/" +
        "br/br-e" +
        (parseInt(eleicao.cd, 10) + 1000000).toString().slice(-6) +
        "-ab.json";
      console.log(arquivo);
      this.setState({ acompanhamentoBR: [] });
      fetch(arquivo + "?v=" + Date.now())
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong ...");
          }
        })
        .then((data) => {
          this.setState({ acompanhamentoBR: data, isLoading: false });
        })
        .catch((error) => this.setState({ error, isLoading: false }));
    }
  }
  carregaArquivoConfiguracaoMunicipios(eleicao) {
    var ambiente = this.state.ambiente;
    var ano = this.state.configuracaoEleicao.c;
    var arquivo = "";
    arquivo =
      this.state.url +
      ambiente +
      "/" +
      ano +
      "/" +
      eleicao.cd +
      "/config" +
      "/mun-e" +
      (parseInt(eleicao.cd, 10) + 1000000).toString().slice(-6) +
      "-cm.json";
    console.log(arquivo);
    this.setState({ municipiosConfigurados: [], abrangenciasDisponiveis: [] });
    fetch(arquivo + "?v=" + Date.now())
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        if (data.abr.length === 1 && data.abr[0].mu.length === 1) {
          this.setState({ municipioSelecionado: data.abr[0].mu[0].cd });
          this.carregaArquivoResultadoMunicipio(
            data.abr[0].mu[0].cd,
            data.abr[0].cd.toLowerCase()
          );
        }
        var abrangenciasDisponiveis = [];
        if (eleicao.tp === "8" || eleicao.tp === "9" || eleicao.tp === "5") {
          abrangenciasDisponiveis.push("br");
        }
        for (var i = 0; i < data.abr.length; i++) {
          abrangenciasDisponiveis.push(data.abr[i].cd.toLowerCase());
        }
        var eleicaoSelecionada = this.state.eleicaoSelecionada;
        eleicaoSelecionada.abrangenciasDisponiveis = abrangenciasDisponiveis;
        if (eleicao.tp === "3" || eleicao.tp === "4" || eleicao.tp === "7") {
          document.getElementById("comboMunicipio").style.display = "block"; //className="collapse show";
          document.getElementById("comboMunicipio").value =
            data.abr[0].mu[0].cd;
        } else {
          this.carregaArquivosResultadoPorEleicao(
            abrangenciasDisponiveis[0],
            eleicaoSelecionada
          );
        }
        this.setState({
          eleicaoSelecionada: eleicaoSelecionada,
          municipiosConfigurados: data,
          abrangenciasDisponiveis: abrangenciasDisponiveis,
          abrangenciaSelecionada: abrangenciasDisponiveis[0],
          isLoading: false,
        });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    this.carregarArquivosConfiguracaoEleicao(this.state.ambiente);

    clearInterval(this.intervalId);
  }

  GetSortOrderData(prop) {
    return function(a, b) {
      var dia = a[prop].split("/")[0];
      var mes = a[prop].split("/")[1];
      var ano = a[prop].split("/")[2];
      var data1 =
        ano + "-" + ("0" + mes).slice(-2) + "-" + ("0" + dia).slice(-2);

      dia = b[prop].split("/")[0];
      mes = b[prop].split("/")[1];
      ano = b[prop].split("/")[2];
      var data2 =
        ano + "-" + ("0" + mes).slice(-2) + "-" + ("0" + dia).slice(-2);

      if (new Date(data1) > new Date(data2)) {
        return -1;
      } else if (new Date(data1) < new Date(data2)) {
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
  GetSortOrderDataHora(propdt, propht) {
    return function(a, b) {
      var dia = a[propdt].split("/")[0];
      var mes = a[propdt].split("/")[1];
      var ano = a[propdt].split("/")[2];

      var hora = a[propht].split(":")[0];
      var minuto = a[propht].split(":")[1];
      var segundo = a[propht].split(":")[2];
      var data1 = new Date(ano, mes, dia, hora, minuto, segundo);
      //ano + '-' + ('0' + mes).slice(-2) + '-' + ('0' + dia).slice(-2);
      dia = b[propdt].split("/")[0];
      mes = b[propdt].split("/")[1];
      ano = b[propdt].split("/")[2];
      hora = b[propht].split(":")[0];
      minuto = b[propht].split(":")[1];
      segundo = b[propht].split(":")[2];
      var data2 = new Date(ano, mes, dia, hora, minuto, segundo);
      //ano + '-' + ('0' + mes).slice(-2) + '-' + ('0' + dia).slice(-2);
      if (data1 > data2) {
        return 1;
      } else if (data1 < data2) {
        return -1;
      }
      return 0;
    };
  }
  renderComboEleicao() {
    var rows = [];
    var hoje = new Date();
    var dataLimite = new Date(new Date().setDate(hoje.getDate() - 30));
    var dataEleicao, dt;
    var eleicoesConfiguradas = this.state.configuracaoEleicao.pl;
    for (var x in eleicoesConfiguradas) {
      dt = eleicoesConfiguradas[x].dt;
      dataEleicao = new Date(
        dt.split("/")[2],
        dt.split("/")[1] - 1,
        dt.split("/")[0]
      );
      for (var i = 0; i < eleicoesConfiguradas[x].e.length; i++) {
        if (this.state.mostrarEleicoesRecentes) {
          if (dataEleicao > dataLimite) {
            rows.push(
              <option value={x + "-" + i} key={eleicoesConfiguradas[x].e[i].cd}>
                {eleicoesConfiguradas[x].e[i].cd} - {eleicoesConfiguradas[x].dt}{" "}
                - {eleicoesConfiguradas[x].e[i].nm.replace("&#186;", "º")}
              </option>
            );
          }
        } else {
          rows.push(
            <option value={x + "-" + i} key={eleicoesConfiguradas[x].e[i].cd}>
              {eleicoesConfiguradas[x].e[i].cd} - {eleicoesConfiguradas[x].dt} -{" "}
              {eleicoesConfiguradas[x].e[i].nm.replace("&#186;", "º")}
            </option>
          );
        }
      }
    }
    return rows;
  }
  renderComboEleicaoTypeAhead() {
    var rows = [];
    for (var x in this.state.eleicoesConfiguradas) {
      for (var i = 0; i < this.state.eleicoesConfiguradas[x].length; i++) {
        rows.push(
          this.state.eleicoesConfiguradas[x][i].cd +
            " / " +
            this.state.eleicoesConfiguradas[x][i].nm
        );
      }
    }
    return rows;
  }
  renderComboMunicipio() {
    var getObjectByValue = function(array, key, value) {
      return array.filter(function(object) {
        return object[key] === value;
      });
    };
    var rows = [];
    if (this.state.municipiosConfigurados.abr !== undefined) {
      var abr = getObjectByValue(
        this.state.municipiosConfigurados.abr,
        "cd",
        this.state.abrangenciaSelecionada.toLowerCase()
      );
      if (abr[0] !== undefined && abr[0].mu !== undefined) {
        for (var i = 0; i < abr[0].mu.length; i++) {
          rows.push(
            <option value={abr[0].mu[i].cd} key={i}>
              {abr[0].mu[i].cd} - {abr[0].mu[i].nm}
            </option>
          );
        }
      }
    }
    return rows;
  }
  renderTabCargo() {
    var rows = [];
    if (this.state.eleicaoSelecionada !== undefined) {
      this.state.eleicaoSelecionada.abr[0].cp.sort(this.GetSortOrderAsc("cd"));
      var id, aria, href, classTab, classSync;
      for (var i = 0; i < this.state.eleicaoSelecionada.abr[0].cp.length; i++) {
        id = "nav-tab-" + i;
        aria = "nav-" + i;
        href = "#" + aria;
        classTab =
          i === 0 ? "nav-item nav-link show active" : "nav-item nav-link";
        classSync = this.state.isLoadingCargo[
          parseInt(this.state.eleicaoSelecionada.abr[0].cp[i].cd, 10)
        ]
          ? "fas fa-sync-alt fa-spin"
          : "fas fa-sync-alt";
        if (this.state.eleicaoSelecionada.abr[0].cp[i].cd !== "8") {
          rows.push(
            <a
              className={classTab}
              id={id}
              key={id}
              data-toggle="tab"
              href={href}
              role="tab"
              aria-controls={aria}
            >
              {this.state.eleicaoSelecionada.abr[0].cp[i].cd === "7" &&
              this.state.abrangenciaSelecionada === "df"
                ? "Deputado Distrital"
                : this.state.eleicaoSelecionada.abr[0].cp[i].ds}
              &nbsp;{" "}
              <span
                className="button"
                style={{ fontSize: "12px", color: "Dodgerblue" }}
                id={this.state.eleicaoSelecionada.abr[0].cp[i].cd}
                onClick={this.handleClickCargo}
              >
                <span className={classSync} />
              </span>
            </a>
          );
        }
      }
    }
    return rows;
  }
  renderVotacao() {
    var rows = [];
    if (
      this.state.eleicaoSelecionada !== undefined &&
      this.state.eleicoesCarregadas.length > 0
    ) {
      this.state.eleicoesCarregadas.sort(this.GetSortOrderAsc("carper"));
      var id, aria, classTabPanel, eleicoesFlag;
      for (var i = 0; i < this.state.eleicoesCarregadas.length; i++) {
        id = "nav-" + i;
        aria = "nav-tab-" + i;
        classTabPanel = i === 0 ? "tab-pane fade show active" : "tab-pane fade";
       /* eleicoesFlag = this.state.eleicoes[
          this.state.eleicoesCarregadas[i].carper
        ];*/
        rows.push(
          <div
            className={classTabPanel}
            id={id}
            key={i}
            role="tabpanel"
            aria-labelledby={aria}
          >
            <Painel
              className="painel"
              cargo={this.state.cargo}
              cdeleicao={this.state.eleicaoSelecionada.cd}
              nmeleicao={this.state.eleicaoSelecionada.nm}
              vt={this.state.eleicoesCarregadas[i]}
              eleicoesFlag={eleicoesFlag}
              photoUrl={this.state.photoUrl}
              uf={this.state.abrangenciaSelecionada}
              mostrarFotos={this.state.mostrarFotos}
              tipoEleicao={this.state.eleicaoSelecionada.tp}
              acompanhamentoBR={this.state.acompanhamentoBR}
            />
          </div>
        );
      }
    }
    return rows;
  }

  geraMapaErroJSON() {
    var codigoSituacao = 0,
      mapaErroJSON = {};
    for (var i = 0; i < this.state.erroValidacaoJSON.length; i++) {
      codigoSituacao = parseInt(
        this.state.erroValidacaoJSON[i].codigoSituacao,
        10
      );
      if (mapaErroJSON[codigoSituacao] === undefined) {
        mapaErroJSON[codigoSituacao] = {
          arquivos: [],
          descricaoSituacao: this.state.erroValidacaoJSON[i].descricaoSituacao,
        };
      }
      mapaErroJSON[codigoSituacao].arquivos.push(
        this.state.erroValidacaoJSON[i]
      );
    }
    return mapaErroJSON;
  }
  renderTabValidacaoJSON() {
    var rows = [];
    rows.push(
      <a
        className="nav-item nav-link"
        id="nav-tab-validacaojson"
        key="nav-tab-validacaojson"
        data-toggle="tab"
        href="#nav-validacaojson"
        role="tab"
        aria-controls="nav-validacaojson"
      >
        Validação JSON{" "}
        <span className="badge badge-danger small">
          {this.state.erroValidacaoJSON.length}
        </span>
      </a>
    );
    return rows;
  }
  renderLogValidacaoJSON() {
    var rows = [];
    var mapa = this.geraMapaErroJSON();
    for (var key in mapa) {
      if (mapa.hasOwnProperty(key)) {
        rows.push(
          <Validacao
            key={key}
            codigoSituacao={key}
            descricaoSituacao={mapa[key].descricaoSituacao}
            arquivos={mapa[key].arquivos}
          />
        );
      }
    }
    return rows;
  }

  GetSortOrder(prop) {
    return function(a, b) {
      if (parseInt(a[prop], 10) > parseInt(b[prop], 10)) {
        return 1;
      } else if (parseInt(a[prop], 10) < parseInt(b[prop], 10)) {
        return -1;
      }
      return 0;
    };
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <p>Carregando ...</p>;
    }

    this.state.eleicoesDisponiveis.sort(this.GetSortOrderDesc("cd"));
    return (
      <div className="App">
        <div className="pos-f-t">
          <div className="collapse" id="navbarToggleExternalContent">
            <div className="bg-dark p-4">
              <h5 className="text-white">Configurações</h5>
              <form className="form-inline">
                <div
                  className="alert alert-success form-inline small center m-1"
                  role="alert"
                >
                  <label htmlFor="ambiente" className="small">
                    Url&nbsp;
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="url de conexão"
                    value={this.state.url}
                    readOnly
                  />
                  &nbsp;&nbsp;
                  <label htmlFor="ambiente" className="small">
                    Ambiente&nbsp;
                  </label>
                  <select
                    className="custom-select custom-select-sm"
                    id="ambiente"
                    onChange={this.handleAmbienteChange}
                    value={this.state.ambiente}
                  >
                    <option value="homologacao">homologacao</option>
                    <option value="teste">teste</option>
                    <option value="simulado">simulado</option>
                    <option value="oficial">oficial</option>
                  </select>
                  &nbsp;&nbsp;
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="showFlags"
                    checked={this.state.showFlags}
                    onChange={this.handleShowFlagsChange}
                  />
                  <label htmlFor="showFlags" className="small">
                    Mostrar bandeiras
                  </label>
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="mostrarFotos"
                    checked={this.state.mostrarFotos}
                    onChange={this.handleMostrarFotosChange}
                  />
                  <label htmlFor="mostrarFotos" className="small">
                    Mostrar fotos
                  </label>
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="eleicoesRecentes"
                    checked={this.state.mostrarEleicoesRecentes}
                    onChange={this.handleMostrarEleicoesRecentesChange}
                  />
                  <label htmlFor="eleicoesRecentes" className="small">
                    Apenas eleições recentes
                  </label>
                  &nbsp;&nbsp;&nbsp;
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="chkValidacoes"
                    checked={this.state.chkValidacoes}
                    onChange={this.handleChkValidacoesChange}
                  />
                  <label htmlFor="chkValidacoes" className="small">
                    Validar arquivos
                  </label>
                </div>
              </form>
            </div>
          </div>
          <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="#1">
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt=""
              />
              DIV
            </a>
            <span className="float-right">
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarToggleExternalContent"
                aria-controls="navbarToggleExternalContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
            </span>
          </nav>
        </div>
        <div className="container">
          <div className="form-group">
            <br />
            <form onSubmit={this.handleSubmit}>
              <div className="input-group">
                <select
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Eleição"
                  id="comboEleicao"
                  onChange={this.handleEleicaoChange}
                  className="custom-select custom-select-sm"
                >
                  <option value="" key="">
                    Selecione a eleição
                  </option>
                  {this.renderComboEleicao()}
                </select>
                <div className="input-group-append">
                  <span
                    className="input-group"
                    id="inputGroupAppend2"
                    data-placement="top"
                    data-toggle="tooltip"
                    title="Abrangência"
                  >
                    <Abrangencia
                      abrangenciaSelecionada={this.state.abrangenciaSelecionada}
                      abrangenciasDisponiveis={
                        this.state.abrangenciasDisponiveis
                      }
                      onAbrangenciaChange={this.handleAbrangenciaChange}
                    />
                  </span>
                </div>
                <select
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Município"
                  id="comboMunicipio"
                  onChange={this.handleMunicipioChange}
                  className="collapse custom-select custom-select-sm"
                  value={
                    this.state.municipioSelecionado !== undefined
                      ? this.state.municipioSelecionado.cd
                      : ""
                  }
                >
                  <option value="" key="">
                    Selecione o município
                  </option>
                  {this.renderComboMunicipio()}
                </select>
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={this.handleClick}
                  >
                    {" "}
                    {this.state.eleicoesCarregadas.length > 0
                      ? "Atualizar"
                      : "Consultar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <nav>
            <div className="nav nav-tabs small" id="nav-tab" role="tablist">
              {this.renderTabCargo()}
              {this.state.erroValidacaoJSON.length > 0 &&
                this.renderTabValidacaoJSON()}
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            {this.renderVotacao()}
            <div
              className="tab-pane fade p-2"
              id="nav-validacaojson"
              key="nav-validacaojson"
              role="tabpanel"
              aria-labelledby="nav-tab-validacaojson"
            >
              {this.state.erroValidacaoJSON.length > 0 &&
                this.renderLogValidacaoJSON()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

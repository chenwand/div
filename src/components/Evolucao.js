import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

var options = {
  responsive: true,
  title: {
    display: false,
    text: ''
  },
  legend: {
    display: true,
    position: 'bottom',
    fontSize: 1
  },
  tooltips: {
    mode: 'index',
    intersect: false,
    position: 'nearest'
  },
  elements: {
    point: {
      pointStyle: 'circle'
    }
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [
      {
        display: true,
        scaleLabel: {
          display: false,
          labelString: ''
        }
      }
    ],
    yAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: '% votos válidos'
        }
      }
    ]
  }
};

class Evolucao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: [],
      data: {
        labels: [],
        datasets: []
      },
      cargo: ''
    };
  }
  static defaultProps = {};
  componentDidMount() {}
  componentWillUpdate() {}
  componentDidUpdate() {}
  componentWillReceiveProps() {
    this.setState({
      data: {
        labels: [],
        datasets: []
      }
    });
  }
  componentWillUnmount() {}
  sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((parseInt(a[i], 10) || 0) + (parseInt(b[i], 10) || 0));
    }
    return c;
  }
  ConvertDate(data, hora) {
    var dia = data.split('/')[0];
    var mes = data.split('/')[1];
    var ano = data.split('/')[2];

    return new Date(
      ano +
        '-' +
        ('0' + mes).slice(-2) +
        '-' +
        ('0' + dia).slice(-2) +
        ' ' +
        hora
    );
  }
  GetSortOrderDataHora(propdt, propht) {
    return function(a, b) {
      var dia = a[propdt].split('/')[0];
      var mes = a[propdt].split('/')[1];
      var ano = a[propdt].split('/')[2];

      var hora = a[propht].split(':')[0];
      var minuto = a[propht].split(':')[1];
      var segundo = a[propht].split(':')[2];

      var data1 = new Date(ano, mes, dia, hora, minuto, segundo);
      //ano + '-' + ('0' + mes).slice(-2) + '-' + ('0' + dia).slice(-2);

      dia = b[propdt].split('/')[0];
      mes = b[propdt].split('/')[1];
      ano = b[propdt].split('/')[2];

      hora = b[propht].split(':')[0];
      minuto = b[propht].split(':')[1];
      segundo = b[propht].split(':')[2];

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
  geraGrafico() {
    if (
      this.props.dados !== undefined &&
      this.props.dados.cargo !== undefined &&
      this.state.data.datasets.length === 0
    ) {
      var dados = [];
      var data = this.state.data;
      for (var j = 0; j < this.props.dados.cargo.candidato.length; j++) {
        dados[j] = [];
        var labels = [];
        var dataset = {
          fill: false,
          //lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 1.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10
        };
        //this.props.dados.cargo.candidato[j].apuracao.sort(          this.GetSortOrderAsc('votVal')       );
        this.props.dados.cargo.candidato[j].apuracao.sort(
          this.GetSortOrderDataHora('datApu', 'horApu')
        );
        for (
          var i = 0;
          i < this.props.dados.cargo.candidato[j].apuracao.length;
          i++
        ) {
          dados[j].push(
            (
              (parseInt(
                this.props.dados.cargo.candidato[j].apuracao[i].totVot,
                10
              ) /
                parseInt(
                  this.props.dados.cargo.candidato[j].apuracao[i].votVal,
                  10
                )) *
              100
            ).toFixed(2)
          );
          labels.push(
            this.props.dados.cargo.candidato[j].apuracao[i].horApu.split(
              ':'
            )[0] +
              ':' +
              this.props.dados.cargo.candidato[j].apuracao[i].horApu.split(
                ':'
              )[1]
          );
        }
        //parciaisTotalValidos = this.sumArray(parciaisTotalValidos, dados[j]);

        data.labels = data.labels.length > labels.length ? data.labels : labels;

        dataset.data = dados[j];
        dataset.backgroundColor = this.props.dados.cargo.candidato[j].cor;
        dataset.pointHoverBackgroundColor = this.props.dados.cargo.candidato[
          j
        ].cor;
        dataset.borderColor = this.props.dados.cargo.candidato[j].cor;
        dataset.pointBorderColor = this.props.dados.cargo.candidato[j].cor;
        dataset.label =
          this.props.dados.cargo.candidato[j].num +
          ' - ' +
          this.props.dados.cargo.candidato[j].nUrn;
        data.datasets.push(dataset);
      }

      /* for (var b = 0; b < dados.length; b++) {
        for (var a = 0; a < parciaisTotalValidos.length; a++) {
          dados[b][a] = ((parseInt(dados[b][a]) / parseInt(parciaisTotalValidos[a])) *100).toFixed(2);
        }
      }*/

      //      this.setState({ data: data });
    }
  }
  render() {
    this.geraGrafico();
    return (
      <div>
        <Line data={this.state.data} options={options} />
      </div>
    );
  }
}

export default Evolucao;

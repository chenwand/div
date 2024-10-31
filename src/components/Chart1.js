import React, { Component } from 'react';
import { Doughnut, Chart } from 'react-chartjs-2';

class Chart1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData,
      opt: {
        responsive: true,
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                offsetGridLines: false
              }
            }
          ],
          yAxes: [
            {
              display: true
            }
          ]
        },
        showLines: false,
        spanGaps: false
      }
    };
  }
  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'right'
  };

  componentDidMount() {
    Chart.pluginService.register({
      afterDraw: function(chart, easing) {
        // Plugin code.
      }
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.chartData !== this.props.chartData) {
      this.setState({ chartData: this.props.chartData });
    }
  }
  render() {
    return (
      <div className="width340">
        <Doughnut
          data={this.state.chartData}
          options={{
            maintainAspectRatio: true,
            title: {
              display: this.props.displayTitle,
              fontSize: 5
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
              fontSize: 5
            }
          }}
        />
      </div>
    );
  }
}
export default Chart1;

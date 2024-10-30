import React from 'react';

const colors = [
  'linear-gradient(#00b3b3 80%, #0066cc)',
  'linear-gradient(#ffcc00 60%, #e69900)',
  'linear-gradient(#0099ff 60%, #0066cc)'
];
const pureColors = ['#00b3b3', '#ffcc00', '#0099ff'];

class Popover extends React.Component {
  render() {
    const { text, index } = this.props;

    return (
      <span className="popover">
        <span className="color" style={{ background: pureColors[index] }} />
        {text}
      </span>
    );
  }
}
class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.hintfix,
      width: `${isNaN(this.props.value) ? '0.00' : this.props.value}%`
    };
  }

  handleHover = (show = false) => () => {
    this.setState({ show });
  };

  componentDidMount() {
    /*this.intervalId = setTimeout(() => {
      this.setState({
        width: `${this.props.value}%`
      });
    }, 300);*/
  }
  componentWillUnmount() {
    //clearInterval(this.intervalId);
  }
  render() {
    var { value, index } = this.props;
    value = isNaN(value) ? '0,00' : value;
    var total = isNaN(this.props.total) ? '0.00' : this.props.total;
    return (
      <span
        className="progress"
        style={{ width: this.state.width, background: colors[index] }}
        onMouseEnter={this.handleHover(true)}
        onClick={this.handleHover(!this.state.show)}
        onMouseOut={this.handleHover(false)}
      >
        {this.state.show && (
          <Popover
            text={
              String(total)
                .split(/(?=(?:...)*$)/)
                .join('.') +
              ' (' +
              String(`${value.replace('.', ',')}%`) +
              ')'
            }
            index={index}
          />
        )}
        <span className="ml-1 mr-1">
          {this.props.showtext &&
            String(this.props.total)
              .split(/(?=(?:...)*$)/)
              .join('.') +
              ' (' +
              String(`${value.replace('.', ',')}%`) +
              ')'}
        </span>
      </span>
    );
  }
}
class ProgressBar extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <span className="progress-bar">
        {data.map((item, index) => (
          <Progress
            key={index}
            value={item.value.replace(',', '.')}
            total={item.total}
            hintfix={item.hintfix}
            showtext={item.showtext}
            index={index}
          />
        ))}
      </span>
    );
  }
}
export default ProgressBar;

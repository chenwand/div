import React from 'react';
import FlagButton from './FlagButton';

class Abrangencia extends React.Component {
  constructor(props) {
    super(props);
    this.handleFlagClick = this.handleFlagClick.bind(this);
  }

  handleFlagClick(e) {
    this.props.onAbrangenciaChange(e);
  }
  renderFlags() {
    var rows = [];
    for (var i = 0; i < this.props.abrangenciasDisponiveis.length; i++) {
      rows.push(
        <FlagButton
          onFlagClick={this.handleFlagClick}
          value={this.props.abrangenciasDisponiveis[i]}
          uf={{
            id: this.props.abrangenciasDisponiveis[i],
            nome: this.props.abrangenciasDisponiveis[i]
          }}
          key={this.props.abrangenciasDisponiveis[i]}
        />
      );
    }
    return rows;
  }
  render() {
    const imgUrl = 'img/' + this.props.abrangenciaSelecionada + '.png';
    return (
      <span>
        <span className="dropdown dropdown-sm dropdown-menu-right">
          <button
            className="btn btn-outline-secondary dropdown-toggle btn-sm"
            type="button"
            data-placement="top"
            data-toggle="dropdown"
          >
            <img
              alt={this.props.abrangenciaSelecionada}
              src={imgUrl}
              width="29"
              className="rounded mx-auto d-block float-left border"
            />
          </button>
          <span
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dropdownMenu2"
          >
            {this.renderFlags()}
          </span>
        </span>
      </span>
    );
  }
}

export default Abrangencia;

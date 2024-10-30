import React, { Component } from 'react';
import ProgressBar from './ProgressBar';

class Votacao extends Component {
    constructor(props){
        super(props);
        this.state= {
            votavel:props.votavel,
            validos:props.percentValidos
        }
    }
    static defaultProps = {
        mostrarBarra:true,
        mostrarPercentValidos:true
    }
    render() {
        const data = [{ value: this.props.percentValidos.toFixed(2),total:this.props.votavel.v}];
       // const data = [{ value: 45 }, { value: 20 }, { value: 25 }];
        return (
          <div className="container">
            <ProgressBar data={data} />
                    <br/>
      <div class="d-inline-flex ">
    <img src="img/br.png" width="30" height="21" className="rounded-left"/><span style={{height: "21px"}} className="border border-dark bg-dark text-white rounded-right small pt-1 fontsize12">16,45%</span></div>

          </div>
        );
      }
}

export default Votacao;
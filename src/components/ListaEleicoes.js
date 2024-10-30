import React, { Component } from 'react';
import EleicaoSelecionada from './EleicaoSelecionada';

class ListaEleicoes extends Component {
    constructor(props){
        super(props);
        this.state= {
            eleicoes:props.eleicoes            
        }
    }

    renderEleicoes(){
        var rows = [];
        for (var i = 0; i < this.props.eleicoes.length; i++) {
            
            rows.push(<EleicaoSelecionada eleicao={this.props.eleicoes[i]}/>);
        }
        return rows;
    }
    GetSortOrder(prop) {  
        return function(a, b) {  

                var dia  = a[prop].split("/")[0];
                var mes  = a[prop].split("/")[1];
                var ano  = a[prop].split("/")[2];
                var data1 = ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);

                var dia  = b[prop].split("/")[0];
                var mes  = b[prop].split("/")[1];
                var ano  = b[prop].split("/")[2];
                var data2 = ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);

            if (new Date(data1) > new Date(data2)) {  
                return -1;  
            } else if (new Date(data1) < new Date(data2)) {  
                return 1;  
            }  
            return 0;  
        }  
    }


    render() {
    //    this.state.eleicoes.sort(this.GetSortOrder("dt"));

        return (
            <div id="accordion">
            </div>
        );
    }
}

export default ListaEleicoes;
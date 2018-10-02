import React from "react";
import '../assets/css/countCost.css';
import loadJsonFile from "load-json-file";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

let MEASURINGS = ["Gr", "Kg", "L", "Ml"];




class CountCostPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: {},
            summ: "0"
        };
        this.getGoods = this.getGoods.bind(this);
        this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
        this.jobNameValidator = this.jobNameValidator.bind(this);
        this.getMeasurings = this.getMeasurings.bind(this);
    }

    componentDidMount() {
        this.getGoods();
    }

     onAfterSaveCell() {
        let summ = 0;
        this.refs.table.state.data.map(good => {
            let price = parseInt(good.quantity) * parseFloat(good.count_price);
            if (good.measuring === "L" || good.measuring === "Kg") {
                price = price * 1000;
            }
            summ = summ + price;
        })
        this.setState({summ:  parseFloat(summ).toFixed(2)  + ''});
    }

    getGoods() {
        let path = "src/goods/goods.json";
        loadJsonFile(path).then(res => {
            this.setState({goods: res.goods})
        }).catch(() => {
            console.log("goods don't exist")
        });
    }

    getMeasurings(cell, row) {
        return cell.measurings;
    }

    jobNameValidator(value) {
        const response = {isValid: true, notification: {type: 'success', msg: '', title: ''}};
        const intValue = parseInt(value) + '';
        if (!value || value !== intValue) {
            response.isValid = false;
            response.notification.type = 'error';
            response.notification.msg = 'Value must be number';
            response.notification.title = 'Invalid Value';
        }
        return response;
    }

    rowStyleFormat(row, rowIdx) {
        return {backgroundColor: rowIdx % 2 === 0 ? '#dff0d8' : 'white', color: '#3c763d'};
    }

    render() {

        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
        };

        const selectRowProp = {
            mode: 'checkbox',
            showOnlySelected: true,
            clickToSelect: true,
        };

        let goodsArray = [];
        Object.keys(this.state.goods).map(good => {
            goodsArray.push(this.state.goods[good])
        });
        return (
            <div className="countCost">
                <i onClick={this.props.back} className="fa fa-chevron-circle-left backButton"/>
                <form className="form-horizontal">
                {
                    Object.keys(goodsArray).length > 0 &&

                    <BootstrapTable
                        ref='table'
                        data={goodsArray}
                        hover={true}
                        trStyle={this.rowStyleFormat}
                        headerContainerClass="headerContainerClass"
                        cellEdit={cellEditProp}
                        selectRow={selectRowProp}
                    >
                        <TableHeaderColumn isKey={true} dataSort={true} dataField='name'>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='quantity' editable={{
                            type: 'textarea',
                            validator: this.jobNameValidator
                        }}>Quantity</TableHeaderColumn>
                        <TableHeaderColumn dataField='measuring' editable={{
                            type: 'select',
                            options: {values: this.getMeasurings}
                        }}>Measuring</TableHeaderColumn>
                    </BootstrapTable>
                }
                    <div className="form-group">
                        <label className="col-sm-6"></label>
                        <div className="col-sm-3">
                                <button onClick={this.onAfterSaveCell} type="button"
                                        className="btn btn-primary btn-block countResult">Count
                                </button>
                        </div>
                        <div className="col-sm-3">
                            <input className="form-control countResult" readOnly={true} value={ 'Cost price: '+this.props.user.currency+' ' +this.state.summ} type="text" />
                        </div>

                    </div>
                </form>
            </div>
        );
    }
}

export default CountCostPrice;
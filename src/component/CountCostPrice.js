import React from "react";
import '../assets/css/App.css';
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
        this.setState({summ: summ + ''});
    }

    getGoods() {
        let path = "src/goods/goods.json";
        loadJsonFile(path).then(res => {
            this.setState({goods: res.goods})
        }).catch(() => {
            console.log("goods don't exist")
        });
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
            <div>
                <button onClick={this.props.back}>Back</button>
                <h1>Count Cost Price</h1>
                <button onClick={this.onAfterSaveCell}>Count</button>
                {
                    Object.keys(goodsArray).length > 0 &&

                    <BootstrapTable
                        ref='table'
                        data={goodsArray}
                        striped={true}
                        hover={true}
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
                            options: {values: MEASURINGS}
                        }}>Measuring</TableHeaderColumn>
                    </BootstrapTable>
                }

                <p>Cost price: {this.state.summ}</p>


            </div>
        );
    }
}

export default CountCostPrice;
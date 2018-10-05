import React from "react";
import '../assets/css/countCost.css';
import loadJsonFile from "load-json-file";
import {BootstrapTable, ShowSelectedOnlyButton, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import writeJsonFile from "write-json-file";
import ButtonGroup from "react-bootstrap/es/ButtonGroup";


class CountCostPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: {},
            summ: "0",
            dishName: "",
            dishes: {},
            showData: "All goods"
        };
        this.getData = this.getData.bind(this);
        this.count = this.count.bind(this);
        this.jobNameValidator = this.jobNameValidator.bind(this);
        this.getMeasurings = this.getMeasurings.bind(this);
        this.saveDish = this.saveDish.bind(this);
        this.error=this.props.error;
        this.success=this.props.success;
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        let dishes = {};
        let pathToGoods = "src/goods/goods.json";
        loadJsonFile(pathToGoods).then(goods => {
            dishes["All goods"] = goods.goods;
            this.setState({goods: goods.goods, dishes: dishes});
            let pathToDishes = "src/dishes/dishes.json";
            loadJsonFile(pathToDishes).then(res => {
                Object.keys(res.dishes).map((dish) => {
                    dishes[dish] = res.dishes[dish]
                })
                this.setState({dishes: dishes})
            }).catch((err) => {
                console.log("dishes don't exist")
            });
        }).catch(() => {
            console.log("goods don't exist")
        });

    }

    count() {
        let summ = 0;
        let dataTable = [];
        if (this.refs.table && this.refs.table.state && this.refs.table.state.data) {
            this.refs.table.state.data.map(good => {
                dataTable.push(good)
            });
        }
        dataTable.map(good => {
            let price = parseInt(good.quantity) * parseFloat(good.count_price);
            if (good.measuring === "L" || good.measuring === "Kg") {
                price = price * 1000;
            }
            summ = summ + price;
        });
        this.setState({summ: parseFloat(summ).toFixed(2) + ''});
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
            response.notification.msg = 'Value must be cell number';
            response.notification.title = 'Invalid Value';
        }
        return response;
    }

    rowStyleFormat(row, rowIdx) {
        return {backgroundColor: rowIdx % 2 === 0 ? '#dff0d8' : 'white', color: '#3c763d'};
    }

    saveDish() {
        if (this.state.dishName === "") {
            this.error("Please, fill all fields");
        } else {
            let path = "src/dishes/dishes.json";
            let dishes = {};
            loadJsonFile(path).then(res => {
                dishes = res.dishes;
                if (dishes[this.state.dishName]) {
                    this.error("Sorry, this dish exist already!");
                } else {
                    let tableGoods = [];
                    this.refs.table.state.data.map(good => {
                        tableGoods.push(good)
                    });
                    dishes[this.state.dishName] = tableGoods;
                    (async () => {
                        await writeJsonFile("src/dishes/dishes.json", {"dishes": dishes});
                        this.setState({
                            dishName: ""
                        })
                        this.success("Information updated");
                        this.getData();
                    })();
                }
            }).catch((err) => {
                console.log(err);
            });


        }
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
            className:'my-custom-class'
        };

        let goodsArray = [];
        if (this.state.dishes && this.state.dishes[this.state.showData]) {
            Object.keys(this.state.dishes[this.state.showData]).map(good => {
                goodsArray.push(this.state.dishes[this.state.showData][good]);
            });
        }

        return (
            <div className="countCost">
                <i onClick={this.props.back} className="fa fa-chevron-circle-left backButton"/>
                <form className="form-horizontal">
                    <div className="col-sm-5 no-padding">
                            <label className="col-sm-5 control-label no-padding">Choose the dish:&nbsp;&nbsp;</label>
                            <div className="col-sm-7 no-padding">
                                <select className="form-control" required={true}
                                        onChange={e => this.setState({showData: e.target.value})}
                                        value={this.state.showData}>
                                    {
                                        Object.keys(this.state.dishes).map((dish) => {
                                            return <option value={dish}>{dish}</option>
                                        })
                                    }
                                </select>
                            </div>
                    </div>

                    {
                        goodsArray && goodsArray.length > 0 &&

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
                                type: 'number',
                                validator: this.jobNameValidator
                            }}>Quantity</TableHeaderColumn>
                            <TableHeaderColumn dataField='measuring' editable={{
                                type: 'select',
                                options: {values: this.getMeasurings}
                            }}>Measuring</TableHeaderColumn>
                        </BootstrapTable>
                    }
                    <div className="form-group">
                        <div className="col-sm-3">
                            <input className="form-control countResult" value={this.state.dishName}
                                   onChange={(event) => this.setState({dishName: event.target.value})}
                                   placeholder="Dish Name" type="text"/>
                        </div>
                        <div className="col-sm-3">
                            <button onClick={this.saveDish} type="button"
                                    className="btn btn-primary btn-block countResult">Save dish
                            </button>
                        </div>
                        <div className="col-sm-3">
                            <button onClick={this.count} type="button"
                                    className="btn btn-primary btn-block countResult">Count
                            </button>
                        </div>
                        <div className="col-sm-3">
                            <input className="form-control countResult" readOnly={true}
                                   value={'Cost price: ' + this.props.user.currency + ' ' + this.state.summ}
                                   type="text"/>
                        </div>

                    </div>
                </form>
            </div>
        );
    }
}

export default CountCostPrice;
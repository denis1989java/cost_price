import React from "react";
import '../assets/css/App.css';
import Currencys from "./Currencys";
import loadJsonFile from "load-json-file";
import '../assets/css/addGood.css';

import writeJsonFile from "write-json-file";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

let MEASURINGS = ["Gr", "Kg", "L", "Ml"];

class AddGood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            quantity: "",
            measuring: "Kg",
            price: "",
            currency: "BYN",
            currencysNames: {},
            currencys: {},
            goods: {},
        };
        this.error=this.props.error;
        this.success=this.props.success;
        this.getCurrencysNames = this.getCurrencysNames.bind(this);
        this.getCurrencys = this.getCurrencys.bind(this);
        this.save = this.save.bind(this);
        this.getGoods = this.getGoods.bind(this);
        this.rowStyleFormat = this.rowStyleFormat.bind(this);
    }

    componentDidMount() {
        this.getCurrencysNames();
        this.getGoods();
        this.getCurrencys();
    }

    getGoods() {
        let path = "src/goods/goods.json";
        loadJsonFile(path).then(res => {
            this.setState({goods: res.goods})
        }).catch(() => {
            console.log("goods don't exist")
        });
    }

    getCurrencysNames() {
        Currencys.getCurrencysNames()
            .then(res => {
                this.setState({
                    currencysNames: res,
                });
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                }
            });

    }

    getCurrencys() {
        Currencys.getCurrencys()
            .then(res => {
                this.setState({
                    currencys: res,
                });
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                }
            });

    }

    save() {
        if (this.state.name === "" || this.state.quantity === "" || this.state.measuring === "" || this.state.price === "" || this.state.currency === "") {
            this.error( "Please, fill all fields");
        } else {
            let good = {};
            let price;
            let quantity = parseInt(this.state.quantity);
            let measuring = this.state.measuring;
            let measurings=[];
            let defaultCurrency = this.props.user.currency;
            if (this.state.measuring === "Kg" || this.state.measuring === "L") {
                quantity = parseInt(this.state.quantity) * 1000
                if (this.state.measuring === "L") {
                    measuring = "Ml";
                }
                if (this.state.measuring === "Kg") {
                    measuring = "Gr"
                }
            }
            if (this.state.measuring === "L" || this.state.measuring === "Ml") {
                measurings.push("Ml");
                measurings.push("L");
            }else if(this.state.measuring === "Kg" || this.state.measuring === "Gr"){
                measurings.push("Kg");
                measurings.push("Gr");
            }
            price = parseFloat(this.state.price) / quantity;
            if (this.state.currency === "USD") {
                price = price * parseFloat(this.state.currencys[defaultCurrency]);
            }
            if (this.state.currency !== "USD" && this.state.currency !== defaultCurrency) {

                price = price / parseFloat(this.state.currencys[this.state.currency]) * parseFloat(this.state.currencys[defaultCurrency]);
            }
            good.name = this.state.name;
            good.quantity = 0;
            good.measuring = this.state.measuring;
            good.price = this.state.price;
            good.currency = this.state.currency;
            good.count_measuring = measuring;
            good.count_price = price;
            good.measurings = measurings;
            let goods = this.state.goods;
            if (goods) {
                goods[good.name] = good;
            }
            (async () => {
                await writeJsonFile("src/goods/goods.json", {"goods": goods});
                this.success("Good added");
                this.setState({
                    goods: goods,
                    name: "",
                    quantity: "",
                    price: "",
                    currency: "BYN"
                })
            })();
        }
    }

    rowStyleFormat(row, rowIdx) {
        return {backgroundColor: rowIdx % 2 === 0 ? '#dff0d8' : 'white', color: '#3c763d'};
    }

    render() {
        let goodsArray = [];
        Object.keys(this.state.goods).map(good => {
            goodsArray.push(this.state.goods[good]);
        });
        return (
            <div className="addGoodDiv">
                <i onClick={this.props.back} className="fa fa-chevron-circle-left backButton"/>
                <form className="form-horizontal">
                    <h2>Add Good</h2>
                    <div className="container">
                        <div className="col-sm-7">
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Name:</label>
                                <div className="col-sm-9">
                                    <input className="form-control" required={true} value={this.state.name}
                                           placeholder="Name"
                                           type="text" onChange={e => this.setState({name: e.target.value})}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Quantity:</label>
                                <div className="col-sm-9">
                                    <input className="form-control" required={true} value={this.state.quantity}
                                           placeholder="Quantity"
                                           type="number" onChange={e => this.setState({quantity: e.target.value})}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Measuring:</label>
                                <div className="col-sm-9">
                                    <select className="form-control" required={true}
                                            onChange={e => this.setState({measuring: e.target.value})} value={this.state.measuring}>
                                        <option></option>
                                        {
                                            MEASURINGS.map((measuring)=>{
                                                return <option value={measuring}>{measuring}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-sm-3 control-label">Price:</label>
                                <div className="col-sm-9">
                                    <input className="form-control" required={true} value={this.state.price}
                                           placeholder="Price"
                                           type="number" onChange={e => this.setState({price: e.target.value})}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Currency:</label>
                                <div className="col-sm-9">
                                    <select className="form-control" required={true}
                                            onChange={e => this.setState({currency: e.target.value})}  value={this.state.currency}>
                                        <option></option>
                                        {
                                            Object.keys(this.state.currencysNames).map((currencyName)=>{
                                                return <option value={currencyName}>{this.state.currencysNames[currencyName]}</option>
                                            })
                                        }
                                        </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3"></label>
                                <div className="col-sm-9">
                                    <button onClick={this.save} type="button"
                                            className="btn btn-primary btn-block">Save
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            {
                                Object.keys(goodsArray).length > 0 &&

                                <BootstrapTable trStyle={this.rowStyleFormat}
                                                headerContainerClass="headerContainerClass"
                                                data={goodsArray}
                                                hover={true}
                                >
                                    <TableHeaderColumn isKey={true} dataSort={true}
                                                       dataField='name'>Name</TableHeaderColumn>
                                </BootstrapTable>
                            }
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddGood;
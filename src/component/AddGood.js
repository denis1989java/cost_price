import React from "react";
import '../assets/css/App.css';
import Currencys from "./Currencys";
import loadJsonFile from "load-json-file";

import writeJsonFile from "write-json-file";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

let MEASURINGS = ["Gr", "Kg", "L", "Ml"];

class AddGood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            name: "",
            quantity: "",
            measuring: "Kg",
            price: "",
            currency: "BYN",
            currencysNames: {},
            currencys:{},
            goods: {}
        };
        this.getCurrencysNames = this.getCurrencysNames.bind(this);
        this.getCurrencys = this.getCurrencys.bind(this);
        this.save = this.save.bind(this);
        this.getGoods = this.getGoods.bind(this);
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
        }).catch((err) => {
            console.log(err)
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
            this.setState({error: "Please, fill all fields"});
        } else {
            let good = {};
            let price;
            let quantity=parseInt(this.state.quantity);
            let measuring=this.state.measuring;
            let defaultCurrency=this.props.user.currency;
            if(this.state.measuring==="Kg" || this.state.measuring==="L"){
                quantity=parseInt(this.state.quantity)*1000
                if(this.state.measuring==="L"){
                    measuring="Ml";
                }
                if(this.state.measuring==="Kg"){
                    measuring="Gr"
                }
            }
            price=parseFloat(this.state.price)/quantity;
            if(this.state.currency==="USD"){
                price=price*parseFloat(this.state.currencys[defaultCurrency]);
            }
            if(this.state.currency!=="USD" && this.state.currency!==defaultCurrency){

                price=price/parseFloat(this.state.currencys[this.state.currency])*parseFloat(this.state.currencys[defaultCurrency]);
            }
            good.name = this.state.name;
            good.quantity = 0;
            good.measuring = this.state.measuring;
            good.price = this.state.price;
            good.currency = this.state.currency;
            good.count_measuring=measuring;
            good.count_price=price;
            good.pri
            let goods = this.state.goods;
            if (goods) {
                goods[good.name] = good;
            }
            (async () => {
                await writeJsonFile("src/goods/goods.json", {"goods": goods});
                this.setState({error: "Information updated",
                    goods: goods,
                    name:"",
                    quantity:"",
                    price:"",
                    currency:"BYN"
                })
            })();
        }
    }

    render() {
        let measurings = MEASURINGS.map(measuring => {
            return <option value={measuring}>{measuring}</option>
        });
        let currencysNames = Object.keys(this.state.currencysNames).map(currency => {
            if (currency !== this.state.currency) {
                return <option value={currency}>{this.state.currencysNames[currency]}</option>
            }
        });
        let goodsArray = [];
        Object.keys(this.state.goods).map(good => {
            goodsArray.push(this.state.goods[good])
        });
        return (
            <div>
                <button onClick={this.props.back}>Back</button>
                <h1>Add Good</h1>
                <h1>{this.state.error}</h1>
                <input required={true} type="text" value={this.state.name} placeholder="name"
                       onChange={e => this.setState({name: e.target.value})}/>
                <input required={true} type="number" value={this.state.quantity} placeholder="quantity"
                       onChange={e => this.setState({quantity: e.target.value})}/>
                <select required={true}
                        onChange={e => this.setState({measuring: e.target.value})}>
                    <option></option>
                    {measurings}
                </select>
                <input required={true} type="number" value={this.state.price} placeholder="price"
                       onChange={e => this.setState({price: e.target.value})}/>
                <select required={true}
                        onChange={e => this.setState({currency: e.target.value})}>
                    <option value={this.state.currency}>{this.state.currencysNames[this.state.currency]}</option>
                    <br/>
                    {currencysNames}
                </select>
                <button onClick={this.save}>Save</button>
                {
                    Object.keys(goodsArray).length > 0 &&
                    <BootstrapTable containerClass="tableHeight"
                        data={goodsArray}
                        striped={true}
                        hover={true}
                        condensed={true}
                        search={true}
                    >
                        <TableHeaderColumn isKey={true} dataSort={true} dataField='name'>Name</TableHeaderColumn>
                    </BootstrapTable>
                }

            </div>
        );
    }
}

export default AddGood;
import React from "react";
import '../assets/css/App.css';
import Currencys from "./Currencys";
import writeJsonFile from 'write-json-file';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencys: {},
            name: "",
            surname: "",
            currency: "BYN",
            error: "",
            user:props.user
        };
        this.getCurrencys = this.getCurrencys.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        this.getCurrencys();
        if(this.props.user.name && this.props.user.surname && this.props.user.currency){
            this.setState({
                currencys: this.props.user.currency,
                name:this.props.user.name,
                surname:this.props.user.surname
            });
        }
    }

    getCurrencys() {
        Currencys.getCurrencysNames()
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
        if (this.state.name === "" || this.state.surname === "" || this.state.currency === "") {
            this.setState({error: "Please, fill all fields"});
        } else {
            let userInfo = {};
            userInfo.name = this.state.name;
            userInfo.surname = this.state.surname;
            userInfo.currency = this.state.currency;
            userInfo.currencyName = this.state.currencys[this.state.currency];
            (async () => {
                await writeJsonFile("src/userInfo/userInfo.json", {"user": userInfo});
                this.setState({error:"Information updated",user:userInfo})

            })();
        }
    }

    render() {
        let currencys = Object.keys(this.state.currencys).map(currency => {
            if(currency!==this.state.currency){
                return <option value={currency}>{this.state.currencys[currency]}</option>
            }
        });
        return (
            <div>
                <button onClick={this.props.back}>Back</button>
                <h1>Settings</h1>
                <h1>{this.state.error}</h1>
                <input required={true} type="text" value={this.state.name} placeholder="name" onChange={e => this.setState({name: e.target.value})}/><br/>
                <input required={true} type="text" value={this.state.surname} placeholder="surname" onChange={e => this.setState({surname: e.target.value})}/><br/>
                {
                    this.props.user.currency ? <p>{this.state.currencys[this.state.currency]}</p> :
                        <select required={true}
                                onChange={e => this.setState({currency: e.target.value})}>
                            <option value={this.state.currency}>{this.state.currencys[this.state.currency]}</option><br/>
                            {currencys}
                        </select>
                }
                <button onClick={this.save}>Save</button>
            </div>
        );
    }
}

export default Settings;
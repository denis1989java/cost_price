import React from "react";
import '../assets/css/App.css';
import Currencys from "./Currencys";
import writeJsonFile from 'write-json-file';
import '../assets/css/profile.css';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencys: {},
            name: "",
            surname: "",
            currency: "BYN",
            user: props.user
        };
        this.error=this.props.error;
        this.success=this.props.success;
        this.getCurrencys = this.getCurrencys.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        this.getCurrencys();
        if (this.props.user.name && this.props.user.surname && this.props.user.currency) {
            this.setState({
                currencys: this.props.user.currency,
                name: this.props.user.name,
                surname: this.props.user.surname
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
            this.error("Please, fill all fields");
        } else {
            let userInfo = {};
            userInfo.name = this.state.name;
            userInfo.surname = this.state.surname;
            userInfo.currency = this.state.currency;
            userInfo.currencyName = this.state.currencys[this.state.currency];
            (async () => {
                await writeJsonFile("src/userInfo/userInfo.json", {"user": userInfo});
                this.setState({user: userInfo});
                this.success("Information updated");
            })();
        }
    }

    render() {
        let currencys = Object.keys(this.state.currencys).map(currency => {
            if (currency !== this.state.currency) {
                return <option value={currency}>{this.state.currencys[currency]}</option>
            }
        });
        return (
            <div className="profileDiv">
                <i onClick={this.props.back} className="fa fa-chevron-circle-left backButton"/>
                <form className="form-horizontal">
                    <h2>Profile</h2>
                    <div className="form-group">
                        <label className="col-sm-4 control-label">Name:</label>
                        <div className="col-sm-4">
                            <input className="form-control" required={true} value={this.state.name} placeholder="Name"
                                   type="text" onChange={e => this.setState({name: e.target.value})}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-4 control-label">Surname:</label>
                        <div className="col-sm-4">
                            <input className="form-control" required={true} value={this.state.surname}
                                   placeholder="Surname" type="text"
                                   onChange={e => this.setState({surname: e.target.value})}/>
                        </div>
                    </div>
                    {
                        this.props.user.currency ?
                            <div className="form-group">
                                <label className="col-sm-4 control-label">Currency:</label>
                                <div className="col-sm-4 currencyName">
                                    {this.state.currencys[this.state.currency]}
                                </div>
                            </div> :

                            <div className="form-group">
                                <label className="col-sm-4 control-label">Currency:</label>
                                <div className="col-sm-4">
                                    <select className="form-control" required={true}
                                            onChange={e => this.setState({currency: e.target.value})}>
                                        <option value={this.state.currency}>{this.state.currencys[this.state.currency]}</option>
                                        <br/>
                                        {currencys}
                                    </select>
                                </div>
                            </div>

                    }

                    <div className="form-group">
                        <label className="col-sm-4"></label>
                        <div className="col-sm-4">
                            <button onClick={this.save} type="button"
                                    className="btn btn-primary btn-block">Save
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        );
    }
}

export default Settings;
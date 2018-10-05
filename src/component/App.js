import React from "react";
import AddGood from "./AddGood";
import Settings from "./Settings";
import CountCostPrice from "./CountCostPrice";
import '../assets/css/App.css';
import loadJsonFile from "load-json-file";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "main",
            user: {}
        };
        this.getUser = this.getUser.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.successHandler = this.successHandler.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    errorHandler(message){
        Alert.error(message, {
            position: 'top-left',
            effect: 'genie'
        });
    }

    successHandler(message){
        Alert.success(message, {
            position: 'top-left',
            effect: 'genie'
        });
    }

    getUser() {
        let path = "src/userInfo/userInfo.json";
        loadJsonFile(path).then(res => {
            this.setState({user: res.user})
        }).catch(() => {
            console.log("user don't exist")
        });
    }


    render() {
        let view = this.state.view;
        return (
            <div className="mainScreen">
                <Alert stack={{limit: 1}}  timeout={2000}/>
                <h1>Cost Price Counting</h1>

                {
                    view === 'main' && this.state.user.currency &&
                    <h4>Welcome,&nbsp;{this.state.user.name}&nbsp;{this.state.user.surname}&nbsp;</h4>
                }
                {
                    view === 'main' && <div>
                        {
                            view === 'main' && this.state.user.currency &&
                            <div className="app_buttons">
                                <button type="button" className="btn btn-primary btn-block"
                                        onClick={() => this.setState({view: "fillSettings"})}>Update profile
                                </button>
                                <button onClick={() => this.setState({view: "addGood"})} type="button"
                                        className="btn btn-primary btn-block">Add good
                                </button>
                                <button onClick={() => this.setState({view: "countCostPrice"})} type="button"
                                        className="btn btn-primary btn-block">Count cost price
                                </button>
                            </div>
                        }
                        {
                            view === 'main' && !this.state.user.currency &&
                            <div className="app_buttons">
                                <button type="button" className="btn btn-primary btn-block"
                                        onClick={() => this.setState({view: "fillSettings"})}>Fill profile
                                </button>
                            </div>
                        }

                    </div>
                }


                {
                    view === 'fillSettings' && <Settings error={this.errorHandler} success={this.successHandler} user={this.state.user} back={() => {
                        this.setState({view: "main"});
                        this.getUser()
                    }}/>
                }

                {
                    view === 'addGood' && <AddGood error={this.errorHandler} success={this.successHandler} user={this.state.user} back={() => this.setState({view: "main"})}/>
                }

                {
                    view === 'countCostPrice' && <CountCostPrice error={this.errorHandler} success={this.successHandler} user={this.state.user} back={() => this.setState({view: "main"})}/>
                }
            </div>
        );
    }
}

export default App;

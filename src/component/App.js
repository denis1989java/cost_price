import React from "react";
import AddGood from "./AddGood";
import Settings from "./Settings";
import CountCostPrice from "./CountCostPrice";
import '../assets/css/App.css';
import loadJsonFile from "load-json-file";

class App extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            view: "main",
            user:{}
        };
       this.getUser = this.getUser.bind(this);


   }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        let path="src/userInfo/userInfo.json";
        loadJsonFile(path).then(res => {
            let user=res.user;
            this.setState({user:user})
        }).catch(()=>{
            console.log("user don't exist")
        });
    }


    render() {
       let view=this.state.view;
        return (
            <div className="mainScreen">
                <h1>Cost Price Counting</h1>
                {
                    this.state.user.currency ?     <p>Welcome&nbsp;{this.state.user.name}&nbsp;{this.state.user.surname}&nbsp;Default currency:&nbsp;{this.state.user.currencyName}</p> :
                        <p>Welcome!</p>
                }
                {
                    view==='main' &&  <div>
                        {
                            this.state.user.currency ? <button onClick={()=>this.setState({view:"fillSettings"})}>Update settings</button>:
                                <button onClick={()=>this.setState({view:"fillSettings"})}>Fill settings</button>
                        }
                        <br/>
                        <button onClick={()=>this.setState({view:"addGood"})}>Add good</button><br/>
                        <button onClick={()=>this.setState({view:"countCostPrice"})}>Count cost price</button></div>
                }


                {
                    view==='fillSettings' && <Settings user={this.state.user} back={()=>{this.setState({view:"main"});this.getUser()}}/>
                }

                {
                    view==='addGood' && <AddGood user={this.state.user} back={()=>this.setState({view:"main"})}/>
                }

                {
                    view==='countCostPrice' &&  <CountCostPrice back={()=>this.setState({view:"main"})}/>
                }
            </div>
        );
    }
}

export default App;

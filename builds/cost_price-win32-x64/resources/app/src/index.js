import React from "react";
import { render } from 'react-dom'
import App from "./component/App";
// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
let link= document.createElement('link');
link.setAttribute("rel","stylesheet");
link.setAttribute("href","http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css");
let link_awesome= document.createElement('link');
link_awesome.setAttribute("rel","stylesheet");
link_awesome.setAttribute("href","https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
root.id = 'root';
document.body.appendChild(root);

document.body.appendChild(link);
document.body.appendChild(link_awesome);

// Now we can render our application into it
render(<App />, document.getElementById('root'));
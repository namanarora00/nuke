import { Component } from "react";
import React from "react";
import Login from "../components/login";

class LandingPage extends Component {
  render() {
    const divStyle = {
      marginLeft: "33%",
      marginRight: "33% "
    };

    return (
      <div style={divStyle}>
        <Login />
      </div>
    );
  }
}

export default LandingPage;

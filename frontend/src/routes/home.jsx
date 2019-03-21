import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class HomePage extends Component {
  render() {
    return <h1>Welcome to home</h1>;
  }
}

export default withRouter(HomePage);

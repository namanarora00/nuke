import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Topics from "../components/topics";

class HomePage extends Component {
  render() {
    return (
      <>
        <Topics />
      </>
    );
  }
}

export default withRouter(HomePage);

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Topics from "../components/topics";

class HomePage extends Component {
  render() {
    return (
      <>
        <Topics
          style={{
            marginTop: "10%",
            marginLeft: "33%",
            marginRight: "33%"
          }}
        />
      </>
    );
  }
}

export default withRouter(HomePage);

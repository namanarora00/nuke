import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LandingPage from "./routes/landing";
import HomePage from "./routes/home";

import withAuth from "./utils/auth";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={withAuth(HomePage)} />
      </Router>
    );
  }
}

export default App;

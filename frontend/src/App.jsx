import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LandingPage from "./routes/landing";
//import HomePage from "./layouts/landing";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={LandingPage} />
      </Router>
    );
  }
}

export default App;

import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import LandingPage from "./routes/landing";
import HomePage from "./routes/home";

import withAuth from "./utils/auth";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/home" component={withAuth(HomePage)} />

          <Route // logout
            exact
            path="/logout"
            component={() => {
              sessionStorage.removeItem("token");
              return <Redirect to="/" />;
            }}
          />
          <Route // 404
            component={() => {
              return <h1>Not Found</h1>;
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;

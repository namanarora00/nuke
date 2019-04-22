import { Component } from "react";
import React from "react";
import { Card, Col, Row, message, Icon } from "antd";
import { withRouter, Redirect } from "react-router-dom";
import Helmet from "react-helmet";
import Loadable from "react-loadable";

import logo from "../assets/landing/landing.png";
import "../assets/common/css/fonts.css";

const LoadLogin = Loadable({
  loader: () => import("../components/login"),
  loading: () => <div>Loading..</div>
});

const LoadSignup = Loadable({
  loader: () => import("../components/signup"),
  loading: () => <div>Loading..</div>
});

class LandingPage extends Component {
  constructor() {
    super();
    this.state = { location: {}, login: true };
  }

  componentWillMount() {
    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          },
          login: true
        });
      },
      () => {
        message.error("Location access is required for the best experience");
      }
    );
  }

  render() {
    if (sessionStorage.getItem("token")) {
      return <Redirect to={"/home"} />;
    }
    return (
      <div
        style={{
          zoom: 1.15
        }}
      >
        <Helmet>
          <style>{"body { background-color:#33414C; }"}</style>
        </Helmet>
        <Card
          style={{
            borderRadius: "5px",
            textAlign: "center",
            marginTop: "5%",
            marginLeft: "15%",
            marginRight: "15%"
          }}
          bordered={false}
        >
          <Row gutter={-10}>
            <Col span={12}>
              <div
                style={{
                  marginLeft: "-20%",
                  textAlign: "center",
                  marginBottom: "-10%"
                }}
              >
                <img
                  style={{
                    borderRadius: "5px",
                    display: "block",
                    height: "auto",
                    width: "auto",
                    maxWidth: "400px",
                    maxHeight: "400px",
                    objectFit: "scale-down",
                    marginLeft: "20%"
                  }}
                  src={logo}
                  alt="not found lol"
                />
                <p
                  style={{
                    fontFamily: "Kaushan Script, cursive",
                    marginTop: "-5%",
                    marginLeft: "15%",
                    fontSize: "30px"
                  }}
                >
                  "Love is not rocket science"
                </p>
              </div>
            </Col>

            <Col span={11}>
              {!this.state.login && (
                <LoadSignup
                  location={this.state.location}
                  style={{
                    marginTop: "0.5%",
                    textAlign: "center",
                    marginRight: "-10%"
                  }}
                />
              )}
              {this.state.login && (
                <LoadLogin
                  afterLogin={() => {
                    this.forceUpdate();
                  }}
                  style={{
                    marginTop: "0.5%",
                    textAlign: "center",
                    marginRight: "-10%"
                  }}
                />
              )}
            </Col>
            <Col span={1}>
              <Icon
                type={this.state.login ? "user-add" : "user"}
                style={{
                  fontSize: "20px"
                }}
                onClick={() => {
                  this.setState({ login: !this.state.login });
                }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default withRouter(LandingPage);

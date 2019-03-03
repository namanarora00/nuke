import { Component } from "react";
import React from "react";
import Login from "../components/login";
import { Card, Col, Row } from "antd";
import SignUp from "../components/signup";

class LandingPage extends Component {
  render() {
    return (
      <Card
        style={{
          textAlign: "center",
          marginTop: "5%",
          marginLeft: "10%",
          marginRight: "10%",
          height: ""
        }}
        bordered={true}
      >
        <Row gutter={0}>
          <Col span={12}>
            <Login
              style={{
                marginTop: "5%",
                textAlign: "center",
                marginRight: "0.75%",
                marginBottom: "5%"
              }}
            />
          </Col>
          <Col span={12}>
            <SignUp
              style={{
                marginTop: "5%",
                textAlign: "center",
                marginLeft: "0.75%"
              }}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default LandingPage;

import { Component } from "react";
import React from "react";

import { Input, Button, Icon, Card, Divider } from "antd";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: {
        isValidated: false,
        value: ""
      },
      password: {
        value: ""
      },
      error: ""
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.clearUserName = this.clearUserName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleUserNameChange(event) {
    let validationPattern = / ^[\w._]{6,12}$ /;
    let isValidated = validationPattern.test(event.target.value);
    let username = this.state.username;

    if (event.target.value.length < 12) {
      username.value = event.target.value;
      username.isValidated = isValidated;
    }

    this.setState({ username });
  }

  handlePasswordChange(event) {
    let password = this.state.password;
    password.value = event.target.value;
    this.setState({ password });
  }

  clearUserName() {
    let username = this.state.username;
    username.value = "";
    username.isValidated = false;
    this.setState({ username });
  }

  onSubmit() {
    // auth with server
  }

  componentWillUnmount() {
    let password = this.state.password;
    password.value = "";
    this.setState({ password });
  }

  render() {
    const suffix = this.state.username.value ? (
      <Icon type="close-circle" onClick={this.clearUserName} />
    ) : null;

    return (
      <Card
        bodyStyle={{ color: "rgb(0,0,0)" }}
        bordered={false}
        hoverable
        style={{
          marginTop: "5%",
          textAlign: "center"
        }}
      >
        <h1>NuKE</h1>

        <Input
          style={{ width: "75%", marginBottom: "10px" }}
          id="username"
          size="large"
          placeholder="Username"
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          suffix={suffix}
          value={this.state.username.value}
          onChange={this.handleUserNameChange}
        />

        <br />

        <Input.Password
          style={{ width: "75%", marginBottom: "20px" }}
          id="password"
          size="large"
          placeholder="Password"
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          visibilityToggle={true}
          onChange={this.handlePasswordChange}
        />

        <br />

        <Button
          disabled={
            this.state.username.isValidated && this.state.password.value.length
              ? false
              : true
          }
          size="large"
          style={{ width: "75%", marginBottom: "10px" }}
          type="primary"
          onClick={this.onSubmit}
        >
          Log In
        </Button>

        <Divider>
          <strong>OR</strong>
        </Divider>

        <Button
          icon="google"
          size="large"
          style={{ width: "75%", marginBottom: "10px" }}
          href=""
        >
          <span style={{ fontSize: "1.25vw" }}>Log In with google</span>
        </Button>

        <br />

        <a href="/">Forgot Password</a>
      </Card>
    );
  }
}

export default Login;

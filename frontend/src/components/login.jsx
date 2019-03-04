import { Component } from "react";
import React from "react";
import { Input, Button, Icon, Card, Divider, message } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import { isString } from "util";

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
    let validationPattern = /^[\w._]{6,12}$/;
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
    let formData = {
      username: this.state.username.value,
      password: this.state.password.value
    };
    axios({
      method: "post",
      url: "api/user/login",
      data: formData,
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization:
            "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3ROYW1hbiIsImlkIjoiNWM3NDM3NTdiMTkyNTIxNTQ0ZWVhM2QzIiwiZXhwIjoxNTU2MzUwMDUzLCJpYXQiOjE1NTExNjYwNTN9.9-iADhshqFjT5YXiIcccznXwr2C5jb7SoafU4TGhWA0"
        }
      }
    })
      .then(response => {
        let user = response.data.user;
        console.log(user);
        if (user) message.success("Successfully Logged in");
        else message.error("Username or password incorrect");
      })
      .catch(err => {
        if (err.response.status === 401)
          message.error("You are not authorized");
      });
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
        hoverable
        bordered={false}
        style={this.props.style}
      >
        <h1>Log In</h1>

        <Input
          style={{ width: "75%", marginBottom: "20px" }}
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
          style={{ width: "75%", marginBottom: "30px" }}
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
          style={{ width: "75%", marginBottom: "20px" }}
          type="primary"
          onClick={this.onSubmit}
        >
          Log In
        </Button>

        <Divider style={{ width: "60%" }}>
          <strong>OR</strong>
        </Divider>

        <Button
          icon="google"
          size="large"
          style={{ width: "75%", marginBottom: "20px" }}
          href=""
        >
          <span style={{ fontSize: "1.25vw" }}>Log In with google</span>
        </Button>

        <br />

        <Button
          size="large"
          style={{ width: "75%", marginBottom: "20px" }}
          href=""
        >
          <span style={{ fontSize: "1.25vw" }}>Forgot Password</span>
        </Button>
      </Card>
    );
  }
}

Login.propTypes = {
  style: PropTypes.object
};

export default Login;

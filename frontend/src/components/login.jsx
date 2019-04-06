import { Component } from "react";
import React from "react";
import { Input, Button, Icon, Card, Divider, message, Spin } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import ForgotPassword from "./forgot";

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
      error: "",
      loading: false,
      forgotToggle: false
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.clearUserName = this.clearUserName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetPasswordField = this.resetPasswordField.bind(this);
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
    this.setState({ loading: true });
    this.resetPasswordField();
    axios({
      method: "post",
      url: "/api/user/login",
      data: formData
    })
      .then(response => {
        let token = response.data.token;
        this.setState({ loading: false });
        if (token) {
          sessionStorage.setItem("token", token);
          message.success("Successfully Logged in");
          if (this.props.afterLogin) this.props.afterLogin(); // callback after login successful
        } else message.error("Username or password incorrect");
      })
      .catch(err => {
        this.setState({ loading: false });
        message.error("Something went wrong, try again!");
      });
  }

  resetPasswordField() {
    let password = this.state.password;
    password.value = "";
    this.setState({ password });
  }

  componentWillUnmount() {
    this.resetPasswordField();
  }

  render() {
    const suffix = this.state.username.value ? (
      <Icon type="close-circle" onClick={this.clearUserName} />
    ) : null;

    return (
      <>
        <ForgotPassword
          onCancel={() => {
            this.setState({ forgotToggle: false });
          }}
          visible={this.state.forgotToggle}
        />

        <Spin spinning={this.state.loading}>
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
              value={this.state.password.value}
              onChange={this.handlePasswordChange}
            />

            <br />

            <Button
              disabled={
                this.state.username.isValidated &&
                this.state.password.value.length
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
              size="large"
              style={{ width: "75%", marginBottom: "20px" }}
              onClick={() => {
                this.setState({ forgotToggle: true });
              }}
            >
              <span style={{ fontSize: "1.25vw" }}>Forgot Password</span>
            </Button>
          </Card>
        </Spin>
      </>
    );
  }
}

Login.propTypes = {
  style: PropTypes.object,
  afterLogin: PropTypes.func
};

export default Login;

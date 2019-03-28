import React, { Component } from "react";
import axios from "axios";
import { Card, Icon, Input, message, Button } from "antd";
import { Redirect, withRouter } from "react-router-dom";

class RecoverPassword extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      verified: false,
      password: "",
      password2: "",
      name: ""
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(
      this
    );
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const link = this.props.match.params.key;
    console.log(link);

    axios({
      url: "/api/user/recover/" + link,
      method: "GET"
    })
      .then(res => {
        if (res.status === 200)
          this.setState({
            loading: false,
            verified: true,
            name: res.data.user
          });
      })
      .catch(err => {
        if (err.response.status === 401) message.error("Link Expired");
        if (err.response.status === 404) message.error("Not Found");
        else message.error("An error Occurred");
        this.setState({ loading: false });
      });
  }

  handlePasswordChange(e) {
    if (!e.target.value) this.setState({ password2: "" });
    this.setState({ password: e.target.value });
  }
  handleConfirmPasswordChange(e) {
    this.setState({ password2: e.target.value });
  }

  onSubmit() {
    let link = this.props.match.params.key;
    this.setState({ loading: true });
    axios({
      url: "/api/user/recover/" + link,
      method: "POST",
      data: { password: this.state.password }
    })
      .then(res => {
        if (res.status === 200) this.setState({ loading: false });
        message.success("Password Changed Successfully");
      })
      .catch(err => {
        if (err.response.status === 401) message.error("Link Expired");
        if (err.response.status === 404) message.error("Not Found");
        else message.error("An error Occurred");
        this.setState({ loading: false });
      });
  }

  render() {
    if (!this.state.loading && !this.state.verified) {
      return <Redirect to="/" />;
    } else {
      return (
        <div
          style={{ marginLeft: "33%", marginRight: "33%", marginTop: "10%" }}
        >
          <h2>Changing password for {this.state.name}</h2>
          <Card loading={this.state.loading}>
            <h3>Enter new Password</h3>
            <Input.Password
              style={{ width: "75%", marginBottom: "2%" }}
              id="password"
              size="large"
              placeholder="Password"
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              visibilityToggle={true}
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            {this.state.password && (
              <Input.Password
                style={{ width: "75%" }}
                size="large"
                placeholder="Confirm Password"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                visibilityToggle={true}
                onChange={this.handleConfirmPasswordChange}
                value={this.state.password2}
              />
            )}
            <Button
              disabled={
                this.state.password2 !== this.state.password ||
                !this.state.password
              }
              size="large"
              style={{ marginLeft: "2%" }}
              onClick={this.onSubmit}
            >
              Submit
            </Button>
          </Card>
        </div>
      );
    }
  }
}

export default withRouter(RecoverPassword);

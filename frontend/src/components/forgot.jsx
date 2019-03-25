import React, { Component } from "react";
import { Modal, message, Input } from "antd";
import axios from "axios";

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel() {
    this.setState({ username: "" });
    this.props.onCancel();
  }

  onSubmit() {
    if (this.state.username) {
      const { username } = this.state;
      this.setState({ loading: true });
      axios({
        url: "api/user/forgot",
        method: "post",
        data: { username }
      })
        .then(res => {
          message.success("An email is sent to you with further instructions");
          this.setState({ loading: false });
        })
        .catch(err => {
          this.setState({ loading: false });
          if (err.response.status === 401)
            message.error("Account with the username does not exists.");
          else message.error("An error occurred. Try again!");
        });
    }
  }

  render() {
    return (
      <Modal
        style={{ textAlign: "left" }}
        title="Forgot Password"
        visible={this.props.visible}
        confirmLoading={this.state.loading}
        onCancel={this.onCancel}
        onOk={this.onSubmit}
      >
        <Input
          style={{ width: "50%" }}
          type="text"
          placeholder="Enter username"
          onChange={e => {
            this.setState({ username: e.target.value });
          }}
          value={this.state.username}
        />
      </Modal>
    );
  }
}

export default ForgotPassword;

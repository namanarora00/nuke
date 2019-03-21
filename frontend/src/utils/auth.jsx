import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false
      };
    }

    componentDidMount() {
      axios({
        method: "get",
        url: "/api/user/verify",
        headers: {
          Authorization: "Token " + sessionStorage.getItem("token")
        }
      })
        .then(response => {
          if (response.status === 200) this.setState({ loading: false });
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.setState({ loading: false, redirect: true });
          }
        });
    }

    render() {
      if (this.state.loading) {
        return null;
      }
      if (this.state.redirect) {
        message.error("Your session expired. Log in again.");
        return <Redirect to="/" />;
      }
      return (
        <>
          <ComponentToProtect {...this.props} />
        </>
      );
    }
  };
}

export default withAuth;

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

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
          this.setState({ loading: false });
        })
        .catch(err => {
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        sessionStorage.removeItem("token");
        return (
          <div>
            <Redirect
              to={{
                pathname: "/"
              }}
            />
            ;
          </div>
        );
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

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Topics from "../components/topics";
import Recommendations from "../components/users";
import { message } from "antd";
import axios from "axios";
class HomePage extends Component {
  componentWillMount() {
    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(
      position => {
        axios({
          url: "/api/user/location",
          method: "PUT",
          headers: {
            authorization: "Token " + sessionStorage.getItem("token")
          },
          data: {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }
        })
          .then(res => {
            console.log("connected");
          })
          .catch(err => {
            message.error("An error occcured. Refresh the page and try again");
          });
      },
      () => {
        message.error("Location access is required for the best experience");
      }
    );
  }

  render() {
    return (
      <>
        <Recommendations
          style={{
            marginTop: "2%",
            marginLeft: "33%",
            marginRight: "33%"
          }}
        />
        <Topics
          style={{
            marginTop: "1%",
            marginLeft: "33%",
            marginRight: "33%"
          }}
        />
      </>
    );
  }
}

export default withRouter(HomePage);

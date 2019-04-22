import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Topics from "../components/topics";
import Recommendations from "../components/users";
import { message, Tabs, Card } from "antd";
import axios from "axios";
import Helmet from "react-helmet";

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
        <Helmet>
          <style>{"body { background-color:#33414C; }"}</style>
        </Helmet>

        <Card
          style={{
            marginTop: "2%",
            marginLeft: "33%",
            marginRight: "33%"
          }}
        >
          <Tabs
            defaultActiveKey="1"
            tabBarStyle={{
              textAlign: "center"
            }}
          >
            <Tabs.TabPane tab="Explore Users" key="1">
              <Recommendations />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Explore topics" key="2">
              <Topics />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </>
    );
  }
}

export default withRouter(HomePage);

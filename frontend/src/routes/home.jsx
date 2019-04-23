import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Topics from "../components/topics";
import Recommendations from "../components/users";
import Upload from "../components/upload";
import { message, Tabs, Card, Col, Row, Icon, Avatar, Carousel } from "antd";
import axios from "axios";
import Helmet from "react-helmet";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      loading: false,
      currentImages: [],
      logout: false
    };

    this.getUserData = this.getUserData.bind(this);
    this.getImages = this.getImages.bind(this);
  }

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
    this.getUserData();
  }

  getImages() {
    axios({
      url: "/api/image/fetch/" + this.state.user._id,
      method: "get",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        this.setState({ loading: false });
        this.setState({ currentImages: res.data });
      })
      .catch(err => message.error("Could not load images for the user"));
  }

  getUserData() {
    this.setState({ loading: true });
    axios({
      url: "/api/user/data",
      method: "get",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        this.setState({ user: res.data });
        this.getImages();
      })
      .catch(err => {
        message.error("Could not get user");
      });
  }

  render() {
    return (
      <>
        {this.state.logout ? <Redirect to="/logout" /> : ""}
        <Helmet>
          <style>{"body { background-color:#33414C; }"}</style>
        </Helmet>
        <div style={{ marginLeft: "10%", marginRight: "15%" }}>
          <Row gutter={6}>
            <Col span={13}>
              <Card
                style={{
                  marginTop: "10%"
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
            </Col>
            <Col span={11}>
              <Card
                style={{ height: "25%", marginTop: "11.9%" }}
                actions={[
                  <Icon type="setting" />,
                  <Icon type="edit" />,
                  <Icon
                    type="close-circle"
                    onClick={() => this.setState({ logout: true })}
                  />
                ]}
              >
                <Card.Meta
                  avatar={<Avatar icon="user" />}
                  title={this.state.user ? this.state.user.name : "Jordan"}
                  description="This app is cool"
                />
              </Card>
              <Card
                style={{ marginTop: "3%" }}
                cover={
                  !this.state.loading &&
                  this.state.user && (
                    <Carousel>
                      {this.state.currentImages.map(i => {
                        return (
                          <div key={new Date().getTime()}>
                            <img
                              style={{
                                display: "block",
                                height: "auto",
                                width: "auto",
                                maxWidth: "100%",
                                maxHeight: "400px",
                                objectFit: "scale-down",
                                textAlign: "center"
                              }}
                              src={i.src}
                              alt="Nope"
                              key={new Date().getTime()}
                            />
                          </div>
                        );
                      })}
                    </Carousel>
                  )
                }
                actions={[<Upload />]}
              >
                <h3 style={{ textAlign: "center" }}>
                  Upload More images by clicking below
                </h3>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default withRouter(HomePage);

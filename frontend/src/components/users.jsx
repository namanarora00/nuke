import React, { Component } from "react";
import axios from "axios";
import { message, Card, Icon, Avatar, Tooltip, Carousel, Button } from "antd";
import logo from "../assets/landing/landing.png";

import "../assets/home/css/carousel.css";

class Recommendations extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      loading: true,
      failed: false,
      current: -1,
      currentImages: []
    };

    this.getUsers = this.getUsers.bind(this);
    this.reactToUser = this.reactToUser.bind(this);
    this.getImages = this.getImages.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    this.setState({ loading: true, failed: false });
    axios({
      url: "/api/match/",
      method: "GET",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        const data = res.data || [];
        this.setState({
          users: data,
          loading: false,
          current: data.length - 1,
          currentImages: []
        });
        if (!data.length) {
          setTimeout(this.getUsers, 8000);
        } else {
          this.getImages(this.state.users[this.state.current]._id);
        }
      })
      .catch(err => {
        console.log(err);
        message.error("Could not fetch users!");
        this.setState({ failed: true, loading: false });
      });
  }

  getImages(uid) {
    axios({
      url: "/api/image/fetch/" + uid,
      method: "get",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        this.setState({ currentImages: res.data });
      })
      .catch(err => message.error("Could not load images for the user"));
  }

  async reactToUser(reactType) {
    const { loading, users, failed, current } = this.state;
    if (loading || !users.length || failed) return;

    let url = `/api/match/react/${users[current]._id}/`;
    if (reactType === 0) url += "dislike";
    else if (reactType === 1) url += "like";

    await axios({
      url: url,
      method: "GET",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    }).catch(err => {
      message.error("An error ocurred while reacting");
    });

    // remove the current topic
    users.pop();
    this.setState({ users: users, current: users.length - 1 });

    // fetch new users
    if (users.length === 0) {
      this.setState({ loading: true, current: -1, users: [] });
      this.getUsers();
    } else {
      this.getImages(this.state.users[this.state.current]._id);
    }
  }

  render() {
    const { current, users, loading } = this.state;
    return (
      <div style={this.props.style}>
        <Card
          cover={
            !loading &&
            users.length && (
              <Carousel>
                {this.state.currentImages.map(i => {
                  return (
                    <div>
                      <img
                        style={{
                          display: "block",
                          height: "auto",
                          width: "auto",
                          maxWidth: "100%",
                          maxHeight: "50%",
                          objectFit: "scale-down",
                          textAlign: "center"
                        }}
                        src={i.src}
                        alt=""
                        key={i.dateUpload}
                      />
                    </div>
                  );
                })}
              </Carousel>
            )
          }
          actions={[
            <Tooltip mouseEnterDelay={0.5} title="Like">
              <Icon
                onClick={() => {
                  this.reactToUser(1);
                }}
                style={{ fontSize: "23px" }}
                type="like"
              />
            </Tooltip>,
            <Tooltip mouseEnterDelay={0.5} title="Dislike">
              <Icon
                onClick={() => {
                  this.reactToUser(0);
                }}
                style={{ fontSize: "23px" }}
                type="dislike"
              />
            </Tooltip>
          ]}
        >
          {!loading && users.length ? (
            <Card.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={users[current].name}
              description="This app is cool"
            />
          ) : loading ? (
            <Icon type="loading" />
          ) : (
            <h3>We couldn't find any more users.</h3>
          )}
        </Card>
      </div>
    );
  }
}

export default Recommendations;

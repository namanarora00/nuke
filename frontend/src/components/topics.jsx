import React, { Component } from "react";
import { Card, Tooltip, Icon, message } from "antd";
import axios from "axios";

class Topics extends Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      loading: true,
      current: 0,
      failed: false,
      intervalID: ""
    };

    this.getTopics = this.getTopics.bind(this);
    this.reactToTopic = this.reactToTopic.bind(this);
  }

  componentDidMount() {
    this.getTopics();
  }

  getTopics() {
    axios({
      url: "/api/topic/",
      method: "GET",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        let data = res.data;

        this.setState({ topics: data, loading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  reactToTopic(reactType) {
    if (this.state.loading || !this.state.topics.length) return;

    const { current, topics } = this.state;
    const url = `/api/topic/react/${topics[current]._id}?type=${reactType}`;

    axios({
      url,
      method: "GET",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    }).catch(err => {
      message.error("An error ocurred while reacting");
    });

    let next = current + 1;

    if (next === topics.length) {
      this.setState({ loading: true, current: 0, topics: [] });
      this.getTopics();
    } else {
      this.setState({ current: next });
    }
  }

  render() {
    return (
      <div
        style={{
          marginTop: "10%",
          marginLeft: "33%",
          marginRight: "33%"
        }}
      >
        <Card
          cover={
            <div
              style={{
                marginTop: "15%",
                textAlign: "center"
              }}
            >
              <h1
                style={{
                  fontFamily: "helvetica",
                  MozUserSelect: "none",
                  WebkitUserSelect: "none",
                  msUserSelect: "none"
                }}
              >
                {this.state.loading ? (
                  <Icon type="loading" />
                ) : this.state.topics.length ? (
                  this.state.topics[this.state.current].name.toUpperCase()
                ) : (
                  "You're all caught up!"
                )}
              </h1>
            </div>
          }
          actions={[
            <Tooltip mouseEnterDelay={0.5} title="Like">
              <Icon
                onClick={() => {
                  this.reactToTopic(1);
                }}
                style={{ fontSize: "23px" }}
                type="like"
              />
            </Tooltip>,
            <Tooltip mouseEnterDelay={0.5} title="Neutral">
              <Icon
                onClick={() => {
                  this.reactToTopic(0);
                }}
                style={{ fontSize: "23px" }}
                type="safety"
              />
            </Tooltip>,
            <Tooltip mouseEnterDelay={0.5} title="Dislike">
              <Icon
                onClick={() => {
                  this.reactToTopic(-1);
                }}
                style={{ fontSize: "23px" }}
                type="dislike"
              />
            </Tooltip>
          ]}
        />
      </div>
    );
  }
}

export default Topics;

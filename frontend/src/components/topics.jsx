import React, { Component } from "react";
import { Card, Tooltip, Icon, message } from "antd";
import axios from "axios";

class Topics extends Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      loading: true,
      failed: false,
      current: -1
    };

    this.getTopics = this.getTopics.bind(this);
    this.reactToTopic = this.reactToTopic.bind(this);
  }

  componentDidMount() {
    this.getTopics();
  }

  getTopics() {
    this.setState({ loading: true });
    axios({
      url: "/api/topic/",
      method: "GET",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        let data = res.data;
        if (!data.length) {
          setTimeout(this.getTopics, 8000);
        }
        this.setState({
          topics: data,
          loading: false,
          failed: false,
          current: data.length - 1
        });
      })
      .catch(err => {
        this.setState({ loading: false, failed: true });
        message.error("Could not retrieve topics");
      });
  }

  async reactToTopic(reactType) {
    const { loading, topics, failed, current } = this.state;
    if (loading || !topics.length || failed) return;

    let url = `/api/topic/react/${topics[current]._id}?type=`;
    if (reactType === 0) url += "neutral";
    else if (reactType === 1) url += "like";
    else url += "dislike";

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
    topics.pop();
    this.setState({ topics: topics, current: topics.length - 1 });

    // fetch new topics
    if (topics.length === 0) {
      this.setState({ loading: true, current: -1, topics: [] });
      this.getTopics();
    }
  }

  render() {
    const { topics, failed, loading, current } = this.state;
    return (
      <div style={this.props.style}>
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
                {loading && !failed ? (
                  <Icon type="loading" />
                ) : topics.length ? (
                  topics[current].name.toUpperCase()
                ) : (
                  <>{!failed && "You're all caught up!"}</>
                )}
              </h1>
              {failed && <h1> 404 </h1>}
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

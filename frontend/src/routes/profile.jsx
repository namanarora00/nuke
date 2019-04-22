import React, { Component } from "react";
import {
  Card,
  Avatar,
  Col,
  Row,
  Slider,
  Tooltip,
  Radio,
  Tabs,
  List,
  DatePicker,
  Input
} from "antd";
import { withRouter } from "react-router-dom";

class Profile extends Component {
  render() {
    return (
      <div
        style={{
          marginLeft: "20%",
          marginRight: "20%",
          marginTop: "5%"
        }}
      >
        <Card>
          <Row gutter={0}>
            <Col span={10}>
              <Card>
                <Card.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title="Naman Arora"
                  description={<Input size="small" value="I don't do bios" />}
                />
              </Card>
            </Col>

            <Col span={14}>
              <Card
                title="Recommendation preferences"
                style={{
                  marginLeft: "5%"
                }}
              >
                <Tooltip
                  mouseEnterDelay={0.5}
                  title="This is the radius upto which we find people for you"
                >
                  <h3>Distance</h3>
                </Tooltip>

                <Slider
                  onChange
                  min={20}
                  max={100}
                  style={{
                    marginLeft: "0.5%"
                  }}
                  defaultValue={30}
                />
                <Tooltip
                  mouseEnterDelay={0.5}
                  title="What gender are you interested in?"
                >
                  <h3>Sex</h3>
                </Tooltip>

                <Radio.Group>
                  <Radio value={-1}>Female</Radio>
                  <Radio value={1}>Male</Radio>
                  <Radio value={0}>All</Radio>
                </Radio.Group>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default Profile;

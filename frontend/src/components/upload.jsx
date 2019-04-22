import { Upload, Button, Icon, message } from "antd";
import React from "react";
import axios from "axios";

class ImageUpload extends React.Component {
  state = {
    fileList: [],
    upload: false,
    images: []
  };

  componentDidMount() {
    axios({
      url: "/api/image/fetch",
      method: "get",
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        this.setState({ images: res.data });
      })
      .catch(e => {
        message.error("Could not get images");
      });
  }

  handleUpload = () => {
    const { fileList } = this.state;
    this.onUpload(fileList[0]);
  };

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onUpload = async file => {
    console.log("hello");
    const data = {};
    try {
      let b64 = await this.toBase64(file);
      data.image = b64;
    } catch (e) {
      return message.error("Error while handling upload");
    }
    axios({
      url: "/api/image/upload",
      method: "post",
      data: data,
      headers: {
        Authorization: "Token " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        this.setState({ upload: false });
        message.success("Uploaded successfully");
      })
      .catch(err => {
        message.error("An error occurred!");
        this.reset();
      });
    this.setState({ upload: true });
  };

  render() {
    const { fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },

      accept: ".jpg, .jpeg, .png",
      multiple: false,

      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };

    return (
      <div
        style={{
          marginLeft: "33%"
        }}
      >
        <Upload {...props}>
          <Button disabled={this.state.fileList.length >= 1 ? true : false}>
            <Icon type="upload" />
            Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          hidden={fileList.length === 0}
          style={{ marginTop: 16 }}
        >
          Start Upload
        </Button>
      </div>
    );
  }
}

export default ImageUpload;

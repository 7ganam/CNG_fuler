import React, { Component } from "react";
import QrReader from "react-qr-reader";

export default class QrComponent extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { result: "No QR detected" };
  }

  handleScan = (data) => {
    if (data) {
      this.setState({ result: data });
      this.props.setScannedQr(data);
      this.props.setModal(false);
    }
  };
  handleError = (err) => {
    console.error(err);
  };
  render() {
    console.log(this.props);
    return (
      <div>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "100%" }}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

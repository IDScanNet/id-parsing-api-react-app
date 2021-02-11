import React, { Component } from "react";
import "../node_modules/@idscan/idvc/dist/css/idvc.css";
import IDVC from '@idscan/idvc'
import  '@idscan/idvc/dist/css/idvc.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Birthdate: "",
      Fullname: "",
      Address1: "",
      City: "",
      component: null,
    };

     this.onInputchange = this.onInputchange.bind(this);
  }

  componentWillUnmount() {
    this.state.component.stopProccesing();
  }

  componentDidMount() {
    let _t = this;
    if (!this.state.component) {
      this.state.component = new IDVC({
        networkUrl: "assets/networks",
        el: "videoCapturingEl",
        licenseKey:
          "",
        types: ["ID"],
        showSubmitBtn: true,
        steps: [{ type: "pdf", name: "Back Scan" }],
        onChange(step) {
          console.log(step);
        },
        onReset(steps) {
          console.log(steps);
        },
        submit(data) {
          let backStep = data.steps.find((item) => item.type === "pdf");

          let request = {
            authKey: "",
            data: backStep.img.split(/:image\/(jpeg|png);base64,/)[2],
          };

          fetch(
            "https://app1.idware.net/DriverLicenseParserRest.svc/ParseImage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
              body: JSON.stringify(request),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              _t.setState({
                Birthdate: data.ParseImageResult.DriverLicense.Birthdate,
                Fullname: data.ParseImageResult.DriverLicense.FullName,
                Address1: data.ParseImageResult.DriverLicense.Address1,
                City: data.ParseImageResult.DriverLicense.City,
              });
            })
            .catch(() => {});
        },
      });
    }
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <div>
          <h3>DVS Demo Application</h3>
          <div id="videoCapturingEl"></div>
        </div>
        <div style={{ margin: "50px" }}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={this.state.Fullname}
              onChange={this.onInputchange}
            />
          </div>
          <div>
            <label>Birth Date</label>
            <input
              type="text"
              value={this.state.Birthdate}
              onChange={this.onInputchange}
            />
          </div>
          <div>
            <label> Address</label>
            <input
              type="text"
              value={this.state.Address1}
              onChange={this.onInputchange}
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              value={this.state.City}
              onChange={this.onInputchange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

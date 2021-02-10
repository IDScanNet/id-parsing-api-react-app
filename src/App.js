import React, { Component } from "react";
import "../node_modules/@idscan/idvc/dist/css/idvc.css";
import IDVC from '@idscan/idvc'
import  '@idscan/idvc/dist/css/idvc.css'

class App extends Component {
    
    licenseKey = '';


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            component: null
        }
    }

    componentWillUnmount() {
        this.state.component.stopProccesing()
    }

    componentDidMount () {
        let _t = this
        if (!this.state.component) {
            this.state.component = new IDVC({
              networkUrl: "networks",
              el: "videoCapturingEl",
              licenseKey: "",
              types: ["ID"],
              showSubmitBtn: true,
              steps: [
                { type: "front", name: "Front Scan" },
                { type: "back", name: "Back Scan" },
                { type: "face", name: "Selfie" },
              ],
              onChange(step) {
                console.log(step);
              },
              onReset(steps) {
                console.log(steps);
              },
              submit(data) {
                let backStep = data.steps.find((item) => item.type === "back");
                let trackString =
                  backStep && backStep.trackString ? backStep.trackString : "";

                let request = {
                  frontImageBase64: data.steps
                    .find((item) => item.type === "front")
                    .img.split(/:image\/(jpeg|png);base64,/)[2],
                  backOrSecondImageBase64: backStep.img.split(
                    /:image\/(jpeg|png);base64,/
                  )[2],
                  faceImageBase64: data.steps
                    .find((item) => item.type === "face")
                    .img.split(/:image\/(jpeg|png);base64,/)[2],
                  documentType: data.documentType,
                  trackString: trackString,
                };
                _t.setState({ isLoading: true });
                fetch("https://dvs2.idware.net/api/Request", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Authorization: `Bearer `,
                  },
                  body: JSON.stringify(request),
                })
                  .then((response) => response.json())
                  .then((response) => {
                    fetch(
                      "" + "/api/ValidationRequests/complete/",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                        },
                        body: JSON.stringify({
                          requestId: response.requestId,
                        }),
                      }
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        _t.setState({ isLoading: false });
                        alert(
                          data.payload.isDocumentSuccess
                            ? "Document valid"
                            : "Document invalid"
                        );
                      });
                  })
                  .catch(() => {
                    _t.setState({ isLoading: false });
                  });
              },
            });
        }
    }
    
    render () {
        const isLoading = this.state.isLoading
        return (
            <div>
                {
                    !isLoading
                        ? null
                        : (
                            <div className="loading">Verify...</div>
                        )
                }
                <h3>DVS Demo Application</h3>
                <div id="videoCapturingEl"></div>
            </div>
        );
    }
}

export default App;

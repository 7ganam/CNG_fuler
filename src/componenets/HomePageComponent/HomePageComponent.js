import React from "react";
import { Container, Row, Col } from "reactstrap";
import "./HomePageComponent.css";
import NewCarFormComponent from "./NewCarFormComponent/NewCarFormComponent";
import { useHttpClient } from "../hooks/useHttpClient";
import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import { Alert } from "reactstrap";

import QrComponent from "./QrComponent/QrComponent";

const DispenserIp = "192.168.0.12";
const DispenserPort = "80";
function HomePageComponent(props) {
  const maintainance_period = 30; // max time for maintainance gap in days TODO: fetch this value from the db

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [PostedCar, setPostedCar] = useState(null);
  const [ScannedQr, setScannedQr] = useState(null);
  const [UpdatedCar, setUpdatedCar] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    console.log(ScannedQr);
  }, [ScannedQr]);

  const onCancel = () => {
    setPostedCar(null);
    setScannedQr(null);
    setUpdatedCar(null);
  };

  const Find_maint_state = (car) => {
    let str = car.maintenances[car.maintenances.length - 1];
    let date = moment(str);
    let last_maint_date = date.utc().format("DD-MM-YYYY");

    //calculating reamaing days for maintainance
    let current_date = moment();
    let date_diff = current_date.diff(date, "days");
    if (date_diff <= maintainance_period) {
      return <Alert color="success">Car can be charged</Alert>;
    } else {
      return <Alert color="danger">Needs maintainence</Alert>;
    }
  };

  let onOpenDispenser = async () => {
    try {
      fetch(`https://${DispenserIp}/Charger4_ON`);
    } catch (error) {
      console.log("sent open request");
    }
  };
  let onCloseDispenser = async () => {
    try {
      fetch(`https://${DispenserIp}/Charger4_OFF`);
    } catch (error) {
      console.log("sent open request");
    }
    // .then((json) => console.log(json));
  };
  return (
    <>
      <div style={{}}>
        <div>
          {ScannedQr === PostedCar?.data[0].qr_str ? (
            <Container className="update_maint_date_container">
              {Find_maint_state(PostedCar?.data[0])}

              <Button
                style={{ height: "50px", width: "80%", marginTop: "20px" }}
                color="success"
                onClick={onOpenDispenser}
              >
                Open Dispenser
              </Button>
              <Button
                style={{ height: "50px", width: "80%", marginTop: "20px" }}
                color="warning"
                onClick={onCloseDispenser}
              >
                Close Dispenser
              </Button>
              <Button
                style={{ height: "50px", width: "80%", marginTop: "20px" }}
                color="danger"
                onClick={onCancel}
              >
                Go Back
              </Button>
            </Container>
          ) : (
            <Container className="Form_container" style={{ marginTop: "0px" }}>
              <Row>
                <Col xs="12" md="4">
                  <div className="page_title"> Charge check</div>
                  <div className="page_sub_title">
                    {" "}
                    Enter car's plate info then scan the QR code to check the
                    car's maintaince date
                  </div>
                  <NewCarFormComponent setPostedCar={setPostedCar} />
                </Col>
                <Col xs="0" md="1"></Col>
                <Col xs="12" md="7">
                  <div>
                    {PostedCar && (
                      <>
                        <div
                          style={{
                            width: "90%",
                            marginTop: "30px",
                            margin: "30px auto 30px auto",
                          }}
                        >
                          <button
                            className="scan_qr_button"
                            style={{ width: "100%" }}
                            color="success"
                            onClick={toggle}
                          >
                            <div style={{ marginLeft: "10px" }}>
                              {" "}
                              SCAN QR CODE
                            </div>
                            <img
                              style={{ marginRight: "10px", height: "50px" }}
                              src="/qr_logo.png"
                              alt="qr"
                            />
                          </button>
                        </div>
                        <Modal isOpen={modal} toggle={toggle}>
                          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                          <ModalBody>
                            {!toggle ? (
                              <div>test</div>
                            ) : (
                              <QrComponent setScannedQr={setScannedQr} />
                            )}
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" onClick={toggle}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePageComponent;

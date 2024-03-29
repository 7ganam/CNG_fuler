import React from "react";
import { Container, Row, Col, Label } from "reactstrap";
import "./HomePageComponent.css";
import NewCarFormComponent from "./NewCarFormComponent/NewCarFormComponent";
import { useHttpClient } from "../hooks/useHttpClient";
import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import { Alert } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";

import QrComponent from "./QrComponent/QrComponent";

const DispenserIp = "192.168.0.12";
function HomePageComponent(props) {
  const maintainance_period = 30; // max time for maintainance gap in days TODO: fetch this value from the db

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [FetchedCar, setFetchedCar] = useState(null);
  const [FetchedCarError, setFetchedCarError] = useState(null);
  const [ScannedQr, setScannedQr] = useState(null);
  const [UpdatedCar, setUpdatedCar] = useState(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [dispenserNo, setDispenserNo] = useState(4);

  const onCancel = () => {
    setFetchedCar(null);
    setScannedQr(null);
    setUpdatedCar(null);
  };

  const Find_maint_state = (car) => {
    let str = car.maintenances[car.maintenances.length - 1];
    let date = moment(str);

    //calculating reamaing days for maintainance
    let current_date = moment();
    let date_diff = current_date.diff(date, "days");
    if (date_diff <= (car?.maintenance_period || maintainance_period)) {
      return <Alert color="success">Car can be charged</Alert>;
    } else {
      return <Alert color="danger">Needs maintainence</Alert>;
    }
  };

  const needsMaintenance = (car) => {
    let str = car.maintenances[car.maintenances.length - 1];
    let date = moment(str);

    //calculating reamaing days for maintainance
    let current_date = moment();
    let date_diff = current_date.diff(date, "days");
    console.log("car :>> ", car);
    if (date_diff <= (car?.maintenance_period || maintainance_period)) {
      return true;
    } else {
      return false;
    }
  };

  let onOpenDispenser = async () => {
    try {
      fetch(`https://${DispenserIp}/Charger${dispenserNo}_ON`);
    } catch (error) {
      console.log("sent open request");
    }
  };

  const submit_form = async (fields) => {
    console.log("FetchedCar :>> ", FetchedCar);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/cars/${FetchedCar.data[0]._id}`,
        "PUT",
        JSON.stringify({
          charger_note: fields.charger_note,
        }),
        { "Content-Type": "application/json" }
      );
      console.log("responseData ", responseData);
      props.setUpdatedCar(true);
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <>
      <div style={{}}>
        <div>
          {ScannedQr === FetchedCar?.data[0].qr_str ? (
            <Container className="update_maint_date_container">
              {Find_maint_state(FetchedCar?.data[0])}

              {FetchedCar?.data[0] && needsMaintenance(FetchedCar?.data[0]) && (
                <>
                  <div
                    style={{
                      width: "80%",
                      margin: "auto",
                      marginBottom: "50px",
                    }}
                  >
                    <Formik
                      initialValues={{
                        charger_note: "",
                        maintenance_period: 10,
                      }}
                      // validationSchema={Yup.object().shape({
                      //     firstName: Yup.string().required('First Name is required'),
                      //     lastName: Yup.string().required('Last Name is required'),
                      //     email: Yup.string().email('Email is invalid') .required('Email is required'),

                      // })}
                      onSubmit={(fields) => {
                        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))

                        submit_form(fields);
                      }}
                      render={({ errors, status, touched }) => (
                        <Form>
                          <div md="12">
                            <label className="form_text form_label">
                              Charger Note
                            </label>
                          </div>
                          <div md="12" className="mb-3">
                            <Field
                              style={{ height: "150px" }}
                              name={`charger_note`}
                              className="form-control in_field"
                              as="textarea"
                            ></Field>
                            {/* <ErrorMessage name='birth_date' component={TextError} /> */}
                          </div>

                          <div>
                            <Button
                              style={{
                                height: "50px",
                                width: "100%",
                                fontSize: "20px",
                                marginTop: "20px",
                              }}
                              color="primary"
                              type="submit"
                            >
                              Add note
                            </Button>
                          </div>

                          <div>{error}</div>
                        </Form>
                      )}
                    />
                  </div>
                  <div>
                    <Label style={{ marginRight: "20px" }}>
                      Dispenser Number{" "}
                    </Label>

                    <select
                      style={{ width: "100px", fontSize: "30px" }}
                      value={dispenserNo}
                      onChange={(e) => setDispenserNo(e.target.value)}
                    >
                      {[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                      ].map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    style={{ height: "50px", width: "80%", marginTop: "20px" }}
                    color="success"
                    onClick={onOpenDispenser}
                  >
                    Open Dispenser {dispenserNo}
                  </Button>
                </>
              )}
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
                    car's maintenance date
                  </div>
                  <NewCarFormComponent
                    setFetchedCar={setFetchedCar}
                    setModal
                    setFetchedCarError={setFetchedCarError}
                  />
                </Col>
                <Col xs="0" md="1"></Col>
                <Col xs="12" md="7">
                  <div>
                    {FetchedCar && (
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
                          <ModalHeader toggle={toggle}>
                            Scan the QR code
                          </ModalHeader>
                          <ModalBody>
                            {!toggle ? (
                              <div>test</div>
                            ) : (
                              <QrComponent
                                setScannedQr={setScannedQr}
                                setModal={setModal}
                              />
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

                    {ScannedQr && ScannedQr !== FetchedCar?.data[0]?.qr_str && (
                      <Alert color="danger">
                        QR doesn't match plate number, the admin was notified by
                        this incident
                      </Alert>
                    )}

                    {FetchedCarError && (
                      <Alert color="danger">
                        Couldn't find car in the database
                      </Alert>
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

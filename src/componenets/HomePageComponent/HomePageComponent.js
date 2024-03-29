import React from "react";
import { Container, Row, Col, Label } from "reactstrap";
import "./HomePageComponent.css";
import { useHttpClient } from "../hooks/useHttpClient";
import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import { Alert } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CarPlateComponent from "./CarPlateComponent/CarPlateComponent";
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
  const [carPlateIsRight, setCarPlateIsRight] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [dispenserNo, setDispenserNo] = useState(4);

  const onCancel = () => {
    setFetchedCar(null);
    setScannedQr(null);
    setUpdatedCar(null);
    setCarPlateIsRight(false);
  };

  const Find_maint_state = (car) => {
    let str = car?.maintenances[car.maintenances.length - 1];
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
    let str = car?.maintenances[car.maintenances.length - 1];
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

  const fetchCarByQr = async (qr) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/cars/getcar/${qr}`
      );

      console.log("responseData", responseData);
      setFetchedCar(responseData);
      setFetchedCarError(false);
    } catch (err) {
      console.log(err);
      setFetchedCarError(true);
    }
  };

  useEffect(() => {
    if (ScannedQr) {
      fetchCarByQr(ScannedQr);
    }
  }, [ScannedQr]);

  return (
    <>
      <div style={{}}>
        <div>
          {carPlateIsRight ? (
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
                        charger_note: FetchedCar?.data[0]?.charger_note,
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
                  <div className="page_title">Charge A new car</div>
                  <div className="page_sub_title">Scan QR code on the car</div>

                  <button
                    className="get_car_button"
                    style={{
                      margin: "auto",
                      width: "200px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    Scan QR Code
                  </button>
                  <div>
                    {FetchedCarError && (
                      <Alert color="danger" style={{ marginTop: "30px" }}>
                        "couldnt find car in the database"
                      </Alert>
                    )}
                  </div>
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Scan the QR code</ModalHeader>
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
                </Col>
                <Col xs="0" md="12">
                  {FetchedCar && (
                    <>
                      <CarPlateComponent
                        plate_no={FetchedCar?.data[0]?.plate_no}
                        plate_str={FetchedCar?.data[0]?.plate_str}
                      ></CarPlateComponent>
                      <Button
                        style={{
                          height: "50px",
                          width: "80%",
                          marginTop: "20px",
                        }}
                        color="success"
                        onClick={() => {
                          setCarPlateIsRight(true);
                        }}
                      >
                        number is right
                      </Button>
                      <Button
                        style={{
                          height: "50px",
                          width: "80%",
                          marginTop: "20px",
                        }}
                        color="danger"
                        onClick={() => {
                          onCancel();
                        }}
                      >
                        number is wrong
                      </Button>
                    </>
                  )}
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

import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import './NewCarFormComponent.css'
import DateView from 'react-datepicker'
import { Container, Row, Col } from 'reactstrap';

import { useHttpClient } from '../../hooks/useHttpClient'



function NewCarFormComponent(props) {
    const [qr_str, setqr_str] = useState('')
    const { isLoading, error, sendRequest, clearError } = useHttpClient();







    const submit_form = async (fields) => {

        function reverseString(str) {
            return str
                .split('')
                .sort(() => 1)
                .join('');
        }

        let plate_no = fields.plate_no.split(' ').join('');
        let plate_str = fields.plate_str.split(' ').join('');
        let plate_str2 = reverseString(plate_str);

        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/v1/cars/getcar/${plate_no}/${encodeURI(plate_str2)}`);

            console.log('responseData ', responseData)
            props.setPostedCar(responseData)
            let qr_str = responseData.data[0].qr_str;
            setqr_str(qr_str)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Formik
                initialValues={{
                    plate_no: '',
                    plate_str: '',
                }}
                // validationSchema={Yup.object().shape({
                //     firstName: Yup.string().required('First Name is required'),
                //     lastName: Yup.string().required('Last Name is required'),
                //     email: Yup.string().email('Email is invalid') .required('Email is required'),

                // })}
                onSubmit={fields => {
                    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))
                    submit_form(fields)
                }}
                render={({ errors, status, touched }) => (
                    <Form>

                        <div className="plate_card_all" >
                            <div className="plate_card_top">
                                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
                                    <div style={{ flexGrow: '1', display: 'flex', marginLeft: "20px", alignItems: 'center', fontSize: '50px' }} >
                                        EGYPT
                                    </div>
                                    <div style={{ flexGrow: '1', display: 'flex', marginLeft: "20px", alignItems: 'center', fontSize: '50px' }} >
                                        <div style={{ marginBottom: "30px" }}>مصر</div>
                                    </div>
                                </div>
                            </div>

                            <div className="plate_card_bottom">
                                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
                                    <div style={{ width: '50%', display: 'flex', alignItems: 'center', fontSize: '70px' }} >
                                        <div className="form-group">
                                            <Field name="plate_no" type="text" className={'plate_input form-control' + (errors.plate_no && touched.plate_no ? ' is-invalid' : '')} />
                                            <ErrorMessage name="plate_no" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div style={{ width: '50%', display: 'flex', alignItems: 'center', fontSize: '70px' }} >
                                        <div className="form-group">
                                            <Field name="plate_str" type="text" className={'plate_input form-control' + (errors.plate_str && touched.plate_str ? ' is-invalid' : '')} />
                                            <ErrorMessage name="plate_str" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <button className="get_car_button" type="submit" style={{ marginLeft: 'auto' }}>Submit</button>
                        <div>{error}
                        </div>
                    </Form>
                )}
            />
        </div>
    )
}

export default NewCarFormComponent

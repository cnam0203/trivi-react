
import React, { useEffect, useState } from "react";
import { Row, Container, Form } from '@themesberg/react-bootstrap';
import Chart from "./components/Chart";
import {domainPath} from '../constants/utils';

export default () => {  
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    fetch(domainPath + 'dimadb/home/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(json => {
        setCharts(json);
      });
  }, []);

  


  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
            <Form.Group className="mb-3 col-6">
                <Form.Label>From date</Form.Label>
                <Form.Control type="date" onChange={(e) => console.log(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3 col-6">
                <Form.Label>To date</Form.Label>
                <Form.Control type="date" />
            </Form.Group>
        </Row>
        <Row className="mt-3">
            {
                charts.map((chart, index) => <Chart key={index} rawChart={chart}/>)
            }
            </Row>
        </Container>
    </article>
  );
};

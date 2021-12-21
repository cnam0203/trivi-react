import React, {useState, useEffect} from 'react';
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Container, InputGroup, Button, Tab, Nav } from '@themesberg/react-bootstrap';
import { useHistory, useLocation } from "react-router";

import Documentation from "../components/Documentation";
import { TabTitle } from '../constants/generalFunctions';

export default () => {
    TabTitle('Configuration');
    
    const listUpcomingAlgorithms = ['Base Time Sorting', 'Base Event Sorting'];
    const listSimilarAlgorithms = ['Cosine Similarity', 'Base Event Sorting'];
    const listMostPopularAlgorithms = ['Ponderation with Web Acivity values', 'Base Event Sorting'];

    const [upComingAlgo, setUpComingAlgo] = useState('');
    const [mostPoplarAlgo, setMostPopularAlgo] = useState('');
    const [similarAlgo, setSimilarAlgo] = useState('');

    const handleSubmitMostPopular = (e) => {
        e.preventDefault();
    }
    const handleSubmitUpcomming = (e) => {
        e.preventDefault();
    }

    const handleSubmitSimilar = (e) => {
        e.preventDefault();
    }

    return (
        <article>
            <Container className="px-0">
                <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
                    <Col className="d-block mb-4 mb-md-0">
                        <h1 className="h2">Recommender congifuration</h1>
                    </Col>
                </Row>
                <Row className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center py-4">
                    <Col xs={12} className="d-block mb-4 mb-md-0">
                        <Card>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="home">
                                    <Nav fill variant="pills" className="flex-column flex-sm-row">
                                        <Nav.Item>
                                        <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
                                            Most Popular Products Recommender
                                        </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                        <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
                                            Upcoming Event Recommender
                                        </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                        <Nav.Link eventKey="messages" className="mb-sm-3 mb-md-0">
                                            Similar Products Recommender
                                        </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="home" className="py-4">
                                            <Form className="row" onSubmit={e => handleSubmitMostPopular(e)}>
                                                <Form.Group className="mb-3 col-6">
                                                    <Form.Label>Selected algorithm</Form.Label>
                                                    <Form.Control value={mostPoplarAlgo} onChange={e => setMostPopularAlgo(e.target.value)} as="select" required>
                                                    <option value="">Open this select menu</option>
                                                    {
                                                        listMostPopularAlgorithms.map((item, index) => (
                                                        <option value={item} key={index}>{item}</option>
                                                        ))
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                                <Row>
                                                    {
                                                        ['View', 'Intend-to-buy', 'Share', 'Like', 'Search'].map((item, index) => (
                                                            <Form.Group className="mb-3 col-6">
                                                                <Form.Label>{`${item} weight`}</Form.Label>
                                                                <Form.Control type="number" defaultValue={2} required/>
                                                            </Form.Group>
                                                        ))
                                                    }
                                                </Row>
                                                <Row className="d-flex justify-content-center flex-nowrap">
                                                    <Button variant="primary" className="m-1" type="submit" style={{width:150}}>Save</Button>
                                                </Row>
                                            </Form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="profile" className="py-4">
                                            <Form className="row" onSubmit={e => handleSubmitUpcomming(e)}>
                                                <Form.Group className="mb-3 col-6">
                                                    <Form.Label>Selected algorithm</Form.Label>
                                                    <Form.Control as="select" value={upComingAlgo} onChange={e => setUpComingAlgo(e.target.value)}  required>
                                                    <option value="">Open this select menu</option>
                                                    {
                                                        listUpcomingAlgorithms.map((item, index) => (
                                                        <option value={item} key={index}>{item}</option>
                                                        ))
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                                <Row className="d-flex justify-content-center flex-nowrap">
                                                    <Button variant="primary" className="m-1" type="submit" style={{width:150}}>Save</Button>
                                                </Row>
                                            </Form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="messages" className="py-4">
                                            <Form className="row" onSubmit={e => handleSubmitSimilar(e)}>
                                                <Form.Group className="mb-3 col-6">
                                                    <Form.Label>Selected algorithm</Form.Label>
                                                    <Form.Control as="select" required value={similarAlgo} onChange={e => setSimilarAlgo(e.target.value)}>
                                                    <option value="">Open this select menu</option>
                                                    {
                                                        listSimilarAlgorithms.map((item, index) => (
                                                        <option value={item} key={index}>{item}</option>
                                                        ))
                                                    }
                                                    </Form.Control>
                                                </Form.Group>                                
                                                <Row className="d-flex justify-content-center flex-nowrap">
                                                    <Button variant="primary" className="m-1" type="submit" style={{width:150}}>Save</Button>
                                                </Row>
                                            </Form>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </article>
    );
};

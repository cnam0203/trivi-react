import React, {useState} from 'react';
import { Col, Row, Card, Form, Container, Button} from '@themesberg/react-bootstrap';
import ProcessTables from "./tables/ProcessTables";

export default () => {

    const [isSubmitted, setSubmit] = useState(false);
    const [recommendLevel, setRecommendLevel] = useState('');
    const [domain, setDomain] = useState('');
    const [product, setProduct] = useState('');
    const [recommendType, setRecommendType] = useState('');
    const [quantity, setQuantity] = useState(1);

    const recommendLevels = [
        {
            id: 0,
            value: 'General level'
        },
        {
            id: 1,
            value: 'Domain-specific level'
        }, 
        {
            id: 2,
            value: 'Product-specific level'
        }];
    const domains = [
        {
            id: 0,
            value: '1'
        }, {
            id: 1,
            value: '2'
        }, {
            id: 2,
            value: '3'
        }];
    const products = [
        {
            id: 0,
            value: '1'
        }, {
            id: 1,
            value: '2'
        }, {
            id: 2,
            value: '3'
        }];
    const recommendTypes = [
        {
            id: 0,
            value: 'Upcomming event'
        }, {
            id: 1,
            value: 'Most popular'
        }];
    const currentResults = [{
        'id': 1,
        'value': 'ACB',
        'price': 11
    }, {
        'id': 2,
        'value': 'ACB',
        'price': 11
    }, {
        'id': 3,
        'value': 'ACB',
        'price': 11
    }, {
        'id': 4,
        'value': 'ACB',
        'price': 11

    }]
    const columns = currentResults.length ? Object.keys(currentResults[0]).map(key => {return {Header: key, accessor: key}}) : []; 
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit(!isSubmitted);
    }


  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col className="d-block mb-4 mb-md-0">
            <h1 className="h2">API Integration</h1>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center py-4">
          <Col xs={12} className="d-block mb-4 mb-md-0">
            <Card>
                <Card.Body>
                    <Form className="row" onSubmit={e => handleSubmit(e)}>
                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Recommend level</Form.Label>
                            <Form.Control as="select" value={recommendLevel} onChange={e => setRecommendLevel(e.target.value)} required>
                            <option value="">Open this select menu</option>
                            {
                                recommendLevels.map((item, index) => (
                                <option value={item.id} key={index}>{item.value}</option>
                                ))
                            }
                            </Form.Control>
                        </Form.Group>
                        {
                            recommendLevel === '1' && (
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>Domain</Form.Label>
                                    <Form.Control as="select" value={domain} onChange={e => setDomain(e.target.value)} required>
                                    <option value="">Open this select menu</option>
                                    {
                                        domains.map((item, index) => (
                                        <option value={item.id} key={index}>{item.value}</option>
                                        ))
                                    }
                                    </Form.Control>
                                </Form.Group>
                            )
                        }
                        {
                            recommendLevel === '2' && (
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>Product</Form.Label>
                                    <Form.Control as="select" value={product} onChange={e => setProduct(e.target.value)} required>
                                    <option value="">Open this select menu</option>
                                    {
                                        products.map((item, index) => (
                                        <option value={item.id} key={index}>{item.value}</option>
                                        ))
                                    }
                                    </Form.Control>
                                </Form.Group>
                            )
                        }
                        {
                            recommendLevel !== '2' && (
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>Recommend type</Form.Label>
                                    <Form.Control as="select" value={recommendType} onChange={e => setRecommendType(e.target.value)} required>
                                    <option value="">Open this select menu</option>
                                    {
                                        recommendTypes.map((item, index) => (
                                        <option value={item.id} key={index}>{item.value}</option>
                                        ))
                                    }
                                    </Form.Control>
                                </Form.Group>
                            )
                        }
                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" value={quantity} min={1} onChange={e => setQuantity(e.target.value)} required/>
                        </Form.Group>
                        <Row className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center">
                            <Col xs={4} className="d-flex flex-wrap flex-md-nowrap justify-content-center align-items-center">
                                <Button variant="primary" className="m-1" type="submit">Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                    {
                        isSubmitted && (
                            <>
                                <Form>
                                    <Form.Group className="mb-3 col-6">
                                        <Form.Label className="h2">API for integration</Form.Label>
                                        <Form.Control type="text" defaultValue={"127.0.0.1/dimadb/upcoming-events?qnty=10"} readOnly/>
                                    </Form.Group>
                                </Form>
                                <Container className="px-0">
                                    <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
                                        <Col className="d-block mb-4 mb-md-0">
                                            <h1 className="h2">Recommended Products (Event or Item)</h1>
                                        </Col>
                                    </Row>
                                    {
                                    columns.length && <ProcessTables columns={columns} data={currentResults}/>
                                    }
                                </Container>
                            </>
                        )
                    }
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </article>
  );
};

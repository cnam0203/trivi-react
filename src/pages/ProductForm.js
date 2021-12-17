import React, {useState, useEffect} from 'react';
import { Col, Row, Form, Container, Button, Modal } from '@themesberg/react-bootstrap';
import { useHistory, useLocation } from "react-router";
import {domainPath} from '../constants/utils';


export default () => {
  const history = useHistory();
  const location = useLocation();
  const productType = location.pathname.includes('item') ? 'item' : 'event';
  const isNewForm = location.pathname.includes('form') ? true : false;

  const [productID, setProductID] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [organization, setOrganization] = useState('');
  const [slug, setSlug] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [listDomains, setListDomains] = useState([]);
  const [listOrganizaitons, setListOrganizations] = useState([]);
  const [showDefault, setShowDefault] = useState(false);

  useEffect(() => {
      const id = location.pathname.split('/').pop();
      const url = domainPath + `dimadb/product/${productType}/${id}`; 
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + localStorage.getItem('token')
        }
      })
      .then(res => res.json())
      .then(json => {
        const product = json['product'];
        const domains = json['domains'];
        const organizations = json['organizations'];

        setListDomains(domains);
        setListOrganizations(organizations);
        setProductID(product['product_id']);
        setCreatedAt(new Date(product['created_at']));
        setName(product['name']);
        setDomain(product['domain_id']);
        setOrganization(product['organization_id']);
        setSlug(product['slug']);
        setDescription(product['description']);
        setSourceUrl(product['source_url']);
        setImageUrl(product['image_url']);

        if (productType === 'event') {
          setStatus(product['status']);
          setStartDate(product['start_date']);
          setEndDate(product['end_date']);
        } else {
          setPrice(product['price']);
        }
      });
  }, []);


  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowDefault(true);
  }

  const handleDeleteProduct = () => {
    // e.preventDefault();
    const url = domainPath + `dimadb/product/${productType}/${productID}/`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      }
    })
    .then(res => {
      if (res.status === 400) {
        setShowDefault(false);
        alert(`Can not delete ${productType}`)
      } else {
        setShowDefault(false);
        alert(`Delete ${productType} successfully`)
        history.go(-1)
      }
    })
    
  }
  
  const handlePostNewProduct = (e) => {
    e.preventDefault();
    const id = location.pathname.split('/').pop();
    var url = domainPath + `dimadb/product/${productType}/`;
    var method = '';

    alert(id);
    if (id === 'form') {
      url = url + 'new-product';
      method = 'POST';
    } else {
      url = url + id + '/';
      method = 'PUT';
    }
    
    const newProduct = {
      product_id: productID,
      name: name,
      domain: domain,
      organization: organization,
      slug: slug,
      description: description,
      source_url: sourceUrl,
      image_url: imageUrl,
      product_type: productType,
    };

    if (productType === 'event') {
      newProduct['status'] = status;
      newProduct['startDate'] = startDate;
      newProduct['endDate'] = endDate;
    } else {
      newProduct['price'] = price;
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newProduct)
    })
    .then(res => {
      if (res.status === 400) {
        alert(`Can not ${method === 'PUT' ? 'update' : 'create new'} ${productType}`)
      } else {
        alert(`${method === 'PUT' ? 'Update' : 'Create new'} ${productType} successfully`)
        history.go(0)
      }
    })
  }

  const onChangeStartDate = (value) => {
    if (endDate !== '' && value > endDate) {
      alert('Start date must be before end date');
      setStartDate('');
    } else {
      setStartDate(value);
    }
  }

  const onChangeEndDate = (value) => {
    if (startDate !== '' && value < startDate) {
      alert('End date must be after start date');
      setEndDate('');
    } else {
      setEndDate(value);
    }
  }

  const handleClose = () => setShowDefault(false);

  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col className="d-block mb-4 mb-md-0">
            <h1 className="h2">{`${isNewForm ? "New" : 'Detailed'} ${productType}`}</h1>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col xs={12} className="mb-4">
            <Form className="row" onSubmit={(e) => handlePostNewProduct(e)}>
                {
                  !isNewForm ? (
                    <>
                      <Form.Group className="mb-3 col-6">
                          <Form.Label>Product ID</Form.Label>
                          <Form.Control type="text" defaultValue={productID} readOnly/>
                      </Form.Group>
                      <Form.Group className="mb-3 col-6">
                        <Form.Label>Create at</Form.Label>
                        <Form.Control type="datetime" defaultValue={createdAt} readOnly/>
                      </Form.Group>
                    </>
                  ) : <></>
                }
                <Form.Group className="mb-3 col-6">
                    <Form.Label>{`Name of ${productType}`}</Form.Label>
                    <Form.Control type="text" defaultValue={name} onChange={e => setName(e.target.value)} required/>
                </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Domain</Form.Label>
                    <Form.Control as='select' value={domain} onChange={e => setDomain(e.target.value)} required>
                      <option value="">Open this select menu</option>
                      {
                        listDomains.map((item, index) => (
                          <option value={item.id} key={index}>{item.name}</option>
                        ))
                      }
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Organization</Form.Label>
                    <Form.Control as='select' value={organization} onChange={e => setOrganization(e.target.value)} required>
                      <option value="">Open this select menu</option>
                      {
                        listOrganizaitons.map((item, index) => (
                          <option value={item.id} key={index}>{item.legal_name}</option>
                        ))
                      }
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Slug</Form.Label>
                    <Form.Control type="text" defaultValue={slug} onChange={e => setSlug(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Source url</Form.Label>
                    <Form.Control type="text" defaultValue={sourceUrl} onChange={e => setSourceUrl(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3 col-6">
                    <Form.Label>Image url</Form.Label>
                    <Form.Control type="text" defaultValue={imageUrl} onChange={e => setImageUrl(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3 col-12">
                    <Form.Label>Description</Form.Label>
                    <Form.Control  as="textarea" rows="5" defaultValue={description} onChange={e => setDescription(e.target.value)} required/>
                </Form.Group>
                {
                  productType === 'event' ? (
                    <>
                      <Form.Group className="mb-3 col-4">
                          <Form.Label>Status</Form.Label>
                          <Form.Control type="text" placeholder="Classic music" defaultValue={status} onChange={e => setStatus(e.target.value)} required/>
                      </Form.Group>
                      <Form.Group className="mb-3 col-4">
                          <Form.Label>Start date</Form.Label>
                          <Form.Control type="date" value={startDate} onChange={e => onChangeStartDate(e.target.value)} required/>
                      </Form.Group>
                      <Form.Group className="mb-3 col-4">
                          <Form.Label>End date</Form.Label>
                          <Form.Control type="date" value={endDate} onChange={e => onChangeEndDate(e.target.value)} required/>
                      </Form.Group>
                    </> 
                  ) : (
                    <Form.Group className="mb-3 col-4">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" value={price} min={0} onChange={e => setPrice(e.target.value)} required/>
                    </Form.Group>
                  )
                }                    
                <Row>
                  <Col xs={5} className="mb-4 align-items-end">
                  </Col>
                  <Col xs={5} className="mb-4 align-items-end">
                      {
                        isNewForm ? (
                          <Button variant="primary" className="m-1" type="submit">Save</Button>
                        ) : (
                          <>
                            <Button variant="primary" className="m-1" type="submit">Update</Button>
                            <React.Fragment>
                              <Button variant="secondary" className="m-1" onClick={e => handleOpenModal(e)}>Delete</Button>
                              <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
                              <Modal.Header>
                                <Modal.Title className="h6">Delete</Modal.Title>
                                <Button variant="close" aria-label="Close" onClick={handleClose} />
                              </Modal.Header>
                              <Modal.Body>
                                <p>Do you want to delete {productType} {productID} ?</p>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={handleDeleteProduct}>
                                  Yes
                              </Button>
                                <Button variant="link" className="text-gray ms-auto" onClick={handleClose}>
                                  No
                              </Button>
                              </Modal.Footer>
                            </Modal>
                            </React.Fragment>
                          </>
                        )
                      }
                  </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </article>
  );
};

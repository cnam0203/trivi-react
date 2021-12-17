import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Container, Button, ButtonGroup, Dropdown, Form, InputGroup } from '@themesberg/react-bootstrap';
import { useHistory } from "react-router";
import { CSVLink } from "react-csv";
import ProcessTables from "./tables/ProcessTables";
import {domainPath} from '../constants/utils';

export default () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const headerKeys = searchProducts.length ? Object.keys(searchProducts[0]).map(key => {return {label : key, key: key}}) : [];
  const columns = searchProducts.length ? Object.keys(searchProducts[0]).map(key => {return {Header: key, accessor: key}}) : []; 

  useEffect(() => {
      fetch(domainPath + 'dimadb/product/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(json => {
        setAllProducts(json, 3);
      });
  }, []);

  const setAllProducts = (json, level=3) => {
    if (level >= 3)
      setProducts(json);
    if (level >= 2) 
      setFilteredProducts(json);
    if (level >= 1)
      setSearchProducts(json);
  }

  const filterProduct = (selectType, productType) => {
    if (selectType === productType || selectType === 'all') {
        return true;
    } else {
      return false;
    }
  }

  const handleFilter = (e) => {
     const listFilteredProducts = products.filter((item) => {return filterProduct(e, item['product_type'])});
     setAllProducts(listFilteredProducts, 2);
  }

  const handleViewDetail = (row) => {
    const type = row['product_type'];
    const id = row['product_id'];
    const url = `/cultural-products/detail/${type}/${id}`;
    history.push(url);
  }

  const handleImportCsv = (e) => {

  }

  const handleNewProduct = (e, id) => {
    const url = `/cultural-products/detail/${e}/${id}`;
    history.push(url);
  }

  const searchKeyWord = (keyword) => {
    if (keyword === '') {
      setAllProducts(filteredProducts, 2);
    } else {
      var filteredKeyWord = [];
      for (var i=0; i < filteredProducts.length; i++) {
        const obj = filteredProducts[i];
        const keys = Object.keys(obj);
        for (var j=0; j < keys.length; j++) {
          const value = String(obj[keys[j]]).toLowerCase();
          if (value.includes(keyword)) {
            filteredKeyWord.push(obj);
            break;
          }
        }
      }
      setAllProducts(filteredKeyWord, 1);
    }
  }

  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col className="d-block mb-4 mb-md-0">
            <h1 className="h2">Tables</h1>
          </Col>
        </Row>
        <Row>
            <Col xs={9} className="mb-4">
                <Dropdown
                  as={ButtonGroup}
                  className="m-1"
                  onSelect={handleFilter}
                >
                  <Button variant="gray">Filter</Button>
                  <Dropdown.Toggle split variant="gray">
                      <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                        <Dropdown.Item eventKey={`all`}>All</Dropdown.Item>
                        <Dropdown.Item eventKey={`event`}>Event</Dropdown.Item>
                        <Dropdown.Item eventKey={`item`}>Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  as={ButtonGroup}
                  className="m-1"
                  onSelect={(e) => handleNewProduct(e, 'form')}
                >
                  <Button variant="primary">New Product</Button>
                  <Dropdown.Toggle split variant="primary">
                      <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                        <Dropdown.Item eventKey={`event`}>Event</Dropdown.Item>
                        <Dropdown.Item eventKey={`item`}>Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="secondary" className="m-1">Import CSV</Button>
                <Button variant="tertiary" className="m-1">
                  <CSVLink data={searchProducts} headers={headerKeys}>Export CSV</CSVLink>
                </Button>
            </Col>
            <Col xs={3} className="mb-4">
              <Form.Group>
                <InputGroup className="input-group-merge">
                  <Form.Control type="text" placeholder="Search keyword" onKeyPress={e => {
                      if (e.key === "Enter") {
                        searchKeyWord(e.target.value);
                      }
                    }} />
                  <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} style={{cursor: 'pointer'}}/>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
        </Row>
        {
          columns.length > 0 ? <ProcessTables columns={columns} data={searchProducts} isViewDetail={true} handleViewDetail={handleViewDetail}/> : <></>
        }
      </Container>
    </article>
  );
};
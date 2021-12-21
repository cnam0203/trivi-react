import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Container, Button, ButtonGroup, Dropdown, Form, InputGroup } from '@themesberg/react-bootstrap';
import { CSVLink } from "react-csv";
import ProcessTables from "./tables/ProcessTables";
import {domainPath} from '../constants/utils';
import { TabTitle } from '../constants/generalFunctions';

export default () => {
  TabTitle('Activities');

  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchActivities, setSearchActivities] = useState([]);
  const headerKeys = searchActivities.length ? Object.keys(searchActivities[0]).map(key => {return {label : key, key: key}}) : [];
  const columns = searchActivities.length ? Object.keys(searchActivities[0]).map(key => {return {Header: key, accessor: key}}) : []; 
  const activityTypes = ['like', 'intend-to-buy', 'view', 'share', 'search'];

  useEffect(() => {
      fetch(domainPath + 'dimadb/activity/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(json => {
        setAllActivities(json, 3);
      });
  }, []);

  const setAllActivities = (json, level=3) => {
    if (level >= 3)
      setActivities(json);
    if (level >= 2) 
      setFilteredActivities(json);
    if (level >= 1)
      setSearchActivities(json);
  }

  const filterActivity = (selectType, activityType) => {
    if (selectType === activityType || selectType === 'all') {
        return true;
    } else {
      return false;
    }
  }

  const handleFilter = (e) => {
     const listFilteredActivities = activities.filter((item) => {return filterActivity(e, item['activity_type'])});
     setAllActivities(listFilteredActivities, 2);
  }

  const handleImportCsv = (e) => {

  }

  const searchKeyWord = (keyword) => {
    if (keyword === '') {
      setAllActivities(filteredActivities, 2);
    } else {
      var filteredKeyWord = [];
      for (var i=0; i < filteredActivities.length; i++) {
        const obj = filteredActivities[i];
        const keys = Object.keys(obj);
        for (var j=0; j < keys.length; j++) {
          const value = String(obj[keys[j]]).toLowerCase();
          if (value.includes(keyword)) {
            filteredKeyWord.push(obj);
            break;
          }
        }
      }
      setAllActivities(filteredKeyWord, 1);
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
                        {
                            activityTypes.map((type, index) => (
                                <Dropdown.Item eventKey={type} key={index}>{type}</Dropdown.Item>
                            ))
                        }
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="secondary" className="m-1">Import CSV</Button>
                <Button variant="tertiary" className="m-1">
                  <CSVLink data={searchActivities} headers={headerKeys}>Export CSV</CSVLink>
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
          columns.length > 0 ? <ProcessTables columns={columns} data={searchActivities}/> : <></>
        }
      </Container>
    </article>
  );
};
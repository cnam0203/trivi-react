import React, {useState, useEffect} from 'react';
import { Col, Row, Form, Container, Button, Modal } from '@themesberg/react-bootstrap';
import { useHistory, useLocation } from "react-router";
import {domainPath} from '../constants/utils';
import { TabTitle } from '../constants/generalFunctions';
import { map } from 'highcharts';
import _ from 'lodash';
import {v4} from 'uuid';

const findPathName = (path, index, attributeName) => {
    var pathName = '';

    if (index !== undefined) {
        pathName = path + '.value[' + index.toString() + ']';
    }
    else {
        if (path) 
            pathName = path + '.attributes.' + attributeName;
        else if (attributeName)
            pathName = 'attributes.' + attributeName;
        else
            pathName = '';
    }
    return pathName;
}

const FormElement = ({path, index, formInfo, 
                        attributeName, formName, 
                        handleChangeValue, 
                        handleAddElement, 
                        handleRemoveElement}) => {
    const order = index !== undefined ? '_' + (index+1).toString() : '';
    const labelName = attributeName ? attributeName + order : formName + order;
    const pathName = findPathName(path, index, attributeName);
    const cloneObj = formInfo.elementAttribute ? JSON.parse(JSON.stringify(formInfo.elementAttribute)) : {};

    if (formInfo.type === 'object') {
        return (
            <>
                <Form.Label>{labelName.toUpperCase()}</Form.Label>
                {
                    Object.keys(formInfo.attributes).map((key, index) => 
                        <FormElement path={pathName} attributeName={key} 
                                        formInfo={formInfo.attributes[key]} key={index} 
                                        handleChangeValue={handleChangeValue}
                                        handleAddElement={handleAddElement}
                                        handleRemoveElement={handleRemoveElement}/>
                    )
                }
            </>
        )
    } else if (formInfo.type === 'text') {
        return (
            <Form.Group className="mb-3 col-6">
                <Form.Label>{labelName}</Form.Label>
                <Form.Control type="text" defaultValue={formInfo.value} onChange={(e) => handleChangeValue(pathName, e.target.value)}/>
            </Form.Group>
        )
    } else if (formInfo.type === 'number') {
        return (
            <Form.Group className="mb-3 col-6">
                <Form.Label>{labelName}</Form.Label>
                <Form.Control type="number" defaultValue={formInfo.value} 
                                min={formInfo.min ? formInfo.min : ''} 
                                max={formInfo.max ? formInfo.max : ''}
                                onChange={(e) => handleChangeValue(pathName, e.target.value)}/>
            </Form.Group>
        )
    } else if (formInfo.type === 'textarea') {
        return (
            <Form.Group className="mb-3 col-6">
                <Form.Label>{labelName}</Form.Label>
                <Form.Control as="textarea" defaultValue={formInfo.value} rows={5}
                            onChange={(e) => handleChangeValue(pathName, e.target.value)}/>
            </Form.Group>
        )
    } else if (formInfo.type === 'datetime' || formInfo.type === 'date') {
        return (
            <Form.Group className="mb-3 col-6">
                <Form.Label>{labelName}</Form.Label>
                <Form.Control type={formInfo.type} defaultValue={formInfo.value} 
                                min={formInfo.min ? formInfo.min : ''} 
                                max={formInfo.max ? formInfo.max : ''}
                                onChange={(e) => handleChangeValue(pathName, e.target.value)}/>
            </Form.Group>
        )
    } else if (formInfo.type === 'select') {
        return (
            <Form.Group className="mb-3 col-6">
                <Form.Label>{labelName}</Form.Label>
                <Form.Control as='select' value={formInfo.value}
                        onChange={(e) => handleChangeValue(pathName, e.target.value)}>
                  <option value="">Open this select menu</option>
                  {
                    formInfo.choices.map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))
                  }
                </Form.Control>
            </Form.Group>
        )
    } else if (formInfo.type === 'array') {
        return (
            <>
                {
                    formInfo.value.map((value, index) => (
                        <Row key={value.id}>
                            <FormElement formInfo={value} index={index} path={pathName} 
                                        handleChangeValue={handleChangeValue} 
                                        attributeName={attributeName} 
                                        handleAddElement={handleAddElement}/>
                            <div className='col-12 text-center'>
                                <Button variant="primary" className="m-1" onClick={() => handleRemoveElement(pathName, index)}>{`Delete`}</Button>
                            </div>
                        </Row>
                    )
                    )
                }
                <Row>
                    <div className='col text-center'>
                        <Button variant="primary" className="m-1" onClick={() => handleAddElement(pathName, cloneObj)}>{`Add ${formInfo.value.length ? "more" : ""} ${attributeName}(s)`}</Button>
                    </div>
                </Row>
            </>
        )
    } else {
        return <></>
    }
}

export default () => {
    const location = useLocation();
    const urlArrays = location.pathname.split('/');
    const itemType = urlArrays[urlArrays.length-2];
    const id = urlArrays[urlArrays.length-1];
    const [formInfo, setFormInfo] = useState({});

    TabTitle(`New ${itemType}`);

    useEffect(() => {
        const url = domainPath + `dimadb/getItem/${itemType}/${id}`; 
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + localStorage.getItem('token')
          }
        })
        .then(res => res.json())
        .then(json => {
            setFormInfo(json);
        })
        .catch(err => alert('Fetch data error'))
    }, []);
    
    const handleChangeValue = (path, value) => {
        const pathValue = path + '.value';
        const cloneFormInfo = {...formInfo};

        _.set(cloneFormInfo, pathValue, value);
        setFormInfo(cloneFormInfo);
    }

    const handleAddElement = (path, obj) => {
        const pathValue = path + '.value';
        var cloneFormInfo = {...formInfo};

        const oldArray = _.get(cloneFormInfo, pathValue);
        var cloneOldArray = [...oldArray];
        obj.id = v4();

        cloneOldArray.push(obj);
        _.set(cloneFormInfo, pathValue, cloneOldArray);
        setFormInfo(cloneFormInfo);
    }

    const handleRemoveElement = (path, index) => {
        const pathValue = path + '.value';
        var cloneFormInfo = {...formInfo};

        const oldArray = _.get(cloneFormInfo, pathValue);
        var cloneOldArray = [...oldArray];

        cloneOldArray.splice(index, 1);
        _.set(cloneFormInfo, pathValue, cloneOldArray);
        setFormInfo(cloneFormInfo);
    }

    return (
        <article>
        <Container className="px-0">
            <Row className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3">
            <Col className="d-block mb-2 mb-md-0">
                <h1 className="h2">Form</h1>
            </Col>
            </Row>
            <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-3">
            <Col xs={12} className="mb-4">
                {
                    !_.isEmpty(formInfo) ? (
                        <Form className="row" onSubmit={(e) => {}}>
                            <FormElement formInfo={formInfo} 
                                        handleChangeValue={handleChangeValue} 
                                        formName={'event'} 
                                        handleAddElement={handleAddElement}
                                        handleRemoveElement={handleRemoveElement}/>

                            <div className='row'>
                                <div className='col text-center'>
                                    <Button variant="primary" className="m-1" type="submit">Save</Button>
                                </div>
                            </div>
                        </Form>
                    ) : <></>
                }
            </Col>
            </Row>
        </Container>
        </article>
    );
};

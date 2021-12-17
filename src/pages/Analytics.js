
import React, { useEffect, useState } from "react";
import { Col, Row, Dropdown, Container, ButtonGroup, DropdownButton, Card, Form } from '@themesberg/react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {domainPath} from '../constants/utils';

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);

export default () => {  
  const selections = ['line', 'bar', 'column', 'area', 'stacked bar', 'stacked column'];
  const [charts, setCharts] = useState([]);
  const [show, setShow] = useState(true);

  const createChart = (title, chartData, chartType) => {
    return {
      title: {
        text: title ? title : '',
        margin: 20,
        style: {
          fontSize: "1.25rem",
          color: "#262B40",
        }},
      chart: {
        type: chartType ? chartType : 'line',
        style: {
          fontFamily: "Nunito Sans",
        }},
      series: chartData ? [{
        name: "",
        data: chartData, 
        colorByPoint: true,}] : [],
      exporting: {
        enabled: true,
        showTable: false,
      },
      xAxis: {
        type: 'category'
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
            },
            showInLegend: true
        }, 
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      options: {
        charts: {
          style: {
            fontFamily: "Nunito Sans",
          }
        }
      }
    }
  }

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
        var listCharts = json.map((chart, index) => {
          var newChart = createChart(chart.title, chart.data, chart.type);
          return newChart;
        });
        setCharts(listCharts);
      });
  }, []);

  const handleSelect=(e) => {
    // var newChart = Object.assign({}, options);
    // if (e.includes('bar')) {
    //   newChart['chart'] = {
    //     type: 'bar'
    //   }
    // } else if (e.includes('column')) {
    //   newChart['chart'] = {
    //     type: 'column'
    //   }
    // } else if (e.includes('area')) {
    //   newChart['chart'] = {
    //     type: 'area'
    //   }
    // } else {
    //   newChart['chart'] = {
    //     type: 'line'
    //   }
    // }
  
    // if (e.includes('stacked')) {
    //   const name = e.split(' ')[1];

    //   newChart['plotOptions'] = {};
    //   newChart['plotOptions'][name] = {
    //     stacking: 'normal'
    //   }
    // }
    
    // setShow(false);
    // setTimeout(() => {
    //   setShow(true);
    //   setChart(newChart)}
    // , 500);
  }


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
                charts.map((chart, index) => (
                    <Col xs={12} xl={6} sm={6} className="mb-4">
                        <Card border="light" className="shadow-sm p-3" style={{overflow: 'hidden'}}>
                            <DropdownButton
                                as={ButtonGroup}
                                title="Chart type"
                                onSelect={handleSelect}
                                className="col-3"
                            >
                                {
                                selections.map((type, index) => (
                                    <Dropdown.Item key={index} eventKey={type}>{type}</Dropdown.Item>
                                ))
                                }
                            </DropdownButton>
                            {
                                show && (<HighchartsReact
                                highcharts={Highcharts}
                                options={chart}
                                />
                                )
                            }
                        </Card>
                    </Col>
                ))
            }
            </Row>
        </Container>
    </article>
  );
};

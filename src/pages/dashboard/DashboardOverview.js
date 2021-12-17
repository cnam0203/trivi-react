
import React, { useEffect, useState } from "react";
import { faCashRegister, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget} from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares } from "../../data/charts";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {domainPath} from '../../constants/utils.js';


require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);

export default () => {
  const data = [{
    name: 'Installation',
    data: [{'x': new Date('2021-03-04'), 'y': 43934}, {'x': new Date('2021-03-05'), 'y': 43934}, {'x': new Date('2021-03-06'), 'y': 73934}]
  }, {
      name: 'Manufacturing',
      data: [{'x': new Date('2021-03-04'), 'y': 53934}, {'x': new Date('2021-03-05'), 'y': 13934}, {'x': new Date('2021-03-06'), 'y': 13934}]
  }, {
      name: 'Sales & Distribution',
      data: [{'x': new Date('2021-03-04'), 'y': 23934}, {'x': new Date('2021-03-05'), 'y': 33934}, {'x': new Date('2021-03-06'), 'y': 23934}]
  }, ];
  
  const selections = ['line', 'bar', 'column', 'area', 'stacked bar', 'stacked column'];
  const options = {
    title: {
      text: 'My chart'
    },
    xAxis: {
      type: "datetime",
    },
    series: data,
    exporting: {
      enabled: true,
      showTable: false,
    },
  }

  const [chart, setChart] = useState({});
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
      series: data ? [{
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
    fetch(domainPath + 'home/', {
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
    var newChart = Object.assign({}, options);
    if (e.includes('bar')) {
      newChart['chart'] = {
        type: 'bar'
      }
    } else if (e.includes('column')) {
      newChart['chart'] = {
        type: 'column'
      }
    } else if (e.includes('area')) {
      newChart['chart'] = {
        type: 'area'
      }
    } else {
      newChart['chart'] = {
        type: 'line'
      }
    }
  
    if (e.includes('stacked')) {
      const name = e.split(' ')[1];

      newChart['plotOptions'] = {};
      newChart['plotOptions'][name] = {
        stacking: 'normal'
      }
    }
    
    setShow(false);
    setTimeout(() => {
      setShow(true);
      setChart(newChart)}
    , 500);
  }


  return (
    <>
      {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Dropdown className="btn-toolbar">
          <Dropdown.Toggle as={Button} variant="primary" size="sm" className="me-2">
            <FontAwesomeIcon icon={faPlus} className="me-2" />New Task
          </Dropdown.Toggle>
          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faTasks} className="me-2" /> New Task
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" /> Upload Files
            </Dropdown.Item>
            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faUserShield} className="me-2" /> Preview Security
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faRocket} className="text-danger me-2" /> Upgrade to Pro
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <ButtonGroup>
          <Button variant="outline-primary" size="sm">Share</Button>
          <Button variant="outline-primary" size="sm">Export</Button>
        </ButtonGroup>
      </div> */}
      <Row className="mt-3 justify-content-md-center">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Visitors"
            title="345k"
            period="Feb 1 - Apr 1"
            percentage={18.2}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Sessions"
            title="$43,594"
            period="Feb 1 - Apr 1"
            percentage={28.4}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Traffic Share"
            data={trafficShares} />
        </Col>
        {
          charts.map((chart, index) => (
          <Col xs={12} xl={6} sm={6} className="mb-4" key={index}>
            <Card border="light" className="shadow-sm" style={{overflow: 'hidden'}}>
              <HighchartsReact
                highcharts={Highcharts}
                options={chart}
                />
            </Card>
          </Col>
          ))
        }
        {/* <Col xs={12} xl={8} sm={6} className="mb-4 bg-white">
          <h1 className="h2">HighChartS 10300</h1>
          <Row>
            <Form.Group className="mb-3 col-6">
                <Form.Label>From date</Form.Label>
                <Form.Control type="date" onChange={(e) => console.log(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3 col-6">
                <Form.Label>To date</Form.Label>
                <Form.Control type="date" />
            </Form.Group>
          </Row>
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
        </Col> */}
        {/* <Col xs={12} xl={6} sm={6} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} xl={6} sm={6} className="mb-4">
          <BarChartWidget
            title="Total orders"
            value={452}
            percentage={18.2}
            data={totalOrders} />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col> */}
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col>
{/* 
                <Col xs={12} lg={6} className="mb-4">
                  <TeamMembersWidget />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <ProgressTrackWidget />
                </Col> */}
              </Row>
            </Col>

            {/* <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={452}
                    percentage={18.2}
                    data={totalOrders} />
                </Col>

                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget />
                </Col>

                <Col xs={12} className="px-0">
                  <AcquisitionWidget />
                </Col>
              </Row>
            </Col> */}
          </Row>
        </Col>
      </Row>
    </>
  );
};

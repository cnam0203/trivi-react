
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Container, InputGroup, Image } from '@themesberg/react-bootstrap';
import ReactLogo from "../../assets/img/technologies/logo.svg";
import {domainPath} from '../../constants/utils';
import BgImage from "../../assets/img/illustrations/signin.svg";


export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_login = (e, data) => {
    e.preventDefault();
    fetch(domainPath + '/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        if (json.token) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('username', json.user.username);
          this.props.history.push('/');
        } else {
          alert("Your account is invalid");
        }
      });
  };


  render() {
    return (
      <main className="bg-dark vh-100">
        <section className="d-flex align-items-center my-5 mt-lg-8 mb-lg-5">
          <Container>
            {/* <p className="text-center">
              <Card.Link as={Link} to={Routes.DashboardOverview.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
              </Card.Link>
            </p> */}
            <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="bg-white shadow-soft border rounded border-primary p-4 p-lg-5 w-100 fmxw-500">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className="mb-0">Sign in to Trivia.ca</h3>
                  </div>
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <Image className="" src={ReactLogo} height={80} />
                  </div>
                  <Form className="mt-4" onSubmit={e => this.handle_login(e, this.state)}>
                    <Form.Group id="email" className="mb-4">
                      <Form.Label>Your Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                        <Form.Control autoFocus required type="text" placeholder="example@company.com" name="username" value={this.state.username} onChange={this.handle_change}/>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <Form.Group id="password" className="mb-4">
                        <Form.Label>Your Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faUnlockAlt} />
                          </InputGroup.Text>
                          <Form.Control required type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handle_change} />
                        </InputGroup>
                      </Form.Group>
                      <div className="d-flex justify-content-center align-items-center mb-4">
                        {/* <Form.Check type="checkbox">
                          <FormCheck.Input id="defaultCheck5" className="me-2" />
                          <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                        </Form.Check> */}
                        <Card.Link className="small">Forget password?</Card.Link>
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Sign in
                    </Button>
                  </Form>
  
                  {/* <div className="mt-3 mb-4 text-center">
                    <span className="fw-normal">or login with</span>
                  </div>
                  <div className="d-flex justify-content-center my-4">
                    <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                      <FontAwesomeIcon icon={faFacebookF} />
                    </Button>
                    <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                      <FontAwesomeIcon icon={faTwitter} />
                    </Button>
                    <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                      <FontAwesomeIcon icon={faGithub} />
                    </Button>
                  </div> */}
                  {/* <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Not registered?
                      <Card.Link as={Link} to={Routes.Signup.path} className="fw-bold">
                        {` Create account `}
                      </Card.Link>
                    </span>
                  </div> */}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }
};

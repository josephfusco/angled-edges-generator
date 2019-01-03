import React, { Component } from 'react';
import history from '../history';
import queryString from 'query-string';
import AngledEdge, { HypotenuseOptions } from 'components/AngledEdge';
import ColorPicker from 'components/ColorPicker';
import styled from 'styled-components';

import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Icon,
  InputNumber,
  Menu,
  Row,
  Slider,
  Radio
} from 'antd';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls: {
        angle     : 10,
        fluid     : false,
        hypotenuse: 'lower-left',
        height    : 200,
        width     : 800,
        fillTop   : 'rgba(234,50,23,1.0)',
        fillShape : 'rgba(234,50,23,1.0)',
        fillBottom: 'rgba(239,239,239,1.0)'
      }
    };
  }

  componentDidMount() {
    this.updateStateFromQueryString();
  }

  updateStateFromQueryString = () => {
    const params = queryString.parse(this.props.location.search);
    const updated = { ...this.state.controls, ...params };
    const allowed = Object.keys(this.state.controls);

    const filtered = Object.keys(updated)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        const type = typeof this.state.controls[key];
        if ('boolean' === type) {
          obj[key] = 'true' === updated[key];
        } else if ('number' === type) {
          obj[key] = parseInt(updated[key]);
        } else {
          obj[key] = updated[key];
        }
        return obj;
      }, {});

    this.setState({
      controls: filtered
    });
  };

  handleChange = (name, value) => {
    console.log(name, value);
    this.setState({
      controls: {
        ...this.state.controls,
        [name]: value
      }
    });
  };

  handleChangeAndUpdate = async (name, value) => {
    console.log(name, value);
    await this.setState({
      controls: {
        ...this.state.controls,
        [name]: value
      }
    });

    await history.push(
      `/?${queryString.stringify(this.state.controls, {
        encode: false
      })}`
    );
  };

  render() {
    const { controls } = this.state;
    const hypotenuseMenu = (
      <Menu onClick={e => this.handleChangeAndUpdate('hypotenuse', e.key)}>
        {HypotenuseOptions.map(option => (
          <Menu.Item key={option.value}>{option.value}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <SectionTop fill={controls.fillTop}>
          <Title>Angled Edges Generator</Title>
          <Subtitle>
            Create angled edges on sections
            <br />
            by dynamically encoding SVGs.
          </Subtitle>
        </SectionTop>
        <AngledEdge
          angle={controls.fluid ? null : controls.angle}
          fill={controls.fillShape}
          height={!controls.fluid ? null : controls.height}
          hypotenuse={controls.hypotenuse}
          width={controls.fluid ? null : controls.width}
        />
        <SectionBottom fill={controls.fillBottom}>
          <Controls>
            <Form layout="horizontal">
              <Row>
                <Col sm={24} md={10}>
                  <Form.Item>
                    <ColorPicker
                      fill={controls.fillTop}
                      label="top section color:"
                      onChange={e => this.handleChange('fillTop', e)}
                      onChangeComplete={e =>
                        this.handleChangeAndUpdate('fillTop', e)
                      }
                    />
                    <ColorPicker
                      fill={controls.fillBottom}
                      label="bottom section color:"
                      onChange={e => this.handleChange('fillBottom', e)}
                      onChangeComplete={e =>
                        this.handleChangeAndUpdate('fillBottom', e)
                      }
                    />
                    <Radio.Group
                      defaultValue="a"
                      buttonStyle="solid"
                      onChange={e =>
                        this.handleChangeAndUpdate('fillShape', e.target.value)
                      }
                    >
                      shape color:
                      <Radio.Button
                        style={{ marginLeft: 8, fontSize: 12 }}
                        value={controls.fillTop}
                      >
                        from top
                        <Color fill={controls.fillTop} />
                      </Radio.Button>
                      <Radio.Button
                        style={{ fontSize: 12 }}
                        value={controls.fillBottom}
                      >
                        from bottom
                        <Color fill={controls.fillBottom} />
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col sm={24} md={7}>
                  <Form.Item>
                    <label>
                      fluid width:
                      <Checkbox
                        checked={controls.fluid}
                        onChange={e =>
                          this.handleChangeAndUpdate('fluid', e.target.checked)
                        }
                        style={{ marginLeft: 8 }}
                      />
                    </label>
                    <div>
                      <Dropdown
                        onChange={e =>
                          this.handleChangeAndUpdate(
                            'hypotenuse',
                            e.target.value
                          )
                        }
                        overlay={hypotenuseMenu}
                        trigger={['click']}
                      >
                        <div style={{ minWidth: '20rem' }}>
                          hypotenuse:
                          <Button style={{ marginLeft: 8 }}>
                            {controls.hypotenuse}
                            <Icon type="down" />
                          </Button>
                        </div>
                      </Dropdown>
                    </div>
                  </Form.Item>
                </Col>
                <Col sm={24} md={7}>
                  <Form.Item>
                    {!controls.fluid && (
                      <Row>
                        <Col span={4}>angle:</Col>
                        <Col span={12}>
                          <Slider
                            disabled={controls.fluid}
                            max={45}
                            min={1}
                            onAfterChange={e =>
                              this.handleChangeAndUpdate('angle', e)
                            }
                            onChange={e => this.handleChange('angle', e)}
                            style={{ marginLeft: 16 }}
                            value={controls.angle}
                          />
                        </Col>
                        <Col span={4}>
                          <InputNumber
                            disabled={controls.fluid}
                            max={45}
                            min={1}
                            onChange={e =>
                              this.handleChangeAndUpdate('angle', e)
                            }
                            style={{
                              marginLeft: 8,
                              width     : '100%',
                              minWidth  : 70
                            }}
                            value={controls.angle}
                          />
                        </Col>
                      </Row>
                    )}
                    {!controls.fluid && (
                      <Row>
                        <Col span={4}>width:</Col>
                        <Col span={12}>
                          <Slider
                            disabled={controls.fluid}
                            max={2500}
                            min={0}
                            onAfterChange={e =>
                              this.handleChangeAndUpdate('width', e)
                            }
                            onChange={e => this.handleChange('width', e)}
                            step={10}
                            style={{ marginLeft: 16 }}
                            value={controls.width}
                          />
                        </Col>
                        <Col span={4}>
                          <InputNumber
                            disabled={controls.fluid}
                            max={2500}
                            min={0}
                            onChange={e =>
                              this.handleChangeAndUpdate('width', e)
                            }
                            style={{
                              marginLeft: 8,
                              width     : '100%',
                              minWidth  : 70
                            }}
                            value={controls.width}
                          />
                        </Col>
                      </Row>
                    )}
                    {controls.fluid && (
                      <Row>
                        <Col span={4}>height:</Col>
                        <Col span={12}>
                          <Slider
                            disabled={!controls.fluid}
                            max={500}
                            min={0}
                            onAfterChange={e =>
                              this.handleChangeAndUpdate('height', e)
                            }
                            onChange={e => this.handleChange('height', e)}
                            step={10}
                            style={{ marginLeft: 16 }}
                            value={controls.height}
                          />
                        </Col>
                        <Col span={4}>
                          <InputNumber
                            disabled={!controls.fluid}
                            max={500}
                            min={0}
                            onChange={e =>
                              this.handleChangeAndUpdate('height', e)
                            }
                            style={{
                              marginLeft: 8,
                              width     : '100%',
                              minWidth  : 70
                            }}
                            value={controls.height}
                          />
                        </Col>
                      </Row>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <AngledEdge
                  codeSnippet
                  angle={controls.fluid ? null : controls.angle}
                  fill={controls.fillShape}
                  height={!controls.fluid ? null : controls.height}
                  hypotenuse={controls.hypotenuse}
                  width={controls.fluid ? null : controls.width}
                />
              </Row>
            </Form>
          </Controls>
        </SectionBottom>
      </div>
    );
  }
}

const Title = styled.h1`
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 3em;
  font-weight: bold;
  line-height: 1.3;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  line-height: 1.3;
  text-align: center;
`;

const Controls = styled.div`
  width: 100rem;
  max-width: 100%;
  position: relative;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 2;
  margin: 0 auto;

  > form {
    padding: 1rem;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0px 10px 40px 0px rgba(47, 47, 47, 0.1);
  }
`;

const SectionTop = styled.div`
  background-color: ${props => props.fill};
  height: 20rem;
  padding-top: 2.5rem;
`;

const SectionBottom = styled.div`
  min-height: 20rem;
  background-color: ${props => props.fill};
  padding-top: 15rem;
`;

const Color = styled.span`
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
  border-radius: 50px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.fill};
`;

export default App;

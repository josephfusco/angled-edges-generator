import React, { Component } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';

class ColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false
    };
  }

  handleChange = value => {
    this.props.onChange(value);
  };

  handleChangeComplete = value => {
    this.props.onChangeComplete(value);
  };

  toggleColorPicker = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  closeColorPicker = () => {
    this.setState({ displayColorPicker: false });
  };

  render() {
    return (
      <div>
        {this.props.label}
        <Swatch
          onClick={() => this.toggleColorPicker()}
          style={{ marginLeft: 8 }}
        >
          <Color fill={this.props.fill} />
        </Swatch>
        {this.state.displayColorPicker ? (
          <Popover>
            <Cover onClick={() => this.closeColorPicker()} />
            <ChromePicker
              color={this.props.fill}
              onChange={({ rgb }) =>
                this.handleChange(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`)
              }
              onChangeComplete={({ rgb }) =>
                this.handleChangeComplete(
                  `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`
                )
              }
            />
          </Popover>
        ) : null}
      </div>
    );
  }
}

const Popover = styled.div`
  position: absolute;
  z-index: 2;
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Swatch = styled.div`
  padding: 5px;
  background-color: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
`;

const Color = styled.div`
  width: 36px;
  height: 14px;
  border-radius: 2px;
  background-color: ${props => props.fill};
`;

export default ColorPicker;

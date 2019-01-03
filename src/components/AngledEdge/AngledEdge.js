import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import tinycolor from 'tinycolor2';
import CodeArea from './components/CodeArea';

const propTypes = {
  hypotenuse: PropTypes.oneOf([
    'upper-left',
    'upper-right',
    'lower-left',
    'lower-right'
  ]).isRequired,
  fill  : PropTypes.string.isRequired,
  height: PropTypes.number,
  width : PropTypes.number,
  angle : PropTypes.number
};

const getBackgroundData = svg => {
  let encodedSVG = '';

  encodedSVG = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  encodedSVG = encodedSVG.replace('%', '%25');
  encodedSVG = encodedSVG.replace(/"/g, "'");
  encodedSVG = encodedSVG.replace(/</g, '%3C');
  encodedSVG = encodedSVG.replace(/>/g, '%3E');

  return `data:image/svg+xml,${encodedSVG}`;
};

const drawWedge = (hypotenuse, fill, height, width) => {
  const color = tinycolor(fill);
  const fillRGB = `rgb(${color._r},${color._g},${color._b})`;
  const fillAlpha = color._a;
  let points = {};
  let wedge = '';

  if (null === width) {
    // Full width shape - angle changes at different screen resolutions.
    points = {
      'upper-left' : `0,${height} 100,${height} 100,0`,
      'upper-right': `0,${height} 100,${height} 0,0`,
      'lower-left' : `0,0 100,${height} 100,0`,
      'lower-right': `0,0 100,0 0,${height}`
    };

    // Raw SVG markup for the colored wedge.
    wedge = `<svg preserveAspectRatio="none" viewBox="0 0 100 ${height}" fill="${fillRGB}" fill-opacity="${fillAlpha}"><polygon points="${
      points[hypotenuse]
    }"></polygon></svg>`;
  } else {
    // Fixed width shape - angle does not change.
    points = {
      'upper-left' : `0,${height} ${width},${height} ${width},0`,
      'upper-right': `0,${height} ${width},${height} 0,0`,
      'lower-left' : `0,0 ${width},${height} ${width},0`,
      'lower-right': `0,0 ${width},0 0,${height}`
    };

    // Raw SVG markup for the colored wedge.
    wedge = `<svg width="${width}" height="${height}" fill="${fillRGB}" fill-opacity="${fillAlpha}"><polygon points="${
      points[hypotenuse]
    }"></polygon></svg>`;
  }

  return getBackgroundData(wedge);
};

const getPosition = (hypotenuse, height) => {
  switch (hypotenuse) {
    case 'upper-left': {
      return `-${Math.round(height)}`;
    }
    case 'upper-right': {
      return `-${Math.round(height)}`;
    }
    case 'lower-left': {
      return 0;
    }
    case 'lower-right': {
      return 0;
    }
    default: {
      break;
    }
  }
};

const getTanFromDegrees = degrees => {
  return Math.tan((degrees * Math.PI) / 180);
};

const AngledEdge = ({
  angle,
  hypotenuse,
  fill,
  height = 100,
  width = null,
  codeSnippet = false
}) => {
  if (angle && (width !== null && width !== undefined && width !== 0)) {
    height = Math.round(getTanFromDegrees(angle) * width);
  }

  const wedge = drawWedge(hypotenuse, fill, height, width);
  const position = getPosition(hypotenuse, height);
  const styleData = (
    <CodeArea
      code={`.example-class {
  position: relative;
}
.example-class::before {
  position: absolute;
  pointer-events: none;
  background-image: url("${wedge}");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: ${!width && '100% 100%'};
  content: '';
  height: ${Math.round(height)}px;
  top: ${position}px;
  right: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}`}
    />
  );

  return codeSnippet ? (
    styleData
  ) : (
    <ShapeContainer>
      <Shape position={position} wedge={wedge} height={height} width={width} />
    </ShapeContainer>
  );
};

const ShapeContainer = styled.div`
  position: relative;
`;

const Shape = styled.div`
  position: absolute;
  pointer-events: none;
  background-image: url("${props => props.wedge}");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: ${props => !props.width && '100% 100%'};
  content: '';
  /* Round height in order to fix subpixel rendering in webkit browsers. */
  height: ${props => Math.round(props.height)}px;
  top: ${props => props.position}px;
  right: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  overflow: hidden;
`;

export const HypotenuseOptions = [
  {
    label: 'Upper Left',
    value: 'upper-left'
  },
  {
    label: 'Upper Right',
    value: 'upper-right'
  },
  {
    label: 'Lower Left',
    value: 'lower-left'
  },
  {
    label: 'Lower Right',
    value: 'lower-right'
  }
];

AngledEdge.propTypes = propTypes;

export default AngledEdge;

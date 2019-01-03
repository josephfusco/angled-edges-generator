import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/styles/hljs';

const CodeArea = ({ code }) => {
  return (
    <div style={{ fontSize: '0.8em' }}>
      <SyntaxHighlighter language="scss" style={github}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeArea;

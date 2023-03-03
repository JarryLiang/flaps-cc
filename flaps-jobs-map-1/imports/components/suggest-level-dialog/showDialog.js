import React from 'react';
import ReactDOM from 'react-dom';


import * as _Modal from 'antd/lib/modal/Modal.js';


let lastZ = 1000;

export default function showDialog(Component, config) {
  const {
    onOK, onCancel, parent, ...rest
  } = config;


  const div = document.createElement('div');
  document.body.appendChild(div);
  div.style.zIndex = 9000;

  /*
  if (parent) {
    parent.appendChild(div);
  } else {

  }*/

  const currentConfig = {
    ...rest,
    close,
    visible: true,
    onCancel: () => {
      if (onCancel) {
        onCancel();
      }

      close();
    },
    onOK: (value) => {
      if(onOK){
        onOK(value);
      }
      close();
    },
  };

  function close() {
    const newConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy,
    };
    render(newConfig);
  }

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);

    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    for (let i = 0; i < _Modal.destroyFns.length; i++) {
      const fn = _Modal.destroyFns[i];
      if (fn === close) {
        _Modal.destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function render(props) {
    ReactDOM.render(React.createElement(Component, props), div);
  }

  render(currentConfig);

  _Modal.destroyFns.push(close);

  return {
    destroy: close,
  };
}

import React from 'react';
import { Modal} from "antd";
import {StringUtils} from "/imports/utils/string";




class CommonDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {


    };
  }

  onCancel = () => {
    const {
      onCancel,
    } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const {
      visible, children, width, title, padding, closable,
    } = this.props;
    if (!visible) {
      return null;
    }

    const bodyStyle = {
      padding: 0,
    };

    if (padding) {
      bodyStyle.padding = padding;
    }

    let titleFix = title;
    if (closable) {
      if (StringUtils.isBlank(title)) {
        titleFix = 'Dialog';
      }
    }
    return (
      <Modal
        title={titleFix}
        footer={null}
        visible={visible}
        closable={closable}
        width={width || 800}
        bodyStyle={bodyStyle}
        onCancel={this.onCancel}
      >
        {children}
      </Modal>
    );
  }
}

export default CommonDialog;
CommonDialog.defaultProps = {
  closable: false,
};

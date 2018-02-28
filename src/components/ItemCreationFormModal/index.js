import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Modal, InputNumber, Icon, Upload, message } from 'antd';
import MyBraftEditor from '../../components/MyBraftEditor';

// eslint-disable-next-line
const FormItem = Form.Item;

function beforeUpload(file) {
  // const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不可以超过2m');
  }
  return isLt2M;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


@Form.create()
export default class ItemCreationFormModal extends PureComponent {
  state = {
    loading: false,
    imageUrl: null,
  }
  uploadChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    // console.log(info.file.response);
    const finishFn = (url, path) => {
      // console.log('finish:', url, ' path:', path);
      this.imagePathChange(path);
      this.setState({
        imageUrl: url,
        loading: false,
      });
    };

    if (info.file.status === 'error') {
      // 如果为本地开发 我们就认为它成功了
      if (location.hostname === 'localhost') {
        getBase64(info.file.originFileObj, url => finishFn(url, 'newImagePath'));
        return;
      }
      this.setState({
        loading: false,
      });
      message.error('似乎文件上传发生了点问题，请稍候重试。');
      return;
    }
    if (info.file.status === 'done') {
      // 我们判断一下如果是来自 faker的伪实现 那么我们就伪造结果
      // 反之就使用正常结果
      if (info.file.response.id && !info.file.response.path) {
        getBase64(info.file.originFileObj, url => finishFn(url, 'newImagePath'));
      } else {
        // eslint-disable-next-line
        const { thumbnail_url, path } = info.file.response;
        finishFn(thumbnail_url, path);
      }
    }
  }
  imagePathChange= (value) => {
    // const { form } = this.props;
    // form.setFieldsValue({
    //   imagePath: value,
    // });
    // this.imagePath = value;
    this.setState({
      imagePath: value,
    });
  }
  richHtmlChange = (value) => {
    this.setState({
      richDescription: value,
    });
  }
  ok = () => {
    const { onOk, form } = this.props;
    if (!this.state.imagePath) {
      message.warn('请上传图片');
      return;
    }
    if (!this.state.richDescription) {
      message.warn('请详细描述这个项目');
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onOk({
        ...fieldsValue,
        imagePath: this.state.imagePath,
        richDescription: this.state.richDescription,
      });
    });
  }

  render() {
    // 这里渲染上传组件
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );
    const upload = (
      <Upload
        accept="image/*"
        name="file"
        listType="picture-card"
        // className={styles.upload}
        showUploadList={false}
        // action="//jsonplaceholder.typicode.com/posts/"
        withCredentials
        action="/_resourceUpload/jQueryFileUpload"
        beforeUpload={beforeUpload}
        onChange={this.uploadChange}
      >
        {imageUrl ? <img alt="上传的图片" width={250} src={imageUrl} /> : uploadButton}
      </Upload>
    );
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        {...this.props}
        onOk={this.ok}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem
                required="true"
                label="项目名称"
                style={{
                  width: '100%',
                }}
                wrapperCol={{
                  span: 16,
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      min: 2,
                      message: '必须输入项目名称',
                    }],
                })(
                  <Input placeholder="请输入项目名称" />
                  )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                required="true"
                label="项目类型"
                style={{
                  width: '100%',
                }}
                wrapperCol={{
                  span: 16,
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('itemType', {
                  rules: [
                    {
                      required: true,
                      min: 2,
                      message: '必须输入项目类型',
                    }],
                })(
                  <Input placeholder="请输入项目类型" />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem
                required="true"
                label="结算价"
                style={{
                  width: '100%',
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('costPrice', {
                  rules: [
                    {
                      required: true,
                      message: '必须输入有效的结算价',
                    }],
                })(
                  <InputNumber min={0} step={0.01} />
                  )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                required="true"
                label="销售价"
                style={{
                  width: '100%',
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('salesPrice', {
                  rules: [
                    {
                      required: true,
                      message: '必须输入有效的销售价',
                    }],
                })(
                  <InputNumber min={0} step={0.01} />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem
                required="true"
                label="原价"
                style={{
                  width: '100%',
                }}
                labelCol={{
                  span: 8,
                }}
              >
                {getFieldDecorator('price', {
                  rules: [
                    {
                      required: true,
                      message: '必须输入有效的原价',
                    }],
                })(
                  <InputNumber min={0} step={0.01} />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
            <Col span={24}>
              <FormItem
                required="true"
                label="图片"
                style={{
                  width: '100%',
                }}
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 20,
                }}
              >
                {upload}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, sm: 16, lg: 24, xl: 48 }}>
            <Col span={24}>
              <FormItem
                required="true"
                label="简述"
                style={{
                  width: '100%',
                }}
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 20,
                }}
              >
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      min: 3,
                      message: '必须输入简述',
                    }],
                })(
                  <Input placeholder="请输入简述" />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={24}>
              <FormItem
                required="true"
              >
                {/* {getFieldDecorator('richDescription', {
                  rules: [
                    {
                      required: true,
                      min: 8,
                      message: '必须输入富文本',
                    }],
                })} */}
                <MyBraftEditor
                  onHTMLChange={this.richHtmlChange}
                  value={this.state.richDescription}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

import BraftEditor from 'braft-editor';
import React, { PureComponent } from 'react';
import 'braft-editor/dist/braft.css';
import { deleteProperty } from '../utils/utils';

// export const my = options => (Editor) => {
//   console.log(options);
//   return <Editor />;
// };

// const MyBraftEditor = my()(BraftEditor);
// export default MyBraftEditor;
// https://github.com/margox/braft-editor
export default class MyBraftEditor extends PureComponent {
    validateFn = (file) => {
      // 支持 maxSize
      const { maxSize = 1024 * 1024 * 2 } = this.props;
      return file.size < maxSize;
    }
    // https://github.com/margox/braft-editor#mediauploadfnparam-object
    uploadFn = ({ file, progress, success, error }) => {
      // 声明一个xhr
      const xhr = new XMLHttpRequest();

      const successFn = (response) => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        // console.log(response);
        if (response.total === 0) {
          errorFn(response);
          return;
        }
        // console.log({
        //   path: xhr.responseText,
        //   url: xhr.getResponseHeader('Location'),
        // });
        // url 是
        success({
        //   path: xhr.responseText,
          url: JSON.parse(xhr.responseText).location,
        });
      };

      const errorFn = () => {
        // 上传发生错误时调用param.error
        error({
          msg: `unable to upload. with: ${xhr.responseText}`,
        });
      };

      const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        progress((event.loaded / event.total) * 100);
      };


      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);

      const fd = new FormData();
      //   console.log(file);
      fd.append('file', file);
      xhr.open('POST', '/_resourceUpload/tinyImage', true);
      xhr.send(fd);
    }
    render() {
      const to = deleteProperty(this.props, ['maxSize']);
      return (
        <BraftEditor
          {...to}
          media={{
                    validateFn: this.validateFn,
                    uploadFn: this.uploadFn,
                }}
        />
      );
    }
}

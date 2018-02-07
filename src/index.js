import dva from 'dva';
import '@babel/polyfill';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './index.less';
import onError from './utils/error';

// 1. Initialize
const app = dva({
  onError,
});
// 可以通过onError传入错误处理器

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
FastClick.attach(document.body);

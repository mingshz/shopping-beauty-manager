# 标准后台
## 技术介绍
采用dva作为基本架构技术，使用定制版的roadhog作为打包和测试工具，它可以支持在线api的直接mock。

界面上采用了ant desgin作为主要组件来源。
## 文件介绍
* public 存放直接打包到dist的文件
* src/assets  可在应用中使用的资源
* src/common 基本文件，包括基础路由和菜单
* src/components 纯组件
* src/layouts 布局，主要2种；需登录布局LoginLayout, 基本布局
* src/models dva核心model
* src/routes 页面逻辑
* src/services 面向服务端的接口服务
* src/utils 工具类
* src/index.ejs html页面的构建模板
* src/index.js 应用入口
* src/index.less 页面样式
* src/router.js 路由器入口
* src/theme.js 应用主题
* tests 测试相关辅助文件
* .api.mock.js local-api-mocker相关的配置文件
* .eslintrc eslint配置文件
* .webpackrc webpack打包配置文件
* jsonconfig.json 就干了一个事儿，允许使用装饰器@
* package.json ...

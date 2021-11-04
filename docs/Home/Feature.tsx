import React from 'react';
import './less/feature.css';

class Feature extends React.PureComponent {
  render() {
    return (
      <div className="feature">
        <h1 className="feature-title">特别感谢</h1>
        <p>
          本站点参考了<a href="https://d.umijs.org/">dumi</a>以及
          <a href="https://landing.ant.design/docs/use/dumi-cn">
            Antd Design Landing
          </a>
          得以实现
        </p>
        <p>我们只是代码的搬运工</p>
      </div>
    );
  }
}

export default Feature;

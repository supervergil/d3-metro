## 这个库是做什么的

用这个库可以很方便地制作一张地铁图，并且带有一些酷炫的特效。

## 如何使用

### 使用npm安装

```
npm install d3-metro
```

```javascript
import Metro from 'd3-metro';

const metro = new Metro({
  id: '#app',
  origin: {
    width: 3840,
    height: 2160
  },
  data: testData
});
```


### 使用script标签引入 (具体看example文件夹)

```javascript
<script src="path/to/metro.js"></script>

var metro = new Metro({
  id: '#app',
  origin: {
    width: 3840,
    height: 2160
  },
  data: testData
});
```

备注: testData的结构请查看 /example/data.js 文件

具体原理请查看:[https://www.zhangyangjun.com/post/use-svg-draw-metro-basic.html](https://www.zhangyangjun.com/post/use-svg-draw-metro-basic.html)
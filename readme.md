## What does this library do

For Generating Metro Map Easier.

## How To Use

### use npm

```
npm install d3-metro
```

```html
<svg id="app" width="100%" height="100%" style="margin: 0;padding: 0;cursor: move"></svg>
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


### use script tag (see example dir)

```html
<script src="path/to/metro.js"></script>

<svg id="app" width="100%" height="100%" style="margin: 0;padding: 0;cursor: move"></svg>

<script>
  var metro = new Metro({
    id: '#app',
    origin: {
      width: 3840,
      height: 2160
    },
    data: testData
  })
</script>
```

note: see testData structure in /example/data.js

see mechanism:[https://www.zhangyangjun.com/post/use-svg-draw-metro-basic.html](https://www.zhangyangjun.com/post/use-svg-draw-metro-basic.html)

[中文文档](./readme-zh.md)
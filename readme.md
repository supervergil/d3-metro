## What does this library do

For Generating Metro Map Easier.

## How To Use

### use npm

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


### use script tag (see example dir)

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

note: see testData structure in /example/data.js

[中文文档](./readme-zh.md)
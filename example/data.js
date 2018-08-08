var testData = {
  lines: [{
    id: 'line1',
    name: '1号线',
    color: '#e999c0',
    width: 8,
    running: true,
    points: [
      [{
        x: 1260,
        y: 571
      }, {
        x: 1488,
        y: 571
      }, {
        x: 1615,
        y: 698
      }, {
        x: 1864,
        y: 698
      }, {
        x: 1864,
        y: 911
      }, {
        x: 1920,
        y: 966
      }, {
        x: 1920,
        y: 1157
      }]
    ]
  }, {
    id: 'line2',
    name: '2号线',
    color: '#8cc220',
    width: 8,
    running: true,
    points: [
      [{
        x: 1120,
        y: 778
      }, {
        x: 1627,
        y: 778
      }, {
        x: 1706,
        y: 857
      }, {
        x: 2165,
        y: 857
      }, {
        x: 2350,
        y: 1043
      }, {
        x: 2350,
        y: 1200
      }, {
        x: 2669,
        y: 1200
      }, {
        x: 2669,
        y: 1350
      }]
    ]
  }, {
    id: 'line3',
    name: '3号线',
    color: '#c6afd4',
    width: 8,
    running: true,
    points: [
      [{
        x: 1189,
        y: 787
      }, {
        x: 1288,
        y: 787
      }, {
        x: 1306,
        y: 931
      }],
      [{
        x: 1125,
        y: 931
      }, {
        x: 1875,
        y: 931
      }, {
        x: 1914,
        y: 970
      }, {
        x: 2043,
        y: 970
      }, {
        x: 2043,
        y: 774
      }, {
        x: 2303,
        y: 513
      }, {
        x: 2303,
        y: 324
      }]
    ]
  }],
  stations: [
    //1号线
    {
      id: 'station1',
      name: '金运路',
      type: 1,
      x: 1260,
      y: 571,
      status: 'normal',
      rotation: 0
    }, {
      id: 'station2',
      name: '金沙江西路',
      type: 1,
      x: 1316,
      y: 571,
      status: 'normal',
      rotation: 0
    }, {
      id: 'station3',
      name: '丰庄',
      type: 1,
      x: 1374,
      y: 571,
      status: 'normal',
      rotation: 0
    }, {
      id: 'station4',
      name: '金沙江西路',
      type: 1,
      x: 1429,
      y: 571,
      status: 'normal',
      rotation: 0
    }, {
      id: 'station5',
      name: '金沙江西路',
      type: 1,
      x: 1487,
      y: 571,
      status: 'normal',
      rotation: 0
    }
  ]
}

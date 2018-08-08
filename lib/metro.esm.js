import * as d3 from "d3"

var config = {
  bgColor: '#12222c',
  normalColor: 'green',
  dangerColor: '#941532',
  exColor: 'blue',
  noRunningColor: '#666',
  WARNING_I: 'warning',
  WARNING_II: 'warning2',
  WARNING_III: 'warning3',
  NOP: 'nop',
  stationR: 3,
  stationRX: 6,
  tailDelay: 0.6,
  tailTime: 5,
  tailRandomTime: 4,
  launchDuration: 3
};

var LightenDarkenColor = function(col, amt) {
  var usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  var b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  var g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};


var Metro = function(info) {

  var self = this;

  // 容器id
  this.containerId = info.id;
  // 容器对象
  this.container = d3.select(info.id);
  // 对象组
  this.group = this.container.append("g");
  // 特效对象组
  this.effectGroup = this.group.append("g");
  // 原始底图参数
  this.origin = info.origin;
  // 地铁数据
  this.data = info.data;
  // 当前容器宽高
  this.containerWidth = this.container.node().getBoundingClientRect().width;
  this.containerHeight = this.container.node().getBoundingClientRect().height;
  // 当前地图的缩放参数
  this.scale = 1;
  this.offsetX = 0;
  this.offsetY = 0;
  // 所有动效的timer数组
  this.timers = [];
  // 列车发动flag
  this.launchFlag = false;

  this.test = 0;

  // 特效声明

  // 径向渐变
  this.radialGradient = this.group
    .append('defs')
    .append("radialGradient")
    .attr('id', 'radial')
    .attr('fx', '50%')
    .attr('fy', '50%')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%')

  this.radialGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', config.dangerColor)
    .attr('stop-opacity', 0)

  this.radialGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', config.dangerColor)
    .attr('stop-opacity', 1)


  // 缩放事件
  this.zoom = d3.zoom().scaleExtent([0.1, 100]).on("zoom", function() {
    self.group.attr("transform", d3.event.transform);
    self.scale = d3.event.transform.k;
    self.offsetX = d3.event.transform.x;
    self.offsetY = d3.event.transform.y;
  });

  // 缩放事件对象
  this.groupEvent = this.container.call(this.zoom);

  // 自适应
  this.fit();

  // 渲染地铁
  this.render();

};

// 自适应算法
Metro.prototype.fit = function() {
  var scaleW = this.containerWidth / this.origin.width;
  var scaleH = this.containerHeight / this.origin.height;
  var scale = (scaleW <= scaleH) ? scaleW : scaleH;
  this.scaleTo(scale);
};

// 缩放
Metro.prototype.scaleTo = function(scale) {
  this.scale = scale;
  this.offsetX = (this.containerWidth - this.origin.width * scale) * 0.5;
  this.offsetY = (this.containerHeight - this.origin.height * scale) * 0.5;
  this.groupEvent.transition().duration(400).call(this.zoom.transform, d3.zoomIdentity.translate(this.offsetX, this.offsetY).scale(scale));
};


// 渲染函数
Metro.prototype.render = function() {

  var self = this;

  // 清空所有动画事件
  for (var key in this.timers) {
    if (this.timers[key]) {
      this.timers[key].stop()
      this.timers[key] = null
    }
  }
  this.timers = []


  // 移除 所有地铁线路 | 曳尾效果
  this.group.selectAll('path').remove();
  // 移除所有站点的点击事件
  this.group.selectAll('g').selectAll('circle').on('click', null);
  // 移除所有站点
  this.group.selectAll('g').remove();
  // 移除所有移动的圆点
  this.group.selectAll('circle').remove();


  var stationLines = this.data.lines;
  var stations = this.data.stations;

  // 渲染前调整所有线路的z-index (active最后渲染)
  stationLines.sort(function(a, b) {
    if (!!a.active) {
      return 1
    } else {
      return -1
    }
  });

  // 渲染线路
  stationLines.forEach(function(item) {

    var groupPath = self.group.append("path");

    // 根据关键点，绘制折线
    var path = d3.path()
    var points = item.points
    points.forEach(function(line) {
      line.forEach(function(p, index) {
        if (index === 0) {
          path.moveTo(p.x, p.y)
        } else {
          path.lineTo(p.x, p.y)
        }
      })
    });

    // 将折线路径写入group
    groupPath
      .attr('stroke-width', item.width)
      .attr('fill', 'transparent')
      .attr('stroke', item.color)
      .attr("d", path.toString())
      .attr("stroke-linecap", "round");

    // 如果线路激活
    if (!!item.active) {
      groupPath.transition().duration(400).attr('stroke-width', item.width * 2)
    }

    // 对于没有运行的线路，将其渲染成灰色
    if (!item.running) {
      groupPath.attr('stroke', config.noRunningColor)
    }

  });




  // 渲染站点

  // 创建一个group用来放置站点
  var groupCircle = this.group.append('g')
  var shape = null;


  // 渲染站点状态特效
  stations.forEach(function(circle) {

    if (circle.status === config.WARNING_I || circle.status === config.WARNING_II) {

      var statusCircle = groupCircle.append("circle")
        .attr("cx", circle.x)
        .attr("cy", circle.y)
        .attr("r", config.stationR)
        .style("fill", 'url(#radial)');
      var t = d3.timer(function(elapsed) {
        statusCircle
          .attr("r", 3 + elapsed % 1000 / 20)
          .style("opacity", 1 - elapsed % 1000 / 1000)
      }, 30);
      self.timers.push(t)

    }

  });


  stations.forEach(function(circle) {

    // 渲染不同站点类型
    switch (circle.type) {
      case 1: // 非集中站
        shape = groupCircle.append("circle")
          .attr("cx", circle.x)
          .attr("cy", circle.y)
          .attr("r", config.stationR)
          .style("stroke", config.normalColor)
          .style("fill", config.bgColor)
          .style("cursor", "pointer")
        if (circle.status === config.WARNING_I || circle.status === config.WARNING_II) {
          shape.style("stroke", config.dangerColor)
        }
        if (circle.status === config.WARNING_III) {
          shape.style("stroke", config.exColor)
        }
        if (circle.status === config.NOP) {
          shape.style("stroke", config.noRunningColor)
        }
        break;
      case 2: // 集中站
        shape = groupCircle.append("g")
          .attr("transform", "translate(" + circle.x + "," + circle.y + ")")
          .style("cursor", "pointer");

        var c1 = shape.append("circle")
          .attr("r", config.stationRX * 2)
          .style("fill", config.bgColor)
          .style("stroke", config.normalColor);

        var c2 = shape.append("circle")
          .attr("r", config.stationRX)
          .style("fill", config.normalColor);

        if (circle.status === config.WARNING_I || circle.status === config.WARNING_II) {
          c1.style("stroke", config.dangerColor)
          c2.style("fill", config.dangerColor)
        }
        if (circle.status === config.WARNING_III) {
          c1.style("stroke", config.exColor);
          c2.style("fill", config.exColor);
        }
        if (circle.status === config.NOP) {
          c1.style("stroke", config.noRunningColor);
          c2.style("fill", config.noRunningColor);
        }
        break;
    }

    shape.on('click', function() {
      self.onStationClick(circle)
    });


  });


  // 渲染列车曳尾效果

  // 特效group
  self.effectGroup = self.group.append("g");

  if (!self.launchFlag) {

    stationLines.forEach(function(item) {
      var points = item.points;
      points.forEach(function(line, index) {

        var path = d3.path()
        line.forEach(function(p, idx) {
          if (idx === 0) {
            path.moveTo(p.x, p.y)
          } else {
            path.lineTo(p.x, p.y)
          }
        });

        var count = 0;

        var launch = function() {
          if (count % 100 === 0) {
            self.launch(item, path.toString());
          }
          count++;
          setTimeout(function() {
            launch();
          }, config.launchDuration * 10);
        };

        launch();

        self.launchFlag = true;

      });

    });

  }



};

// 线路高亮
Metro.prototype.highlight = function(id) {
  this.data.lines.forEach(function(item) {
    if (item.id === id) {
      item.active = true
    }
  })
  this.render()
};

// 重置线路高亮
Metro.prototype.resetHighlight = function() {
  this.data.lines.forEach(function(item) {
    item.active = false
  })
  this.render();
};

// 更新站点状态
Metro.prototype.updateStations = function(stations) {
  for (var key in stations) {
    this.data.stations.forEach(function(item) {
      if (item.id === stations[key].id) {
        item.status = stations[key].status
      }
    })
  }
  this.render();
};

// 计算tailpath的方法
Metro.prototype.calcTailPath = function(linear, cx, cy, cx2, cy2, pathArray) {
  var self = this;
  // 判断一个点是否在两个点之间
  var isBetween = function(x, y, jx1, jy1, jx2, jy2) {
    var originLength = Math.pow(Math.pow(jx2 - jx1, 2) + Math.pow(jy2 - jy1, 2), 0.5);
    var lenth1 = Math.pow(Math.pow(x - jx1, 2) + Math.pow(y - jy1, 2), 0.5);
    var lenth2 = Math.pow(Math.pow(x - jx2, 2) + Math.pow(y - jy2, 2), 0.5);
    return Math.abs(lenth1 + lenth2 - originLength) < 5;
  };
  var pathContainer = []
  for (var key in pathArray) {
    if (key == 0) {
      continue
    }
    var pre = pathArray[key - 1]
    var cur = pathArray[key]
    pathContainer.push(pre)
    if (isBetween(cx2, cy2, pre[0], pre[1], cur[0], cur[1])) {
      pathContainer = [
        [cx2, cy2]
      ]
    }
    if (isBetween(cx, cy, pre[0], pre[1], cur[0], cur[1])) {
      pathContainer.push([cx, cy])
      break
    }
  }

  linear
    .attr('x1', pathContainer[0][0])
    .attr('y1', pathContainer[0][1])
    .attr('x2', pathContainer[pathContainer.length - 1][0])
    .attr('y2', pathContainer[pathContainer.length - 1][1])

  pathContainer.forEach(function(item) {
    return item.join(',')
  })

  return 'M' + pathContainer.join('L')
};

// 发车
Metro.prototype.launch = function(item, path) {

  var self = this;
  var pathTmp = path.substr(1);
  var pathArray = pathTmp.split('L').map(function(item) {
    return item.split(',')
  });
  var cx = +pathArray[0][0];
  var cy = +pathArray[0][1];
  var cx2 = cx;
  var cy2 = cy;
  var pointer = 1;
  var pointer2 = 1;
  var id = item.id + Math.random();
  var defs = self.effectGroup.append('defs');
  var linear = defs.append('linearGradient').attr('id', id).attr('gradientUnits', 'userSpaceOnUse')
  linear.append('stop').attr('offset', '0%').style('stop-color', item.color).style('stop-opacity', 0);
  linear.append('stop').attr('offset', '100%').style('stop-color', LightenDarkenColor(item.color, 120)).style('stop-opacity', 1);

  var isPointIn = function(currentX, currentY, stepX, stepY, pointX, pointY) {
    var len = Math.pow((Math.pow(currentX - pointX, 2) + Math.pow(currentY - pointY, 2)), 0.5);
    var len2 = Math.pow((Math.pow(currentX + stepX - pointX, 2) + Math.pow(currentY + stepY - pointY, 2)), 0.5);
    return len <= len2;
  };

  var tail = self.effectGroup.append('path');

  var t = d3.timer(function(elapsed) {
    var preX = pathArray[pointer - 1][0];
    var preY = pathArray[pointer - 1][1];
    var x = pathArray[pointer][0];
    var y = pathArray[pointer][1];
    var len = Math.pow((Math.pow(preX - x, 2) + Math.pow(preY - y, 2)), 0.5);
    var stepX = (x - preX) / len * 3;
    var stepY = (y - preY) / len * 3;
    if (isPointIn(cx + stepX, cy + stepY, stepX, stepY, x, y)) {
      if (pointer < pathArray.length - 1) {
        pointer++;
      } else {
        t.stop();
        t2.stop();
        tail.remove();
        defs.remove();
        return;
      }
    }
    cx += stepX;
    cy += stepY;
    var tailString = self.calcTailPath(linear, cx, cy, cx2, cy2, pathArray.slice(0));
    if (tailString !== 'M') {
      tail
        .attr('d', tailString)
        .attr('stroke-width', '12')
        .attr('fill', 'transparent')
        .attr('stroke-linecap', 'round')
        .attr('stroke', 'url(#' + id + ')')
    }
  });

  var t2 = d3.timer(function(elapsed) {
    var preX = pathArray[pointer2 - 1][0];
    var preY = pathArray[pointer2 - 1][1];
    var x = pathArray[pointer2][0];
    var y = pathArray[pointer2][1];
    var len = Math.pow((Math.pow(preX - x, 2) + Math.pow(preY - y, 2)), 0.5);
    var stepX = (x - preX) / len * 3;
    var stepY = (y - preY) / len * 3;
    if (isPointIn(cx2 + stepX, cy2 + stepY, stepX, stepY, x, y)) {
      if (pointer2 < pathArray.length - 1) {
        pointer2++;
      } else {
        t2.stop();
        return;
      }
    }
    cx2 += stepX;
    cy2 += stepY;

  }, config.tailDelay * 1000);

};


export default Metro

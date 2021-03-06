// Generated by CoffeeScript 1.9.2
var lodchart;

lodchart = function() {
  var additive, additive_ylab, additive_ylim, additive_yscale, additive_yticks, additivelinecolor, axispos, chart, chrGap, chrSelect, darkrect, height, lightrect, linewidth, lodcurve, lodlinecolor, lodvarname, manhattanPlot, mappingScale, margin, markerSelect, nyticks, pad4heatmap, pointcolor, pointsAtMarkers, pointsize, pointstroke, rotate_ylab, significantcolor, suggestivecolor, title, titlepos, width, xlab, xscale, ylab, ylim, yscale, yticks;
  width = 800;
  height = 500;
  margin = {
    left: 60,
    top: 40,
    right: 40,
    bottom: 40,
    inner: 5
  };
  axispos = {
    xtitle: 25,
    ytitle: 30,
    xlabel: 5,
    ylabel: 5
  };
  titlepos = 20;
  manhattanPlot = false;
  ylim = null;
  additive_ylim = null;
  nyticks = 5;
  yticks = null;
  additive_yticks = null;
  chrGap = 8;
  darkrect = "#F1F1F9";
  lightrect = "#FBFBFF";
  lodlinecolor = "darkslateblue";
  additivelinecolor_plus = "red";
  additivelinecolor_negative = "green";
  linewidth = 2;
  suggestivecolor = "gainsboro";
  significantcolor = "#EBC7C7";
  pointcolor = "#E9CFEC";
  pointsize = 0;
  pointstroke = "black";
  title = "";
  xlab = "Chromosome";
  ylab = "LRS score";
  additive_ylab = "Additive Effect";
  rotate_ylab = null;
  yscale = d3.scale.linear();
  additive_yscale = d3.scale.linear();
  xscale = null;
  pad4heatmap = false;
  lodcurve = null;
  lodvarname = null;
  markerSelect = null;
  chrSelect = null;
  pointsAtMarkers = true;
  chart = function(selection) {
    return selection.each(function(data) {
      var additive_yaxis, additivecurve, chr, curves, g, gEnter, hiddenpoints, j, k, len, len1, lodvarnum, markerpoints, markertip, redraw_plot, ref, ref1, rotate_additive_ylab, suggestive_bar, svg, titlegrp, x, xaxis, yaxis;
      if (manhattanPlot === true) {
        pointcolor = "darkslateblue";
        pointsize = 2;
      }
      lodvarname = lodvarname != null ? lodvarname : data.lodnames[0];
      data[lodvarname] = (function() {
        var j, len, ref, results;
        ref = data[lodvarname];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          x = ref[j];
          results.push(Math.abs(x));
        }
        return results;
      })();
      ylim = ylim != null ? ylim : [0, d3.max(data[lodvarname])];

      if ('additive' in data) {
        data['additive'] = (function() {
          var j, len, ref, results;
          ref = data['additive'];
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            x = ref[j];
            results.push(x);
          }
          return results;
        })();
        additive_ylim = additive_ylim != null ? additive_ylim : [0, d3.max(data['additive'])];
      }
      lodvarnum = data.lodnames.indexOf(lodvarname);
      svg = d3.select(this).selectAll("svg").data([data]);
      gEnter = svg.enter().append("svg").append("g");
      svg.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
      g = svg.select("g");
      g.append("rect").attr("x", margin.left).attr("y", margin.top).attr("height", height).attr("width", width).attr("fill", darkrect).attr("stroke", "none");
      yscale.domain(ylim).range([height + margin.top, margin.top + margin.inner]);
      yticks = yticks != null ? yticks : yscale.ticks(nyticks);
      if ('additive' in data) {
        additive_yscale.domain(additive_ylim).range([height + margin.top, margin.top + margin.inner + height / 2]);
        additive_yticks = additive_yticks != null ? additive_yticks : additive_yscale.ticks(nyticks);
      }
      reorgLodData(data, lodvarname);
      data = chrscales(data, width, chrGap, margin.left, pad4heatmap, mappingScale);
      xscale = data.xscale;
      chrSelect = g.append("g").attr("class", "chrRect").selectAll("empty").data(data.chrnames).enter().append("rect").attr("id", function(d) {
        return "chrrect" + d[0];
      }).attr("x", function(d, i) {
        if (i === 0 && pad4heatmap) {
          return data.chrStart[i];
        }
        return data.chrStart[i] - chrGap / 2;
      }).attr("width", function(d, i) {
        if ((i === 0 || i + 1 === data.chrnames.length) && pad4heatmap) {
          return data.chrEnd[i] - data.chrStart[i] + chrGap / 2;
        }
        return data.chrEnd[i] - data.chrStart[i] + chrGap;
      }).attr("y", margin.top).attr("height", height).attr("fill", function(d, i) {
        if (i % 2) {
          return darkrect;
        }
        return lightrect;
      }).attr("stroke", "none").on("click", function(d) {
        console.log("d is:", d);
        return redraw_plot(d);
      });
      xaxis = g.append("g").attr("class", "x axis");
      xaxis.selectAll("empty").data(data.chrnames).enter().append("text").text(function(d) {
        return d[0];
      }).attr("x", function(d, i) {
        return (data.chrStart[i] + data.chrEnd[i]) / 2;
      }).attr("y", margin.top + height + axispos.xlabel).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("cursor", "pointer").on("click", function(d) {
        return redraw_plot(d);
      });
      xaxis.append("text").attr("class", "title").attr("y", margin.top + height + axispos.xtitle).attr("x", margin.left + width / 2).attr("fill", "slateblue").text(xlab);
      redraw_plot = function(chr_ob) {
        var chr_plot;
        $('#topchart').remove();
        $('#chart_container').append('<div class="qtlcharts" id="topchart"></div>');
        return chr_plot = new Chr_Lod_Chart(600, 1200, chr_ob, manhattanPlot, mappingScale);
      };
      rotate_ylab = rotate_ylab != null ? rotate_ylab : ylab.length > 1;
      yaxis = g.append("g").attr("class", "y axis");
      yaxis.selectAll("empty").data(yticks).enter().append("line").attr("y1", function(d) {
        return yscale(d);
      }).attr("y2", function(d) {
        return yscale(d);
      }).attr("x1", margin.left).attr("x2", margin.left + 7).attr("fill", "none").attr("stroke", "white").attr("stroke-width", 1).style("pointer-events", "none");
      yaxis.selectAll("empty").data(yticks).enter().append("text").attr("y", function(d) {
        return yscale(d);
      }).attr("x", margin.left - axispos.ylabel).attr("fill", "blue").attr("dominant-baseline", "middle").attr("text-anchor", "end").text(function(d) {
        return formatAxis(yticks)(d);
      });
      yaxis.append("text").attr("class", "title").attr("y", margin.top + height / 2).attr("x", margin.left - axispos.ytitle).text(ylab).attr("transform", rotate_ylab ? "rotate(270," + (margin.left - axispos.ytitle) + "," + (margin.top + height / 2) + ")" : "").attr("text-anchor", "middle").attr("fill", "slateblue");
      if ('additive' in data) {
        rotate_additive_ylab = rotate_additive_ylab != null ? rotate_additive_ylab : additive_ylab.length > 1;
        additive_yaxis = g.append("g").attr("class", "y axis");
        additive_yaxis.selectAll("empty").data(additive_yticks).enter().append("line").attr("y1", function(d) {
          return additive_yscale(d);
        }).attr("y2", function(d) {
          return additive_yscale(d);
        }).attr("x1", margin.left + width).attr("x2", margin.left + width - 7).attr("fill", "none").attr("stroke", "white").attr("stroke-width", 1).style("pointer-events", "none");
        additive_yaxis.selectAll("empty").data(additive_yticks).enter().append("text").attr("y", function(d) {
          return additive_yscale(d);
        }).attr("x", function(d) {
          return margin.left + width + axispos.ylabel + 20;
        }).attr("fill", "green").attr("dominant-baseline", "middle").attr("text-anchor", "end").text(function(d) {
          return formatAxis(additive_yticks)(d);
        });
        additive_yaxis.append("text").attr("class", "title").attr("y", margin.top + 1.5 * height).attr("x", margin.left + width + axispos.ytitle).text(additive_ylab).attr("transform", rotate_additive_ylab ? "rotate(270," + (margin.left + width + axispos.ytitle) + ", " + (margin.top + height * 1.5) + ")" : "").attr("text-anchor", "middle").attr("fill", "green");
      }
      if ('suggestive' in data) {
        suggestive_bar = g.append("g").attr("class", "suggestive");
        suggestive_bar.selectAll("empty").data([data.suggestive]).enter().append("line").attr("y1", function(d) {
          return yscale(d);
        }).attr("y2", function(d) {
          return yscale(d);
        }).attr("x1", margin.left).attr("x2", margin.left + width).attr("fill", "none").attr("stroke", suggestivecolor).attr("stroke-width", 5).style("pointer-events", "none");
        suggestive_bar = g.append("g").attr("class", "significant");
        suggestive_bar.selectAll("empty").data([data.significant]).enter().append("line").attr("y1", function(d) {
          return yscale(d);
        }).attr("y2", function(d) {
          return yscale(d);
        }).attr("x1", margin.left).attr("x2", margin.left + width).attr("fill", "none").attr("stroke", significantcolor).attr("stroke-width", 5).style("pointer-events", "none");
      }
      if (manhattanPlot === false) {
        lodcurve = function(chr, lodcolumn) {
          return d3.svg.line().x(function(d) {
            return xscale[chr](d);
          }).y(function(d, i) {
            return yscale(data.lodByChr[chr][i][lodcolumn]);
          });
        };
        if ('additive' in data) {
          additivecurve = function(chr, lodcolumn) {
            if (data.additiveByChr[chr][0] < 0) {
              pos_neg = "negative"
            }
            else {
              pos_neg = "positive"
            }
            return [pos_neg, d3.svg.line().x(function(d) {
              return xscale[chr](d);
            }).y(function(d, i) {
              return additive_yscale(Math.abs(data.additiveByChr[chr][i]));
            })];
          };
        }
        curves = g.append("g").attr("id", "curves");
        ref = data.chrnames;
        for (j = 0, len = ref.length; j < len; j++) {
          chr = ref[j];
          if (chr.indexOf(data['chr'])) {
            curves.append("path").datum(data.posByChr[chr[0]]).attr("d", lodcurve(chr[0], lodvarnum)).attr("stroke", lodlinecolor).attr("fill", "none").attr("stroke-width", linewidth).style("pointer-events", "none");
          }
        }
        if ('additive' in data) {
          ref1 = data.chrnames;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            chr = ref1[k];
            if (chr.indexOf(data['chr'])) {
              if (additivecurve(chr[0], lodvarnum)[0] == "negative") {
                curves.append("path").datum(data.posByChr[chr[0]]).attr("d", additivecurve(chr[0], lodvarnum)[1]).attr("stroke", additivelinecolor_negative).attr("fill", "none").attr("stroke-width", 1).style("pointer-events", "none");
              }
              else {
                curves.append("path").datum(data.posByChr[chr[0]]).attr("d", additivecurve(chr[0], lodvarnum)[1]).attr("stroke", additivelinecolor_plus).attr("fill", "none").attr("stroke-width", 1).style("pointer-events", "none");
              }
            }
          }
        }
      }
      console.log("before pointsize");
      if (pointsize > 0) {
        console.log("pointsize > 0 !!!");
      }
      markerpoints = g.append("g").attr("id", "markerpoints_visible");
      markerpoints.selectAll("empty").data(data.markers).enter().append("circle").attr("cx", function(d) {
        return xscale[d.chr](d.pos);
      }).attr("cy", function(d) {
        return yscale(d.lod);
      }).attr("r", pointsize).attr("fill", pointcolor).attr("stroke", pointstroke).attr("pointer-events", "hidden");
      titlegrp = g.append("g").attr("class", "title").append("text").attr("x", margin.left + width / 2).attr("y", margin.top - titlepos).text(title);
      g.append("rect").attr("x", margin.left).attr("y", margin.top).attr("height", height).attr("width", function() {
        if (pad4heatmap) {
          return data.chrEnd.slice(-1)[0] - margin.left;
        }
        return data.chrEnd.slice(-1)[0] - margin.left + chrGap / 2;
      }).attr("fill", "none").attr("stroke", "black").attr("stroke-width", "none");
      if (pointsAtMarkers) {
        hiddenpoints = g.append("g").attr("id", "markerpoints_hidden");
        markertip = d3.tip().attr('class', 'd3-tip').html(function(d) {
          return [d.name, " LRS = " + (d3.format('.2f')(d.lod))];
        }).direction("e").offset([0, 10]);
        svg.call(markertip);
        return markerSelect = hiddenpoints.selectAll("empty").data(data.markers).enter().append("circle").attr("cx", function(d) {
          return xscale[d.chr](d.pos);
        }).attr("cy", function(d) {
          return yscale(d.lod);
        }).attr("id", function(d) {
          return d.name;
        }).attr("r", d3.max([pointsize * 2, 3])).attr("opacity", 0).attr("fill", pointcolor).attr("stroke", pointstroke).attr("stroke-width", "1").on("mouseover.paneltip", function(d) {
          d3.select(this).attr("opacity", 1);
          return markertip.show(d);
        }).on("mouseout.paneltip", function() {
          return d3.select(this).attr("opacity", 0).call(markertip.hide);
        });
      }
    });
  };
  chart.width = function(value) {
    if (!arguments.length) {
      return width;
    }
    width = value;
    return chart;
  };
  chart.height = function(value) {
    if (!arguments.length) {
      return height;
    }
    height = value;
    return chart;
  };
  chart.margin = function(value) {
    if (!arguments.length) {
      return margin;
    }
    margin = value;
    return chart;
  };
  chart.titlepos = function(value) {
    if (!arguments.length) {
      return titlepos;
    }
    titlepos;
    return chart;
  };
  chart.axispos = function(value) {
    if (!arguments.length) {
      return axispos;
    }
    axispos = value;
    return chart;
  };
  chart.manhattanPlot = function(value) {
    if (!arguments.length) {
      return manhattanPlot;
    }
    manhattanPlot = value;
    return chart;
  };
  chart.mappingScale = function(value) {
    if (!arguments.length) {
      return mappingScale;
    }
    mappingScale = value;
    return chart;
  };
  chart.ylim = function(value) {
    if (!arguments.length) {
      return ylim;
    }
    ylim = value;
    return chart;
  };
  chart.additive_ylim = function(value) {
    if (!arguments.length) {
      return additive_ylim;
    }
    additive_ylim = value;
    return chart;
  };
  chart.nyticks = function(value) {
    if (!arguments.length) {
      return nyticks;
    }
    nyticks = value;
    return chart;
  };
  chart.yticks = function(value) {
    if (!arguments.length) {
      return yticks;
    }
    yticks = value;
    return chart;
  };
  chart.chrGap = function(value) {
    if (!arguments.length) {
      return chrGap;
    }
    chrGap = value;
    return chart;
  };
  chart.darkrect = function(value) {
    if (!arguments.length) {
      return darkrect;
    }
    darkrect = value;
    return chart;
  };
  chart.lightrect = function(value) {
    if (!arguments.length) {
      return lightrect;
    }
    lightrect = value;
    return chart;
  };
  chart.linecolor = function(value) {
    var linecolor;
    if (!arguments.length) {
      return linecolor;
    }
    linecolor = value;
    return chart;
  };
  chart.linewidth = function(value) {
    if (!arguments.length) {
      return linewidth;
    }
    linewidth = value;
    return chart;
  };
  chart.pointcolor = function(value) {
    if (!arguments.length) {
      return pointcolor;
    }
    pointcolor = value;
    return chart;
  };
  chart.pointsize = function(value) {
    if (!arguments.length) {
      return pointsize;
    }
    pointsize = value;
    return chart;
  };
  chart.pointstroke = function(value) {
    if (!arguments.length) {
      return pointstroke;
    }
    pointstroke = value;
    return chart;
  };
  chart.title = function(value) {
    if (!arguments.length) {
      return title;
    }
    title = value;
    return chart;
  };
  chart.xlab = function(value) {
    if (!arguments.length) {
      return xlab;
    }
    xlab = value;
    return chart;
  };
  chart.ylab = function(value) {
    if (!arguments.length) {
      return ylab;
    }
    ylab = value;
    return chart;
  };
  chart.rotate_ylab = function(value) {
    if (!arguments.length) {
      return rotate_ylab;
    }
    rotate_ylab = value;
    return chart;
  };
  chart.lodvarname = function(value) {
    if (!arguments.length) {
      return lodvarname;
    }
    lodvarname = value;
    return chart;
  };
  chart.pad4heatmap = function(value) {
    if (!arguments.length) {
      return pad4heatmap;
    }
    pad4heatmap = value;
    return chart;
  };
  chart.pointsAtMarkers = function(value) {
    if (!arguments.length) {
      return pointsAtMarkers;
    }
    pointsAtMarkers = value;
    return chart;
  };
  chart.yscale = function() {
    return yscale;
  };
  chart.additive_yscale = function() {
    return additive_yscale;
  };
  chart.xscale = function() {
    return xscale;
  };
  if (manhattanPlot === false) {
    chart.lodcurve = function() {
      return lodcurve;
    };
  }
  chart.additivecurve = function() {
    return additivecurve;
  };
  chart.markerSelect = function() {
    return markerSelect;
  };
  chart.chrSelect = function() {
    return chrSelect;
  };
  return chart;
};
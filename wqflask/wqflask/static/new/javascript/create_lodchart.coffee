create_lod_chart = ->
    h = 500
    w = 1200
    margin = {left:60, top:40, right:40, bottom: 40, inner:5}
    halfh = (h+margin.top+margin.bottom)
    totalh = halfh*2
    totalw = (w+margin.left+margin.right)
    if 'additive' of js_data
        additive = js_data.additive
    else
        additive = false

    console.log("js_data:", js_data)

    # simplest use
    #d3.json "data.json", (data) ->
    mychart = lodchart().lodvarname("lod.hk")
                        .height(h)
                        .width(w)
                        .margin(margin)
                        .ylab(js_data.result_score_type + " score")
                        .manhattanPlot(js_data.manhattan_plot)
                        #.additive(additive)

    data = js_data.json_data

    d3.select("div#topchart")
      .datum(data)
      .call(mychart)

    # grab chromosome rectangles; color pink on hover
    chrrect = mychart.chrSelect()
    chrrect.on "mouseover", ->
                d3.select(this).attr("fill", "#E9CFEC")
           .on "mouseout", (d,i) ->
                d3.select(this).attr("fill", ->
                      return "#F1F1F9"  if i % 2
                      "#FBFBFF")

    # animate points at markers on click
    mychart.markerSelect()
              .on "click", (d) ->
                    r = d3.select(this).attr("r")
                    d3.select(this)
                      .transition().duration(500).attr("r", r*3)
                      .transition().duration(500).attr("r", r)

# iplotMScanone_noeff: image of lod curves linked to plot of lod curves
# Karl W Broman

iplotMScanone_noeff = (lod_data, times, chartOpts) ->

    # chartOpts start
    wleft = chartOpts?.wleft ? 1000 # width of left panels in pixels
    wright = chartOpts?.wright ? 500 # width of right panel in pixels
    htop = chartOpts?.htop ? 350 # height of top panels in pixels
    hbot = chartOpts?.hbot ? 350 # height of bottom panel in pixels
    margin = chartOpts?.margin ? {left:100, top:40, right:40, bottom: 40, inner:5} # margins in pixels (left, top, right, bottom, inner)
    axispos = chartOpts?.axispos ? {xtitle:25, ytitle:30, xlabel:5, ylabel:5} # position of axis labels in pixels (xtitle, ytitle, xlabel, ylabel)
    titlepos = chartOpts?.titlepos ? 20 # position of chart title in pixels
    chrGap = chartOpts?.chrGap ? 8 # gap between chromosomes in pixels
    darkrect = chartOpts?.darkrect ? "#C8C8C8" # color of darker background rectangle
    lightrect = chartOpts?.lightrect ? "#E6E6E6" # color of lighter background rectangle
    nullcolor = chartOpts?.nullcolor ? "#E6E6E6" # color for pixels with null values
    colors = chartOpts?.colors ? ["slateblue", "white", "crimson"] # heat map colors
    zlim = chartOpts?.zlim ? null # z-axis limits
    zthresh = chartOpts?.zthresh ? null # lower z-axis threshold for display in heat map
    lod_ylab = chartOpts?.lod_ylab ? "" # y-axis label for LOD heatmap (also used as x-axis label on effect plot)
    linecolor = chartOpts?.linecolor ? "darkslateblue" # color of lines
    linewidth = chartOpts?.linewidth ? 2 # width of lines
    nxticks = chartOpts?.nxticks ? 5 # no. ticks in x-axis on right-hand panel, if quantitative scale
    xticks = chartOpts?.xticks ? null # tick positions in x-axis on right-hand panel, if quantitative scale
    lod_labels = chartOpts?.lod_labels ? null # optional vector of strings, for LOD column labels
    # chartOpts end
    chartdivid = chartOpts?.chartdivid ? 'chart'
  
    totalh = htop + hbot + 2*(margin.top + margin.bottom)
    totalw = wleft + wright + 2*(margin.left + margin.right)
  
    # if quant scale, use times as labels; otherwise use lod_data.lodnames
    unless lod_labels?
        lod_labels = if times? then (formatAxis(times, extra_digits=1)(x) for x in times) else lod_data.lodnames

    mylodheatmap = lodheatmap().height(htop)
                               .width(wleft)
                               .margin(margin)
                               .axispos(axispos)
                               #.titlepos(titlepos)
                               #.chrGap(chrGap)
                               #.rectcolor(lightrect)
                               #.colors(colors)
                               #.zlim(zlim)
                               #.zthresh(zthresh)
                               #.quantScale(times)
                               #.lod_labels(lod_labels)
                               #.ylab(lod_ylab)
                               #.nullcolor(nullcolor)
  
    svg = d3.select("div##{chartdivid}")
            .append("svg")
            .attr("height", totalh)
            .attr("width", totalw)
  
    g_heatmap = svg.append("g")
                   .attr("id", "heatmap")
                   .datum(lod_data)
                   .call(mylodheatmap)
  
    mylodchart = lodchart().height(hbot)
                           .width(wleft)
                           .margin(margin)
                           .axispos(axispos)
                           .titlepos(titlepos)
                           .chrGap(chrGap)
                           .linecolor("none")
                           .pad4heatmap(true)
                           .darkrect(darkrect)
                           .lightrect(lightrect)
                           .ylim([0, d3.max(mylodheatmap.zlim())])
                           .pointsAtMarkers(false)
  
    g_lodchart = svg.append("g")
                    .attr("transform", "translate(0,#{htop+margin.top+margin.bottom})")
                    .attr("id", "lodchart")
                    .datum(lod_data)
                    .call(mylodchart)
  
    # function for lod curve path
    lodcurve = (chr, lodcolumn) ->
            d3.svg.line()
                  .x((d) -> mylodchart.xscale()[chr](d))
                  .y((d,i) -> mylodchart.yscale()(Math.abs(lod_data.lodByChr[chr][i][lodcolumn])))
  
    # plot lod curves for selected lod column
    lodchart_curves = null
    plotLodCurve = (lodcolumn) ->
        g_lodchart.selectAll("g#curves").remove()
        lodchart_curves = g_lodchart.append("g").attr("id", "lodcurves")
        for chr in lod_data.chrnames
            lodchart_curves.append("path")
                           .datum(lod_data.posByChr[chr[0]])
                           .attr("d", lodcurve(chr[0], lodcolumn))
                           .attr("stroke", linecolor)
                           .attr("fill", "none")
                           .attr("stroke-width", linewidth)
                           .style("pointer-events", "none")
  
    # rearrange data for curves of time x LOD
    lod4curves = {data:[]}
    for pos of lod_data.pos
        y = (Math.abs(lod_data[lodcolumn][pos]) for lodcolumn in lod_data.lodnames)
        x = (+i for i of lod_data.lodnames)
        lod4curves.data.push({x:x, y:y})
  
    #mycurvechart = curvechart().height(htop)
    #                           .width(wright)
    #                           .margin(margin)
    #                           .axispos(axispos)
    #                           .titlepos(titlepos)
    #                           .xlab(lod_ylab)
    #                           .ylab("LOD score")
    #                           .strokecolor("none")
    #                           .rectcolor(lightrect)
    #                           .xlim([-0.5, lod_data.lodnames.length-0.5])
    #                           .ylim([0, d3.max(mylodheatmap.zlim())])
    #                           .nxticks(0)
    #                           .commonX(false)
    #
    #g_curvechart = svg.append("g")
    #                  .attr("transform", "translate(#{wleft+margin.top+margin.bottom},0)")
    #                  .attr("id", "curvechart")
    #                  .datum(lod4curves)
    #                  .call(mycurvechart)
    #
    ## add X axis
    #if times? # use quantitative axis
    #    xscale = d3.scale.linear().range(mycurvechart.xscale().range())
    #    xscale.domain([times[0], times[times.length-1]])
    #    xticks = xticks ? xscale.ticks(nxticks)
    #    curvechart_xaxis = g_curvechart.select("g.x.axis")
    #    curvechart_xaxis.selectAll("empty")
    #                    .data(xticks)
    #                    .enter()
    #                    .append("line")
    #                    .attr("x1", (d) -> xscale(d))
    #                    .attr("x2", (d) -> xscale(d))
    #                    .attr("y1", margin.top)
    #                    .attr("y2", margin.top+htop)
    #                    .attr("fill", "none")
    #                    .attr("stroke", "white")
    #                    .attr("stroke-width", 1)
    #                    .style("pointer-events", "none")
    #    curvechart_xaxis.selectAll("empty")
    #                    .data(xticks)
    #                    .enter()
    #                    .append("text")
    #                    .attr("x", (d) -> xscale(d))
    #                    .attr("y", margin.top+htop+axispos.xlabel)
    #                    .text((d) -> formatAxis(xticks)(d))
    #else # qualitative axis
    #    curvechart_xaxis = g_curvechart.select("g.x.axis")
    #                                   .selectAll("empty")
    #                                   .data(lod_labels)
    #                                   .enter()
    #                                   .append("text")
    #                                   .attr("id", (d,i) -> "xaxis#{i}")
    #                                   .attr("x", (d,i) -> mycurvechart.xscale()(i))
    #                                   .attr("y", margin.top+htop+axispos.xlabel)
    #                                   .text((d) -> d)
    #                                   .attr("opacity", 0)

    # hash for [chr][pos] -> posindex
    #posindex = {}
    #curindex = 0
    #for chr in lod_data.chrnames
    #    posindex[chr] = {}
    #    for pos in lod_data.posByChr[chr]
    #        posindex[chr][pos] = curindex
    #        curindex += 1
  
    #mycurvechart.curvesSelect()
    #            .on("mouseover.panel", null)
    #            .on("mouseout.panel", null)
    #
    mylodheatmap.cellSelect()
                .on "mouseover", (d) ->
                         plotLodCurve(d.lodindex)
                         g_lodchart.select("g.title text").text("#{lod_labels[d.lodindex]}")
                         #g_curvechart.selectAll("path.path#{posindex[d.chr][d.pos]}").attr("stroke", linecolor)
                         p = d3.format(".1f")(d.pos)
                         #g_curvechart.select("g.title text").text("#{d.chr}@#{p}")
                         #g_curvechart.select("text#xaxis#{d.lodindex}").attr("opacity", 1) unless times?
                .on "mouseout", (d) ->
                         lodchart_curves.remove()
                         g_lodchart.select("g.title text").text("")
                         #g_curvechart.selectAll("path.path#{posindex[d.chr][d.pos]}").attr("stroke", null)
                         #g_curvechart.select("g.title text").text("")
                         #g_curvechart.select("text#xaxis#{d.lodindex}").attr("opacity", 0) unless times?
                         
iplotMScanone_noeff(lod_data = js_data.json_data)
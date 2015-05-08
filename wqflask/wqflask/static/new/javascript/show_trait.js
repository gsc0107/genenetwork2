// Generated by CoffeeScript 1.9.2
(function() {
  var Stat_Table_Rows, is_number,
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  console.log("start_b");

  is_number = function(o) {
    return !isNaN((o - 0) && o !== null);
  };

  Stat_Table_Rows = [
    {
      vn: "n_of_samples",
      pretty: "N of Samples",
      digits: 0
    }, {
      vn: "mean",
      pretty: "Mean",
      digits: 2
    }, {
      vn: "median",
      pretty: "Median",
      digits: 2
    }, {
      vn: "std_error",
      pretty: "Standard Error (SE)",
      digits: 2
    }, {
      vn: "std_dev",
      pretty: "Standard Deviation (SD)",
      digits: 2
    }, {
      vn: "min",
      pretty: "Minimum",
      digits: 2
    }, {
      vn: "max",
      pretty: "Maximum",
      digits: 2
    }, {
      vn: "range",
      pretty: "Range (log2)",
      digits: 2
    }, {
      vn: "range_fold",
      pretty: "Range (fold)",
      digits: 2
    }, {
      vn: "interquartile",
      pretty: "Interquartile Range",
      url: "/glossary.html#Interquartile",
      digits: 2
    }
  ];

  $(function() {
    var block_by_attribute_value, block_by_index, block_outliers, change_stats_value, create_value_dropdown, edit_data_change, export_sample_table_data, get_sample_table_data, hide_no_value, hide_tabs, make_table, on_corr_method_change, open_trait_selection, populate_sample_attributes_values_dropdown, process_id, reset_samples_table, sample_group_types, sample_lists, show_hide_outliers, stats_mdp_change, update_stat_values;
    sample_lists = js_data.sample_lists;
    sample_group_types = js_data.sample_group_types;
    root.bar_chart = new Bar_Chart(sample_lists[0]);
    root.histogram = new Histogram(sample_lists[0]);
    new Box_Plot(sample_lists[0]);
    $('.bar_chart_samples_group').change(function() {
      var all_samples, group;
      $('#bar_chart').remove();
      $('#bar_chart_container').append('<div id="bar_chart"></div>');
      group = $(this).val();
      if (group === "samples_primary") {
        return root.bar_chart = new Bar_Chart(sample_lists[0]);
      } else if (group === "samples_other") {
        return root.bar_chart = new Bar_Chart(sample_lists[1]);
      } else if (group === "samples_all") {
        all_samples = sample_lists[0].concat(sample_lists[1]);
        return root.bar_chart = new Bar_Chart(all_samples);
      }
    });
    $('.box_plot_samples_group').change(function() {
      var all_samples, group;
      $('#box_plot').remove();
      $('#box_plot_container').append('<div id="box_plot"></div>');
      group = $(this).val();
      if (group === "samples_primary") {
        return new Box_Plot(sample_lists[0]);
      } else if (group === "samples_other") {
        return new Box_Plot(sample_lists[1]);
      } else if (group === "samples_all") {
        all_samples = sample_lists[0].concat(sample_lists[1]);
        return new Box_Plot(all_samples);
      }
    });
    d3.select("#select_compare_trait").on("click", (function(_this) {
      return function() {
        $('.scatter-matrix-container').remove();
        return open_trait_selection();
      };
    })(this));
    d3.select("#clear_compare_trait").on("click", (function(_this) {
      return function() {
        return $('.scatter-matrix-container').remove();
      };
    })(this));
    open_trait_selection = function() {
      return $('#collections_holder').load('/collections/list?color_by_trait #collections_list', (function(_this) {
        return function() {
          $.colorbox({
            inline: true,
            href: "#collections_holder"
          });
          return $('a.collection_name').attr('onClick', 'return false');
        };
      })(this));
    };
    hide_tabs = function(start) {
      var i, ref, results, x;
      results = [];
      for (x = i = ref = start; ref <= 10 ? i <= 10 : i >= 10; x = ref <= 10 ? ++i : --i) {
        results.push($("#stats_tabs" + x).hide());
      }
      return results;
    };
    stats_mdp_change = function() {
      var selected;
      selected = $(this).val();
      hide_tabs(0);
      return $("#stats_tabs" + selected).show();
    };
    change_stats_value = function(sample_sets, category, value_type, decimal_places) {
      var current_value, id, in_box, the_value, title_value;
      id = "#" + process_id(category, value_type);
      console.log("the_id:", id);
      in_box = $(id).html;
      current_value = parseFloat($(in_box)).toFixed(decimal_places);
      the_value = sample_sets[category][value_type]();
      console.log("After running sample_sets, the_value is:", the_value);
      if (decimal_places > 0) {
        title_value = the_value.toFixed(decimal_places * 2);
        the_value = the_value.toFixed(decimal_places);
      } else {
        title_value = null;
      }
      console.log("*-* the_value:", the_value);
      console.log("*-* current_value:", current_value);
      if (the_value !== current_value) {
        console.log("object:", $(id).html(the_value));
        $(id).html(the_value).effect("highlight");
      }
      if (title_value) {
        return $(id).attr('title', title_value);
      }
    };
    update_stat_values = function(sample_sets) {
      var category, i, len, ref, results, row;
      ref = ['samples_primary', 'samples_other', 'samples_all'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        category = ref[i];
        results.push((function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = Stat_Table_Rows.length; j < len1; j++) {
            row = Stat_Table_Rows[j];
            console.log("Calling change_stats_value");
            results1.push(change_stats_value(sample_sets, category, row.vn, row.digits));
          }
          return results1;
        })());
      }
      return results;
    };
    make_table = function() {
      var header, i, key, len, ref, ref1, row, row_line, table, the_id, the_rows, value;
      header = "<thead><tr><th>&nbsp;</th>";
      console.log("js_data.sample_group_types:", js_data.sample_group_types);
      ref = js_data.sample_group_types;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        console.log("aa key:", key);
        console.log("aa value:", value);
        the_id = process_id("column", key);
        header += "<th id=\"" + the_id + "\">" + value + "</th>";
      }
      header += "</thead>";
      console.log("windex header is:", header);
      the_rows = "<tbody>";
      for (i = 0, len = Stat_Table_Rows.length; i < len; i++) {
        row = Stat_Table_Rows[i];
        console.log("rowing");
        row_line = "<tr>";
        if (row.url != null) {
          row_line += "<td id=\"" + row.vn + "\"><a href=\"" + row.url + "\">" + row.pretty + "</a></td>";
        } else {
          row_line += "<td id=\"" + row.vn + "\">" + row.pretty + "</td>";
        }
        console.log("box - js_data.sample_group_types:", js_data.sample_group_types);
        ref1 = js_data.sample_group_types;
        for (key in ref1) {
          if (!hasProp.call(ref1, key)) continue;
          value = ref1[key];
          console.log("apple key:", key);
          the_id = process_id(key, row.vn);
          console.log("the_id:", the_id);
          row_line += "<td id=\"" + the_id + "\">foo</td>";
        }
        row_line += "</tr>";
        console.log("row line:", row_line);
        the_rows += row_line;
      }
      the_rows += "</tbody>";
      table = header + the_rows;
      console.log("table is:", table);
      return $("#stats_table").append(table);
    };
    process_id = function() {
      var i, len, processed, value, values;
      values = 1 <= arguments.length ? slice.call(arguments, 0) : [];

      /* Make an id or a class valid javascript by, for example, eliminating spaces */
      processed = "";
      for (i = 0, len = values.length; i < len; i++) {
        value = values[i];
        console.log("value:", value);
        value = value.replace(" ", "_");
        if (processed.length) {
          processed += "-";
        }
        processed += value;
      }
      return processed;
    };
    edit_data_change = function() {
      var already_seen, checkbox, checked, i, j, len, len1, name, real_value, row, rows, sample_sets, table, tables;
      already_seen = {};
      sample_sets = {
        samples_primary: new Stats([]),
        samples_other: new Stats([]),
        samples_all: new Stats([])
      };
      console.log("at beginning:", sample_sets);
      tables = ['samples_primary', 'samples_other'];
      for (i = 0, len = tables.length; i < len; i++) {
        table = tables[i];
        rows = $("#" + table).find('tr');
        for (j = 0, len1 = rows.length; j < len1; j++) {
          row = rows[j];
          name = $(row).find('.edit_sample_sample_name').html();
          name = $.trim(name);
          real_value = $(row).find('.edit_sample_value').val();
          console.log("real_value:", real_value);
          checkbox = $(row).find(".edit_sample_checkbox");
          checked = $(checkbox).attr('checked');
          if (checked && is_number(real_value) && real_value !== "") {
            console.log("in the iffy if");
            real_value = parseFloat(real_value);
            sample_sets[table].add_value(real_value);
            console.log("checking name of:", name);
            if (!(name in already_seen)) {
              console.log("haven't seen");
              sample_sets['samples_all'].add_value(real_value);
              already_seen[name] = true;
            }
          }
        }
      }
      console.log("towards end:", sample_sets);
      root.histogram.redraw(sample_sets['samples_primary'].the_values);
      return update_stat_values(sample_sets);
    };
    show_hide_outliers = function() {
      var label;
      console.log("FOOBAR in beginning of show_hide_outliers");
      label = $('#show_hide_outliers').val();
      console.log("lable is:", label);
      if (label === "Hide Outliers") {
        return $('#show_hide_outliers').val("Show Outliers");
      } else if (label === "Show Outliers") {
        console.log("Found Show Outliers");
        $('#show_hide_outliers').val("Hide Outliers");
        return console.log("Should be now Hide Outliers");
      }
    };
    on_corr_method_change = function() {
      var corr_method;
      console.log("in beginning of on_corr_method_change");
      corr_method = $('select[name=corr_method]').val();
      console.log("corr_method is:", corr_method);
      $('.correlation_desc').hide();
      $('#' + corr_method + "_r_desc").show().effect("highlight");
      if (corr_method === "lit") {
        return $("#corr_sample_method_options").hide();
      } else {
        return $("#corr_sample_method_options").show();
      }
    };
    $('select[name=corr_method]').change(on_corr_method_change);
    create_value_dropdown = function(value) {
      return "<option val=" + value + ">" + value + "</option>";
    };
    populate_sample_attributes_values_dropdown = function() {
      var attribute_info, i, key, len, ref, ref1, results, sample_attributes, selected_attribute, value;
      console.log("in beginning of psavd");
      $('#attribute_values').empty();
      sample_attributes = {};
      ref = js_data.attribute_names;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        attribute_info = ref[key];
        sample_attributes[attribute_info.name] = attribute_info.distinct_values;
      }
      console.log("[visa] attributes is:", sample_attributes);
      selected_attribute = $('#exclude_menu').val().replace("_", " ");
      console.log("selected_attribute is:", selected_attribute);
      ref1 = sample_attributes[selected_attribute];
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        value = ref1[i];
        results.push($(create_value_dropdown(value)).appendTo($('#attribute_values')));
      }
      return results;
    };
    if (js_data.attribute_names.length > 0) {
      populate_sample_attributes_values_dropdown();
    }
    $('#exclude_menu').change(populate_sample_attributes_values_dropdown);
    block_by_attribute_value = function() {
      var attribute_name, cell_class, exclude_by_value;
      attribute_name = $('#exclude_menu').val();
      exclude_by_value = $('#attribute_values').val();
      cell_class = ".column_name-" + attribute_name;
      return $(cell_class).each((function(_this) {
        return function(index, element) {
          var row;
          if ($.trim($(element).text()) === exclude_by_value) {
            row = $(element).parent('tr');
            return $(row).find(".trait_value_input").val("x");
          }
        };
      })(this));
    };
    $('#exclude_group').click(block_by_attribute_value);
    block_by_index = function() {
      var end_index, error, i, index, index_list, index_set, index_string, j, k, len, len1, ref, ref1, ref2, results, start_index;
      index_string = $('#remove_samples_field').val();
      index_list = [];
      ref = index_string.split(",");
      for (i = 0, len = ref.length; i < len; i++) {
        index_set = ref[i];
        if (index_set.indexOf('-') !== -1) {
          try {
            start_index = parseInt(index_set.split("-")[0]);
            end_index = parseInt(index_set.split("-")[1]);
            for (index = j = ref1 = start_index, ref2 = end_index; ref1 <= ref2 ? j <= ref2 : j >= ref2; index = ref1 <= ref2 ? ++j : --j) {
              index_list.push(index);
            }
          } catch (_error) {
            error = _error;
            alert("Syntax error");
          }
        } else {
          index = parseInt(index_set);
          console.log("index:", index);
          index_list.push(index);
        }
      }
      console.log("index_list:", index_list);
      results = [];
      for (k = 0, len1 = index_list.length; k < len1; k++) {
        index = index_list[k];
        if ($('#block_group').val() === "primary") {
          console.log("block_group:", $('#block_group').val());
          console.log("row:", $('#Primary_' + index.toString()));
          results.push($('#Primary_' + index.toString()).find('.trait_value_input').val("x"));
        } else if ($('#block_group').val() === "other") {
          console.log("block_group:", $('#block_group').val());
          console.log("row:", $('#Other_' + index.toString()));
          results.push($('#Other_' + index.toString()).find('.trait_value_input').val("x"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    $('#block_by_index').click(block_by_index);
    hide_no_value = function() {
      return $('.value_se').each((function(_this) {
        return function(_index, element) {
          if ($(element).find('.trait_value_input').val() === 'x') {
            return $(element).hide();
          }
        };
      })(this));
    };
    $('#hide_no_value').click(hide_no_value);
    block_outliers = function() {
      return $('.outlier').each((function(_this) {
        return function(_index, element) {
          return $(element).find('.trait_value_input').val('x');
        };
      })(this));
    };
    $('#block_outliers').click(block_outliers);
    reset_samples_table = function() {
      return $('.trait_value_input').each((function(_this) {
        return function(_index, element) {
          console.log("value is:", $(element).val());
          $(element).val($(element).data('value'));
          console.log("data-value is:", $(element).data('value'));
          return $(element).parents('.value_se').show();
        };
      })(this));
    };
    $('#reset').click(reset_samples_table);
    get_sample_table_data = function(table_name) {
      var samples;
      samples = [];
      $('#' + table_name).find('.value_se').each((function(_this) {
        return function(_index, element) {
          var attribute_info, key, ref, row_data;
          row_data = {};
          row_data.name = $.trim($(element).find('.column_name-Sample').text());
          row_data.value = $(element).find('.edit_sample_value').val();
          if ($(element).find('.edit_sample_se').length !== -1) {
            row_data.se = $(element).find('.edit_sample_se').val();
          }
          ref = js_data.attribute_names;
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            attribute_info = ref[key];
            row_data[attribute_info.name] = $.trim($(element).find('.column_name-' + attribute_info.name.replace(" ", "_")).text());
          }
          console.log("row_data is:", row_data);
          return samples.push(row_data);
        };
      })(this));
      return samples;
    };
    export_sample_table_data = function() {
      var format, json_sample_data, sample_data;
      sample_data = {};
      sample_data.primary_samples = get_sample_table_data('samples_primary');
      sample_data.other_samples = get_sample_table_data('samples_other');
      console.log("sample_data is:", sample_data);
      json_sample_data = JSON.stringify(sample_data);
      console.log("json_sample_data is:", json_sample_data);
      $('input[name=export_data]').val(json_sample_data);
      console.log("export_data is", $('input[name=export_data]').val());
      format = $('#export_format').val();
      if (format === "excel") {
        $('#trait_data_form').attr('action', '/export_trait_excel');
      } else {
        $('#trait_data_form').attr('action', '/export_trait_csv');
      }
      console.log("action is:", $('#trait_data_form').attr('action'));
      return $('#trait_data_form').submit();
    };
    $('#export').click(export_sample_table_data);
    console.log("before registering block_outliers");
    $('#block_outliers').click(block_outliers);
    console.log("after registering block_outliers");
    _.mixin(_.str.exports());
    $('#edit_sample_lists').change(edit_data_change);
    console.log("loaded");
    make_table();
    edit_data_change();
    return console.log("end");
  });

}).call(this);

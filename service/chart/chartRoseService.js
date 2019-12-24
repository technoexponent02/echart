/**
 * Created by yfyuan on 2016/10/28.
 */
'use strict';
cBoard.service('chartRoseService', function ($state, $window) {

    this.render = function (containerDom, option, scope, persist, drill, relations, chartConfig) {
        var render = new CBoardEChartRender(containerDom, option);
        render.addClick(chartConfig, relations, $state, $window);
        return render.chart(null, persist);
    };

    this.parseOption = function (data) {
        var chartConfig = data.chartConfig;console.log(data);
        var casted_keys = data.keys;
        var casted_values = data.series;
        var aggregate_data = data.data;
        var newValuesConfig = data.seriesConfig;

        var series = new Array();
        var string_keys = _.map(casted_keys, function (key) {
            return key.join('-');
        });
        var string_value = _.map(casted_values, function (value) {
            return value.join('-');
        });
        var b = 100 / (casted_values.length * 9 + 1);
        var titles = [];
        for (var i = 0; i < aggregate_data.length; i++) {
            var joined_values = casted_values[i].join('-');
            var realType = angular.copy(newValuesConfig[joined_values]).type;
            var s = {
                name: string_value[i],
                type: 'pie',
                //radius : [20, 110],
                center: [5 * b + i * 9 * b + '%', '50%'],
                data: [],
                roseType: 'area'
            };
            titles.push({
                textAlign: 'center', textStyle: {
                    fontSize: 12,
                    fontWeight: 'normal'
                }, text: string_value[i], left: 5 * b + i * 9 * b + '%', top: '90%'
            });
            for (var j = 0; j < aggregate_data[i].length; j++) {
                s.data.push({
                    name: string_keys[j],
                    value: _.isUndefined(aggregate_data[i][j]) ? 0 : aggregate_data[i][j]
                });
            }
            series.push(s);
        }
        console.log(series);
        var echartOption = {
			title : {
				text: 'Pie Chart',
				subtext: 'Nightingale\'s Rose',
				x:'center'
			},
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				x : 'center',
				y : 'bottom',
				data: string_keys
			},
			toolbox: {
				show : false,
			},
			calculable : true,
			series : series
		};


        updateEchartOptions(chartConfig.option, echartOption);

        return echartOption;
    };
});

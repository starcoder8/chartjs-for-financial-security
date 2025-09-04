﻿'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;

Chart.defaults.financial = {
	label: '',

	hover: {
		mode: 'label'
	},

	scales: {
		xAxes: [{
			type: 'time',
			distribution: 'series',
			categoryPercentage: 0.8,
			barPercentage: 0.9,
			ticks: {
				source: 'data'
			}
		}],
		yAxes: [{
			type: 'financialLinear'
		}]
	},

	tooltips: {
		intersect: false,
		mode: 'index',
		callbacks: {
			label: function(tooltipItem, data) {
				var o = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].o;
				var h = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].h;
				var l = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].l;
				var c = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].c;

				var dataset = data.datasets[tooltipItem.datasetIndex];
				var precision = helpers.valueOrDefault(dataset.precision, 2);
				precision = Math.max(0, Math.min(100, precision));
				o = o.toFixed(precision);
				h = h.toFixed(precision);
				l = l.toFixed(precision);
				c = c.toFixed(precision);

				return ' O: ' + o + '    H: ' + h + '    L: ' + l + '    C: ' + c;
			}
		}
	}
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
var FinancialController = Chart.controllers.bar.extend({

	dataElementType: Chart.elements.Financial,

	/**
	 * @private
	 */
	_updateElementGeometry: function(element, index, reset) {
		var me = this;
		var model = element._model;
		var vscale = me._getValueScale();
		var base = vscale.getBasePixel();
		var horizontal = vscale.isHorizontal();
		var ruler = me._ruler || me.getRuler();
		var vpixels = me.calculateBarValuePixels(me.index, index);
		var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);
		var chart = me.chart;
		var datasets = chart.data.datasets;
		var indexData = datasets[me.index].data[index];

		model.horizontal = horizontal;
		model.base = reset ? base : vpixels.base;
		model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
		model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
		model.height = horizontal ? ipixels.size : undefined;
		model.width = horizontal ? undefined : ipixels.size;
		model.candleOpen = vscale.getPixelForValue(Number(indexData.o));
		model.candleHigh = vscale.getPixelForValue(Number(indexData.h));
		model.candleLow = vscale.getPixelForValue(Number(indexData.l));
		model.candleClose = vscale.getPixelForValue(Number(indexData.c));
	},

	draw: function() {
		var ctx = this.chart.chart.ctx;
		var elements = this.getMeta().data;
		var dataset = this.getDataset();
		var ilen = elements.length;
		var i = 0;
		var d;

		Chart.canvasHelpers.clipArea(ctx, this.chart.chartArea);

		for (; i < ilen; ++i) {
			d = dataset.data[i].o;
			if (d !== null && d !== undefined && !isNaN(d)) {
				elements[i].draw();
			}
		}

		Chart.canvasHelpers.unclipArea(ctx);
	},
});

export default FinancialController;

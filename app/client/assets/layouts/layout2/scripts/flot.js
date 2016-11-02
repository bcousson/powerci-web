$(document).ready(function(){

	var config = {
		toAdd: 1, /* Number of values to add for each ticks */
		idxBase: 500, /* Number of values on start */
		onStart: true /* Run chart on startup */
	}
		//jQuery.get('http://jorisbertomeu.github.io/data.json', function(datas) {

	var data = [], data1 = [], data2 = [], data3 = [];
	var plot;
	var overview;
	var idxBase = config.idxBase, idx = idxBase, toAdd = config.toAdd, updateMe = config.onStart;
	var options;

	// Start button
	$('#goButton').click(function() {
		if (updateMe) {
			updateMe = false;
			$(this).html('Start');
			$(this).attr('class', 'btn btn-success btn-xs')
		} else {
			updateMe = true;
			$(this).html('Stop');
			$(this).attr('class', 'btn btn-danger btn-xs')
			update();
		}
	});
	
	var listCharts = ["VBUS", "VCC_3V3", "VCC_1V8"];
	$(".flot-chart").on('click', 'tr.float-labels', function() {
		var exist = false;
		var listChart = [];
		var flot_element = $.trim($(this).text());
		$.each(listCharts, function(key, val) {
			if(!(flot_element == val)) 
				listChart.push(val);
			else 
				exist = true;
		});
		if(!exist) 
			listChart.push(flot_element);

		listCharts = listChart;
		update();
		
	});

	// initialisation des variables
	function reinit() {
		data1 = [];
		data2 = [];
		data3 = [];
		idx = idxBase;
		vbus = getRandomData(data1, 0, idx, 100); //VBUS
		vcc_3v3 = getRandomData(data2, 0, idx, 50); //VCC_3V3
		vcc_1v8 = getRandomData(data3, 0, idx, 25); //VCC_1V8

		var v1 = {label:"VBUS", data: vbus[0]};
		var v2 = {label:"VCC_3V3", data: vcc_3v3[0]};
		var v3 = {label:"VCC_1V8", data: vcc_1v8[0]};

		options = {
				series: {
					shadowSize: 0
				},
				yaxis: {
					min: 0,
					max: 500
				},
				xaxis: {
					show: true
				},
				grid: {
					hoverable: true,
					clickable: true
				},
				legend: {
    				show: true
    			},
    			selection: {
					mode: "x"
				}
			};
		overview = $.plot("#overview", [v1, v2,  v3], options);
	}

	reinit();

	$('#reinitButton').click(function() {
		reinit();
	});

			
	var updateInterval = 150;
	$("#updateInterval").val(updateInterval).change(function () {
		var v = $(this).val();
		if (v && !isNaN(+v)) {
			updateInterval = +v;
			if (updateInterval < 1) {
				updateInterval = 1;
			} else if (updateInterval > 2000) {
				updateInterval = 2000;
			}
			$(this).val("" + updateInterval);
		}
	});

	// Generat data
	vbus = getRandomData(data1, 0, idx, 100); //VBUS
	data1 = vbus[1];
	vcc_3v3 = getRandomData(data2, 0, idx, getRandomInt(50, 300)); //VCC_3V3
	data2 = vcc_3v3[1];
	vcc_1v8 = getRandomData(data3, 0, idx, getRandomInt(25, 80)); //VCC_1V8
	data3 = vcc_1v8[1];

		
	// Tooltip info
	$("<div id='tooltip'></div>").css({
		position: "absolute",
		display: "none",
		border: "1px solid #fdd",
		padding: "2px",
		"background-color": "#fee",
		opacity: 0.80
	}).appendTo("body");


	var overviewDiv = $("#overview");
	
	function update() {
		idx += toAdd;
		if (idx >= datas.length)
			idx = 0;

		vbus = getRandomData(data1, idx, toAdd, getRandomInt(50, 300));
		data1 = vbus[1];
		vcc_3v3 = getRandomData(data2, idx, toAdd, getRandomInt(10, 200));
		data2 = vcc_3v3[1];
		vcc_1v8 = getRandomData(data3, idx, toAdd, getRandomInt(0, 100)); //VCC_1V8
		data3 = vcc_1v8[1];

		var preparedData = [ {color:"rgb(237,194,64)", label:"VBUS", data: vbus[0]}, {color:"rgb(175,216,248)", label:"VCC_3V3", data: vcc_3v3[0]}, {color:"rgb(203,75,75)", label:"VCC_1V8", data: vcc_1v8[0]} ];
		var data = [];

		$.each(preparedData, function(keyData, valData) {
			
			if(listCharts.indexOf(valData.label) > -1) {
				data.push(valData);
			} else {
				valData.data = [{0 : "0"}];
				data.push(valData); 
			}
		});

		overview.setData(data);
		var maxElement = 0;
		$.each(overview.getData(), function(_, data) {
			if(data.data != null) {
				var maxData = Math.max.apply(Math,data.data.map(function(el) {return el[1];}));
				maxElement = (maxData > maxElement)? maxData : maxElement;
			}
		});
		overview.getAxes().yaxis.options.max = maxElement + 50;
		overview.setupGrid();
		overview.draw();

		if (updateMe) {
			setTimeout(update, updateInterval);
		}

	}

	update();

	$("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
	//});

	// Save picture
	$('#capt').click(function() {
        html2canvas($('.flot-chart-content'), {
		  onrendered: function(canvas) {
		    document.body.appendChild(canvas);
		  }
		});
    });

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	function getRandomData(data, start, end, percent) {
		//console.log('before : ' + data.length);
		//if (data.length > 0)
			//data = data.slice(toAdd * 2);
		//console.log('after : ' + data.length);
		$.each(datas, function(i, elem) {
			if (i >= start && i <= start + end)
				data.push(elem * percent / 100);
		});
		var res = [];
		for (var i = 0; i < data.length; ++i) {
			res.push([i, data[i]/100])
		}
		return [res, data];
	}


    function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }

});

function echo(string) {
	console.log(string);
}

    


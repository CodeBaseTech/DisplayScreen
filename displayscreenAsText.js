


var datesToText = [ "zero", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",  "13th",  "14th",  "15th",  "16th",  "17th",  "18th",  "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"  ]; 

function loadEvents() {
	var data = new Array();
	// get codebase data
	$.ajax({
		type : "GET",
		dataType : "jsonp",
		url : "http://codebasehouseevents.hasacalendar.co.uk/api1/event/jsonp?callback=?",
		success: function(data1){
			// add url for logo for this source
			for(i in data1.data) {
				if (!data1.data[i].deleted) {
					data1.data[i].sourcelogo="codebase.square.png";
					data.push(data1.data[i]);
				}
			}
			// get Open Tech Calendar data
			$.ajax({
				type : "GET",
				dataType : "jsonp",
				url : "http://opentechcalendar.co.uk/api1/area/62/events.jsonp?callback=?",
				success: function(data2){
					// add url for logo for this source, mix 2 data sources
					for(i in data2.data) {
						if (!data2.data[i].deleted) {
							data2.data[i].sourcelogo="opentechcalendar.png";
							data.push(data2.data[i]);
						}
					}
					// sort by start time
					data = data.sort(function(a,b) {
						if (a.start.timestamp == b.start.timestamp) {
							return 0;
						} else if (a.start.timestamp > b.start.timestamp) {
							return 1;
						} else {
							return -1;
						}
					});
					// draw the data!
					var today = new Date();
					var daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

					var html = '';

					for(i in data) {
						var start =  new Date(data[i].start.timestamp * 1000);
						var when;
						if (start.getMonth() == today.getMonth() && start.getDate() == today.getDate() && start.getYear() == today.getYear()) {
							when = "Today";
						} else {
							when = daysOfWeek[start.getDay()] + " " + datesToText[start.getDate()];
						}
						
						html += when+'<br>';
						html += escapeHTML(data[i].summaryDisplay)+'<br><br>';
						html += escapeHTMLNewLine(data[i].description)+'<br><br>';
						html += escapeHTML(data[i].url)+'<br>';
						if (data[i].url != data[i].siteurl) {
							html += escapeHTML(data[i].siteurl)+'<br>';
						}
						html += '<br><br>---<br>';

					}
					$('#content').html(html);

				}
			});
		}
	});


}

function escapeHTML(str) {
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
}
function escapeHTMLNewLine(str) {
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	var out =  div.innerHTML;
	return out.replace(/\n/g,'<br>');
}

// All right, let's go!
loadEvents();

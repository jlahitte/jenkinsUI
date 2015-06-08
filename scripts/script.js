$(main = function() {

	var br = $('<br>');
	var jobs;
	$.handlebars({
		templatePath : './ressources/templates/',
		templateExtension : 'hbs'
	});
	// ////////////////////////
	// List all jobs
	// //////////////////////
	$.getJSON(JENKINS_URL + JSON_PATH)
	 .done(function(data) {
		 	console.log("done");
		 	jobs = getJobsData(data, function() {
		 	for (i = 0; i < jobs.length; i++) {
		 		var job = jobs[i];
		 		jobs[i] = getJobDetail(job);
		 	}
		 	$('#jobsHandleBars').render('jenkinsJob', jobs);
		 	}
		 	)});

	suppSymbolFromBranch = function(value) {
		var re = /([\(-\)])/g;
		return value.replace(re, "-");
	};

	getJobsData = function(data) {

		var jobs = [];
		for (i = 0; i < data.jobs.length; i++) {
			var job = data.jobs[i];
			var icon = "./ressources/img/greenchecked.png";
			if (job.color !== "blue") {
				icon = "./ressources/img/redchecked.png";
			}
			var jobObj = {
				"icon" : icon,
				"url" : job.url,
				"name" : job.name,
				"id" : i,
				"detail" : ""
			};
			console.log("jobObj" + jobObj);
			jobs[i] = jobObj;
		}
		return jobs;
	};

	getJobDetail = function(job) {
		var url = job.url + JSON_PATH;
		$.getJSON(url, function(data) {
			// job.detail = data;
			jobs[job.id].detail = data;
		}).fail(function() {
			console.log("error for detail on job : " + job.name);
		});
	};

})

var LASTBUILD_URI = "/lastBuild/api/json?pretty=true";
var JSON_PATH = "/api/json?pretty=true";
var JOBS_PATH = "/view/All/job/";

//Connect to Jenkins and get details for all jobs
connectToJenkins = function(){
$.getJSON(JENKINS_URL + JSON_PATH)
			.done(function(data){
				console.log("ALL JOBS done");
				var jobs = data.jobs

				for (var i = 0;  i < jobs.length; i++){
					var currJob = jobs[i];
					var url = currJob.url + "/api/json?pretty=true";
					console.log(url);
					$.getJSON(url).done(function(data){
						console.log("Details from job received for " + data.url);
						displayJobDetail(data);
					});

				}
			})
			.fail(function(){
				console.log("ALL JOBS failed");
			}).complete(function(){
				console.log("All jobs where read");
			});
};

builds = function(url){
	$.getJSON(url+JSON_PATH).done(function(data){
		console.log("Detail for build logged " + data.displayName);
	}
	);
}
changeSetDetail=function(url){
	$.getJSON(url+JSON_PATH).done(function(data){
		console.log("Detail for build logged " + data.url);
		displayChangeSet(data);
	});	
		
};


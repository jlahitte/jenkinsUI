
//Connect to Jenkins and get details for all jobs
connectToJenkins = function(){
$.getJSON(JENKINS_URL + JSON_BRANCH_DEPOT + JSON_PATH)
			.done(function(data){
				console.log("ALL JOBS done");
				var jobs = data.jobs

				for (var i = 0;  i < jobs.length; i++){
					var currJob = jobs[i];
					var url = currJob.url + JSON_PATH;
					console.log(url);
					$.getJSON(url).done(function(data){
						console.log("Details from job received for " + data.url);
						data.environement;
						displayJobDetail(data);
					});

				}
				for (var i = 0;  i < jobs.length; i++){
					var currJob = jobs[i];
					var url = currJob.url + JSON_PATH;
					console.log(url);
					$.getJSON(url).done(function(data){
						if(data.lastCompletedBuild){
							if(data.lastCompletedBuild.url){
								var lastSuccessfulBuildUrl=data.lastCompletedBuild.url+JSON_PATH;
								$.getJSON(lastSuccessfulBuildUrl).done(function(data){
									console.log("Last Commit for job last Successful Build " + data.url);
									displayJobLastCommit(data);
								});
							}
						}
					});

				}
			})
			.fail(function(){
				console.log("ALL JOBS failed");
			}).complete(function(){
				console.log("All jobs where read");
			});
};

// Get build details
builds = function(url){
	$.getJSON(url+JSON_PATH).done(function(data){
		console.log("Detail for build logged " + data.displayName);
	}
	);
}

// Get a list of changes for a particular build
// and display them as per defined within genUi.js--> displayChangeSet()
// url : url to the detail of the build
changeSetDetail=function(event,url){
	// Désactivation du comportement du lien par defaut
	// Provoquait un retour en haut de page
	event.preventDefault();
	$.getJSON(url+JSON_PATH).done(function(data){
		displayChangeSet(data);
	});

};

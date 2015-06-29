//Connect to Jenkins and get details for all jobs
connectToJenkins = function(){
	for (var i = 0;  i < window.JENKINS_BRANCHES.length; i++){
		var currJob = window.JENKINS_BRANCHES[i];
		var url = currJob.branch_url + JSON_PATH;
		console.log(url);
		$.getJSON(url).done(function(data){
			console.log("Details from job received for " + data.url);
			displayJobDetail(data);
		});
	}
};

//Get build details
builds = function(url){
	$.getJSON(url+JSON_PATH).done(function(data){
		console.log("Detail for build logged " + data.displayName);
	}
	);
}

//Get a list of changes for a particular build
// and display them as per defined within genUi.js--> displayChangeSet()
// url : url to the detail of the build
changeSetDetail=function(event,url){
	//Désactivation du comportement du lien par defaut
	//Provoquait un retour en haut de page
	event.preventDefault();
	$.getJSON(url+JSON_PATH).done(function(data){
		displayChangeSet(data);
	});

};

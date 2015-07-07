function updateInstanceJob(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from job received for " + environement);
		window.BRICODEPOT_INSTANCES[environement].job = data;
		displayEnvironementJobDetail(environement, window.BRICODEPOT_INSTANCES[environement]);
	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.BRICODEPOT_INSTANCES[environement].job = {};
	});
}

connectToBricoDepot = function() {
	$.each(window.BRICODEPOT_INSTANCES, function(environement, instance) {
		var url = instance.instance_url + BRICO_JSON_PATH;
		var name = instance.instance_name;
		console.log(url);
		updateInstanceVertion(url, environement);
	});
};

function updateInstanceVertion(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from bricodepot instance received for " + environement);
		window.BRICODEPOT_INSTANCES[environement].version = data;
	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.BRICODEPOT_INSTANCES[environement].version = {};
	}).always(function() {
		var url = window.JENKINS_BRANCHES[environement].branch_url + JSON_PATH;
		console.log(url);
		updateInstanceJob(url, environement);
	});
}

// Get build details
builds = function(url) {
	$.getJSON(url + JSON_PATH).done(function(data) {
		console.log("Detail for build logged " + data.displayName);
	});
}

// Get a list of changes for a particular build
// and display them as per defined within genUi.js--> displayChangeSet()
// url : url to the detail of the build
changeSetDetail = function(event, url) {
	// Désactivation du comportement du lien par defaut
	// Provoquait un retour en haut de page
	event.preventDefault();
	$.getJSON(url + JSON_PATH).done(function(data) {
		displayChangeSet(data);
	});

};

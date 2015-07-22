function updateInstanceJob(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from job received for " + environement);
		window.JENKINS_BRANCHES[environement].job = data;
		window.JENKINS_BRANCHES[environement].job.callCount = 0;
		window.JENKINS_BRANCHES[environement].job.buildItems = {};
		for ( var buildItemIndex in window.JENKINS_BRANCHES[environement].job.builds) {
			updateBuildItemsDetails(environement, buildItemIndex);
		}

	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.JENKINS_BRANCHES[environement].job = {};
	});
}

function updateBuildItemsDetails(environement, buildItemIndex) {
	var buildItem = window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex];

	$.getJSON(buildItem.url + JENKINS_JSON_PATH).done(
			function(data) {
				window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].buildDetail = {};
				window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].buildDetail = data;
				if (window.JENKINS_BRANCHES[environement].version.build
						&& window.JENKINS_BRANCHES[environement].version.build.number == window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].buildDetail.id) {
					window.JENKINS_BRANCHES[environement].version.build.Date = FRDateString(new Date(
							window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].buildDetail.timestamp));
				}
				if (data.changeSet.items.length > 0) {
					window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].changes = true;
				} else {
					window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].changes = false;
				}
				if (data.result == "SUCCESS") {
					window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].success = "buildSuccess";
				} else {
					window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].success = "buildFail";
				}
				window.JENKINS_BRANCHES[environement].job.builds[buildItemIndex].buildDate = FRDateString(new Date(data.timestamp));
			}).always(function() {
		window.JENKINS_BRANCHES[environement].job.callCount = window.JENKINS_BRANCHES[environement].job.callCount + 1;
		if ((window.JENKINS_BRANCHES[environement].job.builds.length) === window.JENKINS_BRANCHES[environement].job.callCount) {
			displayEnvironementJobDetail(environement, window.JENKINS_BRANCHES[environement]);
			
		}
	});
}

function FRDateString(date) {
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
	return pad(date.getDate()) + '/' + pad(date.getMonth()) + '/' + pad(date.getFullYear()) + ' à ' + pad(date.getHours()) + 'h' + pad(date.getMinutes());
}

connectToBricoDepot = function() {
	$.each(window.JENKINS_BRANCHES, function(environement, instance) {
		var url = instance.url + BRICO_VERSION_API_PATH;
		console.log(url);
		updateInstanceVertion(url, environement);
	});
};

function updateInstanceVertion(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from bricodepot instance received for " + environement);
		window.JENKINS_BRANCHES[environement].version = data;
	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.JENKINS_BRANCHES[environement].version = {};
	}).always(function() {
		var url = window.JENKINS_BRANCHES[environement].branch_url + JENKINS_JSON_PATH;
		console.log(url);
		updateInstanceJob(url, environement);
	});
}

// Get build details
builds = function(url) {
	$.getJSON(url + JENKINS_JSON_PATH).done(function(data) {
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
	$.getJSON(url + JENKINS_JSON_PATH).done(function(data) {
		displayChangeSet(data);
	});
};

function updateInstanceJob(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from job received for " + environement);
		window.BRICO_ENVIRONEMENT[environement].job = data;
		window.BRICO_ENVIRONEMENT[environement].job.callCount = 0;
		window.BRICO_ENVIRONEMENT[environement].job.buildItems = {};
		for ( var buildItemIndex in window.BRICO_ENVIRONEMENT[environement].job.builds) {
			updateBuildItemsDetails(environement, buildItemIndex);
		}

	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.BRICO_ENVIRONEMENT[environement].job = {};
	});
}

function updateBuildItemsDetails(environement, buildItemIndex) {
	var buildItem = window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex];

	$.getJSON(buildItem.url + JENKINS_JSON_PATH).done(
			function(data) {
				window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].buildDetail = {};
				window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].buildDetail = data;
				if (window.BRICO_ENVIRONEMENT[environement].version.build
						&& window.BRICO_ENVIRONEMENT[environement].version.build.number == window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].buildDetail.id) {
					window.BRICO_ENVIRONEMENT[environement].version.build.Date = FRDateString(new Date(
							window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].buildDetail.timestamp));
				}
				if (data.changeSet.items.length > 0) {
					window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].changes = true;
				} else {
					window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].changes = false;
				}
				if (data.result == "SUCCESS") {
					window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].success = "buildSuccess";
				} else {
					window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].success = "buildFail";
				}
				window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].buildDate = FRDateString(new Date(data.timestamp));
			}).always(function() {
		window.BRICO_ENVIRONEMENT[environement].job.callCount = window.BRICO_ENVIRONEMENT[environement].job.callCount + 1;
		if ((window.BRICO_ENVIRONEMENT[environement].job.builds.length) === window.BRICO_ENVIRONEMENT[environement].job.callCount) {
			displayEnvironementJobDetail(environement, window.BRICO_ENVIRONEMENT[environement]);
			
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
	$.each(window.BRICO_ENVIRONEMENT, function(environement, instance) {
		var url = instance.url + BRICO_VERSION_API_PATH;
		console.log(url);
		updateInstanceVertion(url, environement);
	});
};

function updateInstanceVertion(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from bricodepot instance received for " + environement);
		window.BRICO_ENVIRONEMENT[environement].version = data;
	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.BRICO_ENVIRONEMENT[environement].version = {};
	}).always(function() {
		var url = window.BRICO_ENVIRONEMENT[environement].branch_url + JENKINS_JSON_PATH;
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

function updateInstanceJob(url, environement) {
	$.getJSON(url).done(function(data) {
		console.log("Details from job received for " + environement);
		window.BRICODEPOT_INSTANCES[environement].job = data;
		window.BRICODEPOT_INSTANCES[environement].job.callCount = 0;
		for ( var buildItemIndex in window.BRICODEPOT_INSTANCES[environement].job.builds) {
			updateBuildItemsDetails(environement, buildItemIndex);
		}

	}).fail(function(data) {
		console.log("error " + data.status + " for bricodepot instance " + environement);
		window.BRICODEPOT_INSTANCES[environement].job = {};
	});
}

function updateBuildItemsDetails(environement, buildItemIndex) {
	var buildItem = window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex];

	$.getJSON(buildItem.url + JSON_PATH).done(function(data) {
		window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].buildDetail = {};
		window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].buildDetail = data;

		if (data.changeSet.items.length > 0) {
			window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].changes = true;
		} else {
			window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].changes = false;
		}
		if (data.result == "SUCCESS") {
			window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].success = "buildSuccess";
		} else {
			window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].success = "buildFail";
		}
		window.BRICODEPOT_INSTANCES[environement].job.builds[buildItemIndex].buildDate = FRDateString(new Date(data.timestamp));
	}).always(function() {
		window.BRICODEPOT_INSTANCES[environement].job.callCount = window.BRICODEPOT_INSTANCES[environement].job.callCount + 1;
		if ((window.BRICODEPOT_INSTANCES[environement].job.builds.length) === window.BRICODEPOT_INSTANCES[environement].job.callCount) {
			displayEnvironementJobDetail(environement, window.BRICODEPOT_INSTANCES[environement]);
		}
	});
}

function FRDateString(date) {
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
	return pad(date.getDate() + 1) + '/' + pad(date.getMonth()) + '/' + pad(date.getFullYear()) + ' à ' + pad(date.getHours()) + 'h' + pad(date.getMinutes());
}

connectToBricoDepot = function() {
	$.each(window.BRICODEPOT_INSTANCES, function(environement, instance) {
		var url = instance.instance_url + BRICO_JSON_PATH;
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

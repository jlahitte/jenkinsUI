function connectToBricoDepot() {
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
				} else if (data.result == "FAILURE") {
					window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].success = "buildFail";
				} else {
					window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].success = "other";
				}
				window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].buildDate = FRDateString(new Date(data.timestamp));
				window.BRICO_ENVIRONEMENT[environement].job.builds[buildItemIndex].sha = data.actions[1].lastBuiltRevision.SHA1;

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
	return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getFullYear()) + ' à ' + pad(date.getHours()) + 'h' + pad(date.getMinutes());
}

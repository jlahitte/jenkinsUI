$.handlebars({
	templatePath : './ressources/templates/',
	templateExtension : 'hbs'
});

function displayEnvironementJobDetail(environement, job) {

	var aDiv = $("<div>", {
		id : "div_" + environement
	});
	if (environement == "DR1") {
		$("#jobsHandleBarsDR1").append(aDiv);
	} else if (environement == "IR1") {
		$("#jobsHandleBarsIR1").append(aDiv);
	} else if (environement == "PP2") {
		$("#jobsHandleBarsPP2").append(aDiv);
	} else if (environement == "PRD") {
		$("#jobsHandleBarsPRD").append(aDiv);
	}

	aDiv.render('jenkinsJobDetail', job);
	$("#" + environement + "Panel").show(1000);
}

displayChangeSet = function(build) {
	console.log("displaying ChangeSet");
	// Récupération du div attenant au lien (défini dans "jankinsJobDetail.hbs")
	var div = $("[data-buildNumber=" + build.number + "]");
	if (build.changeSet.items.length > 0) {
		// Builds to display
		div.render('jenkinsChangeSet', build);
	} else {
		// Nothing to display
		console.log("No build to display");
		div.html("<span class='error'>No changes...</span>");
	}

}

displayJobLastCommit = function(commit) {
	var aSpan = $("<span>", {
		id : "span_" + commit.fullDisplayName.split(" ")[0]
	});

	if (commit.fullDisplayName.split(" ")[0] == "DEPOT_JAVA_DR1_branch(DR1)") {
		$("#jobsHandleBarsDR1 .l_jobs").first().append(aSpan);
	}
	if (commit.fullDisplayName.split(" ")[0] == "DEPOT_JAVA_IR1_branch(IR1)") {
		$("#jobsHandleBarsIR1 .l_jobs").append(aSpan);
	}
	if (commit.fullDisplayName.split(" ")[0] == "DEPOT_JAVA_PP2_branch(PP2)") {
		$("#jobsHandleBarsPP2 .l_jobs").append(aSpan);
	}
	if (commit.fullDisplayName.split(" ")[0] == "DEPOT_JAVA_PROD_branch") {
		$("#jobsHandleBarsPRD .l_jobs").append(aSpan);
	}
	var lastCommit = {
		lastCommit : commit.actions[1].lastBuiltRevision.SHA1,
		branch : commit.actions[1].lastBuiltRevision.branch[0].name,
		url : GITHUB_URL + "commit/" + commit.actions[1].lastBuiltRevision.SHA1
	};
	aSpan.render('commit', lastCommit);
}

listAssystFromGH = function(env) {
	$("#jenkinsBuildListGlobalDiv").hide(900);
	$.each(window.BRICO_ENVIRONEMENT, function(environement, instance) {
		if (env != environement) {
			$("#" + environement + "Panel").hide(900);
		} else {
			$("#" + environement + "Panel").show(1000);
		}
	});
	var boxListAssyst = $("#assystList");
	boxListAssyst.html("");
	boxListAssyst.append("<div><ul class='list-group col-xs-12 col-sm-12 col-md-12 col-lg-12'>");
	boxListAssyst.append("<li  class='list-group-item active'>Liste des assysts sur l'environement <b>" + env + "</b></li>");
	var index = 0;
	$.each(window.ASSYST_LIST, function(assyst, entry) {
		var coll = ' listcol-xs-12 col-sm-12 col-md-4 col-lg-4 ';
		if (environementContainsAssyst(env, assyst)) {
			if (window.ASSYST_LIST[assyst][env].ahead_by > 0) {
				boxListAssyst.append("<li class='list-group-item list-group-item-danger " + coll + "'><b>" + window.ASSYST_LIST[assyst].name
						+ "</b> <span class='badge badge-danger'>" + window.ASSYST_LIST[assyst][env].ahead_by + "</span></li>");
			} else {
				boxListAssyst.append("<li class='list-group-item list-group-item-success " + coll + "'><b>" + window.ASSYST_LIST[assyst].name
						+ "</b>  <span class='badge badge-success'><span class='glyphicon glyphicon-ok-sign' aria-hidden='true'></span></span></li>");
			}
		} else {
			boxListAssyst.append("<li class='list-group-item " + coll + "'><b>" + window.ASSYST_LIST[assyst].name
					+ "</b> <span class='badge'><span class='glyphicon glyphicon glyphicon-ban-circle' aria-hidden='true'></span></span></li>");
		}
		index++;
	});
	boxListAssyst.append("</ul></div>");
	$("#assystListGlobalDiv").show(1000);
}

listJenkinsBuild = function(env) {
	$("#assystListGlobalDiv").hide(900);
	$.each(window.BRICO_ENVIRONEMENT, function(environement, instance) {
		if (env != environement) {
			$("#" + environement + "Panel").hide(900);
		} else {
			$("#" + environement + "Panel").show(1000);
		}
	});
	var boxListBuilds = $("#jenkinsBuildList");
	boxListBuilds.html("");
	var coll = ' listcol-xs-12 col-sm-12 col-md-4 col-lg-4 ';
	boxListBuilds.append('<ul class=" list-group col-xs-12 col-sm-12 col-md-12 col-lg-12">');
	$.each(window.BRICO_ENVIRONEMENT[env].job.builds, function(build, entry) {

		if (entry.changes) {
			if (entry.success == "buildSuccess") {
				boxListBuilds.append('<li class="list-group-item list-group-item-success ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate + '</li>');
			} else {
				boxListBuilds.append('<li class="list-group-item list-group-item-danger ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate + '</li>');
			}
		} else {
			if (entry.success == "buildSuccess") {
				boxListBuilds.append('<li  class="list-group-item list-group-item-success ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate
						+ '<span class="badge badge-success"><span class="glyphicon glyphicon glyphicon-ban-circle" aria-hidden="true"></span></span></li>');
			} else {
				boxListBuilds.append('<li  class="list-group-item list-group-item-danger ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate
						+ '<span class="badge badge-danger"><span class="glyphicon glyphicon glyphicon-ban-circle" aria-hidden="true"></span></span></li>');
			}
		}
	});
	boxListBuilds.append('</ul>');

	$("#jenkinsBuildListGlobalDiv").show(1000);
}

fermerPanel = function() {
	$("#assystListGlobalDiv").hide(900);
	$("#jenkinsBuildListGlobalDiv").hide(900);
	$.each(window.BRICO_ENVIRONEMENT, function(environement, instance) {
		$("#" + environement + "Panel").show(1000);
	});
}

openGitHub = function(url) {
	var gui = require('nw.gui');

	// Open URL with default browser.
	gui.Shell.openExternal(url);

};

function togglechangeSetDetail(event, id) {
	event.preventDefault();
	$('#' + id).toggle();
}

function launchUnderIE(url) {
	var exec = require('child_process').exec, child;

	child = exec('\"C:\\Program\ Files\\Internet\ Explorer\\iexplore.exe\" ' + url, function(error, stdout, stderr) {
		if (stdout !== null) {
			console.log('D�marrage du lien dans IE : ' + stdout);
		}
		if (stderr !== null) {
			console.log("Erreur lors de l'ouverture de l'url dans IE: " + stderr);
		}
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
}

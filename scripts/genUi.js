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

displayAssyst = function(data) {
	var boxListAssyst = $("#assystList");
	boxListAssyst.html("");
	for ( var i in ASSYST_HASHMAP) {
		boxListAssyst.append("<span class='assystItem'>" + i + "</span> </br>");
	}
	boxListAssyst.show();

	ASSYST_HASHMAP = [];

}
openGitHub = function(url) {
	var gui = require('nw.gui');

	// Open URL with default browser.
	gui.Shell.openExternal(url);

};

function togglechangeSetDetail(event,id){
	event.preventDefault();
	$( '#'+id ).toggle();
}
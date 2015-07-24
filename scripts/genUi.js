$.handlebars({
	templatePath : './ressources/templates/',
	templateExtension : 'hbs'
});

function displayEnvironementJobDetail(environement, job) {

	var aDiv;
	if (environement == "DR1") {
		aDiv = $("#jobsHandleBarsDR1");
	} else if (environement == "IR1") {
		aDiv = $("#jobsHandleBarsIR1");
	} else if (environement == "PP2") {
		aDiv = $("#jobsHandleBarsPP2");
	} else if (environement == "PRD") {
		aDiv = $("#jobsHandleBarsPRD");
	}
	aDiv.render('bs_env_detail', job);
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
	var boxListAssyst = $("#assystList");
	boxListAssyst.html("");	
	boxListAssyst.append("<div class='assystItem'>sur l'environnement <b>"+ env + "</b></div>");
	boxListAssyst.append("<div class='assystItem'><h4>");

	boxListAssyst.append("<ul>");
	boxListAssyst.append("<li><span class='label label-default'>des modifications sont en cours pour cette assyst et non present sur l'environement</span></li>");

	boxListAssyst.append("<li><span class='label label-success'>l'environement est Ã  jours pour cette assyst</span></li>");
	boxListAssyst.append("</ul>");
	boxListAssyst.append("</h4>");
	boxListAssyst.append("<h6>");
	$.each(window.ASSYST_LIST, function(assyst, entry) {
		if (window.ASSYST_LIST[assyst][env].ahead_by > 0) {
			boxListAssyst.append("<span class='label label-success'>" + window.ASSYST_LIST[assyst].name + "</span>");
		} else {
			boxListAssyst.append("<span class='label label-default'>" + window.ASSYST_LIST[assyst].name  + "</span>");
		}
		boxListAssyst.append("<br/>")
	});
	boxListAssyst.append("</h6>");
	boxListAssyst.show();

	ASSYST_HASHMAP = [];

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

function launchUnderIE(url){
	var exec = require('child_process').exec,
    child;

child = exec('\"C:\\Program\ Files\\Internet\ Explorer\\iexplore.exe\" ' + url,
  function (error, stdout, stderr) {
    if (stdout !==null){
	console.log('Démarrage du lien dans IE : ' + stdout);
    }
    if (stderr !==null){
    console.log("Erreur lors de l'ouverture de l'url dans IE: " + stderr);	
	}
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
}

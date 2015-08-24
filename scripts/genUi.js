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
	$("#spinner" + environement).fadeOut(500);
}

function listAssystFromGH(env) {
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

	var listAssystPanelTitle = $("#listAssytPanelTitle");
	listAssystPanelTitle.html("");
	listAssystPanelTitle.html("Liste des Assytes de l'environement " + env);

	boxListAssyst.append("<div><ul class='list-group col-xs-12 col-sm-12 col-md-12 col-lg-12'>");
	var index = 0;
	$.each(window.ASSYST_LIST, function(assyst, entry) {
		var coll = ' listcol-xs-12 col-sm-12 col-md-4 col-lg-4 ';
		if (environementContainsAssyst(env, assyst)) {
			if (window.ASSYST_LIST[assyst][env].ahead_by > 0) {
				boxListAssyst.append('<li class="list-group-item list-group-item-danger ' + coll
						+ '"><a class="bricoListLink" href="#"  data-toggle="modal"  data-target="#assytCommitsCommentModal"  onclick="updateAssystCommitsComments(\'' + assyst
						+ '\',\'' + env + '\',\'danger\');"><b>' + window.ASSYST_LIST[assyst].name + '</b></a><span class="badge badge-danger">'
						+ window.ASSYST_LIST[assyst][env].ahead_by + '</span></li>');
			} else {
				boxListAssyst.append('<li class="list-group-item list-group-item-success ' + coll + '"><b>' + window.ASSYST_LIST[assyst].name
						+ '</b><span class="badge badge-success"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></span></li>');
			}
		} else {
			boxListAssyst.append('<li class="list-group-item ' + coll + '"><b>' + window.ASSYST_LIST[assyst].name
					+ '</b><span class="badge"><span class="glyphicon glyphicon glyphicon-ban-circle" aria-hidden="true"></span></span></li>');
		}
		index++;
	});
	boxListAssyst.append("</ul></div>");
	$("#assystListGlobalDiv").show(1000);
}

function listJenkinsBuild(env) {
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

	var listBuildPanelTitle = $("#listBuildPanelTitle");
	listBuildPanelTitle.html("");
	listBuildPanelTitle.html("Liste des Builds Jenkins de l'environement " + env);

	var coll = ' listcol-xs-12 col-sm-12 col-md-4 col-lg-4 ';
	boxListBuilds.append('<ul class=" list-group col-xs-12 col-sm-12 col-md-12 col-lg-12">');
	$.each(window.BRICO_ENVIRONEMENT[env].job.builds, function(build, entry) {

		if (entry.changes) {
			if (entry.success == "buildSuccess") {
				boxListBuilds.append('<li class="list-group-item list-group-item-success ' + coll
						+ '"><a class="bricoListLink" href="#" data-toggle="modal" data-target="#buildCommitsCommentModal" onclick="updateBuildCommitsComments(\'' + entry.number
						+ '\',\'' + env + '\',\'success\');">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate + '</a><span class="badge badge-success">'
						+ entry.buildDetail.changeSet.items.length + '</span></span></li>');
			} else if (entry.success == "buildFail") {
				boxListBuilds.append('<li class="list-group-item list-group-item-danger ' + coll
						+ '"><a class="bricoListLink" href="#" data-toggle="modal"  data-target="#buildCommitsCommentModal" onclick="updateBuildCommitsComments(\'' + entry.number
						+ '\',\'' + env + '\',\'danger\');">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate + '</a><span class="badge badge-danger">'
						+ entry.buildDetail.changeSet.items.length + '</span></span></li>');
			} else {
				boxListBuilds.append('<li class="list-group-item' + coll
						+ '"><a class="bricoListLink" href="#" data-toggle="modal"  data-target="#buildCommitsCommentModal" onclick="updateBuildCommitsComments(\'' + entry.number
						+ '\',\'' + env + '\');">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate + '</a><span class="badge">' + entry.buildDetail.changeSet.items.length
						+ '</span></span></li>');
			}
		} else {
			if (entry.success == "buildSuccess") {
				boxListBuilds.append('<li  class="list-group-item list-group-item-success ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate
						+ '<span class="badge badge-success"><span class="glyphicon glyphicon glyphicon-ban-circle" aria-hidden="true"></span></span></li>');
			} else if (entry.success == "buildFail") {
				boxListBuilds.append('<li  class="list-group-item list-group-item-danger ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate
						+ '<span class="badge badge-danger"><span class="glyphicon glyphicon glyphicon-ban-circle" aria-hidden="true"></span></span></li>');
			} else {
				boxListBuilds.append('<li  class="list-group-item list-group-item-danger ' + coll + '">Build n°<b>' + entry.number + '</b> du ' + entry.buildDate
						+ '<span class="badge"><span class="glyphicon glyphicon glyphicon-ban-circle" aria-hidden="true"></span></span></li>');
			}
		}
	});
	boxListBuilds.append('</ul>');

	$("#jenkinsBuildListGlobalDiv").show(1000);
}

function fermerPanel() {
	$("#assystListGlobalDiv").hide(900);
	$("#jenkinsBuildListGlobalDiv").hide(900);
	$.each(window.BRICO_ENVIRONEMENT, function(environement, instance) {
		$("#" + environement + "Panel").show(1000);
	});
}

function openGitHub(url) {
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
			console.log('Démarrage du lien dans IE : ' + stdout);
		}
		if (stderr !== null) {
			console.log("Erreur lors de l'ouverture de l'url dans IE: " + stderr);
		}
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
}

function updateAssystCommitsComments(assytNumber, environement, status) {
	$("#assytCommitsCommentModalHeader").removeClass();
	if (status) {
		$("#assytCommitsCommentModalHeader").addClass("modal-header alert-" + status);
	} else {
		$("#assytCommitsCommentModalHeader").addClass("modal-header");
	}
	$("#assytCommitsCommentModalTitle").html("");
	$("#assytCommitsCommentModalTitle").html("Commentaires pour l'Assyt " + assytNumber + " sur l'environement " + environement);

	var assytCommitsCommentModalBody = $("#assytCommitsCommentModalBody");
	assytCommitsCommentModalBody.html("");
	assytCommitsCommentModalBody.append('<ul>');
	$.each(window.ASSYST_LIST[assytNumber][environement].commits, function(index, commitData) {
		assytCommitsCommentModalBody.append('<li> le ' + commitData.commit.author.date + ' par ' + commitData.commit.author.name + ' : ' + commitData.commit.message
				+ '</li>');
	});
	assytCommitsCommentModalBody.append('</ul>');
}

function updateBuildCommitsComments(buildNumber, environement, status) {
	$("#buildCommitsCommentModalHeader").removeClass();
	if (status) {
		$("#buildCommitsCommentModalHeader").addClass("modal-header alert-" + status);
	} else {
		$("#buildCommitsCommentModalHeader").addClass("modal-header");
	}
	$("#buildCommitsCommentModalTitle").html("");
	$("#buildCommitsCommentModalTitle").html("Commentaires pour le build " + buildNumber + " sur l'environement " + environement);

	var buildCommitsCommentModalBody = $("#buildCommitsCommentModalBody");
	buildCommitsCommentModalBody.html("");
	buildCommitsCommentModalBody.append('<ul>');
	$.each(window.BRICO_ENVIRONEMENT[environement].job.builds, function(index, build) {
		if (build.number == buildNumber) {
			$.each(build.buildDetail.changeSet.items, function(index, item) {
				buildCommitsCommentModalBody.append('<li> le ' + FRDateString(new Date(item.timestamp)) + ' par ' + item.author.fullName + ' : ' + item.comment + '</li>');
			});
		}

	});
	buildCommitsCommentModalBody.append('</ul>');
}

function openProxyConfigurationBox(){
	$("#cog-proxy").click(function(){
		cancelProxyData();
	});
	var jsoncfg = require('jsoncfg');
	
	jsoncfg.loadFiles('./cfg', function(err, files, errInfo) {
		if (err) {
			console.log(err + "  " + errInfo['jenkins']);
		}
		var usr = files.proxy.get('proxy.user');
		$("#proxyLogin").val(usr);
		var pass = files.proxy.get('proxy.pass');
		$("#proxyPass").val(pass);
	});
	
	// Display box
	$("#proxyBox").removeClass("hidden-inline-sm");
	
}

function saveProxyData(){
	var jsonfile = require('jsonfile')
	var util = require('util')
	 
	var file = './cfg/proxy.json'
	jsonfile.readFile(file, function(err, obj) {
	  console.dir(obj);
	  obj.proxy.user = $("#proxyLogin").val();
	  obj.proxy.pass = $("#proxyPass").val();
	  jsonfile.writeFile(file,obj);
	  if (!$("#writeStateAlert").length){
		  $("#proxyBox").append("<div id='writeStateAlert' class='alert alert-success' role='alert'>Config. sauvegardé</div>");
	  }
	});
}


function cancelProxyData(){
	$("#proxyBox").addClass("hidden-inline-sm");
	$("#writeStateAlert").remove();
	$("#cog-proxy").click(function(){
		openProxyConfigurationBox();
	});
}
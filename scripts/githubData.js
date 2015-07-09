var github = require('octonode');
var client;
var ghrepo;
var COMMITS_LIST = [];
var assystPattern = new RegExp(/\d{6}/);
var compareEnvPattern = new RegExp(/compare\/([^.]+)/);
authenticate = function() {
	client = github.client(window.GITHUB_TOKEN);
	client.requestDefaults['proxy'] = 'http://tlati_m:Abrico@95.172.74.3:80';
	ghrepo = client.repo('BRICODEPOT/DEPOT_JAVA');
}

getCommits = function(branchId) {
	if (branchId) {
		ghrepo.commits({
			"sha" : branchId
		}, function(err, data, header) {
			if (err) {
				console.log(err);
			} else {
				console.log("nbr Commits : " + data.length);

				// On regarde le contenu des commits
				// et on place les ASSYST dans window.ASSYST_HASHMAP
				var dataLength = data.length;
				for (var i = 0; i < dataLength; i++) {
					countASSYST(data[i].commit.message);
				}
				displayAssyst(data);
			}
		});
	} else {
		ghrepo.commits(function(err, data, header) {
			if (err) {
				console.log(err);
			} else {
				console.log("nbr Commits : " + data.length);

				// On regarde le contenu des commits
				// et on place les ASSYST dans window.ASSYST_HASHMAP
				var dataLength = data.length;
				for (var i = 0; i < dataLength; i++) {
					countASSYST(data[i].commit.message);
				}
				displayAssyst(data);
			}
		});
	}
}

listCommits = function(branchId) {
	getCommits(branchId);
	compareBranche(branchId);
}

function compareBranche(branchId) {
	if (window.ASSYST_LIST) {
		$.each(window.ASSYST_LIST, function(assyst, entry) {
			ghrepo.compareCommits(branchId, entry.name, compareBrancheCallback);
		});
	}
}

function listBrancheCallback(err, body, headers) {

	window.ASSYST_LIST = {};
	if (err) {
		console.log("listBrancheCallback error : " + err);
		return;
	}
	if (body) {
		body.forEach(function(entry) {
			if (assystPattern.test(entry.name)) {
				window.ASSYST_LIST[assystPattern.exec(entry.name)[0]] = entry;
				console.log(entry.name);
			}
		});
	}
}

function compareBrancheCallback(err, body, headers) {
	if (err) {
		console.log("compareBrancheCallback error : " + err);
		return;
	}
	if (body) {
		var assyst = window.assystPattern.exec(body.url)[0];
		var branch = window.compareEnvPattern.exec(body.url)[1];
		$.each(window.JENKINS_BRANCHES, function(env, entry) {
			if(entry.branch_name==branch){
				if(entry.ASSYST_LIST){
					entry.ASSYST_LIST[assyst]=body;
				}else{
					entry.ASSYST_LIST={};
					entry.ASSYST_LIST[assyst]=body;
				}
			}

		});
		
	}
}
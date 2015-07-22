var github = require('octonode');
var client;
var ghrepo;
var assystPattern = new RegExp(/\d{6}/);
var compareEnvPattern = new RegExp(/compare\/([^.]+)/);

authenticate = function() {
	client = github.client(window.GITHUB_TOKEN);
	client.requestDefaults['proxy'] = 'http://' + window.PROXY_USER + ':' + window.PROXY_PASS + '@' + window.PROXY_IP;
	ghrepo = client.repo('BRICODEPOT/DEPOT_JAVA');
}

function compareBranche(branchId) {
	if (window.ASSYST_LIST) {
		$.each(window.ASSYST_LIST, function(assyst, entry) {
			ghrepo.compareCommits(window.BRICO_ENVIRONEMENT[branchId].version.git.commit, entry.commit.sha, compareBrancheCallback, branchId, entry.name);
		});
	}
}

function listAllAssyts(err, body, headers) {

	window.ASSYST_LIST = {};
	if (err) {
		console.log("listAllAssyts error : " + err);
		return;
	}
	if (body) {
		body.forEach(function(entry) {
			if (assystPattern.test(entry.name)) {
				window.ASSYST_LIST[assystPattern.exec(entry.name)[0]] = entry;
				console.log(entry.name);
			}
		});

		$.each(window.BRICO_ENVIRONEMENT, function(branchId, entry) {
			if (branchId != "PRD") {
				compareBranche(branchId);
			}
			$.each(window.ASSYST_LIST, function(assyst, entry) {
				ghrepo.compareCommits("master", entry.commit.sha, compareBrancheCallback, "master", entry.name);
			});
		});
	}
}

function compareBrancheCallback(err, body, headers, branch, assyst) {
	if (err) {
		console.log("compareBrancheCallback error : " + err);
		return;
	}
	if (body) {
		var assystNumber = window.assystPattern.exec(assyst)[0];
		$.each(window.BRICO_ENVIRONEMENT, function(env, entry) {
			if (entry.branch_name == branch) {
				if (window.ASSYST_LIST) {
					window.ASSYST_LIST[assystNumber][branch] = {};
					window.ASSYST_LIST[assystNumber][branch] = body;
				} else {
					window.ASSYST_LIST = {};
					window.ASSYST_LIST[assystNumber] = {};
					window.ASSYST_LIST[assystNumber][branch] = {};
					window.ASSYST_LIST[assystNumber][branch] = body;
				}
			}
		});
	}
}

function dr1CommitsListCallback(err, body, headers) {
	environementCommitsListCallback(err, body, headers, "DR1");
}

function pp2CommitsListCallback(err, body, headers) {
	environementCommitsListCallback(err, body, headers, "PP2");
}

function ir1CommitsListCallback(err, body, headers) {
	environementCommitsListCallback(err, body, headers, "IR1");
}

function prdCommitsListCallback(err, body, headers) {
	environementCommitsListCallback(err, body, headers, "PRD");
}

function environementCommitsListCallback(err, body, headers, env) {
	if (err) {
		console.log("environementCommitsListCallback error : " + err);
		return;
	}
	if (body) {
		if (window.BRICO_ENVIRONEMENT[env].commitList) {
			window.BRICO_ENVIRONEMENT[env].commitList = window.BRICO_ENVIRONEMENT[env].commitList.concat(body);
		} else {
			window.BRICO_ENVIRONEMENT[env].commitList = [];
			window.BRICO_ENVIRONEMENT[env].commitList = body;
		}

	}
}
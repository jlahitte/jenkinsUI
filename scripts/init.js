$(document).ready(function() {
	var jsoncfg = require('jsoncfg');
	jsoncfg.loadFiles('./cfg', function(err, files, errInfo) {
		if (err) {
			console.log(err + "  " + errInfo['jenkins']);
		}
		var jenkinsFcfg = files.jenkins;
		console.log("Conf file :" + jenkinsFcfg);
		window.JENKINS_URL = jenkinsFcfg.get('jenkins.url');

		var githubFcfg = files.gitHub;
		console.log("Conf file :" + githubFcfg);
		window.GITHUB_URL = githubFcfg.get('github.url');
		window.GITHUB_TOKEN = githubFcfg.get('authentification.token');

		window.JENKINS_BRANCHES = files.branches.environnements;

		window.BRICODEPOT_INSTANCES = files.instances.BRICODEPOT;

		// lancement du traitement
		connectToBricoDepot();
		$("#assystList").hide();
	});
});

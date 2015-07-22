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

		var proxyFcfg = files.proxy;
		window.PROXY_USER = proxyFcfg.get('proxy.user');
		window.PROXY_PASS = proxyFcfg.get('proxy.pass');
		window.PROXY_IP = proxyFcfg.get('proxy.ip');
		authenticate();
		ghrepo.branches(listBrancheCallback);	
		// lancement du traitement
		connectToBricoDepot();
		$("#assystList").hide();
	});
});

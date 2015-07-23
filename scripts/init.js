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
		window.BRICO_ENVIRONEMENT = files.branches.environnements;

		var proxyFcfg = files.proxy;
		window.PROXY_USER = proxyFcfg.get('proxy.user');
		window.PROXY_PASS = proxyFcfg.get('proxy.pass');
		window.PROXY_IP = proxyFcfg.get('proxy.ip');
		authenticate();
		initEnvironementCommitsList();
		initAsstsytList();
		// lancement du traitement
		connectToBricoDepot();
		$("#assystList").hide();
	});
});

function initAsstsytList() {
	ghrepo.branches(listAllAssyts);
}

function initEnvironementCommitsList() {
	for (var index = 1; index <= 3; index++) {

		ghrepo.commits({
			sha : "DR1",
			page : index,
			per_page : 200
		}, "DR1", dr1CommitsListCallback);
		ghrepo.commits({
			sha : "PP2",
			page : index,
			per_page : 200
		}, "PP2", pp2CommitsListCallback);
		ghrepo.commits({
			sha : "IR1",
			page : index,
			per_page : 200
		}, "IR1", ir1CommitsListCallback);
		ghrepo.commits({
			page : index,
			per_page : 200
		}, "master", prdCommitsListCallback);

	}
}
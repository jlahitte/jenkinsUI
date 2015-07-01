var github = require('octonode');
var client;
var COMMITS_LIST = [];
authenticate = function(accessToken) {
	client = github.client(accessToken);
	client.requestDefaults['proxy'] = 'http://lahitte_j:Mois06@95.172.74.3:80'
}

getCommits = function(branchId) {
	var ghrepo = client.repo('BRICODEPOT/DEPOT_JAVA');
	if (branchId) {
		ghrepo.commits({
			"sha" : branchId
		}, function(err, data, header) {
			if (err) {
				console.log(err);
			} else {
				console.log("nbr Commits : " + data.length);
				
				//On regarde le contenu des commits 
				// et on place les ASSYST dans window.ASSYST_HASHMAP
				var dataLength = data.length;
				for(var i = 0; i < dataLength; i++){
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
				
				//On regarde le contenu des commits 
				// et on place les ASSYST dans window.ASSYST_HASHMAP
				var dataLength = data.length;
				for(var i = 0; i < dataLength; i++){
					countASSYST(data[i].commit.message);
				}
				displayAssyst(data);
			}
		});
	}
}
listCommits = function(accessToken, branchId) {
	authenticate(accessToken);
	getCommits(branchId);

}

jenkinsJobUrlToGHBranch = function(url){
	var branchSize =  window.JENKINS_BRANCHES.length;
	if (branchSize > 0 ){
		for (var i = 0 ; i < branchSize;i++){
			var urlBranch = window.JENKINS_BRANCHES[i].branch_url;
			if (urlBranch == url){
				return window.JENKINS_BRANCHES[i].branch_name;
			} 
		}
	}
}
// var ghme = client.me();
// var ghuser = client.user('pksunkara');
// var ghrepo = client.repo('pksunkara/hub');
// var ghorg = client.org('flatiron');
// var ghissue = client.issue('pksunkara/hub', 37);
// var ghmilestone = client.milestone('pksunkara/hub', 37);
// var ghlabel = client.label('pksunkara/hub', 'todo');
// var ghpr = client.pr('pksunkara/hub', 37);
// var ghgist = client.gist();
// var ghteam = client.team(37);

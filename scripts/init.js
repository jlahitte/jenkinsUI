$(document).ready(function(){
	var jsoncfg = require('jsoncfg');
	jsoncfg.loadFiles('./cfg',
			function(err, files, errInfo) {
				if (err){
					console.log(err + "  " + errInfo['jenkins']);
				}
				var jenkinsFcfg = files.jenkins;
				console.log("Conf file :" + jenkinsFcfg);
				window.JENKINS_URL = jenkinsFcfg.get('jenkins.url');
				var branches = files.branchs;
				window.JENKINS_BRANCHES = [branches.environnements.DR1,
										   branches.environnements.IR1,
										   branches.environnements.PP2,
										   branches.environnements.PRD];
				//lancement du traitement
				connectToJenkins();
				//Initialisation interface web
				$("#assystList").hide();
			});
});

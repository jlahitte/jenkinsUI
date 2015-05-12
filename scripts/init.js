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
				//lancement du traitement
				connectToJenkins();
				//Initialisation interface web
				$("#assystList").hide();
			});
});

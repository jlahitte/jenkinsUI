$.handlebars({
  templatePath : './ressources/templates/',
  templateExtension : 'hbs'
});

displayJobDetail = function(job){

  var aDiv = $("<div>",{
    id: "div_" + job.name
  });
  $("#jobsHandleBars").append(aDiv);
  aDiv.render('jenkinsJobDetail', job);

}

displayChangeSet = function(build){
	console.log("displaying ChangeSet");
	//Récupération du div attenant au lien (défini dans "jankinsJobDetail.hbs")
	var div = $("[data-buildNumber=" + build.number+"]");
	div.render('jenkinsChangeSet', build);
}
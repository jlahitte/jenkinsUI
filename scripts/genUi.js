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
  if (build.changeSet.items.length > 0){
    //Builds to display
	  div.render('jenkinsChangeSet', build);
  }else{
    //Nothing to display
    console.log("No build to display");
    div.html("<span class='error'>No changes...</span>");
  }

}

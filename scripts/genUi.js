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

var LASTBUILD_URI = "/lastBuild/api/json?pretty=true";
var JSON_PATH = "api/json?pretty=true";
var JOBS_PATH = "/view/All/job/";
var BUILD_HISTORY_MAX = 10;
detailForBuild = function(urlB){
  return $.getJSON(urlB);
}
listAssystFor = function (url){
  $.getJSON(url).done(function(data){
      var builds = [] ;
      var maxBuild = BUILD_HISTORY_MAX;
      // Cas des jobs avec peux de build
      if (maxBuild > data.builds.length ){
        maxBuild = data.builds.length;
      }
      for (var j = 0; j < maxBuild; j++){
        var b = data.builds[j];
        var urlToLaunch = b.url+JSON_PATH;
        builds.push(detailForBuild(urlToLaunch));
      }
    $.when.apply(this,builds).then(function(){

      for (var i = 0; i < arguments.length;i++){
        var build = arguments[i][0];
        var items = build.changeSet.items;
        for (var j=0;j<items.length;j++){
          var item = items[j];
          console.log(item.comment);
        }
      }

    })
  });

  //TODO : détecter la présence de numéro d'assyst et les stocker dans un hashmap (key: num assys, valeur: nombre de fois rencontré)
  //Affichage de ce hashmap


}

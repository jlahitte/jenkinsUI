var LASTBUILD_URI = "/lastBuild/api/json?pretty=true";
var JSON_PATH = "api/json?pretty=true";
var JOBS_PATH = "/view/All/job/";
var BUILD_HISTORY_MAX = 10;
var ASSYST_HASHMAP = [];
detailForBuild = function(urlB) {
	return $.getJSON(urlB);
}

// Detecte les numéros d'assyst et les stock dans la table ASSYST_HASHMAP
countASSYST = function(comment) {
	var re = /(\d{6})/g;
	var str = comment;
	var m;

	while ((m = re.exec(str)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		for (var i = 0; i < m.length; i++) {
			if (ASSYST_HASHMAP[m[i]]) {
				ASSYST_HASHMAP[m[i]] += 1;
			} else {
				ASSYST_HASHMAP[m[i]] = 1;
			}
		}
	}

	console.log(Object.keys(ASSYST_HASHMAP));


}

listAssystFor = function(url) {
	$.getJSON(url + JSON_PATH).done(function(data) {
		var builds = [];
		var maxBuild = BUILD_HISTORY_MAX;
		// Cas des jobs avec peux de build
		if (maxBuild > data.builds.length) {
			maxBuild = data.builds.length;
		}
		for (var j = 0; j < maxBuild; j++) {
			var b = data.builds[j];
			var urlToLaunch = b.url + JSON_PATH;
			builds.push(detailForBuild(urlToLaunch));
		}
		$.when.apply(this, builds).then(function() {

			for (var i = 0; i < arguments.length; i++) {
				var build = arguments[i][0];
				var items = build.changeSet.items;
				for (var j = 0; j < items.length; j++) {
					var item = items[j];

					countASSYST(item.comment);
				}
			}
			//TODO : Affichage résultat à faire
			alert("Liste ASSSYT : " + Object.keys(ASSYST_HASHMAP));
			ASSYST_HASHMAP = [];
		})
	});

}

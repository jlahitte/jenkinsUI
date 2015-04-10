$( 
		main = function() {
		  var LASTBUILD_URI = "/lastBuild/api/json?pretty=true";
		  var LIST_ALL_JOB = "/api/json?pretty=true";
		  var JOBS_PATH = "/view/All/job/";
		  var br = $('<br>');
		  $(document).ready(function() {
			//////////////////////////
		    //List all jobs
		    ////////////////////////
		    var jqxhrAllJobs = $.getJSON( JENKINS_URL+LIST_ALL_JOB, function(data) {
		    $.each(data.jobs, function(i, job){
		
		      displayOneJob(job);
		      ///////////////////////////////////
		      //Récupération du dernier build
		      //////////////////////////////////
		      var jqxhrAllJobs = $.getJSON( JENKINS_URL+ JOBS_PATH + job.name+ LASTBUILD_URI, function(data) {
		          var a_lastBuild = $('<a>',{
		            text: data.displayName,
		            href: data.url,
		            id: a_lastBuild +job.name
		          });
		          var spanJobNameId = "#span_" + suppSymbolFromBranch(job.name);
		          $(spanJobNameId).append(a_lastBuild);
		          var divLastCommit = $('<div>',{
		            id : "lastCommit" + job.name,
		            class: "d_LastCommit"
		          }).appendTo($(spanJobNameId));
		
		          $.each(data.changeSet.items,function(j,item){
		            divLastCommit.append(item.comment).append(br);
		          });
		      }).fail(function() {
		    	  var spanJobNameId = "#span_" + suppSymbolFromBranch(job.name);
		    	    console.log( "error");
		            // On finalise la ligne par un saut de ligne
		            $(spanJobNameId).append(br);
		      });
		      ///////////////////////////////////
		      //Appeler à chaque fois que l'appel JSON est finalisé
		      ///////////////////////////////////
		      jqxhrAllJobs.complete(function() {
		    	  var spanJobNameId = "#span_" + suppSymbolFromBranch(job.name);
		        // On finalise la ligne par un saut de ligne
		        $(spanJobNameId).append(br);
		      });
		    });
		  });
		  });
		  suppSymbolFromBranch = function(value){
				var re = /([\(-\)])/g; 
				return value.replace(re,"-");
			}
		
		  displayOneJob = function (job){
		    var icon = "./ressources/img/greenchecked.png";
		    if (job.color !== "blue"){
		      icon = "./ressources/img/redchecked.png";
		    }
		    var spanJobNameId = "#span_" + suppSymbolFromBranch(job.name);
		    var span = $('<span>',{id: spanJobNameId}).addClass('text_valign-middle');
		    var img = $('<img>',{
		      id: "icon_" +job.name,
		      src: icon
		    });
		    var a_href = $('<a>',{
		        id: "a_" + job.name,
		        text: job.name,
		        title: job.name,
		        href: job.url
		    }).addClass('l_jobs');
		
		    span.append(img).append(a_href).appendTo("#jobs");
		  }
})


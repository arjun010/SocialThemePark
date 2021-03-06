var Bubbles, root, texts;
texts = [
  {
    key: "batman",
    file: "batman.csv",
    name: "Batman"
  }, {
    key: "goliath",
    file: "goliath.csv",
    name: "Goliath"
  }, {
    key: "sevendwarfsminetrain",
    file: "sevendwarfsminetrain.csv",
    name: "Seven Dwarfs Mine Train"
  }, {
    key: "spacemountain",
    file: "spacemountain.csv",
    name: "Space Mountain"
  }, {
    key: "hulkride",
    file: "hulkride.csv",
    name: "Hulk Ride"
  }
];


var tweetsSDMT = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../newSearch/sevendwarfsminetrain.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

var tweetsSpaceMountain = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../newSearch/spacemountain.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

var tweetsGoliath = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../newSearch/goliath.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

var tweetsBatman = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../newSearch/batman.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

var tweetsHulkRide = (function() {
  console.log("this function called");
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../newSearch/hulkride.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();



root = typeof exports !== "undefined" && exports !== null ? exports : this;
Bubbles = function() {
  var chart, clear, click, collide, collisionPadding, connectEvents, data, force, gravity, hashchange, height, idValue, jitter, label, margin, maxRadius, minCollisionRadius, mouseout, mouseover, node, rScale, rValue, textValue, tick, transformData, update, updateActive, updateLabels, updateNodes, width;
  width = 1150;
  height = 900;
  data = [];
  node = null;
  label = null;
  margin = {
    top: 5,
    right: 0,
    bottom: 0,
    left: 0
  };
  maxRadius = 65;
  rScale = d3.scale.sqrt().range([0, maxRadius]);
  rValue = function(d) {
    return parseInt(d.count);
  };
  idValue = function(d) {
    return d.name;
  };
  textValue = function(d) {
    return d.name;
  };
  collisionPadding = 4;
  minCollisionRadius = 12;
  jitter = 0.5;
  transformData = function(rawData) {
    rawData.forEach(function(d) {
      d.count = parseInt(d.count);
      return rawData.sort(function() {
        return 0.5 - Math.random();
      });
    });
    return rawData;
  };
  tick = function(e) {
    var dampenedAlpha;
    dampenedAlpha = e.alpha * 0.1;
    node.each(gravity(dampenedAlpha)).each(collide(jitter)).attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    return label.style("left", function(d) {
      return ((margin.left + d.x) - d.dx / 2) + "px";
    }).style("top", function(d) {
      return ((margin.top + d.y) - d.dy / 2) + "px";
    });
  };
  force = d3.layout.force().gravity(0).charge(0).size([width, height]).on("tick", tick);
  chart = function(selection) {
    return selection.each(function(rawData) {
      var maxDomainValue, svg, svgEnter;
      data = transformData(rawData);
      maxDomainValue = d3.max(data, function(d) {
        return rValue(d);
      });
      rScale.domain([0, maxDomainValue]);
      svg = d3.select(this).selectAll("svg").data([data]);
      svgEnter = svg.enter().append("svg");
      svg.attr("width", width + margin.left + margin.right);
      svg.attr("height", height + margin.top + margin.bottom);
      node = svgEnter.append("g").attr("id", "bubble-nodes").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      node.append("rect").attr("id", "bubble-background").attr("width", width).attr("height", height).on("click", clear);
      label = d3.select(this).selectAll("#bubble-labels").data([data]).enter().append("div").attr("id", "bubble-labels");
      update();
      hashchange();
      return d3.select(window).on("hashchange", hashchange);
    });
  };
  update = function() {
    data.forEach(function(d, i) {
      return d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)));
    });
    force.nodes(data).start();
    updateNodes();
    return updateLabels();
  };
  updateNodes = function() {
    node = node.selectAll(".bubble-node").data(data, function(d) {
      return idValue(d);
    });
    node.exit().remove();
    return node.enter().append("a").attr("class", "bubble-node").attr("xlink:href", function(d) {
      return "#" + (encodeURIComponent(idValue(d)));
    }).call(force.drag).call(connectEvents).append("circle").attr("r", function(d) {
      return rScale(rValue(d));
    });
  };
  updateLabels = function() {
    var labelEnter;
    label = label.selectAll(".bubble-label").data(data, function(d) {
      return idValue(d);
    });
    label.exit().remove();
    labelEnter = label.enter().append("a").attr("class", "bubble-label").attr("href", function(d) {
      return "#" + (encodeURIComponent(idValue(d)));
    }).call(force.drag).call(connectEvents);
    labelEnter.append("div").attr("class", "bubble-label-name").text(function(d) {
      return textValue(d);
    });
    labelEnter.append("div").attr("class", "bubble-label-value").text(function(d) {
      return rValue(d);
    });
    label.style("font-size", function(d) {
      return Math.max(8, rScale(rValue(d) / 2)) + "px";
    }).style("width", function(d) {
      return 2.5 * rScale(rValue(d)) + "px";
    });
    label.append("span").text(function(d) {
      return textValue(d);
    }).each(function(d) {
      return d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
    }).remove();
    label.style("width", function(d) {
      return d.dx + "px";
    });
    return label.each(function(d) {
      return d.dy = this.getBoundingClientRect().height;
    });
  };
  gravity = function(alpha) {
    var ax, ay, cx, cy;
    cx = width / 2;
    cy = height / 2;
    ax = alpha / 8;
    ay = alpha;
    return function(d) {
      d.x += (cx - d.x) * ax;
      return d.y += (cy - d.y) * ay;
    };
  };
  collide = function(jitter) {
    return function(d) {
      return data.forEach(function(d2) {
        var distance, minDistance, moveX, moveY, x, y;
        if (d !== d2) {
          x = d.x - d2.x;
          y = d.y - d2.y;
          distance = Math.sqrt(x * x + y * y);
          minDistance = d.forceR + d2.forceR + collisionPadding;
          if (distance < minDistance) {
            distance = (distance - minDistance) / distance * jitter;
            moveX = x * distance;
            moveY = y * distance;
            d.x -= moveX;
            d.y -= moveY;
            d2.x += moveX;
            return d2.y += moveY;
          }
        }
      });
    };
  };
  connectEvents = function(d) {
    d.on("click", click);
    d.on("mouseover", mouseover);
    return d.on("mouseout", mouseout);
  };
  clear = function() {
    return location.replace("#");
  };
  click = function(d) {
    location.replace("#" + encodeURIComponent(idValue(d)));
    return d3.event.preventDefault();
  };
  hashchange = function() {
    var id;
    id = decodeURIComponent(location.hash.substring(1)).trim();
    return updateActive(id);
  };
  updateActive = function(id) {
     if($(".tweet").length > 0){
              $(".tweet").remove();
          }
    // node.classed("bubble-selected");
    node.classed("bubble-selected", function(d) {
      return id === idValue(d);
    });
    if (id.length > 0) {
      key = decodeURIComponent(location.search).replace("?", "");
      key = key.replace("/","")
      //console.log(key);  
      var curRideTweets;
      if(key=="sevendwarfsminetrain"){
        curRideTweets=tweetsSDMT;
      }else if(key=="goliath"){
        curRideTweets=tweetsGoliath;
      }else if(key=="batman"){
        curRideTweets=tweetsBatman;
      }else if(key=="spacemountain"){
        curRideTweets=tweetsSpaceMountain;
      }else if(key=="hulkride"){
        curRideTweets=tweetsHulkRide;
      }
      

      for (var i =0; i<curRideTweets.length; i++){
        if(curRideTweets[i]['tweet'].toLowerCase().indexOf(id) > -1){
          //console.log(curRideTweets[i]['tweet']);
          $('#'+key+'modal '+'#tweetsList').prepend('<li class="tweet list-group-item">'+curRideTweets[i]['tweet']+'</li>');
        }
      }
      return $(".status").html("<h3>Showing tweets with word <span class=\"active\">" + id + "</span> </h3>");
    } else {
      $(".tweet").remove();
      return $(".status").html("<h3>No word is active</h3>");
    }
  };
  mouseover = function(d) {
    return node.classed("bubble-hover", function(p) {
      return p === d;
    });
  };
  mouseout = function(d) {
    return node.classed("bubble-hover", false);
  };
  chart.jitter = function(_) {
    if (!arguments.length) {
      return jitter;
    }
    jitter = _;
    force.start();
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return chart;
  };
  chart.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return chart;
  };
  chart.r = function(_) {
    if (!arguments.length) {
      return rValue;
    }
    rValue = _;
    return chart;
  };
  return chart;
};
root.plotData = function(selector, data, plot) {
  return d3.select(selector).datum(data).call(plot);
};

$(function() {
  var display, key, plot, text;
  plot = Bubbles();
  display = function(data) {
    modalToAppend = key+"modal";
    modalDivToAppend = "#"+modalToAppend+" .includeVis";
    return plotData(modalDivToAppend, data, plot);
  };
  key = decodeURIComponent(location.search).replace("?", "");
  key = key.replace("/","")
  //console.log(key);  
  text = texts.filter(function(t) {
    return t.key === key;
  })[0];

  //console.log(text);

  if (!text) {
    text = texts[0];
  }
  //console.log(text);
  $("#text-select").val(key);

    $("form.jitter").on("input", function() {
    return plot.jitter(parseFloat(this.output.value));
  });
  // d3.select("#text-select").on("change", function(e) {
  //   key = $(this).val();
  //   location.replace("#");
  //   return location.search = encodeURIComponent(key);
  // });
  $(".rideButton").hover(function(){
            currentRideId = $(this).attr("id");
            currentUrl = window.location.search;
            if(currentUrl.length > 0) { 
              currentUrl = currentUrl.split("?")[1].split("/")[0];
              if(currentUrl == currentRideId) {
                //do nothing
              } else {
                changeUrlToRideName(currentRideId);
              }
            }
            else {
              changeUrlToRideName(currentRideId);
            }
        });

      function changeUrlToRideName(ride) { 
            key = ride;
            location.replace("#");
            return location.search = encodeURIComponent(key);
      }

  $("#"+key+"modal "+"#book-title").html(text.name);
  return d3.csv("../../WordCounts/" + text.file, display);
});

var posTweetsSpaceMountain = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/spacemountainPositiveTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var negTweetsSpaceMountain = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/spacemountainNegativeTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var neuTweetsSpaceMountain = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/spacemountainNeutralTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
//hulk ride pos, neg, neutral tweets
var posTweetsHulkRide = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/hulkridePositiveTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var negTweetsHulkRide = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/hulkrideNegativeTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var neuTweetsHulkRide = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/hulkrideNeutralTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
//batman pos, neg, neutral tweets
var posTweetsBatman = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/batmanPositiveTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var negTweetsBatman = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/batmanNegativeTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var neuTweetsBatman = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/batmanNeutralTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
//seven dwarfs mine train pos, neg, neutral tweets
var posTweetsSDMT = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/sdmtPositiveTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var negTweetsSDMT = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/sdmtNegativeTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var neuTweetsSDMT = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/sdmtNeutralTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

//goliath pos, neg, neutral tweets
var posTweetsGoliath = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/goliathPositiveTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var negTweetsGoliath = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/goliathNegativeTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
var neuTweetsGoliath = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "../SentimentCounts/goliathNeutralTweets.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    function addPosTweets(curRide){
    currentRideTab = curRide+"_tab3";
    console.log($(currentRideTab));
    if(curRide=="hulkride"){
      $(".sentimentList").empty();
          for(var i =0; i<posTweetsHulkRide.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-success">'+posTweetsHulkRide[i]['tweet']+'</li>');
          } 
    }else if(curRide=="batman"){
      $(".sentimentList").empty();
          for(var i =0; i<posTweetsBatman.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-success">'+posTweetsBatman[i]['tweet']+'</li>');
          }
    }else if(curRide=="goliath"){
      $(".sentimentList").empty();
          for(var i =0; i<posTweetsGoliath.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-success">'+posTweetsGoliath[i]['tweet']+'</li>');
          }
    }else if(curRide=="sevendwarfsminetrain"){
      $(".sentimentList").empty();
          for(var i =0; i<posTweetsSDMT.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-success">'+posTweetsSDMT[i]['tweet']+'</li>');
          }
    }else if(curRide=="spacemountain"){
      $(".sentimentList").empty();
          for(var i =0; i<posTweetsSpaceMountain.length;i++){
              console.log(neuTweetsSpaceMountain[i]['tweet']);
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-success">'+posTweetsSpaceMountain[i]['tweet']+'</li>');
          }
    }
  }
  
  function addNegTweets(curRide){
    console.log(curRide);
    currentRideTab = curRide+"_tab3";
    if(curRide=="hulkride"){
      $(".sentimentList").empty();
          for(var i =0; i<negTweetsHulkRide.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-danger">'+negTweetsHulkRide[i]['tweet']+'</li>');
          } 
    }else if(curRide=="batman"){
      $(".sentimentList").empty();
    console.log("batman neg");

          for(var i =0; i<negTweetsBatman.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-danger">'+negTweetsBatman[i]['tweet']+'</li>');
          }
    }else if(curRide=="goliath"){
      $(".sentimentList").empty();
          for(var i =0; i<negTweetsGoliath.length;i++){
            console.log(negTweetsGoliath[i]['tweet']);
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-danger">'+negTweetsGoliath[i]['tweet']+'</li>');
          }
    }else if(curRide=="sevendwarfsminetrain"){
      $(".sentimentList").empty();
          for(var i =0; i<negTweetsSDMT.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-danger">'+negTweetsSDMT[i]['tweet']+'</li>');
          }
    }else if(curRide=="spacemountain"){
      console.log(curRide);
      $(".sentimentList").empty();
          for(var i =0; i<negTweetsSpaceMountain.length;i++){
            console.log(negTweetsSpaceMountain[i]['tweet']);
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-danger">'+negTweetsSpaceMountain[i]['tweet']+'</li>');
          }
    }
  }
  function addNeutralTweets(curRide){
    currentRideTab = curRide+"_tab3";
    if(curRide=="hulkride"){
      $(".sentimentList").empty();
          for(var i =0; i<neuTweetsHulkRide.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-warning">'+neuTweetsHulkRide[i]['tweet']+'</li>');
          } 
    }else if(curRide=="batman"){
      $(".sentimentList").empty();
  

          for(var i =0; i<neuTweetsBatman.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-warning">'+neuTweetsBatman[i]['tweet']+'</li>');
          }
    }else if(curRide=="goliath"){
      $(".sentimentList").empty();
          for(var i =0; i<neuTweetsGoliath.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-warning">'+neuTweetsGoliath[i]['tweet']+'</li>');
          }
    }else if(curRide=="sevendwarfsminetrain"){
      $(".sentimentList").empty();
          for(var i =0; i<neuTweetsSDMT.length;i++){
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-warning">'+neuTweetsSDMT[i]['tweet']+'</li>');
          }
    }else if(curRide=="spacemountain"){
      $(".sentimentList").empty();

          for(var i =0; i<neuTweetsSpaceMountain.length;i++){
              console.log(neuTweetsSpaceMountain[i]['tweet']);
            $('#'+currentRideTab+' .sentimentList').prepend('<li class="tweet list-group-item list-group-item-warning">'+neuTweetsSpaceMountain[i]['tweet']+'</li>');
          }
    }
  }


  $("button.sentimentButton").on("click", function(){
      currentSentiment = $(this).text();
      curRideID = ($(this).parent().parent().attr("id").split("_")[0]);
      console.log(curRideID);
      console.log(currentSentiment);
      if(currentSentiment == "Positive") {
          addPosTweets(curRideID);
          console.log(curRideID);
      } else if(currentSentiment == "Neutral") {
          addNeutralTweets(curRideID);
          console.log(curRideID);
      } else if (currentSentiment == "Negative")  {
          addNegTweets(curRideID);
      }
      
  });


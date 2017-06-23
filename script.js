var offset = 0

$("#typesFilter").bind("input", function() {
  var items = $(".listItem")
  var filter = $("#typesFilter").val();
  
  for(var i = 0; i < items.length; i++) {
    var current = $(items[i]);
    
    if(current.data("types") && current.data("types").indexOf(filter) < 0) {
      current.hide();
    }
    else {
      current.show();
    }
  }
});

$("#loadMore").click(addChunck);
addChunck();

function addChunck() {
  beginLoad();
  $.get("http://pokeapi.co/api/v1/pokemon/?limit=12&offset=" + offset, function(data) {
    for(var i = 0; i < data.objects.length; i++){
      var current = data.objects[i];
      
      current.image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + current.pkdx_id + ".png";
      current.htmlTypes = fillTemplate(".type", current.types);
      current.totalMoves = current.moves.length;
      current.allTypes = "";
      for(var j = 0; j < current.types.length; j++) {
        current.allTypes += current.types[j].name + " ";
      }
      
      var parsed = $($.parseHTML("\n" + fillTemplate(".listItem", current)));
      $("#content").append(parsed);
      setImagesSrc(parsed);
      parsed.data("types", current.allTypes);
      (function (current) {
        parsed.click(function() {
            showDetails(current);
        })
      })(current);
      
    }
    endLoad();
  });  
}

function showDetails(pokemon) {
  $("#details").show();
  $("#details").html(fillTemplate(".detailsTemplate", pokemon)); 
  setImagesSrc($("#details"));
}

function fillTemplate(selector, data) {
  if(Array.isArray(data)) {
    var ret = "";
    
    for(var i = 0; i < data.length; i++){
      ret += fillTemplate(selector, data[i]);
    }
    return ret;
  } 
  else {
    var template = $("#templates " + selector).parent().html().trim();
    
    for(var property in data) {
      template = template.replace("{" + property + "}", data[property]);
    }
    return template;
  }
}

function setImagesSrc(element) {
  var imgs = element.find("img");
  
  for(var i = 0; i < imgs.length; i++) {
    var img = $(imgs[i]);
    var src = img.data("src");
    
    if(src) {
      img.attr("src", src);
    }
  }
}

function beginLoad() {
  $("#loading").show();
  $("#loadMore button").hide();
}

function endLoad() {
  offset += 12;
  $("#loading").hide();
  $("#loadMore button").show();
}

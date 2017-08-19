function fetchJSON() {
    fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
      .then(function(response) {
         return response.json();
       })
      .then(function(json) {
         var data = json.features.sort(function(a, b){return Number(b.properties.mass)-Number(a.properties.mass)});
         var width = 1000,
             height = 560;
         var projection = d3.geo.mercator()
           .center([5, 30]) //long and lat starting position
           .scale(170) //starting zoom position
           .rotate([10,0]); //where world split occurs
         d3.select("#world")
           .style("width", width + "px")
           .style("height", height + "px");
         var svg = d3.select("#world").append("svg")
           .attr("width", width + "px")
           .attr("height", height + "px");
         var path = d3.geo.path()
           .projection(projection);
         var g = svg.append("g");
      
         // load and display the world and locations
         d3.json("https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json", function(error, topology) {
           var world = g.selectAll("path")
                     .data(topojson.object(topology, topology.objects.countries).geometries)
                     .enter()
                     .append("path")
                     .attr("d", path)
  
           // add city location circles
           var rScaleMax = d3.max(data, function(d) { return Number(d.properties.mass); });
           var rScale = d3.scale.linear()
                                   .domain([0, rScaleMax/5])
                                   .range([1, 1000]);
           var locations = g.selectAll("circle")
                   .data(data)  //cities 
                   .enter()
                   .append("circle")
                   .attr("cx", function(d) {return projection([d.properties.reclong, d.properties.reclat])[0];})
                   .attr("cy", function(d) {return projection([d.properties.reclong, d.properties.reclat])[1];})
                   .attr("r", function(d) {return rScale(d.properties.mass/50);})
                   .style("fill", "red")
                   .style("opacity", 0.6)
                 .on('mouseover', function (data)  {
               document.getElementById("name").innerHTML = data.properties.name + " ";
               document.getElementById("id").innerHTML = data.properties.id;
               document.getElementById("mass").innerHTML = data.properties.mass;
               document.getElementById("class").innerHTML = data.properties.recclass;
               document.getElementById("date").innerHTML = data.properties.year.substring(0, data.properties.year.indexOf("T"));
               document.getElementById("time").innerHTML = data.properties.year.substring( data.properties.year.indexOf("T")+1, data.properties.year.length);
               document.getElementById("lat").innerHTML = data.properties.reclat;
               document.getElementById("long").innerHTML = data.properties.reclong;
               tooltip.style.display = "block";
                 })
                 .on('mouseout', function (data)  {
               tooltip.style.display = "none";
                 });
         });
      
         //zoom and pan functionality
         var zoom = d3.behavior.zoom()
           .on("zoom",function() {
             g.attr("transform","translate(" + d3.event.translate.join(",")+")scale("+d3.event.scale+")");
             g.selectAll("path")  
             .attr("d", path.projection(projection)); 
           });
           svg.call(zoom);
      
      });
  }
    
  fetchJSON();
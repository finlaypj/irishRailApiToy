$(".stationSelector").click(function(){
  $.get("/api", function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
  });
});

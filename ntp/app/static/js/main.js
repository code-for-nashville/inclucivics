$(document).on("ChartView", function(event, category, action ){
  ga('send', event.type, category, action);
});
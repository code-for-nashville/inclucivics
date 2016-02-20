$(document).on("ready", function (ev) {
    $(document).on("ChartView", function(event, category, action ){
      ga('send', event.type, category, action);
    });

    var duration = 300;

    $("#about-link").on("click", function (ev) {
        var $msg = $("#about-message");

        var height = $("#about-message-content").height();

        if ($msg.hasClass("active")) {
            $msg.removeClass("active");
            $msg.height(0);
        } else {
            $msg.addClass("active");
            $msg.height(height);
        }
    });

    var $tabs = $("#reporting-tabs a");

    var $tabContents = $tabs.map(function (_i, tab) {
        var targetId = $(tab).data("target");
        return $(targetId);
    });

    $("#reporting-tabs").on("click", "a", function (ev) {
        var $tab = $(ev.target);
        var targetId = $tab.data("target");

        //$tabs.each(function (_i, tab) {
            //var $xTab = $(tab);

            //if ($tab.data("target") === $xTab.data("target"))
                //$tab.addClass("active");
            //else
                //$tab.removeClass("active");
        //});

        $tabContents.each(function (_i, content) {
            var $con = $(content);

            // TODO duurr
            if ("#" + $con.attr("id") === targetId)
                $con.addClass("active");
            else
                $con.removeClass("active");
        });

    });

});

$(document).ready(function () {
  //jQuery time
  let current_fs, next_fs, previous_fs; //fieldsets
  let left, opacity, scale; //fieldset properties which we will animate
  let animating; //flag to prevent quick multi-click glitches

  $(".candidate").click(function () {
    const input = $(this).find("input");

    if (input.attr("type") === "radio") {
      input.prop("checked", true);
      $(this).addClass("selected");
      $(this).siblings().removeClass("selected");
    } else {
      if (input[0].checked) {
        input.prop("checked", false);
        $(this).removeClass("selected");
      } else {
        input.prop("checked", true);
        $(this).addClass("selected");
      }
    }

    const fieldset = input.closest("#vicePresident");
    if (fieldset.length) {
      const count = fieldset.find('input[name="vicePresident"]:checked').length;
      fieldset.find(".next").prop("disabled", !(count === 2 || count === 0));
    }
  });

  $(".next").click(function () {
    if (animating) return false;
    animating = true;

    if ($(this).hasClass("final")) {
      const president = $('input[name="president"]:checked').val();
      const vicePresident = $('input[name="vicePresident"]:checked')
        .map(function (_, el) {
          return $(el).val();
        })
        .get()
        .join(", ");
      const generalSecretary = $(
        'input[name="generalSecretary"]:checked'
      ).val();

      $(".finalPresident").text(president || "N/A");
      $(".finalVicePresident").text(vicePresident || "N/A");
      $(".finalGeneralSecretary").text(generalSecretary || "N/A");
    }

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = now * 50 + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            transform: "scale(" + scale + ")",
            position: "absolute",
          });
          next_fs.css({ left: left, opacity: opacity });
        },
        duration: 800,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: "easeInOutBack",
      }
    );
  });

  $(".previous").click(function () {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li")
      .eq($("fieldset").index(current_fs))
      .removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale previous_fs from 80% to 100%
          scale = 0.8 + (1 - now) * 0.2;
          //2. take current_fs to the right(50%) - from 0%
          left = (1 - now) * 50 + "%";
          //3. increase opacity of previous_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({ left: left });
          previous_fs.css({
            transform: "scale(" + scale + ")",
            opacity: opacity,
          });
        },
        duration: 800,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: "easeInOutBack",
      }
    );
  });

  $(".submit").click(function (event) {
    event.preventDefault();
    
    $(".voting-form").hide();
    $(".success").fadeIn();
  });
});

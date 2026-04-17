$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  // Use the publication .row: hidden blocks (.bibtex, .abstract) are siblings of .links, not descendants, and BIB sits inside an extra span.
  function publicationRow(elt) {
    return $(elt).closest(".row");
  }
  $("a.abstract").click(function (e) {
    e.preventDefault();
    var $row = publicationRow(this);
    $row.find(".abstract.hidden").toggleClass("open");
    $row.find(".award.hidden.open").toggleClass("open");
    $row.find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function (e) {
    e.preventDefault();
    var $row = publicationRow(this);
    $row.find(".abstract.hidden.open").toggleClass("open");
    $row.find(".award.hidden").toggleClass("open");
    $row.find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function (e) {
    e.preventDefault();
    var $row = publicationRow(this);
    $row.find(".abstract.hidden.open").toggleClass("open");
    $row.find(".award.hidden.open").toggleClass("open");
    $row.find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});

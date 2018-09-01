'use strict';

function reportProgress(elem, percentage) {
  elem.css("width", percentage + "%")
}

function setKey(key) {
  $(".AnalysisKeyBox").addClass("AnalysisKeyBox--visible")
  $(".AnalysisKeyBox__key").html(key)
}

function setResults(text) {
  $(".ResultsBox").addClass("ResultsBox--visible")
  $(".ResultsBox__Text").html(text)
}

function setHiddenKey(text) {
  document.getElementById("hiddenFontKey").value = text;
  document.getElementById("hiddenKey").value = text;  
}


function ajaxTheForm(form) {
  var url = form.prop("action")
  var formData = new FormData(form[0]);
  var progressBar = $(".ProgressBar");
  var progressBarBar = $(".ProgressBar__bar");
  progressBarBar.css("width", "0%")
  progressBar.removeClass("ProgressBar--success")
  progressBar.removeClass("ProgressBar--failure")

  var q = $.ajax({
    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
          var percentComplete = 100 * (e.loaded / e.total)
          reportProgress(progressBarBar, percentComplete)
        }
      }, false)

      return xhr
    },
    url: url,
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formData
  })

  q.done(function(data) {
    setKey(data.key)
    progressBar.addClass("ProgressBar--success")
    // Stores the Key on the page
    setHiddenKey(data.key)
  })

  q.fail(function() {
    progressBarBar.css("width", "0%")
    progressBar.addClass("ProgressBar--failure")
  })
}

function ajaxResultsForm(form) {
  var url = form.prop("action")
  var formData = new FormData(form[0]);

  var q = $.ajax({
    url: url,
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formData
  })

  q.done(function(data) {  
    if (typeof data.colour !== 'undefined') { 
      // If data.colour is defined in API response   
      var results
      results = 'Colour: ' +data.colour + ', Font: ' +  data.font
      // Render Results
      setResults(results);
    }
    else { 
      setResults(String(data.success)) 
    }
  })

  q.fail(function() {
    console.log("Error Getting Results");
  })
}


function bindUploadForm() {
  // Bind the FileUploadForm
  var form = $(".GetResultsForm");
  console.log("ALIVE: GetResultsForm");
  form.on('submit', function(e) {
    e.preventDefault();
    ajaxTheForm(form)
  })
};

function bindResultsForm() {
  // Bind the GetResultsForm
  var form = $(".GetFontColourForm");
  console.log("ALIVE: GetFontColourForm");
  form.on('submit', function(e) {
    e.preventDefault();
    ajaxResultsForm(form)
  }) 
};


$(function() {

  bindUploadForm();
  bindResultsForm();

});

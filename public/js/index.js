$("#search").on("click", function (event) {
  event.preventDefault();

  let jobTitle = $(".job-input").val().trim();
  let locationInput = $(".location-input").val().trim();
  if (!(jobTitle == "" && locationInput == "")) {
    window.location = "results.html?title=" + jobTitle + "&location=" + locationInput;
  }
})

// MODAL INITIALIZE
// $(‘#element’).foundation(‘open’);
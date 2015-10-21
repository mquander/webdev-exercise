$(document).ready(function() {
  getBranches();
});

//// here I call an index of the branches (very minimal information)
var getBranches = function(){

  var request = $.ajax({
    url: "https://api.github.com/repos/andrewdonato/webdev-exercise/branches",
    type: "get"
  })
  request.done(function(serverData){
    var branches = serverData;
    viewEachBranch(branches);
  })
  request.fail(function(serverData){
    console.log(serverData);
    console.log('server request failed');
  })
};


//// Warning!!  This makes many queries at once. Watch your rate limit ~ 60/hr
//// Here I view the show of each branch and add it to an array of all of the branch shows
var allBranchShows = [];
var viewEachBranch = function(branches){
  for (var i = 0; i < branches.length; i++){

    var branchName = branches[i].name

    if (branchName === "master"){
      indexOfMaster = i
    };

    var request = $.ajax({
      url: "https://api.github.com/repos/andrewdonato/webdev-exercise/branches/" + branchName,
      type: "get"
    })
    request.done(function(serverData){
      var branchShow = serverData;
      allBranchShows.push(branchShow)
    })
    request.fail(function(serverData){
      console.log(serverData);
      console.log('server request failed');
    })
  };
  compareBranchDatesToMaster(allBranchShows, indexOfMaster)
};

//// here I compare the date of each branch with the date of master.
//// I added "upToDateStatus" to each branch show object
var compareBranchDatesToMaster = function(allBranches, indexOfMaster){

  dateOfMaster = allBranches[indexOfMaster].commit.commit.author.date

  for (var i = 0; i < allBranches.length; i++){
    var dateOfBranch

    if (dateOfBranch < dateOfMaster){
      allBranches[i].upToDateStatus = false
    }
    else {
      allBranches[i].upToDateStatus = true
    };
  };

  updateDOM(allBranches)
};

//// here I update the branch name and whether or it "Up To Date"
var updateDOM = function (allBranches) {
  debugger

  // I've run out of time.
  // To finish, I would use jquery to determine the branch of each project.
  // I would also use jqeury to populate the branch drop down menu
  // I would then go to the parent row, and then append the "upToDateStatus" which would be either true or false.


}








function Project(id, type, name, lastActivity, branch, upToDate) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.lastActivity = lastActivity;
    this.branch = branch;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", new Date(2014, 6, 17, 13, 5, 842)),
    new Project(1, "Testing", "Blind test of autosuggest model", new Date(2014, 6, 21, 18, 44, 229))
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function(pj) { return pj.id; }));

$(function(){

    var loadProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").text(pj.branch)
            );
        }));
    };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            new Date(),
            $form.find("#project-branch").val()
            // this is where I would put whether or not the project is up to date with master
        );
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("#project-branch").val("");
        $form.find("input:first").focus();
    };

    var $projectTable = $("#project-list>tbody");
    loadProjects($projectTable, CURRENT_PROJECTS);

    $("#add-project-form").submit(function(e) {
        var $form = $(this);
        pj = createProject($form);
        MAX_ID = pj.id;
        CURRENT_PROJECTS.push(pj);
        loadProjects($projectTable, [pj]);
        resetForm($form);
        e.preventDefault();
    });
});

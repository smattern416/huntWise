var db = require("../models");
const axios = require("axios");

module.exports = function (app) {
  //main search function  
  //search api for json response and save all the jobs we got from api to our database
  //save jobs and update the times these jobs have been searched 
  app.get("/api/jobs/search", function (req, res) {
    //get api res json and render to client
    let queryUrl = "https://jobs.github.com/positions.json?description=" + req.query.title + "&location=" + req.query.location;
    axios.get(queryUrl).then(function (response) {
      res.json(response.data);
      //database side
      //search through database to update or insert 
      var jobs = response.data;
      console.log(jobs.length);
      
      for (let index = 0; index < jobs.length; index++) {
        db.Jobs.findOne({
          where : {
            jobId : jobs[index].id
          }
        }).then(function(results){
          
          if (results != null) {
              //this job exists in our database
              db.Jobs.update({
                searchCount : (results.dataValues.searchCount + 1)
              },
                {
                where : {
                  jobId : jobs[index].id
                }
              }).then(function(){
                console.log();
                
                console.log("update success");
              });
          }else{
            //new job 
            
            db.Jobs.create({
              jobId : jobs[index].id,
              type : jobs[index].type,
              url : jobs[index].url,
              created_at : jobs[index].created_at,
              company : jobs[index].company,
              company_url : jobs[index].company_url,
              location : jobs[index].location,
              title : jobs[index].title,
              description : jobs[index].description,
              how_to_apply : jobs[index].how_to_apply,
              company_logo : jobs[index].company_logo,

            }).then(function(){
              console.log("insert" + index+ "success");
              
            });
          }
        });
      }
    });

  });
//get most searched jobs
 app.get("/api/mostsearched",function(req,res){
  db.Jobs.findAll({
    attributes: [[sequelize.fn('COUNT', sequelize.col('searchCount')), 'counts']]//desc or asc
  }).then(function(results){
    //res.send(results[0]);
    // var topFive = [];
    // for(){

    // }
    res.send(topFive);
  });
 });
 //get most searched jobs by location or just location
 app.get("/api/",function(req,res){

});
 //get all faved jobs
 app.get("/api/favorite",function(req,res){
    db.Jobs.findAll({
      where : {
        favCount : favCount > 0
      }
    }).then(function(results){
      res.send(results);
    });
});
app.post("/api/fav",function(req,res){
    //update fav count here
    db.Jobs.update({
      favCount : favCount +1
    },{
      where : {
        id : req.body.id
      }
    }).then(function(results){
        if (results.affectedRows ==1) {
          console.log("update favscount success");
          
        }
    });
});
//give back all the states
app.get("/api/states",function(req,res){
    //
});
};
/*************************************************************************
 * Name:        Group 8: Selma Leathem and Ellen Yang
 * Date:        11/24/2019
 * Description: Backend code for the Dental Appointment Portal where
 *              data from the front end is processed and sent to the
 *              database for storage and data is retrieved from the
 *              database for display at the front end.
 * 
 *              The dental appointment portal enables patients to
 *              make and cancel appointments. It also has an 
 *              administration side which enables staff to edit and
 *              view all the tables: patient, dentist, procedure and
 *              appointment.
 * 
 *              need to additionally install:
 *               npm install moment --save 
 *               npm install body-parser
 ************************************************************************/


var moment = require('moment');  /* adds the ability to convert numbers to dates of any format */

var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 44467);

/*Home main page, user can enter either as patient or staff*/
/*
 Select name and description from procedure to list on the main welcome page.
 he procedure "Unavailable" is exclued as this is used by dentist to schedule time off. */ 
 app.get('/',function(req,res,next){
  var context = {};
  var procedure = []; //create empty object to push all the procedure data into

  /* SQL query:  select name and description from procedure */

  /* add procedure descriptions to publish on the main home pages */

   mysql.pool.query('SELECT name, description FROM dental_procedure WHERE name !="Unavailable"', function(err, rows, fields){
     if(err){
      next(err);
      return;
    }

    for (var i in rows)
    {
      procedure.push({'name':rows[i].name,'description':rows[i].description});
    }
    context.procedure = procedure;
    
    res.render('homeMain', context);
  });   
});

/*Home page for patient. Patient can make appointment, change appointment or cancel appointment*/
app.get('/home',function(req,res,next){
  var context = {};
  var procedure = []; //create empty object to push all the procedure data into
 

  /* SQL query: select name and description from procedure */
  
  /* add procedure descriptions to publish on the home pages */
  mysql.pool.query('SELECT name, description FROM dental_procedure WHERE name !="Unavailable"', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

    for (var i in rows)
    {
      procedure.push({'name':rows[i].name,'description':rows[i].description});
    }
  
    context.procedure = procedure;
    res.render('home', context);
  }); 
});

/*Administration login page has a nonfunctioning login that 
 *automatically allows access to the adminstrator pages.
 */
app.get('/adminLogin',function(req,res,next){
  var context = {};
    res.render('adminLogin', context); 
});

/* The administrator homepage which has a front end menu
 * that enables navigation to the rest of the administrator
 * pages.
 */
app.all('/admin',function(req,res,next){
  var context = {};
    res.render('admin', context);
 
});

/* Initialize the dentistSchedule page which is used by dentists
 * to reserve time off.
 */
app.all('/dentistSchedule',function(req,res,next){
  var context = {};  /* Object holds data that is passed to the front */

  context.error = "";  /* An error message is blank when not used */
  
  /* Initialize the data that is displayed on the page */
  context.dentistId = 0;
  context.date = ""; // "0000-00-00";
   
  /* A table showing a list of the dentist's appointments is disabled */                  
  context.visibilityTable = "display:none;";

  /* The rest of a form is disabled until the dentist enters their
   * identification number.
   */
  context.visibilityfill = "display:none;";

  res.render('dentistSchedule', context);
});

/* After the user enters their dentist id number it is passed here where 
 * 1)The dentist id number is verified. If it is not valid the user
 *   is prompted to re-enter it. If it is valid a second form appears on
 *   the front end page.
 * 2) The data for the second form is made. A list of appointments is 
 *    obtained to be put in a drop down list to select if the dentist
 *    wants to cancel an appointment.
 */
app.all('/scheduleHaveId',function(req,res,next){
  var context = {};/* Object holds data that is passed to the front */
  
   /* Holds a list of all sceduled appointments for the dentist that 
    * will be passed to the front.
    */
  var appointmentsDropDown = [];
  
  /* get the dentist id from the POST body */
  context.dentistId = req.body.dentistId;

  /* initialize the date */
  context.date = ""; // "0000-00-00";

  /* A table showing a list of the dentist's appointments is disabled */ 
  context.visibilityTable = "display:none;";

  /* Verify the dentist Id is valid */
  mysql.pool.query('select dentist.id from dentist where id = ?;', [req.body.dentistId],
  function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
      /* If a dentist with the id dentistId does not exist then the SQL query will
       * return zero rows.
       */
      if (rows.length == 0 )
      {
          /* an error message is sent to the front end */ 
          context.error = "Please enter a valid dentist identification number.";

          /* The rest of a form is disabled until the dentist enters their
          * correct identification number.
          */
          context.visibilityfill = "display:none;";

          res.render('dentistSchedule', context);     
      }
      else{   /* The dentist's id is valid so get a list of all their appointments */

            var queryString = "SELECT date_format(`appointment`.date, ' %m/%d/%Y ' ) as day, time_format(`appointment`.time, '%h:%i %p') as theTime, " +
            " `appointment`.time as unformattedTime,  `dental_procedure`.name " +
              "FROM `appointment` " + 
            "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
            "WHERE `appointment`.did = ?";
            mysql.pool.query(queryString, [req.body.dentistId], function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            
            /* Put the list of appointments returned from the SQL query into an array
             * which is passed to the front end to be displayed in a drop-down list.
             */
            for (var row in rows)
            {
              var appointment = {};
              appointment.date = rows[row].day;
              appointment.time = rows[row].theTime;
              appointment.procedure = rows[row].name;
              appointment.value = JSON.stringify(rows[row]); 
              console.log("in original unformatedtime = " + rows[row].unformattedTime);
              console.log("appoinmtment.value = " + appointment.value);
              appointmentsDropDown.push(appointment);
            }

            context.appointmentsDropDown = appointmentsDropDown;

            /* Since the dentist's id is valid there is no error message */
            context.error = "";
        
            /* Another form is made available for the dentist/user to fill */
            context.visibilityfill = "visibility: visible;";
            
            res.render('dentistSchedule', context);
            
          });
      }
    });  
});


/* After the dentist enters the date on which they wish to schedule time off
 * it is passed here in the body. This function then queries the database to
 * get a list of all appointment times for that day. The list of appointment
 * times are then used in combination with an imported "moment" function to
 * determine the times that the dentist is unscheduled for that day. The list
 * of times are then returned to the front end to fill in a drop down list of
 * unscheduled times.
 */
app.all('/scheduleHaveDate',function(req,res,next){
    var context = {};/* Object holds data that is passed to the front */
  
    /* Holds a list of all sceduled appointments for the dentist that 
    * will be passed to the front.
    */
    var appointmentsDropDown = [];

    /* Holds a list of times that the dentist is not scheduled for the
     * day req.body.day. This list will get passed to the front.
     */
    var times = [];
   
    /* The dentist's id is passed from the front as a hidden field */
    context.dentistId = parseInt(req.body.dentistId,10);

    /* Get the date from POST body */
    context.date = req.body.day;

    /* Get a list of all of the dentist's appointments. These will fill a drop-down box so the
     * dentist can select an appointment to delete if they choose to do so. 
     */
    var queryString = "SELECT date_format(`appointment`.date, ' %m/%d/%Y ' ) as day, time_format(`appointment`.time, '%h:%i %p') as theTime, " +
    " `appointment`.time as unformattedTime,  `dental_procedure`.name " +
    "FROM `appointment` " + 
    "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
    "WHERE `appointment`.did = ?";

    mysql.pool.query(queryString, [context.dentistId], function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        
        /* Put the list of appointments returned from the SQL query into an array
        * which is passed to the front end to be displayed in a drop-down list.
        */
        for (var row in rows)
        {
          var appointment = {};
          appointment.date = rows[row].day;
          appointment.time = rows[row].theTime;
          appointment.procedure = rows[row].name;

          /* The drop down list uses this string which is the composite key
          * for the appointment table to identify which appointment was
          * selected. Later the string will be used to select the correct
          * appointment to delete.
          */
          appointment.value = JSON.stringify(rows[row]);
          appointmentsDropDown.push(appointment);
        }

        context.appointmentsDropDown = appointmentsDropDown;

        /* Select the times that the dentist is scheduled on the passed date */
        var queryStringTimes = "SELECT time_format(`appointment`.time, '%l:%i %p') as busy " +
        "FROM `appointment` " +
        "WHERE `appointment`.did = ? AND `appointment`.date = CONVERT( ? , DATE);";
        mysql.pool.query(queryStringTimes,[context.dentistId, req.body.day], function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
        
          /* Put the times that the above SQL query returns in an array called schedule
           * and convert the times to strings so they can be compared to other times
           */
          var schedule = [];
          for (var row in rows)
          {
              schedule.push(rows[row].busy.toString());
              
          }
          
          /* Source for generating times from a for-loop */
  /*https://stackoverflow.com/questions/36125038/generate-array-of-times-as-strings-for-every-x-minutes-in-javascript */

            var hour; 
            
            for (hour = 8; hour < 18; hour++)
            {
              
              /* store half-hour time intervals in appTime and appHalf */
              var appTime = moment({hour}).format('h:mm A');
              var appHalf = moment({hour,minute:30}).format('h:mm A');
              
              /* If the dentist is scheduled that day only put times in the time array
               * that the dentist is --not-- scheduled.
               */
              if (schedule.length > 0)
              {
                /* The includes(..) function searches the schedule[] array for appTime 
                 * and appHalf. If either time is not found in the schedule[] then they
                 * are added to the times[] array.
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
                 */
                  if (schedule.includes(appTime.toString())== false)
                  {
                    var time = {};
                    time.time = appTime;
                    time.unformattedTime = moment({hour}).format('H:mm:ss');
                    times.push(time);
                  }
                
                  if (schedule.includes(appHalf.toString())== false)
                  {
                    var time = {};
                    time.time = appHalf;
                    time.unformattedTime = moment({hour,minute:30}).format('H:mm:ss');
                    times.push(time);
                  }
              }
              else  /* Dentist has no appointments so put all times in the array */
              {
                var time = {};
                time.time = appTime;
                time.unformattedTime = moment({hour}).format('H:mm:ss');
                times.push(time);

                var time = {};
                time.time = appHalf;
                time.unformattedTime = moment({hour,minute:30}).format('H:mm:ss');
                times.push(time);
              }
            }

            context.times = times;
          

            /* Since the dentist's id is valid there is no error message */
            context.error = "";
        
            /* Another form is made available for the dentist/user to fill */
            context.visibilityfill = "visibility: visible;";

             /* A table showing a list of the dentist's appointments is disabled */ 
            context.visibilityTable = "display:none;";

            res.render('dentistSchedule', context);
            
        });   
    }); 
});


/* The dentist id, appointment date and appointment time is passed in the POST body to
 * this function which inserts the appointment into the database. Note: since this is an
 * appointment made by the dentist it is to schedule time off. Patient appointments to 
 * see a dentist must be made by the patient.
 * Also, a list of appointments is made and published on the front end.
 */
  app.all('/addDentistTimeOff',function(req,res,next){
    var context = {}; /* Object holds data that is passed to the front */

    /* AppointmentsTable holds a list of all appointments for display */
    var appointmentsTable = [];

    /* Appointments dropdown holds a list of all appointments to go in the
     * drop down list for removal
     */
    var appointmentsDropDown = [];
   
    /* retrieve data needed to make the appointment passed in the POST body */
    var date = req.body.date;
    var dentistId = parseInt(req.body.dentistId,10);
    var time = req.body.time.toString();

    context.date = "";

    /* The procedure id is a constant as the dentist can only schedule time off. */
    const Unavailable = 105;  
    
    context.dentistId = dentistId;
    
    /* Insert the new appointment into the appointment table */
    mysql.pool.query("INSERT into appointment(`date`, `time`, `pid`, `did`) VALUES (CONVERT(?, DATE),CONVERT(?, TIME),?,?);", 
    [date, time, Unavailable, dentistId], function(err, result){
        if(err){
          next(err);
          return;
        }

        /* Get the dentist's first and last name to print a table of their appointments */
        mysql.pool.query('SELECT dentist.first_name, dentist.last_name FROM dentist WHERE dentist.id = ?;', [dentistId],
          function(err, rows, fields){
            if(err){
              next(err);
              return;
            }

            context.dfirstName = rows[0].first_name;
            context.dlastName = rows[0].last_name;

             /* Get a list of the dentist's appointments to print in a table on the page */
               var queryString =   " SELECT date_format(`appointment`.date, ' %m/%d/%Y ')  as day, time_format(`appointment`.time, '%h:%i %p') as theTime, " +
                   " `dental_procedure`.name as name, `patient`.first_name as firstName, `patient`.last_name as lastName " +
                  "FROM `appointment` " +
                  "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
                  "LEFT JOIN `patient` ON `appointment`.ptid = `patient`.id " +
                  " WHERE `appointment`.did= ?; ";

                  mysql.pool.query(queryString, [dentistId], function(err, rows, fields){
                    if(err){
                      next(err);
                      return;
                    }
                      for (var row in rows)
                      {
                        var appointment = {};
                        
                        /* When the dentist schedules time off the FK patient id field is NULL */
                        if (rows[row].firstName == null)
                        {
                          appointment.firstName = "NULL";
                          appointment.lastName = "NULL";
                        }
                        else
                        {
                          appointment.firstName = rows[row].firstName;
                          appointment.lastName = rows[row].lastName;
                        }
                        
                        /* add the appointments to the appointmentsTable[] array */
                        appointment.procedure = rows[row].name;
                        appointment.time = rows[row].theTime;
                        appointment.date = rows[row].day;

                        appointmentsTable.push(appointment);
                      }
          
                      context.appointmentsTable = appointmentsTable;

                      /* Get a list of the appointments again with different data to fill a dropdown
                       * list that is used to remove appointments.
                       */
                      var queryString = "SELECT date_format(`appointment`.date, ' %m/%d/%Y ' ) as day, time_format(`appointment`.time, '%h:%i %p') as theTime, " +
                      " `appointment`.time as unformattedTime,  `dental_procedure`.name " +
                          "FROM `appointment` " + 
                          "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
                          "WHERE `appointment`.did = ?";
                        mysql.pool.query(queryString, [dentistId], function(err, rows, fields){
                            if(err){
                              next(err);
                              return;
                            }
                            
                           
                            for (var row in rows)
                            {
                              var appointment = {};
                              appointment.date = rows[row].day;
                              appointment.time = rows[row].theTime;
                              appointment.procedure = rows[row].name;
                              
                              /* The drop down list uses this string which is the composite key
                               * for the appointment table to identify which appointment was
                               * selected. Later the string will be used to select the correct
                               * appointment to delete.
                               */
                              appointment.value = JSON.stringify(rows[row]);
                              appointmentsDropDown.push(appointment);
                            }

                            context.appointmentsDropDown = appointmentsDropDown;

                            /* An error message is blank when not used */
                            context.error = "";
        
                            /* All forms are visible and enabled */
                            context.visibilityfill = "visibility: visible;";

                            /* A table showing a list of the dentist's appointments is disabled */
                            context.visibility = "visibility: visible;";

                            res.render('dentistSchedule', context);
                          
                        });
                  }); 
          });         
    });     
});
  
  /* Delete appointments from the schedule. Staff can override and delete any appointment */
  app.all('/removeAppDentist',function(req,res,next){
    var context = {}; /* Object holds data that is passed to the front */

      /* AppointmentsTable holds a list of all appointments for display */
      var appointmentsTable = [];

      /* Appointments dropdown holds a list of all appointments to go in the
       * drop down list for removal
       */
      var appointmentsDropDown = [];

      var dentistId = parseInt(req.body.dentistId,10);
      context.dentistId = dentistId;

      /* The value attribute of the dropdown list that passes to this function the 
       * specific appointment to delete stores the composite appointment
       * table key as a JSON string
       */
      var appointmentInfo = JSON.parse(req.body.app);
      var appointmentTime = appointmentInfo.unformattedTime.toString();
      var formattedDay = new Date(appointmentInfo.day);

      /* delete the appointment that the user selected from a dropdown list */
      mysql.pool.query("DELETE FROM `appointment` WHERE did = ? AND date = CONVERT(?, DATE) AND time = CONVERT(?, TIME);", 
      [dentistId, formattedDay, appointmentTime], function(err, result){
          if(err){
            next(err);
            return;
          }

     
        /* Get the dentist's first and last name to print a table of their appointments */
        mysql.pool.query('SELECT dentist.first_name, dentist.last_name FROM dentist WHERE dentist.id = ?;', [dentistId],
        function(err, rows, fields){
          if(err){
            next(err);
            return;
          }

          
          context.dfirstName = rows[0].first_name;
          context.dlastName = rows[0].last_name;

           /* Get a list of the dentist's appointments to print in a table on the page */
             var queryString =   " SELECT date_format(`appointment`.date, ' %m/%d/%Y ')  as day, time_format(`appointment`.time, '%h:%i %p') as theTime, " +
                 " `dental_procedure`.name as name, `patient`.first_name as firstName, `patient`.last_name as lastName " +
                "FROM `appointment` " +
                "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
                "LEFT JOIN `patient` ON `appointment`.ptid = `patient`.id " +
                " WHERE `appointment`.did= ?; ";

                mysql.pool.query(queryString, [dentistId], function(err, rows, fields){
                  if(err){
                    next(err);
                    return;
                  }
                    for (var row in rows)
                    {
                      var appointment = {};
                      
                      /* When the dentist schedules time off the FK patient id field is NULL */
                      if (rows[row].firstName == null)
                      {
                        appointment.firstName = "NULL";
                        appointment.lastName = "NULL";
                      }
                      else
                      {
                        appointment.firstName = rows[row].firstName;
                        appointment.lastName = rows[row].lastName;
                      }
                      
                      /* add the appointments to the appointmentsTable[] array */
                      appointment.procedure = rows[row].name;
                      appointment.time = rows[row].theTime;
                      appointment.date = rows[row].day;

                      appointmentsTable.push(appointment);
                    }
        
                    context.appointmentsTable = appointmentsTable;

                    /* Get a list of the appointments again with different data to fill a dropdown
                     * list that is used to remove appointments.
                     */
                    var queryString = "SELECT date_format(`appointment`.date, ' %m/%d/%Y ' ) as day, time_format(`appointment`.time, '%h:%i %p') as theTime, " +
                    " `appointment`.time as unformattedTime,  `dental_procedure`.name " +
                        "FROM `appointment` " + 
                        "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
                        "WHERE `appointment`.did = ?";
                      mysql.pool.query(queryString, [dentistId], function(err, rows, fields){
                          if(err){
                            next(err);
                            return;
                          }
                          
                         
                          for (var row in rows)
                          {
                            var appointment = {};
                            appointment.date = rows[row].day;
                            appointment.time = rows[row].theTime;
                            appointment.procedure = rows[row].name;
                           
                            /* The drop down list uses this string which is the composite key
                             * for the appointment table to identify which appointment was
                             * selected. Later the string will be used to select the correct
                             * appointment to delete.
                             */
                            appointment.value = JSON.stringify(rows[row]);
                          
                            appointmentsDropDown.push(appointment);
                          }

                          context.appointmentsDropDown = appointmentsDropDown;

                          /* An error message is blank when not used */
                          context.error = "";
      
                          /* All forms are visible and enabled */
                          context.visibilityfill = "visibility: visible;";

                          /* A table showing a list of the dentist's appointments is disabled */
                          context.visibility = "visibility: visible;";

                          res.render('dentistSchedule', context);
                        
                      });
                }); 
          });  
      });
});  


/* Initialize front end page addRemoveProcedure. This page enables the dentist
 * to add or remove a procedure to their list of available procedures.
 */
app.all('/addRemoveProcedureDentist',function(req,res,next){
  var context = {}; /* Object holds data that is passed to the front */
  
  /* Initialize the data that is displayed on the page */
  context.dentistId = 0;

  /* A table showing a list of the dentist's appointments is disabled */  
  context.visibilityTable = "display:none;";

  /* The rest of a form is disabled until the dentist enters their
   * identification number.
   */
  context.visibilityfill = "display:none;";

  res.render('addRemoveProcedureDentist', context);
});

/* Selma */
/* This function receives the dentist's id in the body of a POST request 
 * and uses it to populate two drop down boxes. One box includes a list of
 * procedures that the dentist does so the dentist can optionally remove one 
 * of them and the other drop down box has a list of procedures that the dentist 
 * does not have so the dentist can optionally add one of them.
 */
app.all('/addRemoveProcedureHaveDID',function(req,res,next){
  var context = {};  /* Object holds data that is passed to the front */

  /* Holds a list of procedures that the dentist can add */
  var procedureAdd = [];

  /* Holds a list of procedures that the dentist can remove */
  var procedureRemove = [];

  /* get the dentist id from the POST body */
  context.dentistId = req.body.dentistId;

  /* A table showing a list of the dentist's procedures is disabled */ 
  context.visibilityTable = "display:none;";

  /* Verify the dentist Id is valid */
  mysql.pool.query('select dentist.id from dentist where id = ?;', [req.body.dentistId],
  function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
      /* If a dentist with the id dentistId does not exist then the SQL query will
       * return zero rows.
       */
      if (rows.length == 0 )
      {
         /* an error message is sent to the front end */ 
          context.error = "Please enter a valid dentist identification number.";

          /* The rest of a form is disabled until the dentist enters their
          * correct identification number.
          */
          context.visibilityfill = "display:none;";
          res.render('addRemoveProcedureDentist', context);
          
      }
      else{

        /* The dentist's id is valid so get a list of all the procedures that they are not
         * signed up for.
         */
        var queryStringAdd = 
        "SELECT dental_procedure.name as name , dental_procedure.id AS id FROM dental_procedure  " +
        "WHERE dental_procedure.name NOT IN (SELECT dental_procedure.name FROM dental_procedure " + 
        "INNER JOIN dentist_dental_procedure ON dental_procedure.id = dentist_dental_procedure.pid " + 
        " WHERE dentist_dental_procedure.did = ?);";

        mysql.pool.query(queryStringAdd, [req.body.dentistId], function(err, rows, fields){
            if(err){
              next(err);
              return;
            }

            /* Put the list of procedures returned from the SQL query into an array
            * which is passed to the front end to be displayed in a drop-down list.
            */
            for (var row in rows)
            {
              var procedure = {};
              procedure.name = rows[row].name;
              procedure.id = rows[row].id;
              procedureAdd.push(procedure);
            }

            /* If the dentist is signed up for all available procedures then instead
             * put a message indicating this in the procedureAdd[] array. 
             */
            if (rows.length == 0 ) 
            {
              var procedure = {};
              procedure.name = "No more procedures to add.";
              procedure.id = 0;
              procedureAdd.push(procedure);
            }

            context.procedureAdd = procedureAdd;

            /* put the dentist Id in a hidden field in the front end to be reused */
            context.dentistId = req.body.dentistId;  

            /* Get a list of all the procedures that the dentist is signed up for */
            queryStringRemove = "SELECT dental_procedure.name as name , dental_procedure.id AS id FROM dental_procedure " + 
            "INNER JOIN dentist_dental_procedure ON dental_procedure.id = dentist_dental_procedure.pid " +
            "WHERE dentist_dental_procedure.did = ? AND dental_procedure.id <> 105 ;";

            mysql.pool.query(queryStringRemove, [req.body.dentistId], function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }

                /* Put the list of procedures returned from the SQL query into an array
                * which is passed to the front end to be displayed in a drop-down list.
                */
                for (var row in rows)
                {
                  var procedure = {};
                  procedure.name = rows[row].name;
                  procedure.id = rows[row].id;
                  procedureRemove.push(procedure);
                }

            /* If the dentist is not signed up for any procedures then instead
             * put a message indicating this in the procedureRemove[] array. 
             */
                if (rows.length == 0 )
                {
                  var procedure = {};
                  procedure.name = "No more procedures to remove.";
                  procedure.id = 0;
                  procedureRemove.push(procedure);
                }

                context.procedureRemove = procedureRemove;

                context.error = "";
        
                /* All forms on the page are made visible and are enabled */
                context.visibilityfill = "visibility: visible;";
                
                res.render('addRemoveProcedureDentist', context);
            });             
        });
      }
    }); 
});

/* If the procedure id passed from the front is zero that means the dentist is
 * signed up for all available procedures and hence nothing is inserted into 
 * the database otherwise the procedure is inserted into the database as an 
 * available procedure for the dentist to perform.
 */
app.all('/addDentistProcedure',function(req,res,next){
  var context = {};

  /* get the dentist id from the POST body */
  context.dentistId = req.body.dentistId;

  /* The form requesting to add or remove a procedure is disabled */
  context.visibilityfill = "display:none;";

  /* A table listing the dentist's procedures is enabled */
  context.visibilityTable = "visibility: visible;";

  /* Since a valid procedure id is sent from the front end add this procedure to 
   * the dentist's list of available procedures;
   */

  if (req.body.procedure != 0)
  {
    /* Insert the dentist's new procedure into the database */
    mysql.pool.query("INSERT INTO dentist_dental_procedure (`did`,`pid`) VALUES (?, ?);", 
    [req.body.dentistId, req.body.procedure], 
    function(err, result){
      if(err){
        next(err);
        return;
      }

          /* Get the dentist's first and last name to print a table of their appointments */
          mysql.pool.query('SELECT dentist.first_name as firstName, dentist.last_name as lastName FROM dentist WHERE dentist.id = ?;', 
          [req.body.dentistId], 
          function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
              context.firstName = rows[0].firstName;
              context.lastName = rows[0].lastName;

              /* Get a list of the dentist's procedures to print in a table on the page */
              var queryString = 
              "SELECT dental_procedure.name as name , dental_procedure.description as description FROM dental_procedure " + 
              "INNER JOIN dentist_dental_procedure ON dental_procedure.id = dentist_dental_procedure.pid " + 
              "WHERE dentist_dental_procedure.did = ? ;";

              mysql.pool.query(queryString, [req.body.dentistId], function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }

                    var procedures = [];

                    /* add the results from the SQL query to the procedures[] array */
                    for (var row in rows)
                    {
                      var procedure = {};
                      procedure.name = rows[row].name;
                      procedure.description = rows[row].description;
                      procedures.push(procedure);
                    }

                    context.rows = procedures;

                    res.render('addRemoveProcedureDentist', context);
              });
          });
      });
  }
  else    /* The dentist is signed up for all procedures so return  a list of procedures that the
           * dentist can choose to remove and also publish all signed up for procedures in a table
           */
  {
          /* Get the dentist's first and last name to print a table of their procedures*/
          mysql.pool.query('SELECT dentist.first_name as firstName, dentist.last_name as lastName FROM dentist WHERE dentist.id = ?;', 
          [req.body.dentistId], 
          function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
              context.firstName = rows[0].firstName;
              context.lastName = rows[0].lastName;

              /* Get a list of the dentist's procedures to print in a table on the page */
              var queryString = 
              "SELECT dental_procedure.name as name , dental_procedure.description as description FROM dental_procedure " + 
              "INNER JOIN dentist_dental_procedure ON dental_procedure.id = dentist_dental_procedure.pid " + 
              "WHERE dentist_dental_procedure.did = ? ;";
              mysql.pool.query(queryString, [req.body.dentistId], function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                    var procedures = [];

                     /* add the results from the SQL query to the procedures[] array */
                    for (var row in rows)
                    {
                      var procedure = {};
                      procedure.name = rows[row].name;
                      procedure.description = rows[row].description;
                      procedures.push(procedure);
                    }

                    context.rows = procedures;

                    res.render('addRemoveProcedureDentist', context);
              });
          });
      }       
});

/* Remove a procedure from a dentist's list of available procedures */
app.all('/removeDentistProcedure',function(req,res,next){
  var context = {};

  /* get the dentist id from the POST body */
  context.dentistId = req.body.dentistId;

  /* The form requesting to add or remove a procedure is disabled */
  context.visibilityfill = "display:none;";

  /* A table listing the dentist's procedures is enabled */
  context.visibilityTable = "visibility: visible;";

  /* Since a valid procedure id is sent from the front end remove this procedure to 
   * the dentist's list of available procedures;
   */

  if (req.body.procedure != 0)  /* if the procedure id = 0 then there are no procedures to remove */
  {
    /* Remove the dentist's procedure from the database */
    mysql.pool.query("DELETE FROM dentist_dental_procedure WHERE dentist_dental_procedure.did = ? AND dentist_dental_procedure.pid = ? ;", 
    [req.body.dentistId, req.body.procedure], 
    function(err, result){
      if(err){
        next(err);
        return;
      }

          /* Get the dentist's first and last name to print a table of their procedures*/
          mysql.pool.query('SELECT dentist.first_name as firstName, dentist.last_name as lastName FROM dentist WHERE dentist.id = ?;', 
          [req.body.dentistId], 
          function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
              context.firstName = rows[0].firstName;
              context.lastName = rows[0].lastName;

              /* Get a list of the dentist's procedures to print in a table on the page */
              var queryString = 
              "SELECT dental_procedure.name as name , dental_procedure.description as description FROM dental_procedure " + 
              "INNER JOIN dentist_dental_procedure ON dental_procedure.id = dentist_dental_procedure.pid " + 
              "WHERE dentist_dental_procedure.did = ? ;";

              mysql.pool.query(queryString, [req.body.dentistId], function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }

                    var procedures = [];

                    /* add the results from the SQL query to the procedures[] array */
                    for (var row in rows)
                    {
                      var procedure = {};
                      procedure.name = rows[row].name;
                      procedure.description = rows[row].description;
                      procedures.push(procedure);
                    }

                    context.rows = procedures;

                    res.render('addRemoveProcedureDentist', context);
              });
          });
      });
  }
  else    /* The dentist is signed up for all procedures so return  a list of procedures that the
           * dentist can choose to remove and also publish all signed up for procedures in a table
           */
  {
          /* Get the dentist's first and last name to print a table of their appointments */
          mysql.pool.query('SELECT dentist.first_name as firstName, dentist.last_name as lastName FROM dentist WHERE dentist.id = ?;', 
          [req.body.dentistId], 
          function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
              context.firstName = rows[0].firstName;
              context.lastName = rows[0].lastName;

              /* Get a list of the dentist's procedures to print in a table on the page */
              var queryString = 
              "SELECT dental_procedure.name as name , dental_procedure.description as description FROM dental_procedure " + 
              "INNER JOIN dentist_dental_procedure ON dental_procedure.id = dentist_dental_procedure.pid " + 
              "WHERE dentist_dental_procedure.did = ? ;";
              mysql.pool.query(queryString, [req.body.dentistId], function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                    var procedures = [];

                     /* add the results from the SQL query to the procedures[] array */
                    for (var row in rows)
                    {
                      var procedure = {};
                      procedure.name = rows[row].name;
                      procedure.description = rows[row].description;
                      procedures.push(procedure);
                    }

                    context.rows = procedures;

                    res.render('addRemoveProcedureDentist', context);
              });
          });
      }  
});


/* This loads the insertPatient page with a list of patients in a table and
 * fills in form drop down boxes.
 */
app.all('/insertPatient',function(req,res,next){
  var context = {}; /* Object holds data that is passed to the front */

  /* Get a list of dentists to fill a drop down box. The selected dentist
   * will be added as the new patient's dentist.
   */
  mysql.pool.query('SELECT * FROM dentist;', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }

      var dentists = [];

      /* Put the list of dentists returned from the SQL query into an array */
      for (var row in rows)
      {
        var dentist = {};
        dentist.firstName = rows[row].first_name;
        dentist.lastName = rows[row].last_name;
        dentist.id = rows[row].id;
        dentists.push(dentist);
      }

      context.dentists = dentists;

      /* Get a list of all patients and their dentist to put in a table on the page */
      var queryString = "SELECT patient.id, CONCAT(patient.first_name, ' ',patient.last_name) AS patient_name, patient.phone_number, " + 
      "CONCAT(dentist.first_name, ' ', dentist.last_name) AS dentist_name " +
      "FROM patient " + 
      "INNER JOIN dentist ON patient.did = dentist.id; ";
      mysql.pool.query(queryString,  function(err, rows, fields){
          if(err){
            next(err);
            return;
          }

          var patients = [];

          /* Put the list of patients returned from the SQL query into an array */
          for (var row in rows)
          {
            var patient = {};
            patient.Id = rows[row].id;
            patient.patientName = rows[row].patient_name;
            patient.phoneNumber = rows[row].phone_number;
            patient.dentistName = rows[row].dentist_name;
            patients.push(patient);
          }

          context.patients = patients;
          
          res.render('insertPatient', context);
      });   
  }); 
});

/* New patient form data is sent to this function via a POST request
 * and is used to insert a new patient into the database.
 */
app.all('/insertPatientGotInfo',function(req,res,next){
  var context = {}; /* Object holds data that is passed to the front */

  /* Insert a new patient into the database using the form data that
   * was sent in the body of the POST request.
   */
  mysql.pool.query("INSERT INTO patient(`first_name`, `last_name`, `phone_number`,`did`) VALUES (?, ?, ?, ?)",
   [req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.dentist ], 
   function(err, result){
    if(err){
      next(err);
      return;
    }

    /* Repopulate the drop-down list of dentist names so another patient can be
     * easily added. First get a list of dentists.
     */
    mysql.pool.query('SELECT * FROM dentist;', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }

          var dentists = [];

          /* Put the list of dentists returned from the SQL query into an array */
          for (var row in rows)
          {
            var dentist = {};
            dentist.firstName = rows[row].first_name;
            dentist.lastName = rows[row].last_name;
            dentist.id = rows[row].id;
            dentists.push(dentist);
          }

          context.dentists = dentists;

          /* Get a list of all patients and their dentist to put in a table on the page */
          var queryString = "SELECT patient.id, CONCAT(patient.first_name, ' ',patient.last_name) AS patient_name, patient.phone_number, " + 
          "CONCAT(dentist.first_name, ' ', dentist.last_name) AS dentist_name " +
          "FROM patient " + 
          "INNER JOIN dentist ON patient.did = dentist.id; ";
          mysql.pool.query(queryString,  function(err, rows, fields){
              if(err){
                next(err);
                return;
              }

              var patients = [];

              /* Put the list of patients returned from the SQL query into an array */
              for (var row in rows)
              {
                var patient = {};
                patient.Id = rows[row].id;
                patient.patientName = rows[row].patient_name;
                patient.phoneNumber = rows[row].phone_number;
                patient.dentistName = rows[row].dentist_name;
                patients.push(patient);
              }

              context.patients = patients;
              
              res.render('insertPatient', context);
          });      
      }); 
  });
});

/* This loads the dentists page with a list of dentists in a table. 
 */
app.all('/dentists',function(req,res,next){
    var context = {};/* Object holds data that is passed to the front */

    /* Get a list of dentists to fill a table*/
    mysql.pool.query('SELECT * FROM dentist;', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
          var dentists = [];

          /* Put the list of dentists returned from the SQL query into an array */
          for (var row in rows)
          {
            var dentist = {};
            dentist.Id = rows[row].id;
            dentist.firstName = rows[row].first_name;
            dentist.lastName = rows[row].last_name;
            dentist.id = rows[row].id;
            dentists.push(dentist);
          }

          context.dentists = dentists;
        
          res.render('dentists', context);
    }); 

});

/* New dentist form data is sent to this function via a POST request
 * and is used to insert a new dentist into the database and to add the
 * procedure "Unavailable" to the dentist's list of procedures. This is to
 * enable the dentist to schedule unavailablity.
 */
app.all('/editDentistGotInfo',function(req,res,next){
  var context = {};  /* Object holds data that is passed to the front */

  const Unavailable = 105;  /* a constant value for the procedure Unavailable which used to book time off */

  /* Insert a new dentist into the database using the form data that
   * was sent in the body of the POST request.
   */
    mysql.pool.query("INSERT INTO dentist(`first_name`, `last_name`) VALUES (?, ?)", 
    [req.body.firstName, req.body.lastName], function(err, result){
        if(err){
          next(err);
          return;
        }

        /* Get the dentist Id of the new dentist*/
        mysql.pool.query('SELECT dentist.id as id FROM dentist ORDER BY id DESC LIMIT 1;', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }

            var dentistId = rows[0].id;

            /* Add the procedure "Unavailable" to the new dentist's list of procedures. This procedure
             * is added by default and is used to schedule unavailablity.
             */
            mysql.pool.query("INSERT INTO dentist_dental_procedure(`did`, `pid`) VALUES (?, ?)", 
            [dentistId, Unavailable], function(err, result){
                if(err){
                  next(err);
                  return;
                }

                    /* Get a list of all dentists to put in a table on the page */
                    mysql.pool.query('SELECT * FROM dentist;', function(err, rows, fields){
                      if(err){
                        next(err);
                        return;
                      }

                          var dentists = [];

                          /* Put the list of dentists returned from the SQL query into an array */
                          for (var row in rows)
                          {
                            var dentist = {};
                            dentist.Id = rows[row].id;
                            dentist.firstName = rows[row].first_name;
                            dentist.lastName = rows[row].last_name;
                            dentist.id = rows[row].id;
                            dentists.push(dentist);
                          }

                          context.dentists = dentists;
                        
                          res.render('dentists', context);
                    });
              });  
          }); 
    });
});

/*Remove a dentist using the dentist Id passed from the 'dentists' page via a POST request */
app.all('/deleteDentist',function(req,res,next){
  var context = {};  /* Object holds data that is passed to the front */

  const Unavailable = 105;  /* a constant value for the procedure Unavailable which used to book time off */

  var dentistId = parseInt(req.body.dentistId,10);

  /* First delete the dentist's entries in the many to many table, dentist_dental_procedure */
    mysql.pool.query("DELETE FROM dentist_dental_procedure WHERE did = ?;", 
    [dentistId], function(err, result){
        if(err){
          next(err);
          return;
        }

        /* Second delete the dentist from the table of dentists */
        mysql.pool.query("DELETE FROM dentist WHERE id = ?;", 
        [dentistId], function(err, result){
            if(err){
              next(err);
              return;
            }

            /* Get a list of all dentists to put in a table on the page */
            mysql.pool.query('SELECT * FROM dentist;', function(err, rows, fields){
              if(err){
                next(err);
                return;
              }

                  var dentists = [];

                  /* Put the list of dentists returned from the SQL query into an array */
                  for (var row in rows)
                  {
                    var dentist = {};
                    dentist.Id = rows[row].id;
                    dentist.firstName = rows[row].first_name;
                    dentist.lastName = rows[row].last_name;
                    dentist.id = rows[row].id;
                    dentists.push(dentist);
                  }

                  context.dentists = dentists;
                
                  res.render('dentists', context);
            });             
        });
    }); 
});

/* This loads the procedures page with a list of procedures in a table. 
 */
app.all('/procedures',function(req,res,next){
  var context = {};/* Object holds data that is passed to the front */

    /* Get a list of procedures to fill a table*/
    /* The dentist procedure 'Unavailable' with an id of 105 cannot be removed as this is used to book time off*/
    mysql.pool.query('SELECT * FROM dental_procedure WHERE id <> 105;', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
          var procedures = [];

          /* Put the list of procedures returned from the SQL query into an array */
          for (var row in rows)
          {
            var procedure = {};
            procedure.id = rows[row].id;
            procedure.name = rows[row].name;
            procedure.description = rows[row].description;
            procedures.push(procedure);
          }

          context.procedures = procedures;

          res.render('procedures', context);
    });
});

/* New procedure form data is sent to this function via a POST request
 * and is used to insert a new procedure into the database
 */
app.all('/editProcedureGotInfo',function(req,res,next){
  var context = {};/* Object holds data that is passed to the front */

 /* Insert a new procedure into the database using the form data that
  * was sent in the body of the POST request.
  */ 
  mysql.pool.query("INSERT INTO dental_procedure (`name`, `description`) VALUES (?, ?)", 
  [req.body.name, req.body.description], function(err, result){
    if(err){
      next(err);
      return;
    }

    /* Get a list of procedures to fill a table*/ 
    /* The dentist procedure 'Unavailable' with an id of 105 cannot be removed as this is used to book time off*/
      mysql.pool.query('SELECT * FROM dental_procedure WHERE id <> 105;', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }

            var procedures = [];

            /* Put the list of procedures returned from the SQL query into an array */
            for (var row in rows)
            {
              var procedure = {};
              procedure.id = rows[row].id;
              procedure.name = rows[row].name;
              procedure.description = rows[row].description;
              procedures.push(procedure);
            }

            context.procedures = procedures;

            res.render('procedures', context);
      }); 
  });
});

/*Remove a procedure using the procedureId passed from the 'procedures' page via a POST request */
app.all('/deleteProcedure',function(req,res,next){
  var context = {};/* Object holds data that is passed to the front */

  var procedureId = parseInt(req.body.procedureId,10);

 /* First delete the procedure id entries in the many to many table dentist_dental_procedure */
  mysql.pool.query("DELETE FROM dentist_dental_procedure WHERE pid = ? ;", 
  [procedureId], function(err, result){
    if(err){
      next(err);
      return;
    }

    /* Second remove the procedure from the dental_procedure table */
    mysql.pool.query("DELETE FROM dental_procedure WHERE id = ? ;", 
    [procedureId], function(err, result){
      if(err){
        next(err);
        return;
      }

    /* Get a list of procedures to fill a table*/
     /* The dentist procedure 'Unavailable' with an id of 105 cannot be removed as this is used to book time off*/
      mysql.pool.query('SELECT * FROM dental_procedure WHERE id <> 105;', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }

            var procedures = [];

            /* Put the list of procedures returned from the SQL query into an array */
            for (var row in rows)
            {
              var procedure = {};
              procedure.id = rows[row].id;
              procedure.name = rows[row].name;
              procedure.description = rows[row].description;
              procedures.push(procedure);
            }

            context.procedures = procedures;

            res.render('procedures', context);
      }); 
    });
  });
});

/*Patient login page to make dental appointment. Patient Id is required for login*/
app.get('/make',function(req,res,next){
  var context = {};

   /* no query , will  save patientId from webpage*/
    res.render('makeAppointment', context);
 
});

/* View a specific patient's appointments */
app.get('/viewAppointments',function(req,res,next){
  var context = {};

   /* no query , will  save patientId from webpage*/
    res.render('viewAppointments', context);
 
});


/*Patient login page to cancel dental appointment. Patient Id is required for login*/
app.get('/cancel',function(req,res,next){
  var context = {};

  /* no query , will  save patientId from webpage*/
    res.render('cancelAppointment', context);
});

/*Patient login page to change dental appointment. Patient Id is required for login*/
app.get('/change',function(req,res,next){
  var context = {};

  /* no query , will  save patientId from webpage*/
    res.render('changeAppointment', context);
});

/* After the patient enters their id number a table of all their appointments is printed*/
app.all('/getTable',function(req,res,next){
  var context = {};/* Object holds data that is passed to the front */

  var patientId = req.body.patientId;

  /* Get the patient's name from their id or account number */
  var queryString = "SELECT CONCAT(patient.first_name, ' ',patient.last_name) AS patient_name " +
  "FROM patient " +
  "WHERE patient.id = ?;";
  mysql.pool.query(queryString, [patientId], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }

      /* If the patient enters the wrong number print an error message */
      if (rows.length == 0) {
        context.error = "Please enter a valid patient identification number.";
        res.render('viewAppointments', context);
     } else {

        context.error = "";
        context.name = rows[0].patient_name;

        /* Get a list of the patient's appointments and associated appointment procedure */
        var queryStringApps = 
        "SELECT date_format(appointment.date, ' %m/%d/%Y ' ) AS theDate, TIME_FORMAT(`appointment`.time, '%h:%i %p') AS theTime, " +
        "`dental_procedure`.name, CONCAT(`dentist`.first_name, ' ', `dentist`.last_name) AS dentist_name " +
        "FROM `appointment` " +
        "INNER JOIN `dental_procedure` ON `appointment`.pid = `dental_procedure`.id " +
        "INNER JOIN `dentist` ON `appointment`.did = `dentist`.id " +
        "WHERE `appointment`.ptid = ?;";
        mysql.pool.query(queryStringApps,[patientId], function(err, rows, fields){
            if(err){
              next(err);
              return;
            }

            var appointments = [];

            if (rows.length == 0) {

              context.error = "No Appointments At This Time.";

           } else {

                context.error = "";

                /* Put the list of appointments returned from the SQL query into an array */
                for (var row in rows)
                {
                  var appointment = {};
                  appointment.date = rows[row].theDate;
                  appointment.time = rows[row].theTime;
                  appointment.procedure = rows[row].name;
                  appointment.dentistName = rows[row].dentist_name;
                  appointments.push(appointment);
                }

                context.appointments = appointments;
            }     

            res.render('patientAppointments', context);  
      });
    }
  });
});

/*After patient enter their login id to make appointment, patient can choose procedure 
  from a drop down list. */
  app.all('/procedure', function (req, res, next) {
    var context = {};
    var patientId = req.body.patientId; /*patient id pass from the front page*/   
 
    /* verified patient id */
    /* use patient id pass from the front page to find out patient's dentist id */
    /* to find out the procedures the dentist perform */
    mysql.pool.query('SELECT id, did FROM patient WHERE id = ?', [req.body.patientId],
    function (err, rows, fields) {
       if (err) {
          next(err);
          return;
       }
       // incorrect patient ID error 
       if (rows.length == 0) {
          context.error = "Please enter a valid patient identification number.";
          res.render('makeAppointment', context);
       } else {
          context.dentistId = rows[0].did;
          /* SQL query: select procedures that the patient's dentist performs */
          /* and exclude the procedure with name "Unavailable"*/
          var PROCEDURE_QUERY = "SELECT dp.id, dp.name FROM patient " +
            "INNER JOIN dentist_dental_procedure AS ddp ON ddp.did = patient.did " +
            "INNER JOIN dental_procedure AS dp ON dp.id = ddp.pid " +
            "WHERE patient.id = ? " +
            "AND dp.name != 'Unavailable' ";
          mysql.pool.query(PROCEDURE_QUERY, [patientId], function (err, rows, fields) {
             if (err) {
                next(err);
                return;
             }
             var procedure = [];
             for (var i in rows) {
                procedure.push({ 'procedureId': rows[i].id, 'name': rows[i].name });
             }
 
             context.procedure = procedure;
             context.patientId = patientId;
             res.render('procedure', context);
          })
       }
    });
 });

/*After patient select a procedure, patient can pick a date to schedule appointment
  PatientId, procedureId and dentistId is pass from previous page*/
  app.all('/date', function (req, res, next) {
    var context = {};

    context.nextStep = req.body.nextStep;
    context.patientId = req.body.patientId;
    context.procedureId = req.body.procedureId;
    context.dentistId = req.body.dentistId;

    /* no query will save patient Id from webpage*/
    /* if date is invalid render date page with error message else render time */
    /* just render the date form */
    res.render('date', context);
 });

/*After patient select a date, patient can pick a time to schedule appointment
  PatientId, procedureId, dentistId and day is pass from previous page*/
  app.all('/time', function (req, res, next) {
    var context = {};
    var busyTimes = [];   /*used to store times when dentist is bookd*/
    var freeTimes = [];   /*used to store times when dentist is available*/
    var nextStep = req.body.nextStep;
    var apptDate = req.body.apptDate;
    var patientId = req.body.patientId;
    var procedureId = req.body.procedureId;
    var dentistId = req.body.dentistId;
    var oldApptDate = req.body.oldApptDate;
    var oldApptTime = req.body.oldApptTime;
 
    /* Select times from the appointment schedule on the day the patient wants to make
     * an appointment. A local javascript function will then exclude these times from
     * a drop down list of times in half-hour intervals for the patient to select.
     */
 
    /* SQL Query: select times that the dentist is unavailable on the day given by the variable date */
    var BUSY_INTERVAL_QUERY =
       "SELECT (HOUR(time)*2 + MINUTE(time)/30) AS busy_interval FROM appointment " +
       "WHERE appointment.date = CONVERT(?, DATE) " +
       "AND did = ?";
    mysql.pool.query(BUSY_INTERVAL_QUERY, [apptDate, dentistId], function (err, rows, fields) {
       if (err) {
          next(err);
          return;
       }
       /* a for loop will run through the unavailable times to generate a list of times
        * in half hour intervals that the dentist is available.
        */
 
       /* run javascript in background to prevent weekend*/
 
       for (var i in rows) {
          busyTimes.push({ 'busy': rows[i].busy_interval });
       }
       /*
        * A day has 48 half-hour intervals.
        * 8AM will be assigned numeric value 16 while 6PM will be assigned numeric value 36.
        */
       var busyIndex = 0;
       for (var i = 16; i < 36; i++) {
          // Do not add time to free time array if it is busy
          if (busyIndex < busyTimes.length && busyTimes[busyIndex].busy == i) {
             busyIndex = busyIndex + 1;
          } else {
             // Build time string from interval value
             var hour = Math.floor(i / 2);
             var hiddenTime = hour; // 24-hour format
             var displayTime = hour; // 12-hour format
             var halfHour = ":30";
             if (i % 2 == 0) {
                halfHour = ":00";
             }
             var midday = " AM";
             if (hour >= 12) {
                if (hour > 12) {
                   displayTime = hour - 12;
                }
                midday = " PM";
             }
             hiddenTime = hiddenTime + halfHour;
             displayTime = displayTime + halfHour + midday;
             freeTimes.push({ 'hiddenTime': hiddenTime, 'displayTime': displayTime });
          }
       }
 
       context.nextStep = nextStep;
       context.apptDate = apptDate;
       context.patientId = patientId;
       context.procedureId = procedureId;
       context.dentistId = dentistId;
       context.freeTimes = freeTimes;
       context.oldApptDate = oldApptDate;
       context.oldApptTime = oldApptTime;
       res.render('time', context);
    });
 });

/*Appointment confirmation page*/
app.all('/confirmApp', function (req, res, next) {
  var context = {};
  //form date and hidden variables 
  var nextStep = req.body.nextStep;
  var apptDate = req.body.apptDate;
  var apptTime = req.body.apptTime;
  var patientId = req.body.patientId;
  var procedureId = req.body.procedureId;
  var dentistId = req.body.dentistId;
  var oldApptDate = req.body.oldApptDate;
  var oldApptTime = req.body.oldApptTime;

  /* convert the time to a 12 hour clock to display */
  var timeBreak = apptTime.split(":");
  hour = parseInt(timeBreak[0],10);
  minuteIn = parseInt(timeBreak[1],10);
  var apptTime12 = moment({hour, minute: minuteIn}).format('hh:mm A');

  /* Two SQL queries based on the value of the variable nextStep which is passed from the web page */
  /* 1) SQL query: insert into appointments an appointment at time, patient, date */
  /* 2) SQL query: update appointment with appointmentId and change the appointment time, and date */
  if (nextStep == "change") {
     var UPDATE_APPOINTMENT_QUERY =
        "UPDATE appointment " +
        "SET date = CONVERT(?, DATE), time = CONVERT(?, TIME) " +
        "WHERE date = CONVERT(?, DATE) AND time = CONVERT(?, TIME) AND ptid = ? AND did = ?";
     mysql.pool.query(UPDATE_APPOINTMENT_QUERY, [apptDate, apptTime, oldApptDate, oldApptTime, patientId, dentistId], function (err, rows, fields) {
        if (err) {
           next(err);
           return;
        }
     });
  } else {
     var INSERT_APPOINTMENT_QUERY =
        "INSERT INTO appointment (date, time, ptid, pid, did) " +
        "VALUES (CONVERT(?, DATE), CONVERT(?, TIME), ?, ?, ?)";
     mysql.pool.query(INSERT_APPOINTMENT_QUERY, [apptDate, apptTime, patientId, procedureId, dentistId], function (err, rows, fields) {
        if (err) {
           next(err);
           return;
        }
     });
  }
  context.apptDate = apptDate;
  context.apptTime = apptTime12;
  res.render('confirmApp', context);
});

/*select appointment for patient to update and delete */
app.all('/selectAppointment', function (req, res, next) {
  var context = {};
  var appointments = [];
  var nextStep = req.body.nextStep;
  var patientId = req.body.patientId;
  var oldApptDate = req.body.oldApptDate;
  var oldApptTime = req.body.oldApptTime; 
  context.nextStep = nextStep;
  context.patientId = patientId;
  context.oldApptDate = oldApptDate;
  context.oldApptTime = oldApptTime;

  /* SQL query: select all appointments that are for patientId */
  var PATIENT_APPOINTMENT_QUERY =
     "SELECT CONCAT(appointment.date,',', appointment.time,',',appointment.did) AS appointmentId, " +
     "CONCAT('Appointment with Doctor ', dentist.last_name, ' at ', TIME_FORMAT(`appointment`.time, '%h:%i %p'), ' on ', date_format(appointment.date, ' %m/%d/%Y ' )) as appointment FROM appointment " +
     "INNER JOIN dentist ON dentist.id = appointment.did " +
     "WHERE ptid = ?";

  mysql.pool.query(PATIENT_APPOINTMENT_QUERY, [patientId], function (err, rows, fields) {
     if (rows.length == 0) {
        context.error = "You entered the wrong account number or have no existing appointments.";
        if (nextStep == "change") {
           res.render('changeAppointment', context);
        } else {
           res.render('cancelAppointment', context);
        }
     } else {
        for (var i in rows) {
           appointments.push({ 'appointmentId': rows[i].appointmentId, 'appointment': rows[i].appointment });
        }
        context.appointments = appointments;
        res.render('selectAppointment', context);
     }
  });
});


/* appointment that needs to be delete */
app.all('/selected', function (req, res, next) {
   var context = {};
   var nextStep = req.body.nextStep;
   var patientId = req.body.patientId;

   /*pass existing appointment information for update and delete queries later  */
   var appointmentId = req.body.appointmentId; 
   var tokens = appointmentId.split(",");
   var oldApptDate = tokens[0];
   var oldApptTime = tokens[1];
   var dentistId = tokens[2];

   /* convert the time to a 12 hour clock to display */
   var timeBreak = oldApptTime.split(":");
   hour = parseInt(timeBreak[0],10);
   minuteIn = parseInt(timeBreak[1],10);
   var oldApptTime12 = moment({hour, minute: minuteIn}).format('hh:mm A');

   /* SQL query: delete appointment with appointmentId */

   context.nextStep = nextStep;
   context.patientId = patientId;
   context.oldApptDate = oldApptDate;
   context.oldApptTime = oldApptTime12; // oldApptTime;
   context.dentistId = dentistId;

   if (nextStep == "change") {  /* need to propogate nextStep through date and time */
      
      res.render('date', context);
   }
   else if (nextStep == "cancel") {

      var DELETE_APPOINTMENT_QUERY =
         "DELETE FROM appointment " +
         "WHERE date = CONVERT(?, DATE) AND time = CONVERT(?, TIME) AND ptid = ? AND did = ?";
      mysql.pool.query(DELETE_APPOINTMENT_QUERY, [oldApptDate, oldApptTime, patientId, dentistId], function (err, rows, fields) {
         res.render('confirmDelete', context);
      });
   }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

# Dental_Appointment_Portal
A dental appointment application with a supporting database that will enable patients to make limited appointments 
at a dental office by using a website that will form the front end. In addition, through an administration login
this application enables staff access to the entire database and provides dentists with the ability to book time off 
or cancel patient appointments.

### Technology Stack

Front-End      | Back-End
---------------|---------
HTML           |  Node.JS
Bootstrap CSS  |  Express
Javascript     |  Handlebars
&nbsp;         |  My SQL

### Database Design
<img src="./documentation/Entity_Relationship_Diagram.png" alt="ERD" width="500">
<img src="./documentation/Schema.png" alt="Schema" width="500">

### Screenshots of Website
1. General

    1) Site home page. 

    CRUD: Select from procedure all procedures and their descriptions except for the procedure “Unavailable”.
    
    <img src="./screenshots/Site_Home.png" alt="Site_Home" width="500"> 
    
    &nbsp;
    &nbsp;
    
2. For Patients

    1) Patient home page.
    
    CRUD: select from procedure all procedures and their descriptions except for the procedure “Unavailable”.
    
    <img src="./screenshots/Patient_Home.png" alt="Patient_Home" width="500">    
    
    &nbsp;
    &nbsp;    
    
    2) Make appointment step 1: enter patient account number.
    
    CRUD: select dentist id and patient id (used to verify) using patient account number (patient id).
    
    <img src="./screenshots/Make_an_appointment.png" alt="Make_an_appointment" width="500">
    
    &nbsp;
    &nbsp;    
    
    3) Make appointment step 2: select a procedure.
    
    CRUD: select the procedures that the patient’s dentist performs except for the procedure “unavailable”. 
    
    <img src="./screenshots/Enter_the_appointment_procedure.png" alt="Enter_the_appointment_procedure" width="500">    
    
    &nbsp;
    &nbsp;  
    
    4) Make or change an appointment step 3: select a date. 
    
    No CRUD functionality.    
    
    <img src="./screenshots/Enter_the_appointment_date.png" alt="Enter_the_appointment_date" width="500">  
    
    &nbsp;
    &nbsp;    
    
    5) Make or change an appointment step 4: select the time from a drop-down list.    

    CRUD: select the times (in half hour intervals) that the dentist is unavailable on the given date.
    
    <img src="./screenshots/Enter_appointment_time.png" alt="Enter_appointment_time" width="500">  
    
    &nbsp;
    &nbsp;
    
    6) Make or change an appointment step 5: confirmation page.
    
    CRUD:
    For making an appointment: insert into appointment a new appointment with the selected date, time, and procedure and dentist Id and patient account number  (patient Id).
    
    or
    
    For changing an appointment: update appointment and set the time and date to the newly selected time and date where the appointment is identified by the dentist Id and original date and time  
    
    <img src="./screenshots/Confirms_the_appointment_date_and_time.png" alt="Confirms_the_appointment_date_and_time" width="500">  
    
    &nbsp;
    &nbsp;
    
    7) Change an appointment step 1: Enter patient account number.
    
    No CRUD functionality.
    
    <img src="./screenshots/Change_an_appointment.png" alt="Change_an_appointment" width="500">  
    
    &nbsp;
    &nbsp;   
    
    8) Change or cancel an appointment step 2: Select an appointment to change or cancel.
    
    CRUD: select appointments from appointment for the patient with the given account number (patient id). 
    
    <img src="./screenshots/Where_a_patient_selects_and_appointment_to_cancel.png" alt="Where_a_patient_selects_an_appointment_to_cancel" width="500">        
       
    &nbsp;
    &nbsp;
    
    9) Cancel an appointment step 1: enter patient account number (patient id). 
    
    No CRUD functionality.  
    
    <img src="./screenshots/Cancel_an_appointment.png" alt="Cancel_an_appointment" width="500">    
    
    &nbsp;
    &nbsp;  
    
    10) Cancel an appointment confirmation page.
    
    CRUD: Delete from appointment the appointment with the specified date, time and dentist Id.   
    
    <img src="./screenshots/Confirms_that_an_appointment_was_deleted.png" alt="Confirms_that_an_appointment_was_deleted" width="500">
    
    &nbsp;
    &nbsp; 
    
    11) View appointments step 1: enter patient account number.
    
    No CRUD functionality.  
    
    <img src="./screenshots/View_all_booked_appointments.png" alt="View_all_booked_appointments." width="500">    
    
    &nbsp;
    &nbsp;  
    
    12) View appointments table.
    
    CRUD:
    
    1) select the patient’s name based on the patient account number (patient id)
    
    2) select the patient’s appointments from the appointment table and display the dentist’s name too through an inner join    
    
    <img src="./screenshots/Displays_a_table_of_the_patient's_appointments.png" alt="Displays_a_table_of_the_patient's_appointments" width="500"> 
    
    &nbsp;
    &nbsp;  
    
3. For Staff

    1) Administrator login. A non-functional login page used to access the administrator side. 
    
    No CRUD functionality.   
    
    <img src="./screenshots/Administrator_login.png" alt="Administrator_login" width="500"> 
    
    &nbsp;
    &nbsp;
        
    2) Administrator home page. 
    
    No CRUD functionality.
    
    <img src="./screenshots/Administrator_Home.png" alt="Administrator_Home" width="500">
    
    &nbsp;
    &nbsp;
    
    3) Insert a new patient.
    CRUD:
        1) select all dentists to fill a drop-down list
        
        2) insert into patient table a new patient with the entered name and selected dentist
        
        3) display all patients: select all information from the patient table and their dentist’s name through an inner join  
       
    <img src="./screenshots/Where_an_administrator_adds_a_patient.png" alt="Where_an_administrator_adds_a_patient" width="500"> 
    
    &nbsp;
    &nbsp;  
    
    4) Insert or delete a procedure.
    
    CRUD:
    
        1) Populate a table with all procedures: Select all from the dental_procedure table
        
        2) If Choose to add a procedure: Insert into the dental_procedure table the name and description of a new procedure
        
        3) If Choose to delete a procedure:
        
            1. Delete procedure from many-to-many table dentist_dental_procedure 
            
            2. Delete procedure from dental_procedure table   
            
    <img src="./screenshots/Where_an_administrator_adds_or_removes_a_procedure.png" alt="Where_an_administrator_adds_or_removes_a_procedure" width="500">             
    
    &nbsp;
    &nbsp;    
    
    5) Insert or delete a dentist.
    
    CRUD:
    
        1) Populate a table with all dentists: select all from the dentist table
        
        2) If Choose to add a dentist:
        
            i. insert into the dentist table the name of a new dentist
            
            ii. insert into the dentist_dental_procedure table the procedure “Unavailable” with new dentist’s id
            
        3) If Choose to delete a dentist:
        
            i. delete dentist from many-to-many table dentist_dental_procedure ii. delete dentist from dentist table  
            
    <img src="./screenshots/Where_an_administrator_adds_or_removes_a_dentist.png" alt="Where_an_administrator_adds_or_removes_a_dentist" width="500"> 
    
    &nbsp;
    &nbsp; 
    
    6) Add or remove a dentist’s procedures.
    
    CRUD:
    
        1) To verify the dentist Id: Select the dentist Id from the dentist table
        
        2) Get a list of all the procedures the dentist is signed up for. This is used to select a procedure to remove: Select procedure names from the dental_procedure table inner joined with the denist_dental_procedure table where the procedure is not “Unavailable”.
        
        3) Get a list of all the procedures the dentist is not signed up for. The dentist can choose to add one of these to their list of procedures: Select procedure names from dental_procedure where the procedure is not in the list of procedures the dentist is already signed up for
        
        4) If choose to add a procedure: Insert into many-to-many table dentist_dental_procedure the dentist’s Id and the procedure Id
        
        5) If choose to delete a procedure: delete from the many-to-many table dentist_dental_procedure the dentist’s Id and the procedure Id
        
        6) Get the dentist’s name: Select dentist’s name from the dentist table using the dentist’s account number
        
        7) Get a list of all the procedures and their descriptions that the dentist is signed up for to print in a table: Select procedure name and description from dental_procedure inner joined to dentist_dental_procedure where the dentist Id is that entered by the dentist    
        
    <img src="./screenshots/Where_an_administrator_adds_or_removes_a_dentist's_procedures.png" alt="Where_an_administrator_adds_or_removes_a_dentist's_procedures" width="500">      
        
    &nbsp;
    &nbsp;   
    
    7) Schedule time off or cancel a patient appointment.
    
    CRUD:
    
        1) To verify the dentist Id: Select the dentist Id from the dentist table
        
        2) Get a list of appointments for the dentist to optionally select an appointment to delete: Select an appointment from the appointments table for the given dentist Id

        3) If delete an appointment: Delete an appointment using the selected dentist id, date, and time
        
        4) If a dentist chooses to book time off:
        
            i. Select all times in half-hour intervals that the dentist has appointments on the selected day.

            ii. Insert into the appointment table an appointment with the procedure “Unavailable” and the patient field left as NULL.


        5) Get the dentist’s name: Select the dentist’s name from the dentist table.
        
        6) Put all the dentist’s appointments in a table: Select all appointments, including the procedure name and patient name from the appointment table inner and left joined with other tables, where the dentist’s id is equal to the input value.  
        
   <img src="./screenshots/Where_a_dentist_can_either_add_time_off_to_the_schedule_or_cancel_an_appointment.png" alt="Where_a_dentist_can_either_add_time_off_to_the_schedule_or_cancel_an_appointment" width="500">  


  
                                                                                                                                             

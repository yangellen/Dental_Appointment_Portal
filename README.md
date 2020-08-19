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
    
    <img src="./screenshots/Administrator_Home.png" alt="Administrator_Home" width="500">


<img src="./screenshots/Where_a_dentist_can_either_add_time_off_to_the_schedule_or_cancel_an_appointment.png" alt="Where_a_dentist_can_either_add_time_off_to_the_schedule_or_cancel_an_appointment" width="500">  

<img src="./screenshots/Where_an_administrator_adds_a_patient.png" alt="Where_an_administrator_adds_a_patient" width="500"> 
<img src="./screenshots/Where_an_administrator_adds_or_removes_a_dentist.png" alt="Where_an_administrator_adds_or_removes_a_dentist" width="500"> 
<img src="./screenshots/Where_an_administrator_adds_or_removes_a_dentist's_procedures.png" alt="Where_an_administrator_adds_or_removes_a_dentist's_procedures" width="500">  
<img src="./screenshots/Where_an_administrator_adds_or_removes_a_procedure.png" alt="Where_an_administrator_adds_or_removes_a_procedure" width="500">                                                                                                                                              

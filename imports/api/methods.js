import { Meteor } from 'meteor/meteor';
import {Reports_db} from './report.js';
import {UserData_db} from './userData.js';
import {IncidentType_db} from './incidentType.js';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
Meteor.methods({
    // database methods for report object
  'reports.insert'(title, reportedBy, location, description) {
    check(title, String);
    Reports_db.insert({
       title,
       reportedBy,
       location,
       description,
       createdAt: new Date(),
     });
   },
   'reports.remove'(reportId) {
     Reports_db.remove(reportId);
   },
   'reports.update'(reportId, newTitle, newLocation, newDescription) {
     Reports_db.update(reportId, {$set: {title: newTitle, location: newLocation, description: newDescription}});
   },

   // aux methods
   'userAux.find'(userId) {
     return Meteor.users.find(userId).fetch();
   },

   //atabase methods for user object
   'userData.remove'(userId) {
       UserData_db.remove(userId);
   },

   'userData.update'(userId, newFullName) {
     if(UserData_db.find({originalUserId: userId}).count() == 0) {
        UserData_db.insert({
          originalUserId: userId,
          fullName : newFullName,
          createdAt: new Date(),
       })
     }
     else {
      UserData_db.update({originalUserId: userId}, {$set: {fullName: newFullName}});
     }
   },


   // database methods for category object
   'incidentType.insert'(name, description) {
    check(name, String);
    IncidentType_db.insert({
       name,
       description,
       createdAt: new Date(),
     });
   },
   'incidentType.remove'(incidentTypeId) {
     IncidentType_db.remove(incidentTypeId);
   },
   'incidentType.update'(incidentTypeId, newName, newDescription) {
     IncidentType_db.update(incidentTypeId, {$set: {name: newName, description: newDescription}});
   },
  });
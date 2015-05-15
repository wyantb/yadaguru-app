var reminderController = function(Reminder) {

  // GET route [/api/reminders]
  var get = function(req, res) {

    Reminder.find(function(err, reminders){

      // Log errors
      if(err) {
        console.log(err);
      } else {

        var returnReminders = [];

        // Add a link for GET by id to return JSON
        reminders.forEach(function(element, index, array) {

          // Get entry as JSON object and add link
          var newReminder = element.toJSON();
          // links{} must be added before links.self can be created
          newReminder.links = {};
          newReminder.links.self = 'http://' +
            req.headers.host + '/api/reminders/' + newReminder._id;

          // Add new JSON object to return array
          returnReminders.push(newReminder);
        });

        // Return array in JSON format
        res.json(returnReminders);
      }
    });
  };

  // POST route [/api/reminders] 
  var post = function(req, res) {

    // Get the post data from the body
    var reminder = new Reminder(req.body);

    // Return an error if there is missing data, else save data
    if(!req.body.field || 
       !req.body.fullName ||
       !req.body.message ||
       !req.body.detail ||
       !req.body.reminder) {
      res.status(400);
      res.send('Not all properties are present. ' +
          'Requires field, fullName, message, detail, and reminder.');
    } else {
      reminder.save();
      res.status(201);
      res.send(reminder);
    }
  };


  // Allow post and get to be accessed
  return {
    post: post,
    get: get
  };
};

module.exports = reminderController;
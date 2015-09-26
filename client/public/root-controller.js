(function(app) {
  'use strict';

  var RootController = function ($scope, $rootScope, YadaAPI, Utils, ReminderService, GoogleCalendar,
                                 iCalService, $timeout, pdfService) {
    var ungroupedReminders = [];
    var iCal = new iCalService();
    $scope.reminders = [];
    $scope.dt = new Date();
    var calendarData;

    $scope.selectedTab = '';
    $scope.exportStatus = 'ready';

    $scope.setTab = function(tabName) {
      $scope.selectedTab = '';
      $timeout(function() {
        $scope.selectedTab = tabName;
      }, 1000);
    };

    $scope.isActiveTab = function(tabName) {
      if ($scope.selectedTab === tabName) {
        return true;
      } else {
        return false;
      }
    };

    $scope.clearReminders = function() {
      $scope.reminders = [];
      $scope.ungroupedReminders = [];
      $scope.formData.dt = null;
      $scope.formData.schoolName = null;
      $scope.exportStatus = 'ready';
    };

    $scope.downloadReminders = function() {
      ungroupedReminders.forEach(function(ur) {
        var date = new Date(ur.sortDate);
        var dateFormatted = date.getFullYear() +
                            ('0' + (date.getMonth()+1)).slice(-2) +
                            ('0' + date.getDate()).slice(-2);
        var calEvent = {
          description: ur.name || ur.testType,
          startDate: dateFormatted,
          endDate: dateFormatted,
          summary: ur.detail,
          comment: ur.message
        };
        iCal.addEvent(calEvent);
      });
      iCal.download('YadaguruReminders.ics');
      iCal.events = [];
    };

    var removeTags = function(html) {
      var div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    $scope.saveAsPdf = function() {
      var pdf = new pdfService('p', 'in', 'letter');
      var config = {
        'dateGroup': {
          'fontSize': 30,
          'fontName': 'Times',
          'indent': 0.5
        },
        'category': {
          'fontSize': 30,
          'fontName': 'Times',
          'indent': 0.75
        },
        'reminderName': {
          'fontSize': 18,
          'fontName': 'Times',
          'indent': 1
        },
        'reminderMessage': {
          'fontSize': 14,
          'fontName': 'Times',
          'indent': 1.25
        },
        'reminderDetail': {
          'fontSize': 14,
          'fontName': 'Times',
          'indent': 1.25
        }
      };
      var verticalOffset = 0.5;
      var pageHeight = 10.5;
      var yPos;
      var groupedMessages = $scope.reminders;
      for (var i = 0, gmLength = groupedMessages.length; i < gmLength; i++) {
        var dateGroup = groupedMessages[i];
    		var dateGroupName = pdf.setFont(config.dateGroup.fontName)
    					                 .setFontSize(config.dateGroup.fontSize)
		                           .splitTextToSize(removeTags(dateGroup.name), 8 - config.dateGroup.indent);

        yPos = verticalOffset + config.dateGroup.fontSize / 72;

    		verticalOffset += (dateGroupName.length + 1) * config.dateGroup.fontSize / 72;

        if (verticalOffset > pageHeight) {
          pdf.addPage();
          verticalOffset = 0.5;
          yPos = verticalOffset + config.dateGroup.fontSize / 72;
          verticalOffset += (dateGroupName.length + 1) * config.dateGroup.fontSize / 72;
        }

    		pdf.text(config.dateGroup.indent, yPos, dateGroupName);

        var categories = dateGroup.members;
        for (var x = 0, cLength = categories.length; x < cLength; x++) {
          var category = categories[x];
      		var categoryName = pdf.setFont(config.category.fontName)
      					                .setFontSize(config.category.fontSize)
		                            .splitTextToSize(removeTags(category.name), 8 - config.category.indent);

          yPos = verticalOffset + config.category.fontSize / 72;

      		verticalOffset += (categoryName.length + 1) * config.category.fontSize / 72;

          if (verticalOffset > pageHeight) {
            pdf.addPage();
            verticalOffset = 0.5;
            yPos = verticalOffset + config.category.fontSize / 72;
            verticalOffset += (categoryName.length + 1) * config.category.fontSize / 72;
          }

      		pdf.text(config.category.indent, yPos, categoryName);

          var reminders = category.members;
          for (var y = 0, rLength = reminders.length; y < rLength; y++) {
            var reminder = reminders[y];
        		var reminderName = pdf.setFont(config.reminderName.fontName)
        					                .setFontSize(config.reminderName.fontSize)
				                          .splitTextToSize(removeTags(reminder.name), 8 - config.reminderName.indent);

            yPos = verticalOffset + config.reminderName.fontSize / 72;

            verticalOffset += (reminderName.length + 1) * config.reminderName.fontSize / 72;

            if (verticalOffset > pageHeight) {
              pdf.addPage();
              verticalOffset = 0.5;
              yPos = verticalOffset + config.reminderName.fontSize / 72;
              verticalOffset += (reminderName.length + 1) * config.reminderName.fontSize / 72;
            }

        		pdf.text(config.reminderName.indent, yPos, reminderName);

        		var reminderMessage = pdf.setFont(config.reminderMessage.fontName)
      					                     .setFontSize(config.reminderMessage.fontSize)
				                             .splitTextToSize(removeTags(reminder.message), 8 - config.reminderMessage.indent);

            yPos = verticalOffset + config.reminderMessage.fontSize / 72;

            verticalOffset += (reminderMessage.length + 1) * config.reminderMessage.fontSize / 72;

            if (verticalOffset > pageHeight) {
              pdf.addPage();
              verticalOffset = 0.5;
              yPos = verticalOffset + config.reminderMessage.fontSize / 72;
              verticalOffset += (reminderMessage.length + 1) * config.reminderMessage.fontSize / 72;
            }

        		pdf.text(config.reminderMessage.indent, yPos, reminderMessage);

        		var reminderDetail = pdf.setFont(config.reminderDetail.fontName)
        					                  .setFontSize(config.reminderDetail.fontSize)
				                            .splitTextToSize(removeTags(reminder.detail), 8 - config.reminderDetail.indent);

            yPos = verticalOffset + config.reminderDetail.fontSize / 72;

        		verticalOffset += (reminderDetail.length + 2) * config.reminderDetail.fontSize / 72;

            if (verticalOffset > pageHeight) {
              pdf.addPage();
              verticalOffset = 0.5;
              yPos = verticalOffset + config.reminderDetail.fontSize / 72;
              verticalOffset += (reminderDetail.length + 2) * config.reminderDetail.fontSize / 72;
            }

            pdf.text(config.reminderDetail.indent, yPos, reminderDetail);
          }
        }
      }
      pdf.save('Test.pdf');
    };

    $scope.buildReminderList = function(data) {
      var currentDate = new Date();
      var reminderData = data.reminders,
          testDateData = data.testDates,
          categoryData = data.categories,
          settings = data.settings[0],
          summerDate = {'month': settings.summerCutoffMonth, 'day': settings.summerCutoffDay},
          testMessageData = data.testMessages[0],
          testMessageCategory = Utils.lookup(categoryData, '_id', testMessageData.testCategory, 'categoryName'),
          allData,
          reminderMessages,
          groupedMessages;
      reminderData = ReminderService.flattenTimeframes(reminderData);
      reminderData = ReminderService.generateSortDates(reminderData, 'timeframes', $scope.formData.dt, summerDate);
      var reminderDataWithCategory = [];
      reminderData = reminderData.forEach(function(reminder) {
        reminder.category = Utils.lookup(categoryData, '_id', reminder.category, 'categoryName');
        reminderDataWithCategory.push(reminder);
      });
      testDateData = ReminderService.generateSortDates(testDateData, 'registrationDate');
      testDateData = Utils.addKeyValue(testDateData, 'category', testMessageCategory);
      testDateData = Utils.addKeyValue(testDateData, 'message', testMessageData.satMessage, function(msg) {
        return msg.testType === 'SAT';
      });
      testDateData = Utils.addKeyValue(testDateData, 'detail', testMessageData.satDetail, function(msg) {
        return msg.testType === 'SAT';
      });
      testDateData = Utils.addKeyValue(testDateData, 'message', testMessageData.actMessage, function(msg) {
        return msg.testType === 'ACT';
      });
      testDateData = Utils.addKeyValue(testDateData, 'detail', testMessageData.actDetail, function(msg) {
        return msg.testType === 'ACT';
      });
      allData = reminderDataWithCategory.concat(testDateData);
      calendarData = allData;
      allData = Utils.sortBy(allData, 'sortDate');
      ungroupedReminders = allData; // Set ungroupedReminders for the iCal download
      reminderMessages = ReminderService.generateMessages(allData, $scope.formData.schoolName, $scope.formData.dt,
                                                          currentDate, testMessageCategory);
      groupedMessages = Utils.groupBy(reminderMessages, 'date');
      groupedMessages.forEach(function(dateGroup) {
        dateGroup.members = Utils.groupBy(dateGroup.members, 'category');
      });
      $scope.setTab(groupedMessages[0].name);
      $scope.reminders = groupedMessages;
      console.log($scope.reminders);
    };

    $scope.getReminders = function(formData) {
      $scope.formData = formData;
      Utils.getModels(YadaAPI, ['reminders', 'testDates', 'testMessages', 'categories', 'settings'], $scope.buildReminderList);
    };


    $scope.exportToGoogleCalendar = function() {
      $scope.exportStatus = 'exporting';
      GoogleCalendar.addCalendarEvents(calendarData, $scope.formData.schoolName, $scope.formData.dt, function() {
        $scope.exportStatus = 'complete';
      });
    };

    $scope.format = 'M/d/yyyy';
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
      $scope.dt = null;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.minDate = new Date();
  };

  var FaqController = function($scope, YadaAPI, $sce) {

    $scope.faqContent = '';

    $scope.getFaqs = function() {
      YadaAPI.faqs.get().then(function(resp) {
        $scope.faqContent = $sce.trustAsHtml(resp.data[0].content);
      }, function(err) {console.log(err);});
    };

    $scope.getFaqs();

  };

  app.controller('RootController', ['$scope', '$rootScope', 'YadaAPI', 'Utils', 'ReminderService', 'GoogleCalendar',
    'iCalService', '$timeout', 'pdfService', RootController]);
  app.controller('FaqController', ['$scope', 'YadaAPI', '$sce', FaqController]);

}(angular.module('yg.root')));

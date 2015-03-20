(function() {
  var intId;
  return {
    defaultState: 'loading',
    numberOfTickets: null,
    // group: null,
    view: null,
    assignedTickets: {},
    tickets: [],
    assignedThisRound: 0,

    requests: {
      fetchTickets: function(view) {
        return {
          url: '/api/v2/views/' + view + '/execute.json?page=' + (Math.floor(Math.random() * this.setting('pages')) + 1)
            //url: '/api/v2/search.json?query=assignee:none+status<solved+group:' + group
        };
      },
      assignTickets: function(idString) {
        return {
          url: '/api/v2/tickets/update_many.json?ids=' + idString,
          type: 'PUT',
          data: {
            ticket: {
              "assignee_id": this.currentUser().id()
            }
          }
        };
      },
      verifyAssignment: function(idString) {
        return {
          url: '/api/v2/tickets/show_many.json?ids=' + idString,
          type: 'POST'
        };
      },
      jobReq: function(path) {
        return {
          url: path
        };
      }
    },

    events: {
      'app.activated': 'init',
      'click .takeNextButton': 'requestTickets',
      'click .goButton': 'requestTicketsFromSelection',
      'fetchTickets.done': 'processTickets',
      'assignTickets.done': 'jobCallback',
      'verifyAssignment.done': 'countAssigned'
    },

    init: function() {
      this.numberOfTickets = this.setting('quantity');
      // this.group = this.setting('group');

      this.menu_config = JSON.parse(this.setting('menu_config'));
      console.log(this.setting('pages'));
      this.showForm();
    },
    showForm: function() {
      this.switchTo('dynamic_form', {
        number: this.numberOfTickets,
        menu_config: this.menu_config
      });
    },
    showButton: function() {
      this.switchTo('next_button', {
        number: this.numberOfTickets
      });
    },
    buildStringAndPost: function(max) {
      // console.log("passing", ary);
      var ticketIds = [],
        counted = 0;
      console.log("assigned", this.assignedTickets);
      for (var i = 0; i < this.tickets.length; i++) {
        var currentId = this.tickets[i].ticket.id;
        if (counted < max && typeof this.assignedTickets[currentId] == 'undefined') {
          this.assignedTickets[currentId] = i;
          console.log("curr id ", currentId, counted);
          ticketIds.push(currentId);
          counted++;
        }
      }
      if (counted > 0) {
        var ticketIdsString = ticketIds.toString();
        this.ajax('assignTickets', ticketIdsString);
      } else {
        this.noResults();
      }
    },
    jobCallback: function(resp) {
      // console.log("job response ", resp);
      var jobPath = resp.job_status.url,
        self = this;
      intId = setInterval(function() {
        self.checkJobStatus(jobPath);
      }, 1000);
    },
    checkJobStatus: function(path) {
      var ids = [];

      this.ajax('jobReq', path).done(function(data) {
        console.log(data.job_status);
        if (data.job_status.status == "completed" || data.job_status.status == "failed") {
          clearInterval(intId);
          for (var i = 0; i < data.job_status.results.length; i++) {
            ids.push(data.job_status.results[i].id);
          }
          this.ajax('verifyAssignment', ids.toString());
          // this.showButton();
          if (data.job_status.status == "failed") {
            this.showButton();
            services.notify("There was an error assigning tickets to you; Please try again.");
          }
        }
      });
    },
    countAssigned: function(resp) {
      for (var i = resp.tickets.length - 1; i >= 0; i--) {
        if (resp.tickets[i].assignee_id == this.currentUser().id());
        this.assignedThisRound++;
      }
      if (this.assignedThisRound < this.max) {
        this.ajax('fetchTickets');
      } else {
        services.notify(this.assignedThisRound + " new tickets have been assigned to you.");
        this.showForm();
      }
    },
    processTickets: function(data) {
      console.log("meow!", data.rows);
      this.tickets = data.rows;
      if (this.tickets.length > this.numberOfTickets) {
        this.buildStringAndPost(this.numberOfTickets);
      } else if (this.tickets.length > 0) {
        this.buildStringAndPost(this.tickets.length);
      } else {
        this.noResults();
      }
    },
    requestTicketsFromSelection: function() {
      console.log(this.$('.viewSelect').val());
      this.assignedThisRound = 0;
      this.ajax('fetchTickets', this.$('.viewSelect').val());
      //      this.ajax('fetchTickets');
      this.switchTo('loading', {
        message: "Assigning tickets... This could take a while. You can continue working but don't refresh apps."
      });
    },

    requestTickets: function() {
      this.assignedThisRound = 0;
      // this.ajax('fetchTickets', this.$('.filterOptions').val());
      this.ajax('fetchTickets');
      this.switchTo('loading', {
        message: "Assigning tickets... This could take a while. You can continue working but don't refresh apps."
      });
    },
    noResults: function() {
      services.notify("Could not find any unassigned tickets. Please try a different view.");
      this.showButton();
    }
  };
}());

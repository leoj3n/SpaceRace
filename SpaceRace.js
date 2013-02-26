Stories   = new Meteor.Collection( "stories" );
Mysteries = new Meteor.Collection( "mysteries" );
State     = new Meteor.Collection( "state" );

maxVotes = 5;

//
// CLIENT SIDE
//

if( Meteor.isClient ) {

  Meteor.startup( function() {
    sessions();
  });

  // 
  // TEMPLATES
  // 

  Template.SpaceRace.stories = function () {
    return Stories.find( {}, { sort: { upvotes: -1 } } );
  };

  Template.SpaceRace.mysteries = function () {
    return Mysteries.find( {} );
  };

  Template.SpaceRace.hasScenarios = function () {
    return (Stories.findOne( {} ) != undefined);
  };

  Template.SpaceRace.votesRemaining = function () {
    return Session.get( "votes_remaining" );
  };

  Template.SpaceRace.started = function () {
    return Session.get( "started" );
  };

  Template.SpaceRace.human = function () {
    return Session.get( "human" );
  };

  Template.story.canVote = function () {
    return ((Session.get( "votes_remaining" ) > 0) && Session.get( "voting" ));
  };

  // 
  // EVENTS
  // 

  Template.SpaceRace.events({

    'submit form.story': function () {
      var val = $("#storyInput").val();
      
      if (val == "")
        alert("Cannot be empty.");
      else
        Stories.insert( { text: $("#storyInput").val(), mystery: $("#storySelect").val(), upvotes: 0 } );
      
      $("#storyInput").val('');

      return false;
    }

  });

  Template.story.events({

    'click input.inc': function () {
      Stories.update( this._id, { $inc: { upvotes: 1 } } );
      Session.set( "votes_remaining", (Session.get( "votes_remaining" ) - 1) );
    }

  });
}

//
// SERVER SIDE
//

if( Meteor.isServer ) {
  Meteor.startup( function() {

    Stories.remove( {} );
    Mysteries.remove( {} );

    /*var controls = ["Mining resources run out!",
                    "You found gold!"]; // therefore you...*/

    var mysteries = ["You swap places",
                     "You lose an Asteroid",
                     "You lose $50",
                     "You skip a turn",
                     "You steal an Asteroid",
                     "You roll again",
                     "You gain $50"];

    for (var i = 0; i < mysteries.length; i++)
      Mysteries.insert( { text: mysteries[i] } );

  });
}

function sessions() {
    Session.set( "votes_remaining", maxVotes );
    Session.set( "started", false );
    Session.set( "voting", false );
    Session.set( "human", false );
}

// hack to reset everything
function stop() {
  Stories.remove( {} );
  sessions();
}

function start() {
  stop();
  Session.set( "started", true );
}

function voting() {
  Session.set( "voting", true );
}

function human() {
  start();
  Session.set( "human", true );
}

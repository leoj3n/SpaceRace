Mysteries = new Meteor.Collection( "mysteries" ); // the mystery possibilities
Stories   = new Meteor.Collection( "stories" );   // users submit these, also contains: mysteryID, upvotes

var MASTER_VOTE_TIME = 1361730475687; // (new Date).getTime()

//
// CLIENT SIDE
//

if( Meteor.isClient ) {

  Meteor.startup( function() {
    //Session.set( "last_vote_time", (new Date).getTime() );
    console.log( Session.get( "last_vote_time" ) );
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

  Template.story.canVote = function () {
    return ((Session.get( "last_vote_time" ) > MASTER_VOTE_TIME) ? false : true);
  };

  // 
  // EVENTS
  // 

  Template.SpaceRace.events({

    // ADDs a STORY on CLICK
    'submit form.story': function () {
      Stories.insert( { text: $("#storyInput").val(), mystery: $("#storySelect").val(), upvotes: 0, time: (new Date).getTime() } );
      return false; // prevent form submission
    }

  });

  Template.story.events({

    // cast VOTE on CLICK, and set "LVT"
    'click input.inc': function () {
      Stories.update( this._id, { $inc: { upvotes: 1 } } );
      Session.set( "last_vote_time", (new Date).getTime() );
    }

  });
}

//
// SERVER SIDE
//

if( Meteor.isServer ) {
  Meteor.startup( function() {
    Stories.remove( { time: { $lt: MASTER_VOTE_TIME } } );
    Mysteries.remove({});

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

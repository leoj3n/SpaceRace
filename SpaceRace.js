// Create a client + MongoDB collection

Options = new Meteor.Collection( "options" );
Stories = new Meteor.Collection( "stories" );


//
// CLIENT
//

if( Meteor.isClient ) {
  //
  // STARTUP
  //

  Meteor.startup( function() {
    console.log( "Blast off! (client)" );
  });

  // 
  // TEMPLATE STUFF
  // 

  // "find" the options, sort by score, then by name...
  // @return Array (of options)

  Template.SpaceRace.options = function () {
    return Options.find( {}, { sort: { score: -1, name: 1 } } );
  };

  Template.SpaceRace.stories = function () {
    return Stories.find( {}, { sort: { text: 1 } } );
  };
  // return option name of selected option (using session.get)
  // @return String

  Template.SpaceRace.selected_name = function () {
    var option = Options.findOne( Session.get( "selected_option" ) );
    return option && option.name;
  };

  // return "selected" if option.id is equal to selected_option in session or "" if not
  // @return Boolean

  Template.option.selected = function () {
    return Session.equals( "selected_option", this._id ) ? "selected" : '';
  };

  // 
  // EVENT STUFF
  // 

  // SpaceRace events
  Template.SpaceRace.events({
    'click input.inc': function () {
      Options.update( Session.get( "selected_option" ), { $inc: { score: 5 } } );
    }, 

    'click input.something': function () {
      var tmp = Stories.insert( { text: $('#myInput').val() } );

      console.log( tmp );
    }
  });

  // set selected option on click of option name
  Template.option.events({
    'click': function () {
      Session.set( "selected_option", this._id );
    }
  });
}

//
// SERVER
//

if( Meteor.isServer ) {
  Meteor.startup( function() {
   //Stories.insert( { text:"hi" } );
  
    // initialize options if none exist
    if( Options.find().count() === 0 ) {
      // mystery
      var names = ["Swap Places",
                   "Lose an Asteroid",
                   "Lose Money",
                   "Skip Turn",
                   "Steal Asteroid"]; // because...

      /*var control = ["Mining resources run out!",
                   "You found gold!"]; // therefore you...*/

      for (var i = 0; i < names.length; i++)
        Options.insert( { name: names[i], score: i } );

    }

  });
}


// random snippit of code...: Math.floor(Random.fraction()*10)*5

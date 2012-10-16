/**
 * Class: ChatView
 * Copyright: (C) Craig Barber 2012
 * @author: craigb
 * This class provides a library of functionality for the ChatView within ChitChat.
 * Note: This class depends upon jquery already being loaded.
 */
 
/** Includes **/
if ( typeof ChatBoxWindow === 'undefined' ) { $.getScript( "ChatBoxWindow.class.js" ); }
if ( typeof User === 'undefined' ) { $.getScript( "User.class.js" ); }
if ( typeof UserListWindow === 'undefined' ) { $.getScript( "UserListWindow.class.js" ); }

/**
 * This constructs a new ChatView object.
 */
function ChatView( ) 
{
	/** private instance variables **/
	var chatBoxWindowMap = {};
	var userListWindow = null;
	
	/** methods **/
	
	/**
	 * This function notifies this chat view that the specified chat box window has sent a message.
	 * @param notifyingChatBoxWindow The chat box window which is triggering this event.
	 * @param message The message which is being sent.
	 */
	this.notifyChatBoxMessageSend = function( notifyingChatBoxWindow, message )
	{
		// TODO notify the ajax controller that the specified window has sent a message
	};
	
	/**
	 * This function notifies this chat view that the specified chat box window has closed.
	 * @param notifyingChatBoxWindow The chat box window triggering this event.
	 */
	this.notifyChatBoxWindowClosed = function( notifyingChatBoxWindow )
	{
		var chatBoxWindowUserObject = notifyingChatBoxWindow.getUserObject( );
		delete chatBoxWindowMap[chatBoxWindowUserObject.getId( )];
		notifyingChatBoxWindow.unregisterListener( this );
		
		// TODO remove this test code
		testUserList.splice( testUserList.indexOf( chatBoxWindowUserObject ), 1 ); 
	};
	
	/**
	 * This function handles a notification of a chat window create request being made for the
	 * specified user object.
	 * @param userObject The user object the chat window create reqyest is being made for.
	 * @return void
	 */
	ChatView.prototype.notifyChatWindowCreateRequest = this.notifyChatWindowCreateRequest = function( userObject )
	{
		// if a chat window does not already exist for the specified user, create one
		if ( !chatBoxWindowMap[userObject.getId( )] )
		{
			this.createNewChatWindow( userObject );
		}
	};
	
	/**
	 * This function creates a new chat window associated with the specified user object.
	 * @param userObject The user object the new chat box window will be associated with.
	 * @return void
	 */
	ChatView.prototype.createNewChatWindow = this.createNewChatWindow = function( userObject )
	{
		// create the chat window object
		var newChatBoxWindow = new ChatBoxWindow( userObject, $( "#contentSection") );
		// register as a listener to the new window
		newChatBoxWindow.registerListener( this );
		// add the new chat window box to the map
		chatBoxWindowMap[userObject.getId( )] = newChatBoxWindow;
	};
	
	/** Test Code **/
	
	var testUserList = Array( );

	this.addTestMessageToLastChatBoxWindow = function( )
	{
		var lastUser = null;
		for( var index = 0; index < testUserList.length; index++ )
		{
			lastUser = testUserList[index];
		}
		if ( lastUser )
		{
			lastUser.addSentMessage( "Hello Thar" );
		}
	};
	
	this.showUserListWindow = function( )
	{
		if ( !userListWindow )
		{
			var controlsDiv = $( "#controlsDiv" );
			userListWindow = new UserListWindow( controlsDiv );
			userListWindow.registerListener( this );
		}
				
	};
	
	var testUserCount = 0;
	this.addTestUserToUserList = function( )
	{
		if ( userListWindow )
		{
			var testChatUser = new User( "TestUser" + testUserCount, testUserCount, User.STATUS_AVAILABLE );
			testUserCount++;
			userListWindow.addUser( testChatUser );
			testUserList.push( testChatUser );
		}
	};
	
	this.changeStatusOfLastAddedUser = function( )
	{
		var lastUser = null;
		for( var index = 0; index < testUserList.length; index++ )
		{
			lastUser = testUserList[index];
		}
		lastUser.changeStatus( User.STATUS_AWAY );
	};
}
/**
 * Class: ChatBoxWindow
 * This class encapsulates the data and functionality of individual ChatBoxWindow elements.
 * Note: this class depends upon jquery and expects it to be loaded already.
 * @author: craigb
 */

/** Includes **/
if ( typeof ArrayIterator === 'undefined' ) { $.getScript( "ArrayIterator.class.js" ); }
if ( typeof User === 'undefined' ) { $.getScript( "User.class.js" ); }

/** Class Constants **/
ChatBoxWindow.MESSAGE_TYPE_SELF = 0;
ChatBoxWindow.MESSAGE_TYPE_OTHER_USER = 1;
ChatBoxWindow.MESSAGE_TYPE_SYSTEM = 2;

/**
 * This constructs a new ChatBoxWindow object.
 * @param userObject The user object this chat box window is associated with.
 * @param DOMElement The parent element this chat box window will add itself to.
 */
function ChatBoxWindow( userObject, parentElement )
{
	/** private variables **/
	
	var myUser = userObject;
	var windowElement = null;
	var chatBoxContentElement = null;
	var chatBoxBufferTextInputElement = null;
	var listenerList = new Array( );
	var selfReference = this;
	
	/** methods **/
	
	/**
	 * This function registers the specified listener with this chat box window.
	 * @param listener The listener to register.
	 * @return void 
	 */
	ChatBoxWindow.prototype.registerListener = this.registerListener = function( listener )
	{
		listenerList.push( listener );
	};
	
	/**
	 * This function unregisters the specified listener from this chat box window.
	 * @param listener The listener to be unregistered.
	 * @return void
	 */
	ChatBoxWindow.prototype.unregisterListener = this.unregisterListener = function( listener )
	{
		var index = listenerList.indexOf( listener );
		if ( index >= 0 )
		{
			listenerList.splice( index, 1 );
		}
	};
	
	/**
	 * This function returns the user object associated with this window.
	 * @return The user object associated with this window.
	 */
	ChatBoxWindow.prototype.getUserObject = this.getUserObject = function( )
	{
		return myUser;
	};
	
	/**
	 * This private function notifies all registered listeners that a message is being sent from this chat box window.
	 * @param message The message to be sent.
	 * @return void
	 */
	function notifyListenersMessageSend( message )
	{
		var listenerListIterator = new ArrayIterator( listenerList );
		while( listenerListIterator.hasNext( ) )
		{
			var listener = listenerListIterator.next( );
			listener.notifyChatBoxMessageSend( selfReference, message );
		}
	}
	
	/**
	 * This private function notifies all registered listeners that this chat box window has closed.
	 * @return void
	 */
	function notifyListenersClose( )
	{
		var listenerListIterator = new ArrayIterator( listenerList );
		while( listenerListIterator.hasNext( ) )
		{
			var listener = listenerListIterator.next( );
			listener.notifyChatBoxWindowClosed( selfReference );
		}
	}
	
	/**
	 * This private function closes this chat box window causing it to be removed from it's parent element.
	 * @return void
	 */
	function close( )
	{
		// remove the window element from it's parent
		windowElement.remove( );
		// notify listeners of this window closing
		notifyListenersClose( );
		
		myUser.unregisterListener( selfReference );
	}
	
	/**
	 * This function process's the specified message. It will update the chat box content div.
	 * @param sender If the specified message is a user sent message, this is the user object whom the message originated from.
	 * Otherwise, specify a value of null.
	 * @param string message The message to process.
	 * @param messageType The type of message being processed.
	 * @return void
	 */
	function processMessage( sender, message, messageType )
	{	
		// prepare the new p element container for the message
		var newMessageContainer = $( "<p></p>" );
		
		// if the message is a system message
		if ( messageType == ChatBoxWindow.MESSAGE_TYPE_SYSTEM )
		{
			// prepare the message span, and apply the .chatBoxContentSystemMessageText style to it
			var messageSpan = $( "<span></span>", { class: "chatBoxContentSystemMessageText" } );
			// append the message to the message span
			$( messageSpan ).append( message );
			// append it to the new message container
			$( newMessageContainer ).append( messageSpan );
		}
		// otherwise format as a user message
		else
		{
			var senderNameSpan = $("<span></span>" );
			// if the sender name is the same as this window's id, then the message is from the other user
			if ( messageType == ChatBoxWindow.MESSAGE_TYPE_OTHER_USER )
			{
				$( senderNameSpan ).addClass("chatBoxContentMessageSenderOther" );
				// set the sender name in the span
				$( senderNameSpan ).html( "[" + sender.getUsername( ) +"]: " );
			}
			// otherwise assume the message was from this client's user.
			else
			{
				$( senderNameSpan ).addClass( "chatBoxContentMessageSenderSelf" );
				$( senderNameSpan ).html( "[You]: " );
			}
			
			// append the sender name span to the new message container
			$( newMessageContainer ).append( senderNameSpan );
			
			// create and append the message span to the new message container
			var messageSpan = $( "<span></span>", { class: "chatBoxContentUserMessageText" } );
			$( messageSpan ).append( message );
			$( newMessageContainer ).append( messageSpan );
		}
		
		// append the new message container to the chat content box
		$( chatBoxContentElement ).append( newMessageContainer );
		
		// automatically scroll the div
		$( chatBoxContentElement ).prop( { scrollTop: $( chatBoxContentElement ).prop( "scrollHeight" ) } );
	};
	
	/**
	 * This function facilitates the sending of a message from this chat box window.
	 * @return void
	 */
	function processSendMessage( )
	{
		// retrieve the value from the input buffer
		var message = $(chatBoxBufferTextInputElement).val( );
		
		// if there is a message to send
		if ( message )
		{	
			// clear the input buffer
			$(chatBoxBufferTextInputElement).val( "" );
			
			// append the send message to the chat content element
			processMessage( null, message, ChatBoxWindow.MESSAGE_TYPE_SELF );
			
			// notify listeners of the sent message
			notifyListenersMessageSend( message );
		}
	}
	
	/**
	 * This function handles a notification of a change in status from the specified user object.
	 * @param user The notifying user object.
	 * @param newStatus The new status being notified of.
	 * @return void
	 */
	ChatBoxWindow.prototype.notifyUserStatusChange = this.notifyUserStatusChange = function( user, newStatus )
	{
		// notify the client' user of this user's new status
		var notificationMessage = "Changed status to: " + newStatus.statusStringValue; 
		processMessage( null, notificationMessage, ChatBoxWindow.MESSAGE_TYPE_SYSTEM ); 
	};
	
	/**
	 * This function handles a notification of a message being sent from the specified user object.
	 * @param user The user sending the message.
	 * @param message The message being sent.
	 * @return void
	 */
	ChatBoxWindow.prototype.notifyUserSentMessage = this.notifyUserSentMessage = function( user, message )
	{
		processMessage( user, message, ChatBoxWindow.MESSAGE_TYPE_OTHER_USER );
	};
	
	/** initialization **/
	
	// register this window as a listener for it's user object.
	myUser.registerListener( this );
	
	/* initialize the HTML element's structure for the ChatBoxWindow */
	
	// create the out window div
	windowElement = $( "<div/>", { class: "chitChatWindow", width: "300px" } );
	
	
	// create the chat box title div
	var chatBoxTitleDiv = $( "<div/>", { class: "chitChatWindowTitle" } );
	// create the chat box title text span
	var chatBoxTitleTextSpan = $( "<span></span>" );
	$( chatBoxTitleTextSpan ).html( myUser.getUsername( ) );
	// append the title span to the box title div
	$( chatBoxTitleDiv ).append( chatBoxTitleTextSpan );
	// create the title close button
	var chatBoxTitleCloseButton = $( "<input></input>", { type: "button", class: "chitChatWindowTitleButton", value: "X" } );
	// register the event handler for the close button
	$( chatBoxTitleCloseButton ).click( function( )
	{
		$( windowElement ).fadeOut( "slow", function( ) { close( ); } );
	} );
	// append the close button to the title div
	$( chatBoxTitleDiv ).append( chatBoxTitleCloseButton );
	
	// append the chat box title div to the chat box window
	$( windowElement ).append( chatBoxTitleDiv );
	
	// create the chat box content div
	chatBoxContentElement = $( "<div/>", { class: "chitChatWindowContent", height: "150px" } );
	// append the chat box content div to the chat box window
	$( windowElement ).append( chatBoxContentElement );
	
	// create the chat box buffer div
	var chatBoxBufferDiv = $( "<div/>", { class: "chatBoxBuffer" } );
	// create the buffer text input and append it to the chat box buffer
	chatBoxBufferTextInputElement = $( "<input></input>", { type: "text" } );
	// ensure that when the text field receives focus to select all text inside of it
	$( chatBoxBufferTextInputElement ).focus( function ( ) { $( chatBoxBufferTextInputElement ).select( ); } );
	// assign the event for handling sending a message
	$( chatBoxBufferTextInputElement ).keyup( function( event )
		{
			if ( event.keyCode == 13 )
			{
				processSendMessage( );
 			}
		} );
	
	
	$( chatBoxBufferDiv ).append( chatBoxBufferTextInputElement );
	// create the buffer text send button and append it to the chat box buffer
	var sendButton = $( "<input></input>", { type: "button", value: "Send" } );
	$( sendButton ).click( function( event ) { processSendMessage( ); } );
	$( chatBoxBufferDiv ).append( sendButton );
	
	// append the chat box buffer div to the chat box window div
	$( windowElement ).append( chatBoxBufferDiv );
	
	// append the element to the content pane
	$( parentElement ).append( windowElement );
	// slowly fade in to look slick ;)
	$( windowElement ).css( { display: "none" } );
	$( windowElement ).fadeIn( "slow" );
}
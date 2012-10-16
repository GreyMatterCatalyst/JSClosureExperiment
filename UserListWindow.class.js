/**
 * This class encapsulates the functionality of displaying a user list window
 * @author craigb
 */

/** Includes **/
if ( typeof User === 'undefined' ) { $.getScript( "User.class.js" ); }
if ( typeof ArrayIterator === 'undefined' ) { $.getScript( "ArrayIterator.class.js" ); }

/**
 * This constructs a new UserListWindow. Generating it's html and then adding itself to the specified parent element.
 * @param parentElement The element this user list window will add itself to.
 */
function UserListWindow( parentElement )
{
	/** private variables **/
	var myParentElement = parentElement;
	var userElementMap = {}; // userId -> div
	var windowElement = null;
	var contentElement = null;
	var listenerList = new Array( );
	
	// this is a constant which maps user statuses to colors
	var STATUS_COLOR_MAP = {};
	STATUS_COLOR_MAP[User.STATUS_AVAILABLE.statusId] = "green";
	STATUS_COLOR_MAP[User.STATUS_AWAY.statusId] = "red";
	STATUS_COLOR_MAP[User.STATUS_IDLE.statusId] = "yellow";
	
	/** methods **/
	
	/**
	 * This function registers the specified listener to receive notifications from this object.
	 * @param listener The listener to be registered.
	 * @return void
	 */
	UserListWindow.prototype.registerListener = this.registerListener = function( listener )
	{
		listenerList.push( listener );
	};
	
	/**
	 * This function unregisters the specified listener from this object.
	 * @param listener The listener to be unregistered.
	 * @return void 
	 */
	UserListWindow.prototype.unregisterListener = this.unregisterListener = function( listener )
	{
		listenerList.splice( listenerList.indexOf( listener ), 1 );
	};
	
	/**
	 * This function adds the specified user to this user list window.
	 * @param userObject The user to be added.
	 * @return void
	 */
	UserListWindow.prototype.addUser = this.addUser = function( userObject )
	{
		// register as a listener of to this user
		userObject.registerListener( this );
		
		// create a user list element to represent the user
		var newUserListElement = $( "<div/>", { class: "userListElement" } );
		var statusCircleSpan = $("<span></span>");
		var statusColor = STATUS_COLOR_MAP[userObject.getStatus( ).statusId];
		$( statusCircleSpan ).html( "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"10\" width=\"10\" ><circle cx=\"5\" cy=\"5\" r=\"5\" fill=\"" + statusColor + "\"/></svg>" );
		$( newUserListElement ).append( statusCircleSpan );
		var userNameSpan = $( "<span></span>", { class: "userListElementUsername" } );
		userNameSpan.html( userObject.getUsername( ) );
		$( newUserListElement ).append( userNameSpan );
		
		// map the new user list element to the user element map
		userElementMap[userObject.getId( )] = newUserListElement;
		
		// append the new user list element to the content element
		$( contentElement ).append( newUserListElement );
		$( newUserListElement ).css( { display: "none" } );
		$( newUserListElement ).fadeIn( "slow" );
		
		// bind click event to create new chat window
		$( newUserListElement ).click( function( event ) { processUserListElementClicked( userObject ); } );
	};
	
	/**
	 * This function processes one of the user list elements being clicked. 
	 * @param userObject The user object which corresponds to the element which was clicked.
	 */
	function processUserListElementClicked( userObject )
	{
		// notify listeners of a chat window creation request
		var listenerListIterator = new ArrayIterator( listenerList );
		while( listenerListIterator.hasNext( ) )
		{
			var listener = listenerListIterator.next( );
			listener.notifyChatWindowCreateRequest( userObject );
		}
	}
	
	/**
	 * This function updates the status indicator to reflect the new status of the specified user.
	 * @param userObject The user whose status has changed.
	 * @return void
	 */
	function updateUserStatusIndicator( userObject )
	{
		var userElement = userElementMap[userObject.getId( )];
		var newStatusColor = STATUS_COLOR_MAP[userObject.getStatus( ).statusId];
		$( "span>svg>circle", userElement ).attr( "fill", newStatusColor );
	}
	
	/**
	 * This function notifies this user list window that the specified user object's status has changed.
	 * @param userObject The notifying user object.
	 * @param newStatus The new status being notified of.
	 * @return void
	 */
	UserListWindow.prototype.notifyUserStatusChange = this.notifyUserStatusChange = function( userObject, newStatus )
	{
		// if the user has gone offline
		if ( userObject.getStatus( ) == User.STATUS_OFFLINE )
		{
			// remove the user's element
			// unsubscribe from the user
		}
		// otherwise
		else
		{
			// change the color of the status indicator circle to match the new status
			updateUserStatusIndicator( userObject );
		}
	};
	
	/**
	 * This function notifies this user list window that the specified user object sent a message.
	 * @param userObject The notifying user object.
	 * @param message The message which was sent.
	 * @return void
	 */
	UserListWindow.prototype.notifyUserSentMessage = this.notifyUserSentMessage = function( userObject, message )
	{
		// TODO add some visual indication in the user's list element of a new message
	};
	
	/** initialization **/
	
	// initialize the user list window
	windowElement = $( "<div/>", { class: "chitChatWindow", width: "200px" } );
	
	// initialize the title elements
	var titleElement = $( "<div/>", { class: "chitChatWindowTitle" } );
	var titleTextSpan = $( "<span></span>" );
	$( titleTextSpan ).html( "User List" );
	$( titleElement ).append( titleTextSpan );
	$( windowElement ).append( titleElement );
	
	// initialize the content area
	contentElement = $( "<div/>", { class: "chitChatWindowContent" } );
	$( contentElement ).css( "max-height", "300px" );
	$( contentElement ).css( "min-height", "100px" );
	$( windowElement ).append( contentElement );
	
	// add to the parent element
	$( myParentElement ).prepend( windowElement );
	// slowly fade in to look slick ;)
	$( windowElement ).css( { display: "none" } );
	$( windowElement ).fadeIn( "slow" );
}
/**
 * Copyright: (C) Craig Barber 2012
 * This class encapsulates user data.
 * @author craigb
 */

/** includes **/
if ( typeof ArrayIterator === 'undefined' ) { $.getScript( "ArrayIterator.class.js" ); }

/**
 * Constants
 */
User.STATUS_AVAILABLE = { statusId: 0, statusStringValue: "Available" };
User.STATUS_AWAY = { statusId: 1, statusStringValue: "Away" };
User.STATUS_IDLE = { statusId: 2, statusStringValue: "Idle" };
User.STATUS_OFFLINE = {statusId: 3, statusStringValue: "Offline" };

/**
 * This constructs a new user object.
 * @param username The username to be assigned to this user object.
 * @param id The id to be assigned to this user object.
 * @param initialStatus The initial status to be assigned to this user object.
 */
function User( username, id, initialStatus )
{
	var _username = username;
	var _id = id;
	var _status = initialStatus;
	var listenerList = new Array( );
	
	/**
	 * This function registers the specified listener for updates from this user object.
	 * @param listener The listener object ot be registered.
	 * @return void
	 */
	User.prototype.registerListener = this.registerListener = function( listener )
	{
		listenerList.push( listener );
	};
	
	/**
	 * This function unregisters the specified listener from this object.
	 * @param listener The listener to be unregistered.
	 * @return void
	 */
	User.prototype.unregisteredListener = this.unregisterListener = function( listener )
	{
		var index = listenerList.indexOf( listener );
		if ( index >= 0 )
		{
			listenerList.splice( index, 1 );
		}
	};
	
	/**
	 * This function returns the id of this user object.
	 * @return The id of this user object.
	 */
	User.prototype.getId = this.getId = function( )
	{
		return _id;
	};
	
	/**
	 * This function returns this user object's username.
	 * @return This user object's username.
	 */
	User.prototype.getUsername = this.getUsername = function( )
	{
		return _username;
	};
	
	/**
	 * This function returns this user object's status.
	 * @return This user object's status.
	 */
	User.prototype.getStatus = this.getStatus = function( )
	{
		return _status;
	};
	
	/**
	 * This function changes the status of this user object, causing it to notify listeners
	 * of the new status.
	 * @param newStatus The new status for this user object.
	 * @return void
	 */
	User.prototype.changeStatus = this.changeStatus = function( newStatus )
	{
		_status = newStatus;
		// notify listeners
		var listenerIterator = new ArrayIterator( listenerList );
		while( listenerIterator.hasNext( ) )
		{
			var listener = listenerIterator.next( );
			listener.notifyUserStatusChange( this, newStatus );
		}
		
	};
	
	/**
	 * This function adds a message to this user's message log. Additionally
	 * it notifies listeners of this object that a message has been received
	 * from this user.
	 * @param message The message received from this user.
	 * @return void
	 */
	User.prototype.addSentMessage = this.addSentMessage = function( message )
	{
		// notify listeners of the new message
		var listenerIterator = new ArrayIterator( listenerList );
		while( listenerIterator.hasNext( ) )
		{
			var listener = listenerIterator.next( );
			listener.notifyUserSentMessage( this, message );
		}
	};
}
/**
 * This class provides a simple iterator over the specified array object.
 * @author craigb
 * @param inputArray The array the iterator is being created for.
 * @returns A simple iterator over the specified array.
 */
function ArrayIterator( inputArray )
{
	// validate the input array
	if ( !inputArray || !( inputArray instanceof Array ) )
	{
		throw "ArrayIterator.constructor( ): A valid array must be specified";
	}
	
	var iteratorCollection = inputArray.slice( 0 );
	var currentIndex = 0;
	
	/**
	 * Whether or not this iterator has a next element.
	 * @return Whether or not this iterator has a next element.
	 */
	this.hasNext = function( )
	{
		return currentIndex < iteratorCollection.length;
	};
	
	/**
	 * This function returns the next element in the iteration and moves this iterator
	 * forward one element.
	 * @return The next element in the iteration.
	 */
	this.next = function( )
	{
		return iteratorCollection[currentIndex++];
	};
}
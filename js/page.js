//Code at https://gist.github.com/1514715
//This is for goolgle analtyics, tracking of external link clikcs.
(function () {
    var aTags = document.getElementsByTagName('a'),
        
        // This will match weather or not the href is a full url 
        // such as "http://www.example.com/" and not "/index.html".
        //
        // This is needed because matchServer assumes a full url,
        // however if the href is a path like / nothing will be matched
        // which means nothing will be replaced and the linkServer will 
        // resolve to /my/path/html.This can probably be cleaned up to
        // a use a match instead, and only need 1 regex.
        matchFullLink = new RegExp("^.+://", "gi"),
        
        //RegEx to grab the server name.
        matchServer = new RegExp("^.*://([^/]+).+", "gi"),
        
        //Replace whole match, server name stored in first captured.
        currentServer = window.location.toString().replace(matchServer, "$1"),
        
        // Quick detect which event listener to use.  Quick and dirty but fine
        // since not it's not getting crazy wiht the event handlers.
        addEventFunctionName = (document.createElement('a')).addEventListener ? "addEventListener" : "attachEvent",

        //current node in loop
        link = null,
        
        //Used in for loop.  Represents current index of the node list
        i = 0,
        
        //This will hold the server of the curren link's href
        linkServer = "",
        
        //This will hold the current link's href
        linkHref = "";

    //This will be called when a link is cliked
    function handleExternLinkTrac(e, linkHref, linkServer){
    	//Track click event
        _gaq.push(['_trackEvent', 'Outbound Links', linkServer, linkHref]);
		//navigating to the links location
        /*_gaq.push(function(){
            document.location = linkHref;
        });*/
	}
    
    //Loop though all a tags on the page
    for (i;i < aTags.length; i += 1) {
        //Set link to the current tag 
        link = aTags[i];

        linkHref = link.href.toString();
        linkServer = linkHref.replace(matchServer, "$1");

        // Make sure that the href is a full url(See notes above for
        // matchFullLink) and check to make sure the server name
        // isn't the same as the current server.
        if (matchFullLink.test(linkHref) && linkServer !== currentServer) {
            console.log(linkHref);
            //Link Click Event Handler
            link[addEventFunctionName]('click', function (e) {
                // e will be passed to the function in everything but IE.
            	// if it's IE get window.event
        		var evt = e || window.event;
                
                // Prevent the default behavior, of navigating
            	// to linked page in this case
        		evt.cancelBubble = true;
        		if (evt.stopPropagation) evt.stopPropagation();
                if (evt.stopImmediatePropagation) evt.stopImmediatePropagation();
                
                handleExternLinkTrac(e, linkHref, linkServer);
                
                //Further prevent default behavior
    	        return false;
            });
        }
    }
    
})();
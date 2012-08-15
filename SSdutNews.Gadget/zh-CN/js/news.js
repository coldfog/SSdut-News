// the total number in the body to display
var g_countToView = 3
// the length of seperate line of News item
var g_curLinkWidth = "250px"
//the new which was selected
var g_newsSelected = ""
//the source of news
var g_newsURL = "http://127.0.0.1:8000";
//the website of ssdut
var g_ssdutURL = "http://ssdut.dlut.edu.cn";
//the array use to contain the constent of News
var g_newsItems = new Array();
//the currentView of user, thus the page number of current page, its
//begin with 1
var g_currentView = 0;
//how often app update news
var g_timerCount = 300000;
//how often app update the server
var g_timerServerCount = 400000;
//use to add content to flyout
var g_contentGetter = new ActiveXObject("Msxml2.XMLHTTP");
//use to update the content
var g_updater = new ActiveXObject("Msxml2.XMLHTTP");
//use to add content to flyout
var g_serverUpdater = new ActiveXObject("Msxml2.XMLHTTP");
//the timer for news update
var g_timerNewsUpdater = null;
//the timer for news update
var g_timerServerUpdater = null;
//has load?
var g_isLoad = false;

// ========================================================================= 
// use to make style faster
// ========================================================================= 
function styleSwitch(divObject, backgroundColorVal, topVal, leftVal, heightVal, widthVal, fontWeightVal, fontSizeVal, fontColor, marginTopVal, marginBottomVal, marginRightVal, marginLeftVal, borderBottomVal, borderColorVal)
{
    with(eval(divObject).style)
    {
        if(topVal)
        {
            top = topVal + "px";
        }
        if(leftVal)
        {
            left = leftVal + "px";
        }
        if(heightVal)
        {
            height = heightVal + "px";
        }		
        if(widthVal)
        {
            width = widthVal + "px";
        }	
        if(fontWeightVal)
        {
            fontWeight = fontWeightVal;
        }
        if(fontSizeVal)
        {
            fontSize = fontSizeVal + "px";
        }		
        if(fontColor)
        {
            color = fontColor;
        }
        if(marginTopVal)
        {
            paddingTop = marginTopVal + "px";
        }
        if(marginBottomVal)
        {
            paddingBottom = marginBottomVal + "px";
        }
        if(marginLeftVal)
        {
            paddingLeft = marginLeftVal+ "px";
        }
        if(marginRightVal)
        {
            paddingRight = marginRightVal+ "px";
        }
        if(borderBottomVal)
        {
            borderBottom = "dotted "+ borderBottomVal + "px";
        }
        if(borderColorVal)
        {
            borderColor = borderColorVal;
        }
        if(backgroundColorVal)
        {
            backgroundColor = backgroundColorVal;
        }
    }
}

// ========================================================================= 
// make items style in right way
// ========================================================================= 
function initStyle() {
    //styleSwitch (name backgroundColor top left height width, fontWeight, fontSize, color, paddingTop, paddingBottom, paddingRight, paddingLeft, borderbottom, bordercolor)

    styleSwitch("NewsItemHldr", false, 14, 13, false, false, false, false, false, false, false, 14, false, false, false); 
    styleSwitch("navHolder", false, 190, 106, 20, 75, false, false, false, false, false, false, false, false, false);

    for (var i=0; i < g_countToView; i++)
    {		
        styleSwitch(eval("NewsItem"+i), false, false, false, 44, 264, false, 14, '#ffffff', 3, 2, 7, 7, false, false);
        styleSwitch(eval("NewsItemName"+i), false, false, false, 14, 130, false, 12, '#67788a', 0, 0, 0, 0, false, false);
        styleSwitch(eval("NewsItemDate"+i), false, false, false, 14, 120, false, 12, '#67788a', 0, 0, 0, 0, false, false);
        eval("NewsItem"+i).style.lineHeight = "14px";
        eval("NewsItem"+i).style.overflow = "hidden";		
        eval("NewsItemName"+i).style.lineHeight = "14px";
        eval("NewsItemDate"+i).style.lineHeight = "14px";

        eval("NewsItemName"+i).style.textAlign = "left";
        eval("NewsItemName"+i).style.styleFloat = "left";
        eval("NewsItemDate"+i).style.textAlign = "right";
        eval("NewsItemDate"+i).style.styleFloat = "right";

        eval("NewsItem"+i).style.borderBottom = "dotted 1px #3b4458";
        eval("NewsItemLink"+i).style.textOverflow = "ellipsis";
        eval("NewsItemLink"+i).style.overflow = "hidden"; 
        eval("NewsItemLink"+i).style.whiteSpace = "nowrap"; 
        eval("NewsItemLink"+i).style.width = g_curLinkWidth;
        eval("NewsItemLink"+i).style.paddingTop = "0px";

    }	
    buttonLeftNarrator.style.left = "2px";
    buttonRightNarrator.style.right = "2px";

}

// ========================================================================= 
// when gadget closed this will be called
// ========================================================================= 
/*
 *function onClose() {
 *    System.Debug.outputString("Closed");
 *    var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
 *    xmlhttp.open("POST", g_newsURL+"/close");
 *    xmlhttp.send(null);
 *    xmlhttp.open("POST", g_newsURL+"/close");
 *    xmlhttp.send(null);
 *    
 *}
 */
// ========================================================================= 
// init the Gadget
// ========================================================================= 
function loadMain() {

    //System.Shell.execute(System.Gadget.path + "\\newsUpdater.exe");
    System.Gadget.Flyout.file = "flyout.html";

    initStyle();
    //for(var i=0; i<g_countToView; i++) {
    //}

    navHolder.style.visibility = "hidden";
    clearViewElements();
    updateServer();
    setTimeout("get_news()", 5000);
    start_timer();
    window.setInterval("updateServer()", g_timerServerCount);

}
// ========================================================================= 
// begin to count to update news
// ========================================================================= 
function start_timer() {
    if(g_timerNewsUpdater != null) {
        stop_timer();
    }
    g_timerNewsUpdater = window.setInterval("get_news()", g_timerCount);
}
// ========================================================================= 
// stop to count to update news
// ========================================================================= 
function stop_timer() {
    window.clearInterval(g_timerNewsUpdater);
    
}
// ========================================================================= 
// updata data from server
// ========================================================================= 
function update(oldest, latest) {
    var number = parseInt(Math.random()*1000, 10);
    g_updater.open("GET", g_newsURL+"/get-oldest="+oldest+"-latest="+latest+"-t="+number);
    g_updater.onreadystatechange = function()
    {
        System.Debug.outputString("Hello"+g_updater.readyState);
        if(g_updater.readyState == 4 && g_updater.status == 200)
        {
            System.Debug.outputString("has got data");
            var news = eval(g_updater.responseText);
            var i;
            if(news.length == 0) {
                //avoid the dead loop
                if(oldest != 0) {
                    System.Debug.outputString("Hello get news behind");
                    update(0, g_newsItems[g_newsItems.length-1].no);
                }
                return;
            }
            news.reverse();
            for(i=0; i<news.length; i++) {
                g_newsItems.unshift(news[i]);
            }

            g_newsItems.sort(function(a, b) { return b.no - a.no })
            setItemsContent();
        }else if(g_serverUpdater.readyState == 4 && g_serverUpdater.status != 200) 
        {
            LoadingView.style.left = "20px";
            LoadingView.style.right = "25px";
            LoadingView.style.top = "85px";
            LoadingView.innerText = "The server 'SSDUT News Updater' is not start up. Please make sure you have run setup.exe";

        }
    }
    g_updater.send(null);
}
// ========================================================================= 
// updata data in server 
// ========================================================================= 
function updateServer() {
    g_serverUpdater.open("POST", g_newsURL+"/update");
    g_serverUpdater.onreadystatechange = function()
    {
        System.Debug.outputString("update server");
        if(g_serverUpdater.readyState == 4 && g_serverUpdater.status == 200)
        {
            System.Debug.outputString("have update server");
        }
    }
    g_serverUpdater.send(null);
}
// ========================================================================= 
// get news from web site
// ========================================================================= 
function get_news() {

    if(g_newsItems.length == 0) {
        update(0, 0);
    }else {
        update(g_newsItems[0].no, 0);
    }
}


// ========================================================================= 
// set new items styles and content at current page
// ========================================================================= 
function setItemsContent() {
    if(!g_isLoad) {
        g_isLoad = true;
        System.Debug.outputString("visibility of LoadingView"+LoadingView.style);
        LoadingView.style.visibility = "hidden";
        navHolder.style.visibility = "visible";
    }
    for(var i=0; i<g_countToView; i++) {
        eval("NewsItemName"+i).style.textOverflow = "ellipsis";
        eval("NewsItemName"+i).style.overflow = "hidden"; 
        eval("NewsItemName"+i).style.whiteSpace = "nowrap"; 
        eval("NewsItemDate"+i).style.overflow = "hidden";		

        if(g_newsItems[i] != null) {
            try {
                eval("NewsItemName"+i).innerText = g_newsItems[g_currentView*g_countToView+i].author;
                eval("NewsItemDate"+i).innerText = g_newsItems[g_currentView*g_countToView+i].date;
                eval("NewsItemLink"+i).innerText = g_newsItems[g_currentView*g_countToView+i].title;		
                eval("NewsItemLink"+i).href = g_newsItems[g_currentView*g_countToView+i].link;		
                eval("NewsItemLink"+i).name = (g_currentView*g_countToView+i);
                if(g_newsItems[g_currentView*g_countToView+i].isread == 0) {
                    eval("NewsItemLink"+i).className = "unreadItem";
                }else {
                    eval("NewsItemLink"+i).className = "readItem";
                }
                eval("NewsItem"+i).style.visibility="visible";
            }catch(err) {
                clearViewElement(i);
            }
        }
    }
        eval("positionNumbers").innerText = (g_currentView*g_countToView+1)+"-"+(g_currentView*g_countToView+g_countToView);
}

// ========================================================================= 
// set new items in next page 
// ========================================================================= 
function setNextViewItems() {
    if((g_currentView+1)*g_countToView+1 <= g_newsItems.length) {
        g_currentView++;
    }
    System.Debug.outputString("len"+g_newsItems.length+" page"+g_currentView);
    System.Debug.outputString("the judge value"+g_currentView*g_countToView+1);
    setItemsContent();
}
// ========================================================================= 
// set new items previous page
// ========================================================================= 
function setPreviousViewItems() {
    if(g_currentView-1 >= 0) {
        g_currentView--;
    }
    setItemsContent();
}
// ========================================================================= 
// show flyout window
// ========================================================================= 
function showFlyout(item) {
    //System.Shell.execute(System.Gadget.path + "\\test_AOP.pyw");
        System.Debug.outputString("In Flyout before judgement");
        if(System.Gadget.Flyout.show) {
            if(item.parentElement.innerText == g_newsSelected)
            {
                System.Debug.outputString("In Flyout click self");
                System.Debug.outputString("In Flyout true");
                System.Gadget.Flyout.show = false;
                start_timer();
            }else { // If click other item Flyout will not close. Just change it content
                System.Debug.outputString("In Flyout click other item ");
                clearContent(item);
                addContent(item);
            }
        }else {
            System.Debug.outputString("In Flyout false");
            System.Gadget.Flyout.show = true;
            clearContent(item);
            addContent(item);
            stop_timer();

    }
}

// ========================================================================= 
// clear the content to flyout
// ========================================================================= 
function clearContent(item) {
    try {
        var flyoutDoc = System.Gadget.Flyout.document;
        flyoutDoc.getElementById("flyoutTitleLink").innerText = "Loading";
        flyoutDoc.getElementById("flyoutMainFeedDescription").innerHTML = "Loading...";
        flyoutDoc.getElementById("flyoutTitleLink").href = "";
        flyoutDoc.getElementById("readOnlineLink").href = "";
    }catch(e){
    }
}
// ========================================================================= 
// add the content to flyout
// ========================================================================= 
function addContent(objToOpen) {
    g_contentGetter.abort();
    System.Debug.outputString("in addContent query"+g_newsItems[objToOpen.name].no);
    g_contentGetter.open("GET", g_newsURL+"/getcontent/"+g_newsItems[objToOpen.name].no);
    g_contentGetter.onreadystatechange = function()
    {
        System.Debug.outputString("Hello in addContent"+g_contentGetter.readyState);
        if(g_contentGetter.readyState == 4 && g_contentGetter.status == 200)
        {
            System.Debug.outputString("has got data in add Content" + g_contentGetter.responseText);
            //var content = eval(g_contentGetter.responseText);

            var content = eval("["+g_contentGetter.responseText+"]");
            
            setFlyout(content, objToOpen, true);
            System.Gadget.Flyout.onShow = function() {
                setFlyout(content, objToOpen, true);
            }

            if(g_newsItems[objToOpen.name].isread == 0) {
                g_newsItems[objToOpen.name].isread = 1;
                markReaded(g_newsItems[objToOpen.name].no);
                setItemsContent();
            }
            
        }
        else if(g_contentGetter.readyState == 4 && g_contentGetter.status != 200) {
            System.Debug.outputString("addContent Status"+g_contentGetter.status);
            setFlyout(content, objToOpen, false);
            System.Gadget.Flyout.onShow = function() {
                setFlyout(content, objToOpen, false);
            }
        }
    }
    g_contentGetter.send(null);
}

// ========================================================================= 
// mark no to readed
// ========================================================================= 
function markReaded(no) {
    var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    var number = parseInt(Math.random()*1000, 10);

    xmlhttp.open("POST", g_newsURL+"/mark"+no);
    xmlhttp.onreadystatechange = function()
    {
        System.Debug.outputString("marked"+no);
        //TODO maybe add some deal here
        //if(xmlhttp.readyState == 4 && xmlhttp.status == 200) { }
    }
    xmlhttp.send(null);
}
// ========================================================================= 
// set the content of flyout
// ========================================================================= 
function setFlyout(content, objToOpen, success) {
    System.Debug.outputString("set Flyoutl"+objToOpen.parentElement.id);
    if(success) {
        try {
            var flyoutDoc = System.Gadget.Flyout.document;
            flyoutDoc.getElementById("flyoutTitleLink").innerText = content[0].title;
            flyoutDoc.getElementById("flyoutMainFeedDescription").innerHTML = content[0].content;
            flyoutDoc.getElementById("flyoutTitleLink").href = g_ssdutURL+objToOpen.href;
            flyoutDoc.getElementById("readOnlineLink").href = g_ssdutURL+objToOpen.href;
        }catch(e){
        }

    }else {
        try {
            var flyoutDoc = System.Gadget.Flyout.document;
            flyoutDoc.getElementById("flyoutTitleLink").innerText = "Wrong";
            flyoutDoc.getElementById("flyoutMainFeedDescription").innerHTML = "Network Error. Status:"+g_contentGetter.status;
            flyoutDoc.getElementById("flyoutTitleLink").href = "";
            flyoutDoc.getElementById("readOnlineLink").href = "";
        }catch(e){
            System.Debug.outputString("Wrong report error"+e);
        }
    }
}
// ========================================================================= 
// deal the selected event on a news item include clear background
// image
// ========================================================================= 
function selectBack(objToChange) {
    if(g_newsSelected == objToChange.innerText) {
        g_newsSelected = "";
    } else {
        g_newsSelected = objToChange.innerText;
    }
    clearBack();
}
// ========================================================================= 
// clear all items background image and set them to deafault
// ========================================================================= 
function toggleButton(objToChange, newSRC)
{		
    eval("objToChange").src = "images/"+newSRC;
}
// ========================================================================= 
// clear all items background image and set them to deafault
// ========================================================================= 
function clearBack() {
    System.Debug.outputString("select"+g_newsSelected);
    for(var i=0; i<g_countToView; i++) {
        if(eval("NewsItem"+i).innerText == g_newsSelected) {
            eval("NewsItem"+i).style.backgroundImage = "url(images/selected_bg.png)";
            continue;
        }
        eval("NewsItem"+i).style.backgroundImage = "";
    }
}
// ========================================================================= 
// clear one item background image and set them to deafault
// ========================================================================= 
function clearViewElement(num) {
    //eval("NewsItem"+i).innerText = "";
    eval("NewsItem"+num).style.visibility="hidden";
    eval("NewsItemName"+num).innerText = "";
    eval("NewsItemDate"+num).innerText = "";
    eval("NewsItemLink"+num).innerText = "";
}
// ========================================================================= 
// clear all items background image and set them to deafault
// ========================================================================= 
function clearViewElements() {
    for(var i=0; i<g_countToView; i++) {
        clearViewElement(i);
    }
}
// ========================================================================= 
// change background image when mouse over
// ========================================================================= 
function toggleBack(objToChange, showBack) {
    if(showBack && g_newsSelected != objToChange.innerText) {
        eval("objToChange").style.backgroundImage = "url(images/hover_bg.png)";
    }else {
        clearBack();
    }
    //document.write(eval("objToChange").style.backgroundImag);
}

// ========================================================================= 
// deal the mouse wheel event
// ========================================================================= 
function mouseWheelNavigate() {
    if(event.wheelDelta < -20) {
        setNextViewItems();
    }else if(event.wheelDelta > 20) {
        setPreviousViewItems();
    }

}

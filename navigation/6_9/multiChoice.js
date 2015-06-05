﻿var xmlDoc;
var xmlloaded = false;
var ua = navigator.userAgent;
var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);
var score;
var myHighlight;
var mySignature = "multiple";
var cookieJSON;
var myCookieName ='ccTAMex5_22';
var cookieLifetime = 365;
var cookieSavedNo=0;
var dimensions = [[[436, 218],[452, 148],[405, 232],[221, 72],[222, 52]]];
var foundThem=[];
var foundAll;

function hideAnswers(){
	var x=$("input")
	for (i=0;i<x.length;i++){
		$(x[i].nextElementSibling).removeClass("checkCorr");
		$(x[i].nextElementSibling).removeClass("checkWron");
		$(x[i].nextElementSibling).removeClass("showCorr");
	}
	
	var z=$("span")
	for (var j=0;j<z.length;j++){
		var o=$(z[j].getElementsByTagName("img"))
		$(o[0]).removeClass("showMe");
		$(o[0]).addClass("hideMe");
		$(o[1]).removeClass("showMe");
		$(o[1]).addClass("hideMe");
	}
}

function checkAnswersTxt(myTxt){
	var myInput = $(myTxt.parentNode.getElementsByTagName("input"))[0]
	myInput.click()
	//checkAnswers()
}

function checkAnswers(myItem){
	//myItem.setAttribute("checked", "checked");
	//myItem.checked = true;
	var qScore
	score  = 0;
	hideAnswers()
	var mistakes
	var questions=$(".TrueFalse")
	//alert("cookiJSON = "+JSON.stringify(cookieJSON))
	for (var i=0;i<questions.length;i++){
		qScore = 0;
		mistakes = 0;
		var answerSel=$(questions[i].getElementsByTagName("input"));
		var answerText=$(questions[i].getElementsByTagName("span"));
		for (var j=0;j<answerSel.length;j++){
			
			//if ($(questions[i]).attr("corrects")>1){
				cookieJSON.selections[i][j]=false
			//}
			if ($(answerSel[j]).attr("checked")){
				//if ($(questions[i]).attr("corrects")>1){
					cookieJSON.selections[i][j]=true
				/*}
				else{
					cookieJSON.selections[i] = j
				}*/
				if ($(answerSel[j]).attr("isCorrect")){
					//$(answerSel[j].nextElementSibling).addClass("checkCorr");
					$(answerText[j].parentNode).addClass("thisIsCorrect");
					/*var o=$(answerText[j].getElementsByTagName("img"))
					$(o[0]).removeClass("hideMe");
					$(o[0]).addClass("showMe");*/
					foundThem[i] = true;
					//qScore=1;
					if (answerSel[j]==myItem){
						audioCorrect();
					}
				}
				else{
					//$(answerSel[j].nextElementSibling).addClass("checkWron");
					var o=$(answerText[j].getElementsByTagName("img"))
					//$(o[1]).removeClass("hideMe");
					//$(o[1]).addClass("showMe");
					if (qScore==-answerSel.length+2){
						qScore--;
						foundThem[i] = true;
						break;
					}else{
						if ($(questions[i]).attr("any_answer")){
							mistakes++
						}
						else
						{
							qScore--
						}
					}
					if (answerSel[j]==myItem){
						$(myItem.parentNode).removeClass("bounceInDown");
						$(myItem.parentNode).addClass("hinge");
						audioWrong();
					}
				}
			}
			else{
				/*
				if ($(answerSel[j]).attr("isCorrect")){
					$(answerText[j].parentNode).addClass("thisIsCorrect");
				}
				*/
			}
		}	
		/*
		if (qScore/$(questions[i]).attr("corrects")<1){
			if ($(questions[i]).attr("any_answer")){
				if (mistakes>0){
					qScore = 0
				}
			}
			else{
				qScore = 0
			}
		}
		else{
			qScore = 1
			if ($(questions[i]).attr("any_answer")){
				if (mistakes>0){
					qScore = 0;
				}
			}
		}
		*/
		qScore=(qScore+answerSel.length)/answerSel.length;
		score=score+qScore;
	}	
	$("#myScore").val(score);
	foundAll = 0;
	for (var i=0;i<questions.length;i++){
		var answerSel=$(questions[i].getElementsByTagName("input"))
		var answerText=$(questions[i].getElementsByTagName("span"))
		if (foundThem[i]==true){
			foundAll++;
			for (var j=0;j<answerSel.length;j++){
				$(answerSel[j]).attr("checked", true);
				if ($(answerSel[j]).attr("isCorrect")){
					
				}
				else{
					var o=$(answerText[j].getElementsByTagName("img"))
					//$(o[1]).removeClass("hideMe");
					//$(o[1]).addClass("showMe");
					if (answerSel[j].parentNode.className.indexOf("hinge")==-1){
						$(answerSel[j].parentNode).removeClass("bounceInDown");
						$(answerSel[j].parentNode).addClass("hinge");
					}
				}
				$(answerSel[j]).attr('disabled', true);
				$(answerSel[j]).parent().attr('style','cursor:default')
			}
		}
	}
	
	if ($(myItem).attr("isCorrect")) {
		audioCorrect();
	} else {
		audioWrong();
	}
	
	var myBrowser = get_browser();
	if ((myBrowser=='Chrome')||(isiPad==true)) {
		localStorage.setObject(myCookieName,null);
		localStorage.setObject(myCookieName,cookieJSON);
	}
	else{
		$.removeCookie(myCookieName)
		$.cookie(myCookieName, cookieJSON, {expires: cookieLifetime});
	}	
	var y=exJSON.exercise.items;
	//$("#myScorePerc").val(Math.round((score/y.length)*100) + '%')
	//alert (Math.round((score/y.length)*100) + '%')
	//updateMain(this);
	var actScore = Math.round((score/y.length)*100);
	if ((Math.round((score/y.length)*100)>0)&&(foundAll==y.length)){
		//alert("disable all")
		$("input").attr('disabled', true);
		$("ul li").attr('style','cursor:default')
		//setTimeout("openTools()", 3000);
		audioPlay("completed");
		this.parent.parent.parent.update_chapter5Array(actScore);
		//window.location.href = "../9/exercise.html";
		// COMPLETED MAIN ACTIVITY 
		if(window.top){window.top.activateFor();} else {window.parent.activateFor();}
	} else {
		//audioWrong();
	}
}

function openTools(){
	this.parent.parent.openTheTool(2)
}

function showAnswers(){
	var x=$("input")
	for (i=0;i<x.length;i++){
		if ($(x[i]).attr("iscorrect")){
			$(x[i].nextElementSibling).addClass("showCorr");
		}
	}
}

function readJSON() {
	var theJSONElements = "";
	var countCorrect;
	var itemType;
	var exItems=exJSON.exercise.items;
	var selectedAttr;
	var myClass;
	var markCorrClass;
	var markWronClass;
	//alert(x.length);
	for (i=0;i<exItems.length;i++)
	{
		foundThem.push(false);
		countCorrect = 0;
		theJSONElements += '<div id="tf' + (i+1) + '" class="TrueFalse"';
		var w=exItems[i].stem;
		var y=exItems[i].answers;
		var o=exItems[i].correct;
		countCorrect = o.length;
		theJSONElements += ' corrects='+countCorrect;
		if (exItems[i].any_answer){
			theJSONElements += ' any_answer="true"';
		}
		theJSONElements += '> <div class="stem">' + w + '</div><br>'+'<ul>';
		if ((countCorrect>1)||(exItems[i].checkbox)){
			itemType = "checkbox";
		}
		else{
			itemType = "radio";
		}		
		//alert ("cookie = "+JSON.stringify(cookieJSON))
		if (cookieJSON.selections[i]==undefined){
			//if (countCorrect>1){
				cookieJSON.selections[i]=[];
				for (j=0;j<y.length;j++){
					cookieJSON.selections[i].push("false");
				}
			/*}
			else{
				cookieJSON.selections[i]=-1;
			}*/
			selectedAttr = cookieJSON.selections[i];
		}
		else{
			selectedAttr = cookieJSON.selections[i];
		}
		cookieSavedNo = 0;
		for (j=0;j<y.length;j++)
		{
			myClass = ' class="checkWron"';
			markCorrClass = "hideMe";
			//markWronClass = "showMe";
			markWronClass = "hideMe";
			myClass = "";
			
			//if (countCorrect>1){
				if (selectedAttr[j]==true){
					cookieSavedNo++;
					myClass = ' hideMe';
					for (var k=0;k<countCorrect;k++){
						if (o[k]==j){
							myClass = ' thisIsCorrect';
							foundThem[i] = true;
						}
					}
				}
				if ((foundThem[i] == false)&&(cookieSavedNo==y.length-countCorrect)){
					foundThem[i] = true;
				}
			/*}
			else{
				if (j==selectedAttr){
					cookieSavedNo++;
					myClass = '';
					for (var k=0;k<countCorrect;k++){
						if (o[k]==j){
							myClass = ' thisIsCorrect';
							foundThem[i] = true;
						}
					}
				}
			}*/
			if ((exJSON.exercise.checkButton)&&(exJSON.exercise.checkButton=="true")){
				theJSONElements += '<li '+'class="column'+j+myClass+'">'+'<input name="mul'+i+'" type="'+itemType+'"' + ' onclick=hideAnswers()';
			}
			else {
				theJSONElements += '<li '+'class="column'+j+myClass+'">'+'<input name="mul'+i+'" type="'+itemType+'"' + ' onclick=checkAnswers(this)';
			}
			for (var k=0;k<countCorrect;k++){
				if (o[k]==j){
					theJSONElements += ' isCorrect=true';
					//myClass = ' class="checkCorr"';
					//markCorrClass = "showMe"
					markWronClass = "hideMe";
				}
			}
			myClass = ' class="checkWron"';
			//if (countCorrect>1){
				if (selectedAttr[j]==true){
					theJSONElements += ' checked';
				}
				else{
					myClass = '';
					markCorrClass = "hideMe";
					markWronClass = "hideMe";
				}
			/*}
			else{
				if (j==selectedAttr){
					theJSONElements += ' checked';
				}
				else{
					myClass = ''
					markCorrClass = "hideMe";
					markWronClass = "hideMe";
				}
			}*/
			theJSONElements += ' class="hideMe" />'+'<span'+' onclick=checkAnswersTxt(this)><div class="invisible">'+ y[j]+'</div><img class="mymark '+markCorrClass+'" src="../../images/corr.png" width="30" height="30"><img class="mymark '+markWronClass+'" src="'+'redLine'+i+'_'+j+'.png" width="'+dimensions[i][j][0]+'" height="'+dimensions[i][j][1]+'"><img class="mymark" src="'+'phrase'+i+'_'+j+'.png" width="'+dimensions[i][j][0]+'" height="'+dimensions[i][j][1]+'"></span>'+'</li>';
		}
		theJSONElements += '</ul>'+'</div>';
	}

	/*
	var z=exJSON.exercise.rubric
	theJSONElements += '<div class="sidebarCont2">' + z + '</div>'
	*/
	return theJSONElements;
}

function call1(){
	var x = exJSON.exercise.myText;
	document.getElementById("readTextarea").innerHTML = x;
	return true;
}

function callorig(kati){
	var x=$(".highlight");
	for (var i=0;i<x.length;i++)
	{
		if ($(x[i]).attr("id")=="hl"+myHighlight){
			$(x[i]).addClass("under");
		}
	}
	if ($("#readTextarea .scrollOnce").length != 0){
		$('#readTextarea').animate({scrollTop: $("#readTextarea .scrollOnce").offset().top - 100}, 0);
	}
//	$('#readTextarea').animate({scrollTop: $("#scrollAnchor").offset().top}, 0);
}

function makePageChanges(theContent){
	myHighlight = 0;
	$("#truefalses").html(theContent);
	//if (cookieSavedNo>0){		
		var x=$(".TrueFalse")
		//alert("cookiJSON = "+JSON.stringify(cookieJSON))
		for (var i=0;i<x.length;i++){
			var y=$(x[i].getElementsByTagName("input"))
			var z=$(x[i].getElementsByTagName("span"))
			for (var j=0;j<y.length;j++){			
				/*if ($(y[j]).attr("isCorrect")){
					$(z[j].parentNode).addClass("thisIsCorrect");
				}*/
				$(z[j].parentNode).addClass('animated bounceInDown');		
			}
			
		}	
		
		
		
		for (var i=0;i<x.length;i++){
			var y=$(x[i].getElementsByTagName("input"));
			var z=$(x[i].getElementsByTagName("span"));
			if (foundThem[i]==true){
				for (var j=0;j<y.length;j++){
					$(y[j]).attr("checked", true);
					if ($(y[j]).attr("isCorrect")){
						
					}
					else{
						var o=$(z[j].getElementsByTagName("img"))
						//$(o[1]).removeClass("hideMe");
						//$(o[1]).addClass("showMe");
						$(y[j].parentNode).addClass("hideMe");
					}
					$(y[j]).attr('disabled', true);
					$(y[j]).parent().attr('style','cursor:default')
				}
				// COMPLETED MAIN ACTIVITY 
				if(window.top){window.top.activateFor();} else {window.parent.activateFor();}
			}
		}
		
		
	//}
	//callorig(call1());
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
function get_browser(){
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[0];
    }
function get_browser_version(){
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[1];
    }

function clearCookie(){
	var myBrowser = get_browser();
	if ((myBrowser=='Chrome')||(isiPad==true)) {
		localStorage.setObject(myCookieName,null);
	}
	else{
		if ($.cookie(myCookieName)===null){		
		}
		else{
			cookieJSON = $.cookie(myCookieName)
		}
		$.removeCookie(myCookieName);
	}	
}

$(document).ready(function() {	
	var doIreset=false;
	try {
		doIreset=window.parent.resetEx();
	}
	catch(e){
	}
	
	if (doIreset==true)
		clearCookie();
	var myBrowser = get_browser();
	//alert("myBrowser = "+myBrowser);
	//alert("isiPad = "+isiPad);
	if ((myBrowser=='Chrome')||(isiPad==true)) {
 		if (localStorage.getItem(myCookieName)===null){	
			localStorage.setObject(myCookieName,{'selections':[]})
			cookieJSON = localStorage.getObject(myCookieName)
		}
		else{
			cookieJSON = localStorage.getObject(myCookieName)
		}
	}
	else{
	//$.removeCookie(myCookieName)
		$.cookie.json = true;
		if ($.cookie(myCookieName)===null){		
			$.cookie(myCookieName, {'selections':[]}, {expires: cookieLifetime});
			cookieJSON = $.cookie(myCookieName)
		}
		else{
			cookieJSON = $.cookie(myCookieName)
		}
	}
	//alert("cookiJSON = "+JSON.stringify(cookieJSON))
	score = 0;
	makePageChanges(readJSON());
	$("#showAnswers").click(function(){
		showAnswers()
 	});
	$("#checkAnswers").click(function(){
		checkAnswers()
 	});
	if ((exJSON.exercise.checkButton)&&(exJSON.exercise.checkButton=="true")){
	}
	else{
		document.getElementById("showAnswers").style.display = "none";
		document.getElementById("checkAnswers").style.display = "none";
	}
	//window.parent.showRelevantItems(mySignature);
});
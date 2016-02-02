;(function() {
	var buger = document.createElement('div'),
		title = document.title,
		url = location.href,
		cssText = 'z-index:1111;position:fixed;bottom:100px;right:0;width:50px;height:50px;background:red;cursor:pointer;';

	if(buger.style.cssText) {
		buger.style.cssText = cssText;
	} else {
		buger.setAttribute('style', cssText);
	}
	document.body.appendChild(buger);

	if(buger.addEventListener) {
		buger.addEventListener('click', sendMessage, false);
		buger.addEventListener('touchend', sendMessage, false);
	} else {
		buger.attachEvent('click', sendMessage);
		buger.attachEvent('touchend', sendMessage);
	}
	function sendMessage() {
		if(buger.removeEventListener) {
			buger.removeEventListener('click', sendMessage);
			buger.removeEventListener('touchend', sendMessage);
		} else {
			buger.detachEvent('click', sendMessage);
			buger.detachEvent('touchend', sendMessage);
		}
		
		location.href = 'http://10.14.229.57:8088/#/apply?title='+title+'&url='+url;
	}
})();
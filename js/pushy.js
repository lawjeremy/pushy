/*! Pushy - v1.1.0 - 2017-1-30
* Pushy is a responsive off-canvas navigation menu using CSS transforms & transitions.
* https://github.com/christophery/pushy/
* by Christopher Yee */

(function () {
	var pushy = document.querySelector('.pushy'), //menu css class
		body = document.querySelector('body'),
		container = document.querySelector('#container'), //container css class
		push = document.querySelector('.push'), //css class to add pushy capability
		pushyLeft = 'pushy-left', //css class for left menu position
		pushyOpenLeft = 'pushy-open-left', //css class when menu is open (left position)
		pushyOpenRight = 'pushy-open-right', //css class when menu is open (right position)
		siteOverlay = document.querySelector('.site-overlay'), //site overlay
		menuBtn = document.querySelectorAll('.menu-btn, .pushy-link'), //css classes to toggle the menu
		menuBtnFocus = document.querySelector('.menu-btn'), //css class to focus when menu is closed w/ esc key
		menuLinkFocus = document.querySelector(pushy.getAttribute('data-focus')), //focus on link when menu is open
		menuSpeed = 200, //jQuery fallback menu speed
		menuWidth = parseInt(getComputedStyle(pushy).width) + 'px', //jQuery fallback menu width
		submenuClass = '.pushy-submenu',
		submenuOpenClass = 'pushy-submenu-open',
		submenuClosedClass = 'pushy-submenu-closed',
		submenu = document.querySelector(submenuClass);
	
	//close menu w/ esc key
	document.addEventListener('keyup', function(e) {
		//check if esc key is pressed
		if (e.keyCode == 27) {

			//check if menu is open
			if( body.classList.contains(pushyOpenLeft) || body.classList.contains(pushyOpenRight) ){
				if(cssTransforms3d){
					closePushy(); //close pushy
				}else{
					closePushyFallback();
					opened = false; //set menu state
				}
				
				//focus on menu button after menu is closed
				if(menuBtnFocus){
					menuBtnFocus.focus();
				}
				
			}

		}   
	});

	function togglePushy(){
		//add class to body based on menu position
		if( pushy.classList.contains(pushyLeft) ){
			body.classList.toggle(pushyOpenLeft);
		}else{
			body.classList.toggle(pushyOpenRight);
		}

		//focus on link in menu after css transition ends
		if(menuLinkFocus){
			pushy.addEventListener('transitionend', function(e) {
				menuLinkFocus.focus();

				//remove event listener to ensure event only fires once
				e.target.removeEventListener(e.type, arguments.callee);
					return;
				});
		}
		
	}

	function closePushy(){
		if( pushy.classList.contains(pushyLeft) ){
			body.classList.remove(pushyOpenLeft);
		}else{
			body.classList.remove(pushyOpenRight);
		}
	}

	function openPushyFallback(){
		//animate menu position based on CSS class
		if( pushy.classList.contains(pushyLeft) ){
			body.classList.add(pushyOpenLeft);
			pushy.animate({left: "0px"}, menuSpeed);
			container.animate({left: menuWidth}, menuSpeed);
			//css class to add pushy capability
			push.animate({left: menuWidth}, menuSpeed);
		}else{
			body.classList.contains(pushyOpenRight);
			pushy.animate({right: '0px'}, menuSpeed);
			container.animate({right: menuWidth}, menuSpeed);
			push.animate({right: menuWidth}, menuSpeed);
		}

		//focus on link in menu
		if(menuLinkFocus){
			menuLinkFocus.focus();
		}
	}

	function closePushyFallback(){
		//animate menu position based on CSS class
		if( pushy.classList.contains(pushyLeft) ){
			body.classList.remove(pushyOpenLeft);
			pushy.animate({left: "-" + menuWidth}, menuSpeed);
			container.animate({left: "0px"}, menuSpeed);
			//css class to add pushy capability
			push.animate({left: "0px"}, menuSpeed);
		}else{
			body.classList.remove(pushyOpenRight);
			pushy.animate({right: "-" + menuWidth}, menuSpeed);
			container.animate({right: "0px"}, menuSpeed);
			push.animate({right: "0px"}, menuSpeed);
		}
	}

	function toggleSubmenu(){
		
		let subMenuItems = document.querySelectorAll(submenuClass);

		//hide submenu by default
		subMenuItems.forEach(function(el){
			el.classList.add(submenuClosedClass);

			el.addEventListener('click', function(e){
				
				var selected = '';

				if( selected.classList.contains(submenuClosedClass) ) {
						//hide opened submenus
						let subMenuItems = document.querySelectorAll(submenuClass);
						subMenuItems.forEach(function(el) {
							el.classList.add(submenuClosedClass);
							el.classList.remove(submenuOpenClass);
						});
						//show submenu
						selected.classList.remove(submenuClosedClass)
						selected.classList.add(submenuOpenClass);
				}else{
						//hide submenu
						selected.classList.add(submenuClosedClass)
						selected.classList.remove(submenuOpenClass);
				}
			});
		});

		// subMenuItems.forEach(function(el){
			
		// });
	}

	//checks if 3d transforms are supported removing the modernizr dependency
	var cssTransforms3d = (function csstransforms3d(){
		var el = document.createElement('p'),
		supported = false,
		transforms = {
		    'webkitTransform':'-webkit-transform',
		    'OTransform':'-o-transform',
		    'msTransform':'-ms-transform',
		    'MozTransform':'-moz-transform',
		    'transform':'transform'
		};

		if(document.body !== null) {
			// Add it to the body to get the computed style
			document.body.insertBefore(el, null);

			for(var t in transforms){
			    if( el.style[t] !== undefined ){
			        el.style[t] = 'translate3d(1px,1px,1px)';
			        supported = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			    }
			}

			document.body.removeChild(el);

			return (supported !== undefined && supported.length > 0 && supported !== "none");
		}else{
			return false;
		}
	})();

	if(cssTransforms3d){
		//toggle submenu
		toggleSubmenu();

		//toggle menu
		menuBtn.forEach(function(el) {
			el.addEventListener('click', function(){
				togglePushy();
			});
		});

		//close menu when clicking site overlay
		siteOverlay.addEventListener('click', function(){
			togglePushy();
		});
	}else{
		//add css class to body
		body.classList.add('no-csstransforms3d');

		//hide menu by default
		if( pushy.classList.contains(pushyLeft) ){
			pushy.style.left = "-" + menuWidth;
		}else{
			pushy.style.right = "-" + menuWidth;
		}

		//fixes IE scrollbar issue
		container.style.overflowX = "hidden";

		//keep track of menu state (open/close)
		var opened = false;

		//toggle submenu
		toggleSubmenu();

		//toggle menu
		menuBtn.forEach(function(el) {
			addEventListener('click', function(){
				if (opened) {
					closePushyFallback();
					opened = false;
				} else {
					openPushyFallback();
					opened = true;
				}
			});
		});

		//close menu when clicking site overlay
		siteOverlay.addEventListener('click', function(){
			if (opened) {
				closePushyFallback();
				opened = false;
			} else {
				openPushyFallback();
				opened = true;
			}
		});
	}


}(jQuery));
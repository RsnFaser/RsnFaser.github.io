var Game = function() {
	this.player = $("#rscharacter");	
	this.positionTop = 0;
	this.positionLeft = $(window).width() / 2 - this.player.width() / 2;
	this.init();
}

Game.constructor = Game;

Game.prototype = {
	
	init: function() {
		this.player.css('left', this.positionLeft + 'px');
		this.eventsHandler();	
		this.intro();
		$('nav a:first').addClass('current');
	},

	intro: function() {
		var isFirstTime = localStorage.getItem('isYourFirstTime');
		if(!isFirstTime) {
			this.createInfoBox('#intro', false);
			localStorage.setItem('isYourFirstTime', false);	
		}
	},

	eventsHandler: function() {
		var me = this;
		var player = this.player;
		
		$(window).resize(function(){
			player.css('left', $(window).width() / 2 - player.width() / 2 + 'px');
		});				
		
		$('.tiles, .exitRoad').unbind('click').bind('click', function(e){
			var x = e.pageX - player.width() / 2;
			var y = e.pageY;
			var canMove = me.checkMove(x, y, true);
			if(canMove === true) {				
				me.teleport(x, y);
				me.popupChatbox(y);
			}
			else {
				me.showChatBox(notifications[0]);
			}
		});
		
		$('.exit').unbind('click').bind('click', function(e){			
			me.showChatBox(notifications[3]);
		});
		
		$('.poh').unbind('click').bind('click', function(){
			var target = '#' + $(this).attr('id');
			me.goToPoh(target);
		});

		$('nav a').click(function(e){
			e.preventDefault();
			var target = $(this).attr('href');
			if(target == '#startCave') {
				$('nav a').removeClass('current');
				$(this).addClass('current');
				$('html, body').animate({scrollTop: 0}, 'slow');
				me.teleport($(window).width() / 2 - me.player.width() / 2, 100);
				return;
			}
			else if(target == '#intro') {
				me.createInfoBox(target, false);
				return;
			}
			me.goToPoh(target);
		});

		$(window).unbind('keydown').bind('keydown', function(event) {
			if(me.positionTop > parseFloat($('#startText').css('top'))) {
				$('#startText').fadeOut('fast', function(){
					$(this).remove();
				});
			}
			switch (event.keyCode) {
				case 37:					
					me.moveX(me.positionLeft - 5, 'left');
					event.preventDefault();
				break;

				case 39:
					me.moveX(me.positionLeft + 5, 'right');
					event.preventDefault();
				break;

				case 38:
					me.moveY(me.positionTop - 5, 'up');
					event.preventDefault();
				break;

				case 40:
					me.moveY(me.positionTop + 5, 'down');
					event.preventDefault();
				break;
				
				case 13: 
					if(me.positionTop > $('#mainFloor').height() - $('#exiting').height() - player.height()) {
						$('nav a').removeClass('current');
					}
				break;
				
				case 27: 					
					me.hideChatBox();
				break;

				case 32:
					return false;
				break;
			}
			me.popupChatbox(me.positionTop);
		}).keyup(function(){
			if(player.attr('class') != '')
				player.removeAttr('class').destroy();
		});	

		$("#notifications").find('.close').live('click', function(){
			me.hideChatBox();
		});
		
		$("#backgroundBox, #closeLB").die('click').live('click', function(){
			me.closeInfoBox();
		});
	},

	showChatBox: function(notification) {
		var me = this;		
		$("#notifications").css('bottom', 0);
		if(!$("#notifications").find('.inner').attr('id') || $("#notifications").find('.inner').text() != notification.text){
			$("#notifications").find('.inner').attr('id', notification.type).fadeOut('fast', function(){
				$(this).html('<img src="' + notification.img + '" />' + notification.text).fadeIn('fast');
			});
		}
	},

	hideChatBox: function() {
		$("#notifications").css('bottom', '-150px');
	},

	popupChatbox: function(y) {
		if(y >= 200) {
			$('nav').addClass('show');
			if(y >= 200 && y < 205) {
				this.showChatBox(notifications[1]);
			}
			else if(y > 1100 && $("#notifications").find('.inner').text() == notifications[1].text) {
				this.hideChatBox();
			}
		}
		else {
			$('nav').removeClass('show');	
		}
	},

	teleport: function(x, y) {		
		this.positionTop = y;
		this.positionLeft = x;
		var player = this.player;
		player.css({
			opacity: 0,
			top: y,
			left: x
		}).show().stop(true, true).animate({opacity: 1});
		if(this.positionTop >= 200) {
			$('html, body').animate({scrollTop: y - 400}, 'slow');
		}
	},

	goToPoh: function(target) {
		var poh;
		for(i = 0; i < pohs.length; i++) {
			if(pohs[i].id == target) {
				poh = pohs[i];
				break;
			}
		}
		var y = poh.top + poh.height - 70;
		var x;
		if(poh.left && poh.left != null) {
			x = poh.left + poh.enter.left;
		}
		else {
			x = $(window).width() - poh.width - poh.right + poh.enter.left;
		}
		var canMove = this.checkMove(x, y, true);
		if(canMove) {
			this.positionTop = y;
			this.positionLeft = x;
			this.teleport(x, y);
		}
	},
	
	moveX: function(x, dir) {
		var player = this.player;
		var canMove = this.checkMove(x, null);	
		if(canMove){
			this.positionLeft = x;
			player.animate({'left': x + 'px'}, 10);
		}
		if(dir == 'left') {
			this.moveAround('left', 2);
		}
		else {
			this.moveAround('right', 3);
		}
	},
	
	moveY: function(y, dir) {
		var player = this.player;
		var canMove = this.checkMove(null, y);	
		if(canMove) {
			if(this.positionTop >= 200) {
				if(dir == 'up') {
					$('html, body').animate({scrollTop: $(document).scrollTop() - 5}, 10);
				}
				else {
					$('html, body').animate({scrollTop: $(document).scrollTop() + 5}, 10);
				}
			}
			this.positionTop = y;
			player.animate({'top': y + 'px'}, 10);
		}
		if(dir == 'up') {
			this.moveAround('up', 4);
		}
		else {
			this.moveAround('down', 1);
		}
	},

	moveAround: function(dir, state) {								
		var player = this.player;
		if(!player.hasClass(dir)) {
			player.addClass(dir);
			player.sprite({fps: 9, no_of_frames: 3}).spState(state);						
		}				
	},
	
	insidePoh: function(elmLeft, elmTop) {
		var player = this.player;
		var isinsidePoh = [];
		for(i = 0; i < pohs.length; i++) {
			if(elmTop > pohs[i].top && elmTop < pohs[i].top + pohs[i].height) {
				if(pohs[i].left && pohs[i].left != null) {
					if(elmLeft < pohs[i].left + pohs[i].width && elmLeft > pohs[i].left - player.width() && elmTop < pohs[i].top + pohs[i].height) {
						if(elmLeft > pohs[i].left + pohs[i].enter.left - player.width() / 2 && elmLeft < pohs[i].left + pohs[i].enter.width + pohs[i].enter.left - player.width() / 2) {
							isinsidePoh.push(true);
							if(elmTop <= pohs[i].top + pohs[i].height - 70) {
								this.createInfoBox(pohs[i].id, true);
							}
						}
						else {
							isinsidePoh.push(false);
						}
					}				
					else {
						isinsidePoh.push(true);
					}
				}
				else if(pohs[i].right && pohs[i].right != null) {
					if(elmLeft > $(window).width() - pohs[i].width - pohs[i].right - player.width() && elmLeft < $(window).width() - pohs[i].right && elmTop < pohs[i].top + pohs[i].height) {
						if(elmLeft > $(window).width() - pohs[i].width - pohs[i].right + pohs[i].enter.left - 10  && elmLeft < $(window).width() - pohs[i].right - pohs[i].width + pohs[i].enter.left + pohs[i].enter.width - 10) {
							isinsidePoh.push(true);
							if(elmTop <= pohs[i].top + pohs[i].height - 70) {
								this.createInfoBox(pohs[i].id, true);
							}
						}
						else {
							isinsidePoh.push(false);
						}
					}
					else {
						isinsidePoh.push(true);
					}
				}
				else {
					isinsidePoh.push(true);
				}
				break;
			}			
		}
		return isinsidePoh;
	},

	onTiles: function(elmLeft, elmTop) {
		var player = this.player;
		var mainRoad = $("#tilesFloor");
		var isOnRoad = true;

		// Check if the player is out of boundries
		if(elmLeft < 0 || elmLeft >= parseFloat(player.parent().width()) - parseFloat(player.width()) || elmTop < 0 || elmTop > parseFloat(player.parent().height()) - parseFloat(player.height())) {
			isOnRoad = false;
		}
		else if(elmLeft < ($(window).width() / 2 - mainRoad.width() / 2) || elmLeft > ($(window).width() / 2 + mainRoad.width() / 2) - player.width()) {
			for(i = 0; i < roads.length; i++) {
				if(elmTop > roads[i].top && elmTop < roads[i].top + roads[i].height - player.height()) {
					if(roads[i].direction == 'left') {
						if(elmLeft < ($(window).width() / 2 + mainRoad.width() / 2) - player.width()) {
							isOnRoad = true;
						}
						else {
							isOnRoad = false;	
						}
					}
					else if(roads[i].direction == 'right') {
						if(elmLeft >= ($(window).width() / 2 + mainRoad.width() / 2) - player.width()) {
							isOnRoad = true;
						}
						else {
							isOnRoad = false;
						}
					}
					else {
						isOnRoad = false;
					}
					break;
				}
				else {
					isOnRoad = false;
				}
			}		
		}		

		return isOnRoad;
	},

	checkMove: function(moveLeft, moveTop, teleported) {
		var player = this.player;
		var elmLeft = moveLeft || this.positionLeft;
		var elmTop = moveTop || this.positionTop;
		
		if(player.css('display') == 'none' && !teleported) {
			return false;
		}
		
		// Check if the player is around a house
		var isHouse = this.insidePoh(elmLeft, elmTop);							
		if(isHouse.indexOf(false) >= 0) {
			return false;
		}

		var onTiles = this.onTiles(elmLeft, elmTop);
		if(onTiles === false) {
			return false;
		}
		
		// Sea Handler
		if(elmTop > $('#mainFloor').height() - $('#exiting').height() - player.height()) {
			this.showChatBox(notifications[2]);
			if(elmLeft > $(window).width() / 2 - $('#exitingRoad').width() / 2 && elmLeft < $(window).width() / 2 + $('#exitingRoad').width() / 2 - player.width()) {				
				if(elmTop > $('#mainFloor').height() - $('#exiting').height() + $("#exitingRoad").height() - 100 - player.height()) {
				 	return false;
				}
				return true;
			}
			else {
				return false;
			}
		}

		return true;
	},
	
	createInfoBox:  function(elm, effectMenu) {
		var me = this;
		if($("#backgroundBox").length < 1) {			
			if(effectMenu) {
				// Update the current menu
				$('nav a').removeClass('current');
				$('nav a[href="' + elm + '"]').addClass('current');	
			}
			
			// Get the relevant content
			var content = $(elm).find('.infoBox').html();

			// Creates the infoBox
			$('<div id="backgroundBox"></div>').appendTo('body').fadeIn();
			$('<div id="infoBox">' + content + '<span id="closeLB">x</span></div>').insertAfter("#backgroundBox").delay(1000).fadeIn();

			$(window).unbind('keydown');
			$('#mainFloor').unbind('click');
			
			$(window).bind('keydown', function(e){
				if(e.keyCode == 27) {
					me.closeInfoBox();
				}
			});
		}		
	},
	
	closeInfoBox: function() {
		var me = this;
		$('#backgroundBox, #infoBox').fadeOut('fast', function(){
			var canMove = me.checkMove(me.positionLeft, me.positionTop + 80);
			if(canMove) {				
				me.moveAround('down', 1);
				me.player.animate({'top': me.positionTop + 80}, function(){
					me.player.removeAttr('class').destroy();
				});
				me.positionTop = me.positionTop + 80;
			}
			$('#backgroundBox, #infoBox').remove();
			me.eventsHandler();
			$('html, body').animate({
				scrollTop: me.positionTop - 570
			});
		});
	}
}

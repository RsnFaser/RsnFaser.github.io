var PlayRS = function() {
	// Set Rs player
	this.player = $("#rscharacter");
	// Set top position
	this.positionTop = 0;
	// Set left position
	this.positionLeft = $(window).width() / 2 - this.player.width() / 2;
	// init
	this.init();
}

// Constructor
PlayRS.constructor = PlayRS;

// Main Game
PlayRS.prototype = {
	
	// Init Function
	init: function() {
		//Set Rs Player and intro
		this.player.css('left', this.positionLeft + 'px');
		this.eventsHandler();
		this.intro();
		$('nav a:first').addClass('current');
	},

	// Get Intro screen
	intro: function() {
		var StartScreen = localStorage.getItem('isStartScreen');
		if(!StartScreen) {
			this.createInfoBox('#intro', false);
			localStorage.setItem('isStartScreen', false);	
		}
	},

	// Event Handler
	eventsHandler: function() {
		// Set rs and player
		var me = this;
		var player = this.player;
		
		// resize window
		$(window).resize(function(){
			player.css('left', $(window).width() / 2 - player.width() / 2 + 'px');
		});				
		
		// Check where you can click
		$('.tiles, .exitRoad').unbind('click').bind('click', function(e){
			var x = e.pageX - player.width() / 2;
			var y = e.pageY;
			var checkMove = me.checkMove(x, y, true);
			if(checkMove === true) {				
				me.teleport(x, y);
				me.popupChatbox(y);
			}
			else {
				me.showChatBox(chatboxs[0]);
			}
		});
		
		// Show chatbox at exit
		$('.exit').unbind('click').bind('click', function(e){			
			me.showChatBox(chatboxs[3]);
		});
		
		// Get inside POH
		$('.poh').unbind('click').bind('click', function(){
			var target = '#' + $(this).attr('id');
			me.goToPoh(target);
		});

		// Set up the navigation bar
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

		// Set up the arrows keybinds
		$(window).unbind('keydown').bind('keydown', function(event) {
			if(me.positionTop > parseFloat($('#startText').css('top'))) {
				$('#startText').fadeOut('fast', function(){
					$(this).remove();
				});
			}
			switch (event.keyCode) {
				case 37:					
					me.mX(me.positionLeft - 5, 'left');
					event.preventDefault();
				break;

				case 39:
					me.mX(me.positionLeft + 5, 'right');
					event.preventDefault();
				break;

				case 38:
					me.mY(me.positionTop - 5, 'up');
					event.preventDefault();
				break;

				case 40:
					me.mY(me.positionTop + 5, 'down');
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

		//Hide chatbox
		$("#chatbox").find('.close').live('click', function(){
			me.hideChatBox();
		});
		//Close info box
		$("#backgroundBox, #closeLB").die('click').live('click', function(){
			me.closeInfoBox();
		});
	},

	// Function to show Chatbox
	showChatBox: function(chatbox) {
		var me = this;		
		$("#chatbox").css('bottom', 0);
		if(!$("#chatbox").find('.inner').attr('id') || $("#chatbox").find('.inner').text() != chatbox.text){
			$("#chatbox").find('.inner').attr('id', chatbox.type).fadeOut('fast', function(){
				$(this).html('<img src="' + chatbox.img + '" />' + chatbox.text).fadeIn('fast');
			});
		}
	},

	// Function to hide chatbox
	hideChatBox: function() {
		$("#chatbox").css('bottom', '-150px');
	},

	// Function to pop up the chatbox
	popupChatbox: function(y) {
		if(y >= 200) {
			$('nav').addClass('show');
			if(y >= 200 && y < 205) {
				this.showChatBox(chatboxs[1]);
			}
			else if(y > 1100 && $("#chatbox").find('.inner').text() == chatboxs[1].text) {
				this.hideChatBox();
			}
		}
		else {
			$('nav').removeClass('show');	
		}
	},

	// Function to teleport around the map
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
	
	// Function to move player
	movePlayer: function(dir, state) {								
		var player = this.player;
		if(!player.hasClass(dir)) {
			player.addClass(dir);
			player.sprite({fps: 9, no_of_frames: 3}).spState(state);						
		}				
	},	
	
	// Function to move player x-wards
	mX: function(x, dir) {
		var player = this.player;
		var checkMove = this.checkMove(x, null);	
		if(checkMove){
			this.positionLeft = x;
			player.animate({'left': x + 'px'}, 10);
		}
		if(dir == 'left') {
			this.movePlayer('left', 2);
		}
		else {
			this.movePlayer('right', 3);
		}
	},
	
	// Function to move player y-wards
	mY: function(y, dir) {
		var player = this.player;
		var checkMove = this.checkMove(null, y);	
		if(checkMove) {
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
			this.movePlayer('up', 4);
		}
		else {
			this.movePlayer('down', 1);
		}
	},
	
	// Function to go to poh
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
		var checkMove = this.checkMove(x, y, true);
		if(checkMove) {
			this.positionTop = y;
			this.positionLeft = x;
			this.teleport(x, y);
		}
	},	

	// Function to open info boxes inside poh
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

	// Function on where to click on the tiles
	onTiles: function(elmLeft, elmTop) {
		var player = this.player;
		var mainRoad = $("#tilesFloor");
		var onTiles = true;

		if(elmLeft < 0 || elmLeft >= parseFloat(player.parent().width()) - parseFloat(player.width()) || elmTop < 0 || elmTop > parseFloat(player.parent().height()) - parseFloat(player.height())) {
			onTiles = false;
		}
		else if(elmLeft < ($(window).width() / 2 - mainRoad.width() / 2) || elmLeft > ($(window).width() / 2 + mainRoad.width() / 2) - player.width()) {
			for(i = 0; i < roads.length; i++) {
				if(elmTop > roads[i].top && elmTop < roads[i].top + roads[i].height - player.height()) {
					if(roads[i].direction == 'left') {
						if(elmLeft < ($(window).width() / 2 + mainRoad.width() / 2) - player.width()) {
							onTiles = true;
						}
						else {
							onTiles = false;	
						}
					}
					else if(roads[i].direction == 'right') {
						if(elmLeft >= ($(window).width() / 2 + mainRoad.width() / 2) - player.width()) {
							onTiles = true;
						}
						else {
							onTiles = false;
						}
					}
					else {
						onTiles = false;
					}
					break;
				}
				else {
					onTiles = false;
				}
			}		
		}		

		return onTiles;
	},

	// Function to check the movement of character
	checkMove: function(moveLeft, moveTop, teleported) {
		var player = this.player;
		var elmLeft = moveLeft || this.positionLeft;
		var elmTop = moveTop || this.positionTop;
		
		if(player.css('display') == 'none' && !teleported) {
			return false;
		}

		var checkHouse = this.insidePoh(elmLeft, elmTop);							
		if(checkHouse.indexOf(false) >= 0) {
			return false;
		}

		var onTiles = this.onTiles(elmLeft, elmTop);
		if(onTiles === false) {
			return false;
		}
		
		if(elmTop > $('#mainFloor').height() - $('#exiting').height() - player.height()) {
			this.showChatBox(chatboxs[2]);
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

	// Function to create infobox
	createInfoBox:  function(elm, effectmenu) {
		var me = this;
		if($("#backgroundBox").length < 1) {			
			if(effectmenu) {
				$('nav a').removeClass('current');
				$('nav a[href="' + elm + '"]').addClass('current');	
			}
			
			var content = $(elm).find('.infoBox').html();

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
	
	// Function to close info box
	closeInfoBox: function() {
		var me = this;
		$('#backgroundBox, #infoBox').fadeOut('fast', function(){
			var checkMove = me.checkMove(me.positionLeft, me.positionTop + 80);
			if(checkMove) {				
				me.movePlayer('down', 1);
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

function openModule() {
		document.getElementById("sideModulespec").style.width = "100%";
		document.body.style.overflow = 'hidden';
	}
	function openGuest() {
		document.getElementById("sideGuestLectures").style.width = "100%";
		document.body.style.overflow = 'hidden';
	}	
	function openChat() {
		document.getElementById("sideChatroom").style.width = "100%";
		document.body.style.overflow = 'hidden';
	}
	function openCam() {
		document.getElementById("sideCamCobra").style.width = "100%";
		document.body.style.overflow = 'hidden';
	}
	function openVideo() {
		document.getElementById("sideVideoGame").style.width = "100%";
		document.body.style.overflow = 'hidden';
	}
	function openForm() {
		document.getElementById("sideFormValidation").style.width = "100%";
		document.body.style.overflow = 'hidden';
	}	
	function closeNav() {
		document.getElementById("sideModulespec").style.width = "0";
		document.getElementById("sideGuestLectures").style.width = "0";
		document.getElementById("sideChatroom").style.width = "0";
		document.getElementById("sideCamCobra").style.width = "0";
		document.getElementById("sideVideoGame").style.width = "0";
		document.getElementById("sideFormValidation").style.width = "0";
		document.body.style.overflowY = 'scroll';
	}

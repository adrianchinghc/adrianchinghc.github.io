 /*global jQuery:false , global blogify:false*/
jQuery(document).ready(function()
{

			"use strict";
			/* Availabe Easing Methods
				1. linear
				2. swing
				3. easeInQuad
				4. easeOutQuad
				5. easeInOutQuad
				6. easeInCubic
				7. easeOutCubic
				8. easeInOutCubic
				9. easeInQuart
				10. easeOutQuart
				11. easeInOutQuart
				12. easeInQuint
				13. easeOutQuint
				14. easeInOutQuint
				15. easeInExpo
				16. easeOutExpo
				17. easeInOutExpo
				18. easeInSine
				19. easeOutSine
				20. easeInOutSine
				21. easeInCirc
				22. easeOutCirc
				23. easeInOutCirc
				24. easeInElastic
				25. easeOutElastic
				26. easeInOutElastic
				27. easeInBack
				28. easeOutBack
				29. easeInOutBack
				30. easeInBounce
				31. easeOutBounce
				32. easeInOutBounce
			  */
			if(typeof blogify !== 'undefined')
			    {
		        var Speed = blogify.speed;
		        var Animation = blogify.ease;
		        var template_url = blogify.template_url;
		        var admin_ajax = blogify.admin_ajax;
		        var mainThemeColor = blogify.mainColor;
		    }
		    else
		    {
		        var Speed = 400;
		        var Animation = 'easeOutCirc';
		        var mainThemeColor = '38b49d';
		    }


		     /* --------------------------------------------------------------
		     	Fix c7 form
		      -------------------------------------------------------------- */

  			jQuery('.wpcf7-form-control[type=text] , textarea.wpcf7-form-control').each(function()
  				{
  						jQuery(this).attr('placeholder' , jQuery(this).val()).val('');
  				});



		   /* --------------------------------------------------------------
		   	Meida Element
		    -------------------------------------------------------------- */
		    jQuery('audio , video').mediaelementplayer({

			    loop: false,
			    enableAutosize: false,
			    features: ['playpause','progress', 'current' , 'volume'] ,
			    audioHeight: 40,
			    alwaysShowHours: false

		    });




		     /* --------------------------------------------------------------
		     	Toggle Menu
		      -------------------------------------------------------------- */
		      jQuery(' nav.menu li.toggle a').on('click' , function()
		      	{
		      				var t = jQuery(this);
		      				var items = jQuery(this).parent().parent().find('li:not(.toggle)');
		      				var prnt = jQuery(this).parent().parent();
		      				if(!prnt.hasClass('active-menu'))
		      				{


		      								t.parent().addClass('active');
		      								items.slideDown(100);
		      								prnt.addClass('active-menu');
		      				}
		      				else{
		      								t.parent().removeClass('active');
		      								items.slideUp(100);
		      								prnt.removeClass('active-menu');
		      				}

		      				return false;
		      	});


		      jQuery(window).resize(function()
		      {
		      			if(jQuery(window).width() > 768)
		      			{
		      					jQuery('nav.menu li:not(.toggle)').css('display' , 'block');
		      					jQuery('nav.menu ul li.toggle').css('display' , 'none').removeClass('active');
		      			}
		      			else{
		      					jQuery('nav.menu li:not(.toggle)').css('display' , 'none');
		      					jQuery('nav.menu ul li.toggle').css('display' , 'block');
		      			}
		      });

		  	 /* --------------------------------------------------------------
			   Gallery
			  -------------------------------------------------------------- */
			    jQuery('.flexslider').flexslider({
			         animation: "fade",
			         touch : true ,
			         easing : Animation ,
			         animationSpeed : 1000,
			         keyboard : true,
			         nextText : '' ,
			         prevText : '',
			         slideshow: true,
			         slideshowSpeed: 5000,
			         controlNav: false,
			         directionNav: true
			    });



			  /* --------------------------------------------------------------
			  	Menu
			   -------------------------------------------------------------- */


		  		 jQuery('nav.menu > ul li').hover(function(){

		  		 		// submenu
			   			var sub = jQuery(this).find('ul');

			   			// check if has submenu
			   			if(sub.length > 0 && jQuery(window).width() > 768)
			   			{
			   					sub.stop().slideDown(200  , Animation);
			   			}

		  		 } , function(){
		  		 		// submenu
			   			var sub = jQuery(this).find('ul');

			   			// check if has submenu
			   			if(sub.length > 0 && jQuery(window).width() > 768)
			   			{
			   					sub.stop().slideUp(100  , Animation);
			   			}
		  		 });


			 /* --------------------------------------------------------------
			 	Toggle Sidebar
			  -------------------------------------------------------------- */
			  jQuery('header .toggleSidebar').on('click' , function()
			  {
			  		jQuery('section.top-sidebar').slideToggle(Speed * 2, Animation);
			  		jQuery(this).toggleClass('toggleUp');
			  });


			 /* --------------------------------------------------------------
			 	Toggle Share Buttons
			  -------------------------------------------------------------- */
			  jQuery('.share-box .toggle-share-box').on('click' , function()
			  {
			  		jQuery(this).parent().find('.social-icons').fadeToggle(Speed , Animation);
			  		jQuery(this).toggleClass('active');
			  		return false;
			  }
			  );


		  	/* --------------------------------------------------------------
			  Accordion
			  -------------------------------------------------------------- */
			  /* Quick Accoridon */
			    jQuery('.accordion').each(function() {

			    var acc = jQuery(this);
			    acc.addClass('opened').find('.item:first .head').addClass('head-active');
			    // show first item content
			    if(acc.hasClass('opened')) {
			     jQuery(this).find('.item:first').find('.item-content').slideDown();
			    }

			    // when click
			    jQuery(this).find('.head').click(function() {
			        if(!jQuery(this).hasClass('head-active')){
			      jQuery(acc).find('.head').removeClass('head-active').parent().find('.item-content').slideUp(Speed , Animation);
			      jQuery(this).parent().find('.item-content').slideDown(Speed , Animation);
			      jQuery(this).addClass('head-active');
			        }
			        return false;
			    });
			  }); // End Accrodion





 			 /* --------------------------------------------------------------
 			 	Twitter Section
 			  -------------------------------------------------------------- */
 				var K = function () {
			    var a = navigator.userAgent;
			    return {
			        ie: a.match(/MSIE\s([^;]*)/)
			    }
				}();
	 			function parseTwitterDate(tdate) {
				    var system_date = new Date(Date.parse(tdate));
				    var user_date = new Date();
				    if (K.ie) {
				        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
				    }
				    var diff = Math.floor((user_date - system_date) / 1000);
				    if (diff <= 1) {return "just now";}
				    if (diff < 20) {return diff + " seconds ago";}
				    if (diff < 40) {return "half a minute ago";}
				    if (diff < 60) {return "less than a minute ago";}
				    if (diff <= 90) {return "one minute ago";}
				    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
				    if (diff <= 5400) {return "about 1 hour ago";}
				    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
				    if (diff <= 129600) {return "about 1 day ago";}
				    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
				    if (diff <= 777600) {return "about 1 week ago";}
				    return "on " + system_date;
				}
				jQuery('.twitter-section ').each(function(){
					jQuery(this).find('p small').text(parseTwitterDate(jQuery(this).find('p small').text()));
				});



});

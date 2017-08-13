!function t(e,n,i){function o(s,a){if(!n[s]){if(!e[s]){var l="function"==typeof require&&require;if(!a&&l)return l(s,!0);if(r)return r(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=n[s]={exports:{}};e[s][0].call(c.exports,function(t){var n=e[s][1][t];return o(n||t)},c,c.exports,t,e,n,i)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)o(i[s]);return o}({1:[function(t,e,n){/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";var e=jQuery.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||e[0]>3)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(),function(t){"use strict";
// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
// ============================================================
function e(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in e)if(void 0!==t.style[n])return{end:e[n]};return!1}
// http://blog.alexmaccaw.com/css-transitions
t.fn.emulateTransitionEnd=function(e){var n=!1,i=this;t(this).one("bsTransitionEnd",function(){n=!0});return setTimeout(function(){n||t(i).trigger(t.support.transition.end)},e),this},t(function(){t.support.transition=e(),t.support.transition&&(t.event.special.bsTransitionEnd={bindType:t.support.transition.end,delegateType:t.support.transition.end,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}})})}(jQuery),function(t){"use strict";
// ALERT CLASS DEFINITION
// ======================
var e='[data-dismiss="alert"]',n=function(n){t(n).on("click",e,this.close)};n.VERSION="3.3.7",n.TRANSITION_DURATION=150,n.prototype.close=function(e){function i(){
// detach from parent, fire event then clean up data
s.detach().trigger("closed.bs.alert").remove()}var o=t(this),r=o.attr("data-target");r||(r=(r=o.attr("href"))&&r.replace(/.*(?=#[^\s]*$)/,""));var s=t("#"===r?[]:r);e&&e.preventDefault(),s.length||(s=o.closest(".alert")),s.trigger(e=t.Event("close.bs.alert")),e.isDefaultPrevented()||(s.removeClass("in"),t.support.transition&&s.hasClass("fade")?s.one("bsTransitionEnd",i).emulateTransitionEnd(n.TRANSITION_DURATION):i())};var i=t.fn.alert;t.fn.alert=
// ALERT PLUGIN DEFINITION
// =======================
function(e){return this.each(function(){var i=t(this),o=i.data("bs.alert");o||i.data("bs.alert",o=new n(this)),"string"==typeof e&&o[e].call(i)})},t.fn.alert.Constructor=n,
// ALERT NO CONFLICT
// =================
t.fn.alert.noConflict=function(){return t.fn.alert=i,this},
// ALERT DATA-API
// ==============
t(document).on("click.bs.alert.data-api",e,n.prototype.close)}(jQuery),function(t){"use strict";
// BUTTON PLUGIN DEFINITION
// ========================
function e(e){return this.each(function(){var i=t(this),o=i.data("bs.button"),r="object"==typeof e&&e;o||i.data("bs.button",o=new n(this,r)),"toggle"==e?o.toggle():e&&o.setState(e)})}
// BUTTON PUBLIC CLASS DEFINITION
// ==============================
var n=function(e,i){this.$element=t(e),this.options=t.extend({},n.DEFAULTS,i),this.isLoading=!1};n.VERSION="3.3.7",n.DEFAULTS={loadingText:"loading..."},n.prototype.setState=function(e){var n="disabled",i=this.$element,o=i.is("input")?"val":"html",r=i.data();e+="Text",null==r.resetText&&i.data("resetText",i[o]()),
// push to event loop to allow forms to submit
setTimeout(t.proxy(function(){i[o](null==r[e]?this.options[e]:r[e]),"loadingText"==e?(this.isLoading=!0,i.addClass(n).attr(n,n).prop(n,!0)):this.isLoading&&(this.isLoading=!1,i.removeClass(n).removeAttr(n).prop(n,!1))},this),0)},n.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var n=this.$element.find("input");"radio"==n.prop("type")?(n.prop("checked")&&(t=!1),e.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==n.prop("type")&&(n.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),n.prop("checked",this.$element.hasClass("active")),t&&n.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var i=t.fn.button;t.fn.button=e,t.fn.button.Constructor=n,
// BUTTON NO CONFLICT
// ==================
t.fn.button.noConflict=function(){return t.fn.button=i,this},
// BUTTON DATA-API
// ===============
t(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(n){var i=t(n.target).closest(".btn");e.call(i,"toggle"),t(n.target).is('input[type="radio"], input[type="checkbox"]')||(
// Prevent double click on radios, and the double selections (so cancellation) on checkboxes
n.preventDefault(),
// The target component still receive the focus
i.is("input,button")?i.trigger("focus"):i.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(e){t(e.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(e.type))})}(jQuery),function(t){"use strict";
// CAROUSEL PLUGIN DEFINITION
// ==========================
function e(e){return this.each(function(){var i=t(this),o=i.data("bs.carousel"),r=t.extend({},n.DEFAULTS,i.data(),"object"==typeof e&&e),s="string"==typeof e?e:r.slide;o||i.data("bs.carousel",o=new n(this,r)),"number"==typeof e?o.to(e):s?o[s]():r.interval&&o.pause().cycle()})}
// CAROUSEL CLASS DEFINITION
// =========================
var n=function(e,n){this.$element=t(e),this.$indicators=this.$element.find(".carousel-indicators"),this.options=n,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",t.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",t.proxy(this.pause,this)).on("mouseleave.bs.carousel",t.proxy(this.cycle,this))};n.VERSION="3.3.7",n.TRANSITION_DURATION=600,n.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},n.prototype.keydown=function(t){if(!/input|textarea/i.test(t.target.tagName)){switch(t.which){case 37:this.prev();break;case 39:this.next();break;default:return}t.preventDefault()}},n.prototype.cycle=function(e){return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this},n.prototype.getItemIndex=function(t){return this.$items=t.parent().children(".item"),this.$items.index(t||this.$active)},n.prototype.getItemForDirection=function(t,e){var n=this.getItemIndex(e);if(("prev"==t&&0===n||"next"==t&&n==this.$items.length-1)&&!this.options.wrap)return e;var i=(n+("prev"==t?-1:1))%this.$items.length;return this.$items.eq(i)},n.prototype.to=function(t){var e=this,n=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(t>this.$items.length-1||t<0))// yes, "slid"
return this.sliding?this.$element.one("slid.bs.carousel",function(){e.to(t)}):n==t?this.pause().cycle():this.slide(t>n?"next":"prev",this.$items.eq(t))},n.prototype.pause=function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&t.support.transition&&(this.$element.trigger(t.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},n.prototype.next=function(){if(!this.sliding)return this.slide("next")},n.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},n.prototype.slide=function(e,i){var o=this.$element.find(".item.active"),r=i||this.getItemForDirection(e,o),s=this.interval,a="next"==e?"left":"right",l=this;if(r.hasClass("active"))return this.sliding=!1;var u=r[0],c=t.Event("slide.bs.carousel",{relatedTarget:u,direction:a});if(this.$element.trigger(c),!c.isDefaultPrevented()){if(this.sliding=!0,s&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var f=t(this.$indicators.children()[this.getItemIndex(r)]);f&&f.addClass("active")}var p=t.Event("slid.bs.carousel",{relatedTarget:u,direction:a});// yes, "slid"
// force reflow
return t.support.transition&&this.$element.hasClass("slide")?(r.addClass(e),r[0].offsetWidth,o.addClass(a),r.addClass(a),o.one("bsTransitionEnd",function(){r.removeClass([e,a].join(" ")).addClass("active"),o.removeClass(["active",a].join(" ")),l.sliding=!1,setTimeout(function(){l.$element.trigger(p)},0)}).emulateTransitionEnd(n.TRANSITION_DURATION)):(o.removeClass("active"),r.addClass("active"),this.sliding=!1,this.$element.trigger(p)),s&&this.cycle(),this}};var i=t.fn.carousel;t.fn.carousel=e,t.fn.carousel.Constructor=n,
// CAROUSEL NO CONFLICT
// ====================
t.fn.carousel.noConflict=function(){return t.fn.carousel=i,this};
// CAROUSEL DATA-API
// =================
var o=function(n){var i,o=t(this),r=t(o.attr("data-target")||(i=o.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,""));// strip for ie7
if(r.hasClass("carousel")){var s=t.extend({},r.data(),o.data()),a=o.attr("data-slide-to");a&&(s.interval=!1),e.call(r,s),a&&r.data("bs.carousel").to(a),n.preventDefault()}};t(document).on("click.bs.carousel.data-api","[data-slide]",o).on("click.bs.carousel.data-api","[data-slide-to]",o),t(window).on("load",function(){t('[data-ride="carousel"]').each(function(){var n=t(this);e.call(n,n.data())})})}(jQuery),function(t){"use strict";function e(e){var n,i=e.attr("data-target")||(n=e.attr("href"))&&n.replace(/.*(?=#[^\s]+$)/,"");// strip for ie7
return t(i)}
// COLLAPSE PLUGIN DEFINITION
// ==========================
function n(e){return this.each(function(){var n=t(this),o=n.data("bs.collapse"),r=t.extend({},i.DEFAULTS,n.data(),"object"==typeof e&&e);!o&&r.toggle&&/show|hide/.test(e)&&(r.toggle=!1),o||n.data("bs.collapse",o=new i(this,r)),"string"==typeof e&&o[e]()})}
// COLLAPSE PUBLIC CLASS DEFINITION
// ================================
var i=function(e,n){this.$element=t(e),this.options=t.extend({},i.DEFAULTS,n),this.$trigger=t('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};i.VERSION="3.3.7",i.TRANSITION_DURATION=350,i.DEFAULTS={toggle:!0},i.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},i.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var e,o=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(o&&o.length&&(e=o.data("bs.collapse"))&&e.transitioning)){var r=t.Event("show.bs.collapse");if(this.$element.trigger(r),!r.isDefaultPrevented()){o&&o.length&&(n.call(o,"hide"),e||o.data("bs.collapse",null));var s=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[s](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var a=function(){this.$element.removeClass("collapsing").addClass("collapse in")[s](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!t.support.transition)return a.call(this);var l=t.camelCase(["scroll",s].join("-"));this.$element.one("bsTransitionEnd",t.proxy(a,this)).emulateTransitionEnd(i.TRANSITION_DURATION)[s](this.$element[0][l])}}}},i.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var e=t.Event("hide.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var n=this.dimension();this.$element[n](this.$element[n]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var o=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};if(!t.support.transition)return o.call(this);this.$element[n](0).one("bsTransitionEnd",t.proxy(o,this)).emulateTransitionEnd(i.TRANSITION_DURATION)}}},i.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},i.prototype.getParent=function(){return t(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(t.proxy(function(n,i){var o=t(i);this.addAriaAndCollapsedClass(e(o),o)},this)).end()},i.prototype.addAriaAndCollapsedClass=function(t,e){var n=t.hasClass("in");t.attr("aria-expanded",n),e.toggleClass("collapsed",!n).attr("aria-expanded",n)};var o=t.fn.collapse;t.fn.collapse=n,t.fn.collapse.Constructor=i,
// COLLAPSE NO CONFLICT
// ====================
t.fn.collapse.noConflict=function(){return t.fn.collapse=o,this},
// COLLAPSE DATA-API
// =================
t(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(i){var o=t(this);o.attr("data-target")||i.preventDefault();var r=e(o),s=r.data("bs.collapse")?"toggle":o.data();n.call(r,s)})}(jQuery),function(t){"use strict";function e(e){var n=e.attr("data-target");n||(n=(n=e.attr("href"))&&/#[A-Za-z]/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,""));var i=n&&t(n);return i&&i.length?i:e.parent()}function n(n){n&&3===n.which||(t(i).remove(),t(o).each(function(){var i=t(this),o=e(i),r={relatedTarget:this};o.hasClass("open")&&(n&&"click"==n.type&&/input|textarea/i.test(n.target.tagName)&&t.contains(o[0],n.target)||(o.trigger(n=t.Event("hide.bs.dropdown",r)),n.isDefaultPrevented()||(i.attr("aria-expanded","false"),o.removeClass("open").trigger(t.Event("hidden.bs.dropdown",r)))))}))}
// DROPDOWN CLASS DEFINITION
// =========================
var i=".dropdown-backdrop",o='[data-toggle="dropdown"]',r=function(e){t(e).on("click.bs.dropdown",this.toggle)};r.VERSION="3.3.7",r.prototype.toggle=function(i){var o=t(this);if(!o.is(".disabled, :disabled")){var r=e(o),s=r.hasClass("open");if(n(),!s){"ontouchstart"in document.documentElement&&!r.closest(".navbar-nav").length&&
// if mobile we use a backdrop because click events don't delegate
t(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(t(this)).on("click",n);var a={relatedTarget:this};if(r.trigger(i=t.Event("show.bs.dropdown",a)),i.isDefaultPrevented())return;o.trigger("focus").attr("aria-expanded","true"),r.toggleClass("open").trigger(t.Event("shown.bs.dropdown",a))}return!1}},r.prototype.keydown=function(n){if(/(38|40|27|32)/.test(n.which)&&!/input|textarea/i.test(n.target.tagName)){var i=t(this);if(n.preventDefault(),n.stopPropagation(),!i.is(".disabled, :disabled")){var r=e(i),s=r.hasClass("open");if(!s&&27!=n.which||s&&27==n.which)return 27==n.which&&r.find(o).trigger("focus"),i.trigger("click");var a=r.find(".dropdown-menu li:not(.disabled):visible a");if(a.length){var l=a.index(n.target);38==n.which&&l>0&&l--,// up
40==n.which&&l<a.length-1&&l++,// down
~l||(l=0),a.eq(l).trigger("focus")}}}};var s=t.fn.dropdown;t.fn.dropdown=
// DROPDOWN PLUGIN DEFINITION
// ==========================
function(e){return this.each(function(){var n=t(this),i=n.data("bs.dropdown");i||n.data("bs.dropdown",i=new r(this)),"string"==typeof e&&i[e].call(n)})},t.fn.dropdown.Constructor=r,
// DROPDOWN NO CONFLICT
// ====================
t.fn.dropdown.noConflict=function(){return t.fn.dropdown=s,this},
// APPLY TO STANDARD DROPDOWN ELEMENTS
// ===================================
t(document).on("click.bs.dropdown.data-api",n).on("click.bs.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.bs.dropdown.data-api",o,r.prototype.toggle).on("keydown.bs.dropdown.data-api",o,r.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",r.prototype.keydown)}(jQuery),function(t){"use strict";
// MODAL PLUGIN DEFINITION
// =======================
function e(e,i){return this.each(function(){var o=t(this),r=o.data("bs.modal"),s=t.extend({},n.DEFAULTS,o.data(),"object"==typeof e&&e);r||o.data("bs.modal",r=new n(this,s)),"string"==typeof e?r[e](i):s.show&&r.show(i)})}
// MODAL CLASS DEFINITION
// ======================
var n=function(e,n){this.options=n,this.$body=t(document.body),this.$element=t(e),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,t.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};n.VERSION="3.3.7",n.TRANSITION_DURATION=300,n.BACKDROP_TRANSITION_DURATION=150,n.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},n.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},n.prototype.show=function(e){var i=this,o=t.Event("show.bs.modal",{relatedTarget:e});this.$element.trigger(o),this.isShown||o.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',t.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){i.$element.one("mouseup.dismiss.bs.modal",function(e){t(e.target).is(i.$element)&&(i.ignoreBackdropClick=!0)})}),this.backdrop(function(){var o=t.support.transition&&i.$element.hasClass("fade");i.$element.parent().length||i.$element.appendTo(i.$body),i.$element.show().scrollTop(0),i.adjustDialog(),o&&i.$element[0].offsetWidth,i.$element.addClass("in"),i.enforceFocus();var r=t.Event("shown.bs.modal",{relatedTarget:e});o?i.$dialog.one("bsTransitionEnd",function(){i.$element.trigger("focus").trigger(r)}).emulateTransitionEnd(n.TRANSITION_DURATION):i.$element.trigger("focus").trigger(r)}))},n.prototype.hide=function(e){e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(n.TRANSITION_DURATION):this.hideModal())},n.prototype.enforceFocus=function(){t(document).off("focusin.bs.modal").on("focusin.bs.modal",t.proxy(function(t){document===t.target||this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},n.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",t.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},n.prototype.resize=function(){this.isShown?t(window).on("resize.bs.modal",t.proxy(this.handleUpdate,this)):t(window).off("resize.bs.modal")},n.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$body.removeClass("modal-open"),t.resetAdjustments(),t.resetScrollbar(),t.$element.trigger("hidden.bs.modal")})},n.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},n.prototype.backdrop=function(e){var i=this,o=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var r=t.support.transition&&o;if(this.$backdrop=t(document.createElement("div")).addClass("modal-backdrop "+o).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",t.proxy(function(t){this.ignoreBackdropClick?this.ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide())},this)),r&&this.$backdrop[0].offsetWidth,// force reflow
this.$backdrop.addClass("in"),!e)return;r?this.$backdrop.one("bsTransitionEnd",e).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION):e()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var s=function(){i.removeBackdrop(),e&&e()};t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",s).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION):s()}else e&&e()},
// these following methods are used to handle overflowing modals
n.prototype.handleUpdate=function(){this.adjustDialog()},n.prototype.adjustDialog=function(){var t=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&t?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!t?this.scrollbarWidth:""})},n.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},n.prototype.checkScrollbar=function(){var t=window.innerWidth;if(!t){// workaround for missing window.innerWidth in IE8
var e=document.documentElement.getBoundingClientRect();t=e.right-Math.abs(e.left)}this.bodyIsOverflowing=document.body.clientWidth<t,this.scrollbarWidth=this.measureScrollbar()},n.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",t+this.scrollbarWidth)},n.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},n.prototype.measureScrollbar=function(){// thx walsh
var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var i=t.fn.modal;t.fn.modal=e,t.fn.modal.Constructor=n,
// MODAL NO CONFLICT
// =================
t.fn.modal.noConflict=function(){return t.fn.modal=i,this},
// MODAL DATA-API
// ==============
t(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(n){var i=t(this),o=i.attr("href"),r=t(i.attr("data-target")||o&&o.replace(/.*(?=#[^\s]+$)/,"")),s=r.data("bs.modal")?"toggle":t.extend({remote:!/#/.test(o)&&o},r.data(),i.data());i.is("a")&&n.preventDefault(),r.one("show.bs.modal",function(t){t.isDefaultPrevented()||// only register focus restorer if modal will actually get shown
r.one("hidden.bs.modal",function(){i.is(":visible")&&i.trigger("focus")})}),e.call(r,s,this)})}(jQuery),function(t){"use strict";
// TOOLTIP PUBLIC CLASS DEFINITION
// ===============================
var e=function(t,e){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",t,e)};e.VERSION="3.3.7",e.TRANSITION_DURATION=150,e.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},e.prototype.init=function(e,n,i){if(this.enabled=!0,this.type=e,this.$element=t(n),this.options=this.getOptions(i),this.$viewport=this.options.viewport&&t(t.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var o=this.options.trigger.split(" "),r=o.length;r--;){var s=o[r];if("click"==s)this.$element.on("click."+this.type,this.options.selector,t.proxy(this.toggle,this));else if("manual"!=s){var a="hover"==s?"mouseenter":"focusin",l="hover"==s?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,t.proxy(this.enter,this)),this.$element.on(l+"."+this.type,this.options.selector,t.proxy(this.leave,this))}}this.options.selector?this._options=t.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},e.prototype.getDefaults=function(){return e.DEFAULTS},e.prototype.getOptions=function(e){return(e=t.extend({},this.getDefaults(),this.$element.data(),e)).delay&&"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e},e.prototype.getDelegateOptions=function(){var e={},n=this.getDefaults();return this._options&&t.each(this._options,function(t,i){n[t]!=i&&(e[t]=i)}),e},e.prototype.enter=function(e){var n=e instanceof this.constructor?e:t(e.currentTarget).data("bs."+this.type);if(n||(n=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,n)),e instanceof t.Event&&(n.inState["focusin"==e.type?"focus":"hover"]=!0),n.tip().hasClass("in")||"in"==n.hoverState)n.hoverState="in";else{if(clearTimeout(n.timeout),n.hoverState="in",!n.options.delay||!n.options.delay.show)return n.show();n.timeout=setTimeout(function(){"in"==n.hoverState&&n.show()},n.options.delay.show)}},e.prototype.isInStateTrue=function(){for(var t in this.inState)if(this.inState[t])return!0;return!1},e.prototype.leave=function(e){var n=e instanceof this.constructor?e:t(e.currentTarget).data("bs."+this.type);if(n||(n=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,n)),e instanceof t.Event&&(n.inState["focusout"==e.type?"focus":"hover"]=!1),!n.isInStateTrue()){if(clearTimeout(n.timeout),n.hoverState="out",!n.options.delay||!n.options.delay.hide)return n.hide();n.timeout=setTimeout(function(){"out"==n.hoverState&&n.hide()},n.options.delay.hide)}},e.prototype.show=function(){var n=t.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(n);var i=t.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(n.isDefaultPrevented()||!i)return;var o=this,r=this.tip(),s=this.getUID(this.type);this.setContent(),r.attr("id",s),this.$element.attr("aria-describedby",s),this.options.animation&&r.addClass("fade");var a="function"==typeof this.options.placement?this.options.placement.call(this,r[0],this.$element[0]):this.options.placement,l=/\s?auto?\s?/i,u=l.test(a);u&&(a=a.replace(l,"")||"top"),r.detach().css({top:0,left:0,display:"block"}).addClass(a).data("bs."+this.type,this),this.options.container?r.appendTo(this.options.container):r.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var c=this.getPosition(),f=r[0].offsetWidth,p=r[0].offsetHeight;if(u){var h=a,d=this.getPosition(this.$viewport);a="bottom"==a&&c.bottom+p>d.bottom?"top":"top"==a&&c.top-p<d.top?"bottom":"right"==a&&c.right+f>d.width?"left":"left"==a&&c.left-f<d.left?"right":a,r.removeClass(h).addClass(a)}var g=this.getCalculatedOffset(a,c,f,p);this.applyPlacement(g,a);var v=function(){var t=o.hoverState;o.$element.trigger("shown.bs."+o.type),o.hoverState=null,"out"==t&&o.leave(o)};t.support.transition&&this.$tip.hasClass("fade")?r.one("bsTransitionEnd",v).emulateTransitionEnd(e.TRANSITION_DURATION):v()}},e.prototype.applyPlacement=function(e,n){var i=this.tip(),o=i[0].offsetWidth,r=i[0].offsetHeight,s=parseInt(i.css("margin-top"),10),a=parseInt(i.css("margin-left"),10);
// we must check for NaN for ie 8/9
isNaN(s)&&(s=0),isNaN(a)&&(a=0),e.top+=s,e.left+=a,
// $.fn.offset doesn't round pixel values
// so we use setOffset directly with our own function B-0
t.offset.setOffset(i[0],t.extend({using:function(t){i.css({top:Math.round(t.top),left:Math.round(t.left)})}},e),0),i.addClass("in");
// check to see if placing tip in new offset caused the tip to resize itself
var l=i[0].offsetWidth,u=i[0].offsetHeight;"top"==n&&u!=r&&(e.top=e.top+r-u);var c=this.getViewportAdjustedDelta(n,e,l,u);c.left?e.left+=c.left:e.top+=c.top;var f=/top|bottom/.test(n),p=f?2*c.left-o+l:2*c.top-r+u,h=f?"offsetWidth":"offsetHeight";i.offset(e),this.replaceArrow(p,i[0][h],f)},e.prototype.replaceArrow=function(t,e,n){this.arrow().css(n?"left":"top",50*(1-t/e)+"%").css(n?"top":"left","")},e.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();t.find(".tooltip-inner")[this.options.html?"html":"text"](e),t.removeClass("fade in top bottom left right")},e.prototype.hide=function(n){function i(){"in"!=o.hoverState&&r.detach(),o.$element&&// TODO: Check whether guarding this code with this `if` is really necessary.
o.$element.removeAttr("aria-describedby").trigger("hidden.bs."+o.type),n&&n()}var o=this,r=t(this.$tip),s=t.Event("hide.bs."+this.type);if(this.$element.trigger(s),!s.isDefaultPrevented())return r.removeClass("in"),t.support.transition&&r.hasClass("fade")?r.one("bsTransitionEnd",i).emulateTransitionEnd(e.TRANSITION_DURATION):i(),this.hoverState=null,this},e.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},e.prototype.hasContent=function(){return this.getTitle()},e.prototype.getPosition=function(e){var n=(e=e||this.$element)[0],i="BODY"==n.tagName,o=n.getBoundingClientRect();null==o.width&&(
// width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
o=t.extend({},o,{width:o.right-o.left,height:o.bottom-o.top}));var r=window.SVGElement&&n instanceof window.SVGElement,s=i?{top:0,left:0}:r?null:e.offset(),a={scroll:i?document.documentElement.scrollTop||document.body.scrollTop:e.scrollTop()},l=i?{width:t(window).width(),height:t(window).height()}:null;return t.extend({},o,a,l,s)},e.prototype.getCalculatedOffset=function(t,e,n,i){/* placement == 'right' */
return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-n/2}:"top"==t?{top:e.top-i,left:e.left+e.width/2-n/2}:"left"==t?{top:e.top+e.height/2-i/2,left:e.left-n}:{top:e.top+e.height/2-i/2,left:e.left+e.width}},e.prototype.getViewportAdjustedDelta=function(t,e,n,i){var o={top:0,left:0};if(!this.$viewport)return o;var r=this.options.viewport&&this.options.viewport.padding||0,s=this.getPosition(this.$viewport);if(/right|left/.test(t)){var a=e.top-r-s.scroll,l=e.top+r-s.scroll+i;a<s.top?// top overflow
o.top=s.top-a:l>s.top+s.height&&(// bottom overflow
o.top=s.top+s.height-l)}else{var u=e.left-r,c=e.left+r+n;u<s.left?// left overflow
o.left=s.left-u:c>s.right&&(// right overflow
o.left=s.left+s.width-c)}return o},e.prototype.getTitle=function(){var t=this.$element,e=this.options;return t.attr("data-original-title")||("function"==typeof e.title?e.title.call(t[0]):e.title)},e.prototype.getUID=function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},e.prototype.tip=function(){if(!this.$tip&&(this.$tip=t(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},e.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},e.prototype.enable=function(){this.enabled=!0},e.prototype.disable=function(){this.enabled=!1},e.prototype.toggleEnabled=function(){this.enabled=!this.enabled},e.prototype.toggle=function(e){var n=this;e&&((n=t(e.currentTarget).data("bs."+this.type))||(n=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,n))),e?(n.inState.click=!n.inState.click,n.isInStateTrue()?n.enter(n):n.leave(n)):n.tip().hasClass("in")?n.leave(n):n.enter(n)},e.prototype.destroy=function(){var t=this;clearTimeout(this.timeout),this.hide(function(){t.$element.off("."+t.type).removeData("bs."+t.type),t.$tip&&t.$tip.detach(),t.$tip=null,t.$arrow=null,t.$viewport=null,t.$element=null})};var n=t.fn.tooltip;t.fn.tooltip=
// TOOLTIP PLUGIN DEFINITION
// =========================
function(n){return this.each(function(){var i=t(this),o=i.data("bs.tooltip"),r="object"==typeof n&&n;!o&&/destroy|hide/.test(n)||(o||i.data("bs.tooltip",o=new e(this,r)),"string"==typeof n&&o[n]())})},t.fn.tooltip.Constructor=e,
// TOOLTIP NO CONFLICT
// ===================
t.fn.tooltip.noConflict=function(){return t.fn.tooltip=n,this}}(jQuery),function(t){"use strict";
// POPOVER PUBLIC CLASS DEFINITION
// ===============================
var e=function(t,e){this.init("popover",t,e)};if(!t.fn.tooltip)throw new Error("Popover requires tooltip.js");e.VERSION="3.3.7",e.DEFAULTS=t.extend({},t.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),
// NOTE: POPOVER EXTENDS tooltip.js
// ================================
e.prototype=t.extend({},t.fn.tooltip.Constructor.prototype),e.prototype.constructor=e,e.prototype.getDefaults=function(){return e.DEFAULTS},e.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),n=this.getContent();t.find(".popover-title")[this.options.html?"html":"text"](e),t.find(".popover-content").children().detach().end()[// we use append for html objects to maintain js events
this.options.html?"string"==typeof n?"html":"append":"text"](n),t.removeClass("fade top bottom left right in"),
// IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
// this manually by checking the contents.
t.find(".popover-title").html()||t.find(".popover-title").hide()},e.prototype.hasContent=function(){return this.getTitle()||this.getContent()},e.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},e.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var n=t.fn.popover;t.fn.popover=
// POPOVER PLUGIN DEFINITION
// =========================
function(n){return this.each(function(){var i=t(this),o=i.data("bs.popover"),r="object"==typeof n&&n;!o&&/destroy|hide/.test(n)||(o||i.data("bs.popover",o=new e(this,r)),"string"==typeof n&&o[n]())})},t.fn.popover.Constructor=e,
// POPOVER NO CONFLICT
// ===================
t.fn.popover.noConflict=function(){return t.fn.popover=n,this}}(jQuery),function(t){"use strict";
// SCROLLSPY CLASS DEFINITION
// ==========================
function e(n,i){this.$body=t(document.body),this.$scrollElement=t(t(n).is(document.body)?window:n),this.options=t.extend({},e.DEFAULTS,i),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",t.proxy(this.process,this)),this.refresh(),this.process()}
// SCROLLSPY PLUGIN DEFINITION
// ===========================
function n(n){return this.each(function(){var i=t(this),o=i.data("bs.scrollspy"),r="object"==typeof n&&n;o||i.data("bs.scrollspy",o=new e(this,r)),"string"==typeof n&&o[n]()})}e.VERSION="3.3.7",e.DEFAULTS={offset:10},e.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},e.prototype.refresh=function(){var e=this,n="offset",i=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),t.isWindow(this.$scrollElement[0])||(n="position",i=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var e=t(this),o=e.data("target")||e.attr("href"),r=/^#./.test(o)&&t(o);return r&&r.length&&r.is(":visible")&&[[r[n]().top+i,o]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){e.offsets.push(this[0]),e.targets.push(this[1])})},e.prototype.process=function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,n=this.getScrollHeight(),i=this.options.offset+n-this.$scrollElement.height(),o=this.offsets,r=this.targets,s=this.activeTarget;if(this.scrollHeight!=n&&this.refresh(),e>=i)return s!=(t=r[r.length-1])&&this.activate(t);if(s&&e<o[0])return this.activeTarget=null,this.clear();for(t=o.length;t--;)s!=r[t]&&e>=o[t]&&(void 0===o[t+1]||e<o[t+1])&&this.activate(r[t])},e.prototype.activate=function(e){this.activeTarget=e,this.clear();var n=this.selector+'[data-target="'+e+'"],'+this.selector+'[href="'+e+'"]',i=t(n).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active")),i.trigger("activate.bs.scrollspy")},e.prototype.clear=function(){t(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var i=t.fn.scrollspy;t.fn.scrollspy=n,t.fn.scrollspy.Constructor=e,
// SCROLLSPY NO CONFLICT
// =====================
t.fn.scrollspy.noConflict=function(){return t.fn.scrollspy=i,this},
// SCROLLSPY DATA-API
// ==================
t(window).on("load.bs.scrollspy.data-api",function(){t('[data-spy="scroll"]').each(function(){var e=t(this);n.call(e,e.data())})})}(jQuery),function(t){"use strict";
// TAB PLUGIN DEFINITION
// =====================
function e(e){return this.each(function(){var i=t(this),o=i.data("bs.tab");o||i.data("bs.tab",o=new n(this)),"string"==typeof e&&o[e]()})}
// TAB CLASS DEFINITION
// ====================
var n=function(e){
// jscs:disable requireDollarBeforejQueryAssignment
this.element=t(e)};n.VERSION="3.3.7",n.TRANSITION_DURATION=150,n.prototype.show=function(){var e=this.element,n=e.closest("ul:not(.dropdown-menu)"),i=e.data("target");if(i||(i=(i=e.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),!e.parent("li").hasClass("active")){var o=n.find(".active:last a"),r=t.Event("hide.bs.tab",{relatedTarget:e[0]}),s=t.Event("show.bs.tab",{relatedTarget:o[0]});if(o.trigger(r),e.trigger(s),!s.isDefaultPrevented()&&!r.isDefaultPrevented()){var a=t(i);this.activate(e.closest("li"),n),this.activate(a,a.parent(),function(){o.trigger({type:"hidden.bs.tab",relatedTarget:e[0]}),e.trigger({type:"shown.bs.tab",relatedTarget:o[0]})})}}},n.prototype.activate=function(e,i,o){function r(){s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),a?(e[0].offsetWidth,// reflow for transition
e.addClass("in")):e.removeClass("fade"),e.parent(".dropdown-menu").length&&e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),o&&o()}var s=i.find("> .active"),a=o&&t.support.transition&&(s.length&&s.hasClass("fade")||!!i.find("> .fade").length);s.length&&a?s.one("bsTransitionEnd",r).emulateTransitionEnd(n.TRANSITION_DURATION):r(),s.removeClass("in")};var i=t.fn.tab;t.fn.tab=e,t.fn.tab.Constructor=n,
// TAB NO CONFLICT
// ===============
t.fn.tab.noConflict=function(){return t.fn.tab=i,this};
// TAB DATA-API
// ============
var o=function(n){n.preventDefault(),e.call(t(this),"show")};t(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',o).on("click.bs.tab.data-api",'[data-toggle="pill"]',o)}(jQuery),function(t){"use strict";
// AFFIX PLUGIN DEFINITION
// =======================
function e(e){return this.each(function(){var i=t(this),o=i.data("bs.affix"),r="object"==typeof e&&e;o||i.data("bs.affix",o=new n(this,r)),"string"==typeof e&&o[e]()})}
// AFFIX CLASS DEFINITION
// ======================
var n=function(e,i){this.options=t.extend({},n.DEFAULTS,i),this.$target=t(this.options.target).on("scroll.bs.affix.data-api",t.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",t.proxy(this.checkPositionWithEventLoop,this)),this.$element=t(e),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};n.VERSION="3.3.7",n.RESET="affix affix-top affix-bottom",n.DEFAULTS={offset:0,target:window},n.prototype.getState=function(t,e,n,i){var o=this.$target.scrollTop(),r=this.$element.offset(),s=this.$target.height();if(null!=n&&"top"==this.affixed)return o<n&&"top";if("bottom"==this.affixed)return null!=n?!(o+this.unpin<=r.top)&&"bottom":!(o+s<=t-i)&&"bottom";var a=null==this.affixed,l=a?o:r.top,u=a?s:e;return null!=n&&o<=n?"top":null!=i&&l+u>=t-i&&"bottom"},n.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(n.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},n.prototype.checkPositionWithEventLoop=function(){setTimeout(t.proxy(this.checkPosition,this),1)},n.prototype.checkPosition=function(){if(this.$element.is(":visible")){var e=this.$element.height(),i=this.options.offset,o=i.top,r=i.bottom,s=Math.max(t(document).height(),t(document.body).height());"object"!=typeof i&&(r=o=i),"function"==typeof o&&(o=i.top(this.$element)),"function"==typeof r&&(r=i.bottom(this.$element));var a=this.getState(s,e,o,r);if(this.affixed!=a){null!=this.unpin&&this.$element.css("top","");var l="affix"+(a?"-"+a:""),u=t.Event(l+".bs.affix");if(this.$element.trigger(u),u.isDefaultPrevented())return;this.affixed=a,this.unpin="bottom"==a?this.getPinnedOffset():null,this.$element.removeClass(n.RESET).addClass(l).trigger(l.replace("affix","affixed")+".bs.affix")}"bottom"==a&&this.$element.offset({top:s-e-r})}};var i=t.fn.affix;t.fn.affix=e,t.fn.affix.Constructor=n,
// AFFIX NO CONFLICT
// =================
t.fn.affix.noConflict=function(){return t.fn.affix=i,this},
// AFFIX DATA-API
// ==============
t(window).on("load",function(){t('[data-spy="affix"]').each(function(){var n=t(this),i=n.data();i.offset=i.offset||{},null!=i.offsetBottom&&(i.offset.bottom=i.offsetBottom),null!=i.offsetTop&&(i.offset.top=i.offsetTop),e.call(n,i)})})}(jQuery)},{}],2:[function(t,e,n){(function(t){(function(t,e,n,i,o){/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
!function(e,n){"use strict";"object"==typeof t&&"object"==typeof t.exports?
// For CommonJS and CommonJS-like environments where a proper `window`
// is present, execute the factory and get jQuery.
// For environments that do not have a `window` with a `document`
// (such as Node.js), expose a factory as module.exports.
// This accentuates the need for the creation of a real `window`.
// e.g. var jQuery = require("jquery")(window);
// See ticket #14549 for more info.
t.exports=e.document?n(e,!0):function(t){if(!t.document)throw new Error("jQuery requires a window with a document");return n(t)}:n(e)}("undefined"!=typeof window?window:this,function(t,e){
// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";function n(t,e){var n=(e=e||nt).createElement("script");n.text=t,e.head.appendChild(n).parentNode.removeChild(n)}function o(t){
// Support: real iOS 8.2 only (not reproducible in simulator)
// `in` check used to prevent JIT error (gh-2145)
// hasOwn isn't used here due to false negatives
// regarding Nodelist length in IE
var e=!!t&&"length"in t&&t.length,n=dt.type(t);return"function"!==n&&!dt.isWindow(t)&&("array"===n||0===e||"number"==typeof e&&e>0&&e-1 in t)}function r(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()}
// Implement the identical functionality for filter and not
function s(t,e,n){
// Single element
// Arraylike of elements (jQuery, arguments, Array)
// Simple selector that can be filtered directly, removing non-Elements
// Complex selector, compare the two sets, removing non-Elements
return dt.isFunction(e)?dt.grep(t,function(t,i){return!!e.call(t,i,t)!==n}):e.nodeType?dt.grep(t,function(t){return t===e!==n}):"string"!=typeof e?dt.grep(t,function(t){return at.call(e,t)>-1!==n}):Et.test(e)?dt.filter(e,t,n):(e=dt.filter(e,t),dt.grep(t,function(t){return at.call(e,t)>-1!==n&&1===t.nodeType}))}function a(t,e){for(;(t=t[e])&&1!==t.nodeType;);return t}
// Convert String-formatted options into Object-formatted ones
function l(t){var e={};return dt.each(t.match(Dt)||[],function(t,n){e[n]=!0}),e}function u(t){return t}function c(t){throw t}function f(t,e,n,i){var o;try{
// Check for promise aspect first to privilege synchronous behavior
t&&dt.isFunction(o=t.promise)?o.call(t).done(e).fail(n):t&&dt.isFunction(o=t.then)?o.call(t,e,n):
// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
// * false: [ value ].slice( 0 ) => resolve( value )
// * true: [ value ].slice( 1 ) => resolve()
e.apply(void 0,[t].slice(i))}catch(t){
// Support: Android 4.0 only
// Strict mode functions invoked without .call/.apply get global-object context
n.apply(void 0,[t])}}
// The ready event handler and self cleanup method
function p(){nt.removeEventListener("DOMContentLoaded",p),t.removeEventListener("load",p),dt.ready()}function h(){this.expando=dt.expando+h.uid++}function d(t){
// Only convert to a number if it doesn't change the string
return"true"===t||"false"!==t&&("null"===t?null:t===+t+""?+t:qt.test(t)?JSON.parse(t):t)}function g(t,e,n){var i;
// If nothing was found internally, try to fetch any
// data from the HTML5 data-* attribute
if(void 0===n&&1===t.nodeType)if(i="data-"+e.replace(Ft,"-$&").toLowerCase(),"string"==typeof(n=t.getAttribute(i))){try{n=d(n)}catch(t){}
// Make sure we set the data so it isn't changed later
Rt.set(t,e,n)}else n=void 0;return n}function v(t,e,n,i){var o,r=1,s=20,a=i?function(){return i.cur()}:function(){return dt.css(t,e,"")},l=a(),u=n&&n[3]||(dt.cssNumber[e]?"":"px"),
// Starting value computation is required for potential unit mismatches
c=(dt.cssNumber[e]||"px"!==u&&+l)&&Ht.exec(dt.css(t,e));if(c&&c[3]!==u){
// Trust units reported by jQuery.css
u=u||c[3],
// Make sure we update the tween properties later on
n=n||[],
// Iteratively approximate from a nonzero starting point
c=+l||1;do{
// If previous iteration zeroed out, double until we get *something*.
// Use string for doubling so we don't accidentally see scale as unchanged below
// Adjust and apply
c/=r=r||".5",dt.style(t,e,c+u)}while(r!==(r=a()/l)&&1!==r&&--s)}
// Apply relative offset (+=/-=) if specified
return n&&(c=+c||+l||0,o=n[1]?c+(n[1]+1)*n[2]:+n[2],i&&(i.unit=u,i.start=c,i.end=o)),o}function m(t){var e,n=t.ownerDocument,i=t.nodeName,o=Bt[i];return o||(e=n.body.appendChild(n.createElement(i)),o=dt.css(e,"display"),e.parentNode.removeChild(e),"none"===o&&(o="block"),Bt[i]=o,o)}function y(t,e){
// Determine new display value for elements that need to change
for(var n,i,o=[],r=0,s=t.length;r<s;r++)(i=t[r]).style&&(n=i.style.display,e?(
// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
// check is required in this first loop unless we have a nonempty display value (either
// inline or about-to-be-restored)
"none"===n&&(o[r]=Lt.get(i,"display")||null,o[r]||(i.style.display="")),""===i.style.display&&Wt(i)&&(o[r]=m(i))):"none"!==n&&(o[r]="none",
// Remember what we're overwriting
Lt.set(i,"display",n)));
// Set the display of the elements in a second loop to avoid constant reflow
for(r=0;r<s;r++)null!=o[r]&&(t[r].style.display=o[r]);return t}function b(t,e){
// Support: IE <=9 - 11 only
// Use typeof to avoid zero-argument method invocation on host objects (#15151)
var n;return n=void 0!==t.getElementsByTagName?t.getElementsByTagName(e||"*"):void 0!==t.querySelectorAll?t.querySelectorAll(e||"*"):[],void 0===e||e&&r(t,e)?dt.merge([t],n):n}
// Mark scripts as having already been evaluated
function w(t,e){for(var n=0,i=t.length;n<i;n++)Lt.set(t[n],"globalEval",!e||Lt.get(e[n],"globalEval"))}function x(t,e,n,i,o){for(var r,s,a,l,u,c,f=e.createDocumentFragment(),p=[],h=0,d=t.length;h<d;h++)if((r=t[h])||0===r)
// Add nodes directly
if("object"===dt.type(r))
// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
dt.merge(p,r.nodeType?[r]:r);else if(Qt.test(r)){for(s=s||f.appendChild(e.createElement("div")),
// Deserialize a standard representation
a=(zt.exec(r)||["",""])[1].toLowerCase(),l=Xt[a]||Xt._default,s.innerHTML=l[1]+dt.htmlPrefilter(r)+l[2],
// Descend through wrappers to the right content
c=l[0];c--;)s=s.lastChild;
// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
dt.merge(p,s.childNodes),
// Ensure the created nodes are orphaned (#12392)
(
// Remember the top-level container
s=f.firstChild).textContent=""}else p.push(e.createTextNode(r));for(
// Remove wrapper from fragment
f.textContent="",h=0;r=p[h++];)
// Skip elements already in the context collection (trac-4087)
if(i&&dt.inArray(r,i)>-1)o&&o.push(r);else
// Capture executables
if(u=dt.contains(r.ownerDocument,r),
// Append to fragment
s=b(f.appendChild(r),"script"),
// Preserve script evaluation history
u&&w(s),n)for(c=0;r=s[c++];)Vt.test(r.type||"")&&n.push(r);return f}function T(){return!0}function C(){return!1}
// Support: IE <=9 only
// See #13393 for more info
function E(){try{return nt.activeElement}catch(t){}}function S(t,e,n,i,o,r){var s,a;
// Types can be a map of types/handlers
if("object"==typeof e){
// ( types-Object, selector, data )
"string"!=typeof n&&(
// ( types-Object, data )
i=i||n,n=void 0);for(a in e)S(t,a,n,i,e[a],r);return t}if(null==i&&null==o?(
// ( types, fn )
o=n,i=n=void 0):null==o&&("string"==typeof n?(
// ( types, selector, fn )
o=i,i=void 0):(
// ( types, data, fn )
o=i,i=n,n=void 0)),!1===o)o=C;else if(!o)return t;
// Use same guid so caller can remove using origFn
return 1===r&&(s=o,(o=function(t){
// Can use an empty set, since event contains the info
return dt().off(t),s.apply(this,arguments)}).guid=s.guid||(s.guid=dt.guid++)),t.each(function(){dt.event.add(this,e,o,i,n)})}
// Prefer a tbody over its parent table for containing new rows
function k(t,e){return r(t,"table")&&r(11!==e.nodeType?e:e.firstChild,"tr")?dt(">tbody",t)[0]||t:t}
// Replace/restore the type attribute of script elements for safe DOM manipulation
function $(t){return t.type=(null!==t.getAttribute("type"))+"/"+t.type,t}function N(t){var e=ne.exec(t.type);return e?t.type=e[1]:t.removeAttribute("type"),t}function D(t,e){var n,i,o,r,s,a,l,u;if(1===e.nodeType){
// 1. Copy private data: events, handlers, etc.
if(Lt.hasData(t)&&(r=Lt.access(t),s=Lt.set(e,r),u=r.events)){delete s.handle,s.events={};for(o in u)for(n=0,i=u[o].length;n<i;n++)dt.event.add(e,o,u[o][n])}
// 2. Copy user data
Rt.hasData(t)&&(a=Rt.access(t),l=dt.extend({},a),Rt.set(e,l))}}
// Fix IE bugs, see support tests
function A(t,e){var n=e.nodeName.toLowerCase();
// Fails to persist the checked state of a cloned checkbox or radio button.
"input"===n&&Ut.test(t.type)?e.checked=t.checked:"input"!==n&&"textarea"!==n||(e.defaultValue=t.defaultValue)}function j(t,e,i,o){
// Flatten any nested arrays
e=rt.apply([],e);var r,s,a,l,u,c,f=0,p=t.length,h=p-1,d=e[0],g=dt.isFunction(d);
// We can't cloneNode fragments that contain checked, in WebKit
if(g||p>1&&"string"==typeof d&&!ht.checkClone&&ee.test(d))return t.each(function(n){var r=t.eq(n);g&&(e[0]=d.call(this,n,r.html())),j(r,e,i,o)});if(p&&(r=x(e,t[0].ownerDocument,!1,t,o),s=r.firstChild,1===r.childNodes.length&&(r=s),s||o)){
// Use the original fragment for the last item
// instead of the first because it can end up
// being emptied incorrectly in certain situations (#8070).
for(l=(a=dt.map(b(r,"script"),$)).length;f<p;f++)u=r,f!==h&&(u=dt.clone(u,!0,!0),
// Keep references to cloned scripts for later restoration
l&&
// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
dt.merge(a,b(u,"script"))),i.call(t[f],u,f);if(l)
// Evaluate executable scripts on first document insertion
for(c=a[a.length-1].ownerDocument,
// Reenable scripts
dt.map(a,N),f=0;f<l;f++)u=a[f],Vt.test(u.type||"")&&!Lt.access(u,"globalEval")&&dt.contains(c,u)&&(u.src?
// Optional AJAX dependency, but won't run scripts if not present
dt._evalUrl&&dt._evalUrl(u.src):n(u.textContent.replace(ie,""),c))}return t}function O(t,e,n){for(var i,o=e?dt.filter(e,t):t,r=0;null!=(i=o[r]);r++)n||1!==i.nodeType||dt.cleanData(b(i)),i.parentNode&&(n&&dt.contains(i.ownerDocument,i)&&w(b(i,"script")),i.parentNode.removeChild(i));return t}function I(t,e,n){var i,o,r,s,
// Support: Firefox 51+
// Retrieving style before computed somehow
// fixes an issue with getting wrong values
// on detached elements
a=t.style;
// getPropertyValue is needed for:
//   .css('filter') (IE 9 only, #12537)
//   .css('--customProperty) (#3144)
// A tribute to the "awesome hack by Dean Edwards"
// Android Browser returns percentage for some values,
// but width seems to be reliably pixels.
// This is against the CSSOM draft spec:
// https://drafts.csswg.org/cssom/#resolved-values
// Remember the original values
// Put in the new values to get a computed value out
// Revert the changed values
// Support: IE <=9 - 11 only
// IE returns zIndex value as an integer.
return(n=n||se(t))&&(""!==(s=n.getPropertyValue(e)||n[e])||dt.contains(t.ownerDocument,t)||(s=dt.style(t,e)),!ht.pixelMarginRight()&&re.test(s)&&oe.test(e)&&(i=a.width,o=a.minWidth,r=a.maxWidth,a.minWidth=a.maxWidth=a.width=s,s=n.width,a.width=i,a.minWidth=o,a.maxWidth=r)),void 0!==s?s+"":s}function L(t,e){
// Define the hook, we'll check on the first run if it's really needed.
return{get:function(){if(!t())
// Hook needed; redefine it so that the support test is not executed again.
return(this.get=e).apply(this,arguments);
// Hook not needed (or it's not possible to use it due
// to missing dependency), remove it.
delete this.get}}}
// Return a css property mapped to a potentially vendor prefixed property
function R(t){
// Shortcut for names that are not vendor prefixed
if(t in pe)return t;for(
// Check for vendor prefixed names
var e=t[0].toUpperCase()+t.slice(1),n=fe.length;n--;)if((t=fe[n]+e)in pe)return t}
// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function q(t){var e=dt.cssProps[t];return e||(e=dt.cssProps[t]=R(t)||t),e}function F(t,e,n){
// Any relative (+/-) values have already been
// normalized at this point
var i=Ht.exec(e);
// Guard against undefined "subtract", e.g., when used as in cssHooks
return i?Math.max(0,i[2]-(n||0))+(i[3]||"px"):e}function P(t,e,n,i,o){var r,s=0;for(
// If we already have the right measurement, avoid augmentation
r=n===(i?"border":"content")?4:"width"===e?1:0;r<4;r+=2)
// Both box models exclude margin, so add it if we want it
"margin"===n&&(s+=dt.css(t,n+_t[r],!0,o)),i?(
// border-box includes padding, so remove it if we want content
"content"===n&&(s-=dt.css(t,"padding"+_t[r],!0,o)),
// At this point, extra isn't border nor margin, so remove border
"margin"!==n&&(s-=dt.css(t,"border"+_t[r]+"Width",!0,o))):(
// At this point, extra isn't content, so add padding
s+=dt.css(t,"padding"+_t[r],!0,o),
// At this point, extra isn't content nor padding, so add border
"padding"!==n&&(s+=dt.css(t,"border"+_t[r]+"Width",!0,o)));return s}function H(t,e,n){
// Start with computed style
var i,o=se(t),r=I(t,e,o),s="border-box"===dt.css(t,"boxSizing",!1,o);
// Computed unit is not pixels. Stop here and return.
// Computed unit is not pixels. Stop here and return.
// Check for style in case a browser which returns unreliable values
// for getComputedStyle silently falls back to the reliable elem.style
// Fall back to offsetWidth/Height when value is "auto"
// This happens for inline elements with no explicit setting (gh-3571)
// Normalize "", auto, and prepare for extra
return re.test(r)?r:(i=s&&(ht.boxSizingReliable()||r===t.style[e]),"auto"===r&&(r=t["offset"+e[0].toUpperCase()+e.slice(1)]),(r=parseFloat(r)||0)+P(t,e,n||(s?"border":"content"),i,o)+"px")}function _(t,e,n,i,o){return new _.prototype.init(t,e,n,i,o)}function W(){de&&(!1===nt.hidden&&t.requestAnimationFrame?t.requestAnimationFrame(W):t.setTimeout(W,dt.fx.interval),dt.fx.tick())}
// Animations created synchronously will run synchronously
function M(){return t.setTimeout(function(){he=void 0}),he=dt.now()}
// Generate parameters to create a standard animation
function B(t,e){var n,i=0,o={height:t};for(
// If we include width, step value is 1 to do all cssExpand values,
// otherwise step value is 2 to skip over Left and Right
e=e?1:0;i<4;i+=2-e)o["margin"+(n=_t[i])]=o["padding"+n]=t;return e&&(o.opacity=o.width=t),o}function U(t,e,n){for(var i,o=(V.tweeners[e]||[]).concat(V.tweeners["*"]),r=0,s=o.length;r<s;r++)if(i=o[r].call(n,e,t))
// We're done with this property
return i}function z(t,e){var n,i,o,r,s;
// camelCase, specialEasing and expand cssHook pass
for(n in t)if(i=dt.camelCase(n),o=e[i],r=t[n],Array.isArray(r)&&(o=r[1],r=t[n]=r[0]),n!==i&&(t[i]=r,delete t[n]),(s=dt.cssHooks[i])&&"expand"in s){r=s.expand(r),delete t[i];
// Not quite $.extend, this won't overwrite existing keys.
// Reusing 'index' because we have the correct "name"
for(n in r)n in t||(t[n]=r[n],e[n]=o)}else e[i]=o}function V(t,e,n){var i,o,r=0,s=V.prefilters.length,a=dt.Deferred().always(function(){
// Don't match elem in the :animated selector
delete l.elem}),l=function(){if(o)return!1;for(var e=he||M(),n=Math.max(0,u.startTime+u.duration-e),i=1-(n/u.duration||0),r=0,s=u.tweens.length;r<s;r++)u.tweens[r].run(i);
// If there's more to do, yield
// If there's more to do, yield
// If this was an empty animation, synthesize a final progress notification
// Resolve the animation and report its conclusion
return a.notifyWith(t,[u,i,n]),i<1&&s?n:(s||a.notifyWith(t,[u,1,0]),a.resolveWith(t,[u]),!1)},u=a.promise({elem:t,props:dt.extend({},e),opts:dt.extend(!0,{specialEasing:{},easing:dt.easing._default},n),originalProperties:e,originalOptions:n,startTime:he||M(),duration:n.duration,tweens:[],createTween:function(e,n){var i=dt.Tween(t,u.opts,e,n,u.opts.specialEasing[e]||u.opts.easing);return u.tweens.push(i),i},stop:function(e){var n=0,
// If we are going to the end, we want to run all the tweens
// otherwise we skip this part
i=e?u.tweens.length:0;if(o)return this;for(o=!0;n<i;n++)u.tweens[n].run(1);
// Resolve when we played the last frame; otherwise, reject
return e?(a.notifyWith(t,[u,1,0]),a.resolveWith(t,[u,e])):a.rejectWith(t,[u,e]),this}}),c=u.props;for(z(c,u.opts.specialEasing);r<s;r++)if(i=V.prefilters[r].call(u,t,c,u.opts))return dt.isFunction(i.stop)&&(dt._queueHooks(u.elem,u.opts.queue).stop=dt.proxy(i.stop,i)),i;
// Attach callbacks from options
return dt.map(c,U,u),dt.isFunction(u.opts.start)&&u.opts.start.call(t,u),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always),dt.fx.timer(dt.extend(l,{elem:t,anim:u,queue:u.opts.queue})),u}
// Strip and collapse whitespace according to HTML spec
// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
function X(t){return(t.match(Dt)||[]).join(" ")}function Q(t){return t.getAttribute&&t.getAttribute("class")||""}function G(t,e,n,i){var o;if(Array.isArray(e))
// Serialize array item.
dt.each(e,function(e,o){n||ke.test(t)?
// Treat each array item as a scalar.
i(t,o):
// Item is non-scalar (array or object), encode its numeric index.
G(t+"["+("object"==typeof o&&null!=o?e:"")+"]",o,n,i)});else if(n||"object"!==dt.type(e))
// Serialize scalar item.
i(t,e);else
// Serialize object item.
for(o in e)G(t+"["+o+"]",e[o],n,i)}
// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function Y(t){
// dataTypeExpression is optional and defaults to "*"
return function(e,n){"string"!=typeof e&&(n=e,e="*");var i,o=0,r=e.toLowerCase().match(Dt)||[];if(dt.isFunction(n))
// For each dataType in the dataTypeExpression
for(;i=r[o++];)
// Prepend if requested
"+"===i[0]?(i=i.slice(1)||"*",(t[i]=t[i]||[]).unshift(n)):(t[i]=t[i]||[]).push(n)}}
// Base inspection function for prefilters and transports
function J(t,e,n,i){function o(a){var l;return r[a]=!0,dt.each(t[a]||[],function(t,a){var u=a(e,n,i);return"string"!=typeof u||s||r[u]?s?!(l=u):void 0:(e.dataTypes.unshift(u),o(u),!1)}),l}var r={},s=t===Pe;return o(e.dataTypes[0])||!r["*"]&&o("*")}
// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function K(t,e){var n,i,o=dt.ajaxSettings.flatOptions||{};for(n in e)void 0!==e[n]&&((o[n]?t:i||(i={}))[n]=e[n]);return i&&dt.extend(!0,t,i),t}/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function Z(t,e,n){
// Remove auto dataType and get content-type in the process
for(var i,o,r,s,a=t.contents,l=t.dataTypes;"*"===l[0];)l.shift(),void 0===i&&(i=t.mimeType||e.getResponseHeader("Content-Type"));
// Check if we're dealing with a known content-type
if(i)for(o in a)if(a[o]&&a[o].test(i)){l.unshift(o);break}
// Check to see if we have a response for the expected dataType
if(l[0]in n)r=l[0];else{
// Try convertible dataTypes
for(o in n){if(!l[0]||t.converters[o+" "+l[0]]){r=o;break}s||(s=o)}
// Or just use first one
r=r||s}
// If we found a dataType
// We add the dataType to the list if needed
// and return the corresponding response
if(r)return r!==l[0]&&l.unshift(r),n[r]}/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function tt(t,e,n,i){var o,r,s,a,l,u={},
// Work with a copy of dataTypes in case we need to modify it for conversion
c=t.dataTypes.slice();
// Create converters map with lowercased keys
if(c[1])for(s in t.converters)u[s.toLowerCase()]=t.converters[s];
// Convert to each sequential dataType
for(r=c.shift();r;)if(t.responseFields[r]&&(n[t.responseFields[r]]=e),
// Apply the dataFilter if provided
!l&&i&&t.dataFilter&&(e=t.dataFilter(e,t.dataType)),l=r,r=c.shift())
// There's only work to do if current dataType is non-auto
if("*"===r)r=l;else if("*"!==l&&l!==r){
// If none found, seek a pair
if(!(
// Seek a direct converter
s=u[l+" "+r]||u["* "+r]))for(o in u)if((
// If conv2 outputs current
a=o.split(" "))[1]===r&&(
// If prev can be converted to accepted input
s=u[l+" "+a[0]]||u["* "+a[0]])){
// Condense equivalence converters
!0===s?s=u[o]:!0!==u[o]&&(r=a[0],c.unshift(a[1]));break}
// Apply converter (if not an equivalence)
if(!0!==s)
// Unless errors are allowed to bubble, catch and return them
if(s&&t.throws)e=s(e);else try{e=s(e)}catch(t){return{state:"parsererror",error:s?t:"No conversion from "+l+" to "+r}}}return{state:"success",data:e}}var et=[],nt=t.document,it=Object.getPrototypeOf,ot=et.slice,rt=et.concat,st=et.push,at=et.indexOf,lt={},ut=lt.toString,ct=lt.hasOwnProperty,ft=ct.toString,pt=ft.call(Object),ht={},
// Define a local copy of jQuery
dt=function(t,e){
// The jQuery object is actually just the init constructor 'enhanced'
// Need init if jQuery is called (just allow error to be thrown if not included)
return new dt.fn.init(t,e)},
// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
gt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
// Matches dashed string for camelizing
vt=/^-ms-/,mt=/-([a-z])/g,
// Used by jQuery.camelCase as callback to replace()
yt=function(t,e){return e.toUpperCase()};dt.fn=dt.prototype={
// The current version of jQuery being used
jquery:"3.2.1",constructor:dt,
// The default length of a jQuery object is 0
length:0,toArray:function(){return ot.call(this)},
// Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
get:function(t){
// Return all the elements in a clean array
// Return all the elements in a clean array
return null==t?ot.call(this):t<0?this[t+this.length]:this[t]},
// Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack:function(t){
// Build a new jQuery matched element set
var e=dt.merge(this.constructor(),t);
// Return the newly-formed element set
// Add the old object onto the stack (as a reference)
return e.prevObject=this,e},
// Execute a callback for every element in the matched set.
each:function(t){return dt.each(this,t)},map:function(t){return this.pushStack(dt.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return this.pushStack(ot.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(t){var e=this.length,n=+t+(t<0?e:0);return this.pushStack(n>=0&&n<e?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},
// For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push:st,sort:et.sort,splice:et.splice},dt.extend=dt.fn.extend=function(){var t,e,n,i,o,r,s=arguments[0]||{},a=1,l=arguments.length,u=!1;for(
// Handle a deep copy situation
"boolean"==typeof s&&(u=s,
// Skip the boolean and the target
s=arguments[a]||{},a++),
// Handle case when target is a string or something (possible in deep copy)
"object"==typeof s||dt.isFunction(s)||(s={}),
// Extend jQuery itself if only one argument is passed
a===l&&(s=this,a--);a<l;a++)
// Only deal with non-null/undefined values
if(null!=(t=arguments[a]))
// Extend the base object
for(e in t)n=s[e],
// Prevent never-ending loop
s!==(i=t[e])&&(
// Recurse if we're merging plain objects or arrays
u&&i&&(dt.isPlainObject(i)||(o=Array.isArray(i)))?(o?(o=!1,r=n&&Array.isArray(n)?n:[]):r=n&&dt.isPlainObject(n)?n:{},
// Never move original objects, clone them
s[e]=dt.extend(u,r,i)):void 0!==i&&(s[e]=i));
// Return the modified object
return s},dt.extend({
// Unique for each copy of jQuery on the page
expando:"jQuery"+("3.2.1"+Math.random()).replace(/\D/g,""),
// Assume jQuery is ready without the ready module
isReady:!0,error:function(t){throw new Error(t)},noop:function(){},isFunction:function(t){return"function"===dt.type(t)},isWindow:function(t){return null!=t&&t===t.window},isNumeric:function(t){
// As of jQuery 3.0, isNumeric is limited to
// strings and numbers (primitives or objects)
// that can be coerced to finite numbers (gh-2662)
var e=dt.type(t);
// parseFloat NaNs numeric-cast false positives ("")
// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
// subtraction forces infinities to NaN
return("number"===e||"string"===e)&&!isNaN(t-parseFloat(t))},isPlainObject:function(t){var e,n;
// Detect obvious negatives
// Use toString instead of jQuery.type to catch host objects
// Detect obvious negatives
// Use toString instead of jQuery.type to catch host objects
// Objects with no prototype (e.g., `Object.create( null )`) are plain
// Objects with prototype are plain iff they were constructed by a global Object function
return!(!t||"[object Object]"!==ut.call(t))&&(!(e=it(t))||"function"==typeof(n=ct.call(e,"constructor")&&e.constructor)&&ft.call(n)===pt)},isEmptyObject:function(t){/* eslint-disable no-unused-vars */
// See https://github.com/eslint/eslint/issues/6125
var e;for(e in t)return!1;return!0},type:function(t){return null==t?t+"":"object"==typeof t||"function"==typeof t?lt[ut.call(t)]||"object":typeof t},
// Evaluates a script in a global context
globalEval:function(t){n(t)},
// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 13
// Microsoft forgot to hump their vendor prefix (#9572)
camelCase:function(t){return t.replace(vt,"ms-").replace(mt,yt)},each:function(t,e){var n,i=0;if(o(t))for(n=t.length;i<n&&!1!==e.call(t[i],i,t[i]);i++);else for(i in t)if(!1===e.call(t[i],i,t[i]))break;return t},
// Support: Android <=4.0 only
trim:function(t){return null==t?"":(t+"").replace(gt,"")},
// results is for internal usage only
makeArray:function(t,e){var n=e||[];return null!=t&&(o(Object(t))?dt.merge(n,"string"==typeof t?[t]:t):st.call(n,t)),n},inArray:function(t,e,n){return null==e?-1:at.call(e,t,n)},
// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
merge:function(t,e){for(var n=+e.length,i=0,o=t.length;i<n;i++)t[o++]=e[i];return t.length=o,t},grep:function(t,e,n){
// Go through the array, only saving the items
// that pass the validator function
for(var i=[],o=0,r=t.length,s=!n;o<r;o++)!e(t[o],o)!==s&&i.push(t[o]);return i},
// arg is for internal usage only
map:function(t,e,n){var i,r,s=0,a=[];
// Go through the array, translating each of the items to their new values
if(o(t))for(i=t.length;s<i;s++)null!=(r=e(t[s],s,n))&&a.push(r);else for(s in t)null!=(r=e(t[s],s,n))&&a.push(r);
// Flatten any nested arrays
return rt.apply([],a)},
// A global GUID counter for objects
guid:1,
// Bind a function to a context, optionally partially applying any
// arguments.
proxy:function(t,e){var n,i,o;
// Quick check to determine if target is callable, in the spec
// this throws a TypeError, but we will just return undefined.
if("string"==typeof e&&(n=t[e],e=t,t=n),dt.isFunction(t))
// Simulated bind
// Set the guid of unique handler to the same of original handler, so it can be removed
return i=ot.call(arguments,2),o=function(){return t.apply(e||this,i.concat(ot.call(arguments)))},o.guid=t.guid=t.guid||dt.guid++,o},now:Date.now,
// jQuery.support is not used in Core but other projects attach their
// properties to it so it needs to exist.
support:ht}),"function"==typeof Symbol&&(dt.fn[Symbol.iterator]=et[Symbol.iterator]),
// Populate the class2type map
dt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(t,e){lt["[object "+e+"]"]=e.toLowerCase()});var bt=/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
function(t){function e(t,e,n,i){var o,r,s,a,l,c,p,h=e&&e.ownerDocument,
// nodeType defaults to 9, since context defaults to document
d=e?e.nodeType:9;
// Return early from calls with invalid selector or context
if(n=n||[],"string"!=typeof t||!t||1!==d&&9!==d&&11!==d)return n;
// Try to shortcut find operations (as opposed to filters) in HTML documents
if(!i&&((e?e.ownerDocument||e:H)!==j&&A(e),e=e||j,I)){
// If the selector is sufficiently simple, try using a "get*By*" DOM method
// (excepting DocumentFragment context, where the methods don't exist)
if(11!==d&&(l=gt.exec(t)))
// ID selector
if(o=l[1]){
// Document context
if(9===d){if(!(s=e.getElementById(o)))return n;
// Support: IE, Opera, Webkit
// TODO: identify versions
// getElementById can match elements by name instead of ID
if(s.id===o)return n.push(s),n}else
// Support: IE, Opera, Webkit
// TODO: identify versions
// getElementById can match elements by name instead of ID
if(h&&(s=h.getElementById(o))&&F(e,s)&&s.id===o)return n.push(s),n}else{if(l[2])return Y.apply(n,e.getElementsByTagName(t)),n;if((o=l[3])&&w.getElementsByClassName&&e.getElementsByClassName)return Y.apply(n,e.getElementsByClassName(o)),n}
// Take advantage of querySelectorAll
if(w.qsa&&!U[t+" "]&&(!L||!L.test(t))){if(1!==d)h=e,p=t;else if("object"!==e.nodeName.toLowerCase()){for(
// Capture the context ID, setting it first if necessary
(a=e.getAttribute("id"))?a=a.replace(bt,wt):e.setAttribute("id",a=P),r=(
// Prefix every selector in the list
c=E(t)).length;r--;)c[r]="#"+a+" "+f(c[r]);p=c.join(","),
// Expand context for sibling selectors
h=vt.test(t)&&u(e.parentNode)||e}if(p)try{return Y.apply(n,h.querySelectorAll(p)),n}catch(t){}finally{a===P&&e.removeAttribute("id")}}}
// All others
return k(t.replace(rt,"$1"),e,n,i)}/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function n(){function t(n,i){
// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
// Only keep the most recent entries
return e.push(n+" ")>x.cacheLength&&delete t[e.shift()],t[n+" "]=i}var e=[];return t}/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function i(t){return t[P]=!0,t}/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function o(t){var e=j.createElement("fieldset");try{return!!t(e)}catch(t){return!1}finally{
// Remove from its parent by default
e.parentNode&&e.parentNode.removeChild(e),
// release memory in IE
e=null}}/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function r(t,e){for(var n=t.split("|"),i=n.length;i--;)x.attrHandle[n[i]]=e}/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function s(t,e){var n=e&&t,i=n&&1===t.nodeType&&1===e.nodeType&&t.sourceIndex-e.sourceIndex;
// Use IE sourceIndex if available on both nodes
if(i)return i;
// Check if b follows a
if(n)for(;n=n.nextSibling;)if(n===e)return-1;return t?1:-1}/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function a(t){
// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
return function(e){
// Only certain elements can match :enabled or :disabled
// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
// Only certain elements can match :enabled or :disabled
// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
// Check for inherited disabledness on relevant non-disabled elements:
// * listed form-associated elements in a disabled fieldset
//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
// * option elements in a disabled optgroup
//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
// All such elements have a "form" property.
// Option elements defer to a parent optgroup if present
// Where there is no isDisabled, check manually
/* jshint -W018 */
return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&Tt(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function l(t){return i(function(e){return e=+e,i(function(n,i){
// Match elements found at the specified indexes
for(var o,r=t([],n.length,e),s=r.length;s--;)n[o=r[s]]&&(n[o]=!(i[o]=n[o]))})})}/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function u(t){return t&&void 0!==t.getElementsByTagName&&t}
// Easy API for creating new setFilters
function c(){}function f(t){for(var e=0,n=t.length,i="";e<n;e++)i+=t[e].value;return i}function p(t,e,n){var i=e.dir,o=e.next,r=o||i,s=n&&"parentNode"===r,a=W++;
// Check against closest ancestor/preceding element
// Check against all ancestor/preceding elements
return e.first?function(e,n,o){for(;e=e[i];)if(1===e.nodeType||s)return t(e,n,o);return!1}:function(e,n,l){var u,c,f,p=[_,a];
// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
if(l){for(;e=e[i];)if((1===e.nodeType||s)&&t(e,n,l))return!0}else for(;e=e[i];)if(1===e.nodeType||s)if(f=e[P]||(e[P]={}),
// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
c=f[e.uniqueID]||(f[e.uniqueID]={}),o&&o===e.nodeName.toLowerCase())e=e[i]||e;else{if((u=c[r])&&u[0]===_&&u[1]===a)
// Assign to newCache so results back-propagate to previous elements
return p[2]=u[2];
// A match means we're done; a fail means we have to keep checking
if(
// Reuse newcache so results back-propagate to previous elements
c[r]=p,p[2]=t(e,n,l))return!0}return!1}}function h(t){return t.length>1?function(e,n,i){for(var o=t.length;o--;)if(!t[o](e,n,i))return!1;return!0}:t[0]}function d(t,n,i){for(var o=0,r=n.length;o<r;o++)e(t,n[o],i);return i}function g(t,e,n,i,o){for(var r,s=[],a=0,l=t.length,u=null!=e;a<l;a++)(r=t[a])&&(n&&!n(r,i,o)||(s.push(r),u&&e.push(a)));return s}function v(t,e,n,o,r,s){return o&&!o[P]&&(o=v(o)),r&&!r[P]&&(r=v(r,s)),i(function(i,s,a,l){var u,c,f,p=[],h=[],v=s.length,
// Get initial elements from seed or context
m=i||d(e||"*",a.nodeType?[a]:a,[]),
// Prefilter to get matcher input, preserving a map for seed-results synchronization
y=!t||!i&&e?m:g(m,p,t,a,l),b=n?
// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
r||(i?t:v||o)?
// ...intermediate processing is necessary
[]:
// ...otherwise use results directly
s:y;
// Apply postFilter
if(
// Find primary matches
n&&n(y,b,a,l),o)for(u=g(b,h),o(u,[],a,l),
// Un-match failing elements by moving them back to matcherIn
c=u.length;c--;)(f=u[c])&&(b[h[c]]=!(y[h[c]]=f));if(i){if(r||t){if(r){for(
// Get the final matcherOut by condensing this intermediate into postFinder contexts
u=[],c=b.length;c--;)(f=b[c])&&
// Restore matcherIn since elem is not yet a final match
u.push(y[c]=f);r(null,b=[],u,l)}for(
// Move matched elements from seed to results to keep them synchronized
c=b.length;c--;)(f=b[c])&&(u=r?K(i,f):p[c])>-1&&(i[u]=!(s[u]=f))}}else b=g(b===s?b.splice(v,b.length):b),r?r(null,s,b,l):Y.apply(s,b)})}function m(t){for(var e,n,i,o=t.length,r=x.relative[t[0].type],s=r||x.relative[" "],a=r?1:0,
// The foundational matcher ensures that elements are reachable from top-level context(s)
l=p(function(t){return t===e},s,!0),u=p(function(t){return K(e,t)>-1},s,!0),c=[function(t,n,i){var o=!r&&(i||n!==$)||((e=n).nodeType?l(t,n,i):u(t,n,i));
// Avoid hanging onto element (issue #299)
return e=null,o}];a<o;a++)if(n=x.relative[t[a].type])c=[p(h(c),n)];else{
// Return special upon seeing a positional matcher
if((n=x.filter[t[a].type].apply(null,t[a].matches))[P]){for(
// Find the next relative operator (if any) for proper handling
i=++a;i<o&&!x.relative[t[i].type];i++);
// If the preceding token was a descendant combinator, insert an implicit any-element `*`
return v(a>1&&h(c),a>1&&f(t.slice(0,a-1).concat({value:" "===t[a-2].type?"*":""})).replace(rt,"$1"),n,a<i&&m(t.slice(a,i)),i<o&&m(t=t.slice(i)),i<o&&f(t))}c.push(n)}return h(c)}function y(t,n){var o=n.length>0,r=t.length>0,s=function(i,s,a,l,u){var c,f,p,h=0,d="0",v=i&&[],m=[],y=$,
// We must always have either seed elements or outermost context
b=i||r&&x.find.TAG("*",u),
// Use integer dirruns iff this is the outermost matcher
w=_+=null==y?1:Math.random()||.1,T=b.length;
// Add elements passing elementMatchers directly to results
// Support: IE<9, Safari
// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
for(u&&($=s===j||s||u);d!==T&&null!=(c=b[d]);d++){if(r&&c){for(f=0,s||c.ownerDocument===j||(A(c),a=!I);p=t[f++];)if(p(c,s||j,a)){l.push(c);break}u&&(_=w)}
// Track unmatched elements for set filters
o&&(
// They will have gone through all possible matchers
(c=!p&&c)&&h--,
// Lengthen the array for every element, matched or not
i&&v.push(c))}
// Apply set filters to unmatched elements
// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
// no element matchers and no seed.
// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
// case, which will result in a "00" `matchedCount` that differs from `i` but is also
// numerically zero.
if(
// `i` is now the count of elements visited above, and adding it to `matchedCount`
// makes the latter nonnegative.
h+=d,o&&d!==h){for(f=0;p=n[f++];)p(v,m,s,a);if(i){
// Reintegrate element matches to eliminate the need for sorting
if(h>0)for(;d--;)v[d]||m[d]||(m[d]=Q.call(l));
// Discard index placeholder values to get only actual matches
m=g(m)}
// Add matches to results
Y.apply(l,m),
// Seedless set matches succeeding multiple successful matchers stipulate sorting
u&&!i&&m.length>0&&h+n.length>1&&e.uniqueSort(l)}
// Override manipulation of globals by nested matchers
return u&&(_=w,$=y),v};return o?i(s):s}var b,w,x,T,C,E,S,k,$,N,D,
// Local document vars
A,j,O,I,L,R,q,F,
// Instance-specific data
P="sizzle"+1*new Date,H=t.document,_=0,W=0,M=n(),B=n(),U=n(),z=function(t,e){return t===e&&(D=!0),0},
// Instance methods
V={}.hasOwnProperty,X=[],Q=X.pop,G=X.push,Y=X.push,J=X.slice,
// Use a stripped-down indexOf as it's faster than native
// https://jsperf.com/thor-indexof-vs-for/5
K=function(t,e){for(var n=0,i=t.length;n<i;n++)if(t[n]===e)return n;return-1},Z="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
// Regular expressions
// http://www.w3.org/TR/css3-selectors/#whitespace
tt="[\\x20\\t\\r\\n\\f]",
// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
et="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
nt="\\["+tt+"*("+et+")(?:"+tt+
// Operator (capture 2)
"*([*^$|!~]?=)"+tt+
// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+et+"))|)"+tt+"*\\]",it=":("+et+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+nt+")*)|.*)\\)|)",
// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
ot=new RegExp(tt+"+","g"),rt=new RegExp("^"+tt+"+|((?:^|[^\\\\])(?:\\\\.)*)"+tt+"+$","g"),st=new RegExp("^"+tt+"*,"+tt+"*"),at=new RegExp("^"+tt+"*([>+~]|"+tt+")"+tt+"*"),lt=new RegExp("="+tt+"*([^\\]'\"]*?)"+tt+"*\\]","g"),ut=new RegExp(it),ct=new RegExp("^"+et+"$"),ft={ID:new RegExp("^#("+et+")"),CLASS:new RegExp("^\\.("+et+")"),TAG:new RegExp("^("+et+"|[*])"),ATTR:new RegExp("^"+nt),PSEUDO:new RegExp("^"+it),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+tt+"*(even|odd|(([+-]|)(\\d*)n|)"+tt+"*(?:([+-]|)"+tt+"*(\\d+)|))"+tt+"*\\)|)","i"),bool:new RegExp("^(?:"+Z+")$","i"),
// For use in libraries implementing .is()
// We use this for POS matching in `select`
needsContext:new RegExp("^"+tt+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+tt+"*((?:-\\d)?\\d*)"+tt+"*\\)|)(?=[^-]|$)","i")},pt=/^(?:input|select|textarea|button)$/i,ht=/^h\d$/i,dt=/^[^{]+\{\s*\[native \w/,
// Easily-parseable/retrievable ID or TAG or CLASS selectors
gt=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,vt=/[+~]/,
// CSS escapes
// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
mt=new RegExp("\\\\([\\da-f]{1,6}"+tt+"?|("+tt+")|.)","ig"),yt=function(t,e,n){var i="0x"+e-65536;
// NaN means non-codepoint
// Support: Firefox<24
// Workaround erroneous numeric interpretation of +"0x"
// BMP codepoint
// Supplemental Plane codepoint (surrogate pair)
return i!==i||n?e:i<0?String.fromCharCode(i+65536):String.fromCharCode(i>>10|55296,1023&i|56320)},
// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
bt=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,wt=function(t,e){
// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t},
// Used for iframes
// See setDocument()
// Removing the function wrapper causes a "Permission Denied"
// error in IE
xt=function(){A()},Tt=p(function(t){return!0===t.disabled&&("form"in t||"label"in t)},{dir:"parentNode",next:"legend"});
// Optimize for push.apply( _, NodeList )
try{Y.apply(X=J.call(H.childNodes),H.childNodes),
// Support: Android<4.0
// Detect silently failing push.apply
X[H.childNodes.length].nodeType}catch(t){Y={apply:X.length?
// Leverage slice if possible
function(t,e){G.apply(t,J.call(e))}:
// Support: IE<9
// Otherwise append directly
function(t,e){
// Can't trust NodeList.length
for(var n=t.length,i=0;t[n++]=e[i++];);t.length=n-1}}}
// Expose support vars for convenience
w=e.support={},/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
C=e.isXML=function(t){
// documentElement is verified for cases where it doesn't yet exist
// (such as loading iframes in IE - #4833)
var e=t&&(t.ownerDocument||t).documentElement;return!!e&&"HTML"!==e.nodeName},/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
A=e.setDocument=function(t){var e,n,i=t?t.ownerDocument||t:H;
// Return early if doc is invalid or already selected
// Return early if doc is invalid or already selected
// Update global variables
// Support: IE 9-11, Edge
// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
// Support: IE 11, Edge
/* Attributes
	---------------------------------------------------------------------- */
// Support: IE<8
// Verify that getAttribute really returns attributes and not properties
// (excepting IE8 booleans)
/* getElement(s)By*
	---------------------------------------------------------------------- */
// Check if getElementsByTagName("*") returns only elements
// Support: IE<9
// Support: IE<10
// Check if getElementById returns elements by name
// The broken getElementById methods don't pick up programmatically-set names,
// so use a roundabout getElementsByName test
// ID filter and find
// Support: IE 6 - 7 only
// getElementById is not reliable as a find shortcut
// Tag
// Class
/* QSA/matchesSelector
	---------------------------------------------------------------------- */
// QSA and matchesSelector support
// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
// qSa(:focus) reports false when true (Chrome 21)
// We allow this because of a bug in IE8/9 that throws an error
// whenever `document.activeElement` is accessed on an iframe
// So, we allow :focus to pass through QSA all the time to avoid the IE error
// See https://bugs.jquery.com/ticket/13378
// Build QSA regex
// Regex strategy adopted from Diego Perini
/* Contains
	---------------------------------------------------------------------- */
// Element contains another
// Purposefully self-exclusive
// As in, an element does not contain itself
/* Sorting
	---------------------------------------------------------------------- */
// Document order sorting
return i!==j&&9===i.nodeType&&i.documentElement?(j=i,O=j.documentElement,I=!C(j),H!==j&&(n=j.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",xt,!1):n.attachEvent&&n.attachEvent("onunload",xt)),w.attributes=o(function(t){return t.className="i",!t.getAttribute("className")}),w.getElementsByTagName=o(function(t){return t.appendChild(j.createComment("")),!t.getElementsByTagName("*").length}),w.getElementsByClassName=dt.test(j.getElementsByClassName),w.getById=o(function(t){return O.appendChild(t).id=P,!j.getElementsByName||!j.getElementsByName(P).length}),w.getById?(x.filter.ID=function(t){var e=t.replace(mt,yt);return function(t){return t.getAttribute("id")===e}},x.find.ID=function(t,e){if(void 0!==e.getElementById&&I){var n=e.getElementById(t);return n?[n]:[]}}):(x.filter.ID=function(t){var e=t.replace(mt,yt);return function(t){var n=void 0!==t.getAttributeNode&&t.getAttributeNode("id");return n&&n.value===e}},x.find.ID=function(t,e){if(void 0!==e.getElementById&&I){var n,i,o,r=e.getElementById(t);if(r){if((
// Verify the id attribute
n=r.getAttributeNode("id"))&&n.value===t)return[r];for(
// Fall back on getElementsByName
o=e.getElementsByName(t),i=0;r=o[i++];)if((n=r.getAttributeNode("id"))&&n.value===t)return[r]}return[]}}),x.find.TAG=w.getElementsByTagName?function(t,e){return void 0!==e.getElementsByTagName?e.getElementsByTagName(t):w.qsa?e.querySelectorAll(t):void 0}:function(t,e){var n,i=[],o=0,
// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
r=e.getElementsByTagName(t);
// Filter out possible comments
if("*"===t){for(;n=r[o++];)1===n.nodeType&&i.push(n);return i}return r},x.find.CLASS=w.getElementsByClassName&&function(t,e){if(void 0!==e.getElementsByClassName&&I)return e.getElementsByClassName(t)},R=[],L=[],(w.qsa=dt.test(j.querySelectorAll))&&(o(function(t){
// Select is set to empty string on purpose
// This is to test IE's treatment of not explicitly
// setting a boolean content attribute,
// since its presence should be enough
// https://bugs.jquery.com/ticket/12359
O.appendChild(t).innerHTML="<a id='"+P+"'></a><select id='"+P+"-\r\\' msallowcapture=''><option selected=''></option></select>",
// Support: IE8, Opera 11-12.16
// Nothing should be selected when empty strings follow ^= or $= or *=
// The test attribute must be unknown in Opera but "safe" for WinRT
// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
t.querySelectorAll("[msallowcapture^='']").length&&L.push("[*^$]="+tt+"*(?:''|\"\")"),
// Support: IE8
// Boolean attributes and "value" are not treated correctly
t.querySelectorAll("[selected]").length||L.push("\\["+tt+"*(?:value|"+Z+")"),
// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
t.querySelectorAll("[id~="+P+"-]").length||L.push("~="),
// Webkit/Opera - :checked should return selected option elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
// IE8 throws error here and will not see later tests
t.querySelectorAll(":checked").length||L.push(":checked"),
// Support: Safari 8+, iOS 8+
// https://bugs.webkit.org/show_bug.cgi?id=136851
// In-page `selector#id sibling-combinator selector` fails
t.querySelectorAll("a#"+P+"+*").length||L.push(".#.+[+~]")}),o(function(t){t.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
// Support: Windows 8 Native Apps
// The type and name attributes are restricted during .innerHTML assignment
var e=j.createElement("input");e.setAttribute("type","hidden"),t.appendChild(e).setAttribute("name","D"),
// Support: IE8
// Enforce case-sensitivity of name attribute
t.querySelectorAll("[name=d]").length&&L.push("name"+tt+"*[*^$|!~]?="),
// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
// IE8 throws error here and will not see later tests
2!==t.querySelectorAll(":enabled").length&&L.push(":enabled",":disabled"),
// Support: IE9-11+
// IE's :disabled selector does not pick up the children of disabled fieldsets
O.appendChild(t).disabled=!0,2!==t.querySelectorAll(":disabled").length&&L.push(":enabled",":disabled"),
// Opera 10-11 does not throw on post-comma invalid pseudos
t.querySelectorAll("*,:x"),L.push(",.*:")})),(w.matchesSelector=dt.test(q=O.matches||O.webkitMatchesSelector||O.mozMatchesSelector||O.oMatchesSelector||O.msMatchesSelector))&&o(function(t){
// Check to see if it's possible to do matchesSelector
// on a disconnected node (IE 9)
w.disconnectedMatch=q.call(t,"*"),
// This should fail with an exception
// Gecko does not error, returns false instead
q.call(t,"[s!='']:x"),R.push("!=",it)}),L=L.length&&new RegExp(L.join("|")),R=R.length&&new RegExp(R.join("|")),e=dt.test(O.compareDocumentPosition),F=e||dt.test(O.contains)?function(t,e){var n=9===t.nodeType?t.documentElement:t,i=e&&e.parentNode;return t===i||!(!i||1!==i.nodeType||!(n.contains?n.contains(i):t.compareDocumentPosition&&16&t.compareDocumentPosition(i)))}:function(t,e){if(e)for(;e=e.parentNode;)if(e===t)return!0;return!1},z=e?function(t,e){
// Flag for duplicate removal
if(t===e)return D=!0,0;
// Sort on method existence if only one input has compareDocumentPosition
var n=!t.compareDocumentPosition-!e.compareDocumentPosition;
// Disconnected nodes
// Calculate position if both inputs belong to the same document
// Otherwise we know they are disconnected
// Choose the first element that is related to our preferred document
return n||(1&(n=(t.ownerDocument||t)===(e.ownerDocument||e)?t.compareDocumentPosition(e):1)||!w.sortDetached&&e.compareDocumentPosition(t)===n?t===j||t.ownerDocument===H&&F(H,t)?-1:e===j||e.ownerDocument===H&&F(H,e)?1:N?K(N,t)-K(N,e):0:4&n?-1:1)}:function(t,e){
// Exit early if the nodes are identical
if(t===e)return D=!0,0;var n,i=0,o=t.parentNode,r=e.parentNode,a=[t],l=[e];
// Parentless nodes are either documents or disconnected
if(!o||!r)return t===j?-1:e===j?1:o?-1:r?1:N?K(N,t)-K(N,e):0;if(o===r)return s(t,e);for(
// Otherwise we need full lists of their ancestors for comparison
n=t;n=n.parentNode;)a.unshift(n);for(n=e;n=n.parentNode;)l.unshift(n);
// Walk down the tree looking for a discrepancy
for(;a[i]===l[i];)i++;
// Do a sibling check if the nodes have a common ancestor
// Otherwise nodes in our document sort first
return i?s(a[i],l[i]):a[i]===H?-1:l[i]===H?1:0},j):j},e.matches=function(t,n){return e(t,null,null,n)},e.matchesSelector=function(t,n){if(
// Set document vars if needed
(t.ownerDocument||t)!==j&&A(t),
// Make sure that attribute selectors are quoted
n=n.replace(lt,"='$1']"),w.matchesSelector&&I&&!U[n+" "]&&(!R||!R.test(n))&&(!L||!L.test(n)))try{var i=q.call(t,n);
// IE 9's matchesSelector returns false on disconnected nodes
if(i||w.disconnectedMatch||
// As well, disconnected nodes are said to be in a document
// fragment in IE 9
t.document&&11!==t.document.nodeType)return i}catch(t){}return e(n,j,null,[t]).length>0},e.contains=function(t,e){
// Set document vars if needed
return(t.ownerDocument||t)!==j&&A(t),F(t,e)},e.attr=function(t,e){
// Set document vars if needed
(t.ownerDocument||t)!==j&&A(t);var n=x.attrHandle[e.toLowerCase()],
// Don't get fooled by Object.prototype properties (jQuery #13807)
i=n&&V.call(x.attrHandle,e.toLowerCase())?n(t,e,!I):void 0;return void 0!==i?i:w.attributes||!I?t.getAttribute(e):(i=t.getAttributeNode(e))&&i.specified?i.value:null},e.escape=function(t){return(t+"").replace(bt,wt)},e.error=function(t){throw new Error("Syntax error, unrecognized expression: "+t)},/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
e.uniqueSort=function(t){var e,n=[],i=0,o=0;if(
// Unless we *know* we can detect duplicates, assume their presence
D=!w.detectDuplicates,N=!w.sortStable&&t.slice(0),t.sort(z),D){for(;e=t[o++];)e===t[o]&&(i=n.push(o));for(;i--;)t.splice(n[i],1)}
// Clear input after sorting to release objects
// See https://github.com/jquery/sizzle/pull/225
return N=null,t},/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
T=e.getText=function(t){var e,n="",i=0,o=t.nodeType;if(o){if(1===o||9===o||11===o){
// Use textContent for elements
// innerText usage removed for consistency of new lines (jQuery #11153)
if("string"==typeof t.textContent)return t.textContent;
// Traverse its children
for(t=t.firstChild;t;t=t.nextSibling)n+=T(t)}else if(3===o||4===o)return t.nodeValue}else
// If no nodeType, this is expected to be an array
for(;e=t[i++];)
// Do not traverse comment nodes
n+=T(e);
// Do not include comment or processing instruction nodes
return n},(x=e.selectors={
// Can be adjusted by the user
cacheLength:50,createPseudo:i,match:ft,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(t){
// Move the given value to match[3] whether quoted or unquoted
return t[1]=t[1].replace(mt,yt),t[3]=(t[3]||t[4]||t[5]||"").replace(mt,yt),"~="===t[2]&&(t[3]=" "+t[3]+" "),t.slice(0,4)},CHILD:function(t){/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
// nth-* requires argument
// numeric x and y parameters for Expr.filter.CHILD
// remember that false/true cast respectively to 0/1
return t[1]=t[1].toLowerCase(),"nth"===t[1].slice(0,3)?(t[3]||e.error(t[0]),t[4]=+(t[4]?t[5]+(t[6]||1):2*("even"===t[3]||"odd"===t[3])),t[5]=+(t[7]+t[8]||"odd"===t[3])):t[3]&&e.error(t[0]),t},PSEUDO:function(t){var e,n=!t[6]&&t[2];
// Accept quoted arguments as-is
// Get excess from tokenize (recursively)
// advance to the next closing parenthesis
// excess is a negative index
return ft.CHILD.test(t[0])?null:(t[3]?t[2]=t[4]||t[5]||"":n&&ut.test(n)&&(e=E(n,!0))&&(e=n.indexOf(")",n.length-e)-n.length)&&(t[0]=t[0].slice(0,e),t[2]=n.slice(0,e)),t.slice(0,3))}},filter:{TAG:function(t){var e=t.replace(mt,yt).toLowerCase();return"*"===t?function(){return!0}:function(t){return t.nodeName&&t.nodeName.toLowerCase()===e}},CLASS:function(t){var e=M[t+" "];return e||(e=new RegExp("(^|"+tt+")"+t+"("+tt+"|$)"))&&M(t,function(t){return e.test("string"==typeof t.className&&t.className||void 0!==t.getAttribute&&t.getAttribute("class")||"")})},ATTR:function(t,n,i){return function(o){var r=e.attr(o,t);return null==r?"!="===n:!n||(r+="","="===n?r===i:"!="===n?r!==i:"^="===n?i&&0===r.indexOf(i):"*="===n?i&&r.indexOf(i)>-1:"$="===n?i&&r.slice(-i.length)===i:"~="===n?(" "+r.replace(ot," ")+" ").indexOf(i)>-1:"|="===n&&(r===i||r.slice(0,i.length+1)===i+"-"))}},CHILD:function(t,e,n,i,o){var r="nth"!==t.slice(0,3),s="last"!==t.slice(-4),a="of-type"===e;
// Shortcut for :nth-*(n)
return 1===i&&0===o?function(t){return!!t.parentNode}:function(e,n,l){var u,c,f,p,h,d,g=r!==s?"nextSibling":"previousSibling",v=e.parentNode,m=a&&e.nodeName.toLowerCase(),y=!l&&!a,b=!1;if(v){
// :(first|last|only)-(child|of-type)
if(r){for(;g;){for(p=e;p=p[g];)if(a?p.nodeName.toLowerCase()===m:1===p.nodeType)return!1;
// Reverse direction for :only-* (if we haven't yet done so)
d=g="only"===t&&!d&&"nextSibling"}return!0}
// non-xml :nth-child(...) stores cache data on `parent`
if(d=[s?v.firstChild:v.lastChild],s&&y){for(
// Seek `elem` from a previously-cached index
// ...in a gzip-friendly way
b=(h=(u=(
// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
c=(f=(p=v)[P]||(p[P]={}))[p.uniqueID]||(f[p.uniqueID]={}))[t]||[])[0]===_&&u[1])&&u[2],p=h&&v.childNodes[h];p=++h&&p&&p[g]||(
// Fallback to seeking `elem` from the start
b=h=0)||d.pop();)
// When found, cache indexes on `parent` and break
if(1===p.nodeType&&++b&&p===e){c[t]=[_,h,b];break}}else
// xml :nth-child(...)
// or :nth-last-child(...) or :nth(-last)?-of-type(...)
if(
// Use previously-cached element index if available
y&&(b=h=(u=(
// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
c=(f=(
// ...in a gzip-friendly way
p=e)[P]||(p[P]={}))[p.uniqueID]||(f[p.uniqueID]={}))[t]||[])[0]===_&&u[1]),!1===b)
// Use the same loop as above to seek `elem` from the start
for(;(p=++h&&p&&p[g]||(b=h=0)||d.pop())&&((a?p.nodeName.toLowerCase()!==m:1!==p.nodeType)||!++b||(
// Cache the index of each encountered element
y&&((
// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
c=(f=p[P]||(p[P]={}))[p.uniqueID]||(f[p.uniqueID]={}))[t]=[_,b]),p!==e)););
// Incorporate the offset, then check against cycle size
return(b-=o)===i||b%i==0&&b/i>=0}}},PSEUDO:function(t,n){
// pseudo-class names are case-insensitive
// http://www.w3.org/TR/selectors/#pseudo-classes
// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
// Remember that setFilters inherits from pseudos
var o,r=x.pseudos[t]||x.setFilters[t.toLowerCase()]||e.error("unsupported pseudo: "+t);
// The user may use createPseudo to indicate that
// arguments are needed to create the filter function
// just as Sizzle does
// The user may use createPseudo to indicate that
// arguments are needed to create the filter function
// just as Sizzle does
// But maintain support for old signatures
return r[P]?r(n):r.length>1?(o=[t,t,"",n],x.setFilters.hasOwnProperty(t.toLowerCase())?i(function(t,e){for(var i,o=r(t,n),s=o.length;s--;)t[i=K(t,o[s])]=!(e[i]=o[s])}):function(t){return r(t,0,o)}):r}},pseudos:{
// Potentially complex pseudos
not:i(function(t){
// Trim the selector passed to compile
// to avoid treating leading and trailing
// spaces as combinators
var e=[],n=[],o=S(t.replace(rt,"$1"));return o[P]?i(function(t,e,n,i){
// Match elements unmatched by `matcher`
for(var r,s=o(t,null,i,[]),a=t.length;a--;)(r=s[a])&&(t[a]=!(e[a]=r))}):function(t,i,r){
// Don't keep the element (issue #299)
return e[0]=t,o(e,null,r,n),e[0]=null,!n.pop()}}),has:i(function(t){return function(n){return e(t,n).length>0}}),contains:i(function(t){return t=t.replace(mt,yt),function(e){return(e.textContent||e.innerText||T(e)).indexOf(t)>-1}}),
// "Whether an element is represented by a :lang() selector
// is based solely on the element's language value
// being equal to the identifier C,
// or beginning with the identifier C immediately followed by "-".
// The matching of C against the element's language value is performed case-insensitively.
// The identifier C does not have to be a valid language name."
// http://www.w3.org/TR/selectors/#lang-pseudo
lang:i(function(t){
// lang value must be a valid identifier
return ct.test(t||"")||e.error("unsupported lang: "+t),t=t.replace(mt,yt).toLowerCase(),function(e){var n;do{if(n=I?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(n=n.toLowerCase())===t||0===n.indexOf(t+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),
// Miscellaneous
target:function(e){var n=t.location&&t.location.hash;return n&&n.slice(1)===e.id},root:function(t){return t===O},focus:function(t){return t===j.activeElement&&(!j.hasFocus||j.hasFocus())&&!!(t.type||t.href||~t.tabIndex)},
// Boolean properties
enabled:a(!1),disabled:a(!0),checked:function(t){
// In CSS3, :checked should return both checked and selected elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
var e=t.nodeName.toLowerCase();return"input"===e&&!!t.checked||"option"===e&&!!t.selected},selected:function(t){
// Accessing this property makes selected-by-default
// options in Safari work properly
return t.parentNode&&t.parentNode.selectedIndex,!0===t.selected},
// Contents
empty:function(t){
// http://www.w3.org/TR/selectors/#empty-pseudo
// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
//   but not by others (comment: 8; processing instruction: 7; etc.)
// nodeType < 6 works because attributes (2) do not appear as children
for(t=t.firstChild;t;t=t.nextSibling)if(t.nodeType<6)return!1;return!0},parent:function(t){return!x.pseudos.empty(t)},
// Element/input types
header:function(t){return ht.test(t.nodeName)},input:function(t){return pt.test(t.nodeName)},button:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&"button"===t.type||"button"===e},text:function(t){var e;
// Support: IE<8
// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
return"input"===t.nodeName.toLowerCase()&&"text"===t.type&&(null==(e=t.getAttribute("type"))||"text"===e.toLowerCase())},
// Position-in-collection
first:l(function(){return[0]}),last:l(function(t,e){return[e-1]}),eq:l(function(t,e,n){return[n<0?n+e:n]}),even:l(function(t,e){for(var n=0;n<e;n+=2)t.push(n);return t}),odd:l(function(t,e){for(var n=1;n<e;n+=2)t.push(n);return t}),lt:l(function(t,e,n){for(var i=n<0?n+e:n;--i>=0;)t.push(i);return t}),gt:l(function(t,e,n){for(var i=n<0?n+e:n;++i<e;)t.push(i);return t})}}).pseudos.nth=x.pseudos.eq;
// Add button/input type pseudos
for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})x.pseudos[b]=/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}(b);for(b in{submit:!0,reset:!0})x.pseudos[b]=/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function(t){return function(e){var n=e.nodeName.toLowerCase();return("input"===n||"button"===n)&&e.type===t}}(b);/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
// One-time assignments
// Sort stability
// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
// Initialize against the default document
// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
// Support: IE<9
// Use defaultValue in place of getAttribute("value")
// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
return c.prototype=x.filters=x.pseudos,x.setFilters=new c,E=e.tokenize=function(t,n){var i,o,r,s,a,l,u,c=B[t+" "];if(c)return n?0:c.slice(0);for(a=t,l=[],u=x.preFilter;a;){
// Comma and first run
i&&!(o=st.exec(a))||(o&&(
// Don't consume trailing commas as valid
a=a.slice(o[0].length)||a),l.push(r=[])),i=!1,
// Combinators
(o=at.exec(a))&&(i=o.shift(),r.push({value:i,
// Cast descendant combinators to space
type:o[0].replace(rt," ")}),a=a.slice(i.length));
// Filters
for(s in x.filter)!(o=ft[s].exec(a))||u[s]&&!(o=u[s](o))||(i=o.shift(),r.push({value:i,type:s,matches:o}),a=a.slice(i.length));if(!i)break}
// Return the length of the invalid excess
// if we're just parsing
// Otherwise, throw an error or return tokens
// Cache the tokens
return n?a.length:a?e.error(t):B(t,l).slice(0)},S=e.compile=function(t,e){var n,i=[],o=[],r=U[t+" "];if(!r){for(
// Generate a function of recursive functions that can be used to check each element
e||(e=E(t)),n=e.length;n--;)(r=m(e[n]))[P]?i.push(r):o.push(r);
// Save selector and tokenization
(
// Cache the compiled function
r=U(t,y(o,i))).selector=t}return r},k=e.select=function(t,e,n,i){var o,r,s,a,l,c="function"==typeof t&&t,p=!i&&E(t=c.selector||t);
// Try to minimize operations if there is only one selector in the list and no seed
// (the latter of which guarantees us context)
if(n=n||[],1===p.length){if((
// Reduce context if the leading compound selector is an ID
r=p[0]=p[0].slice(0)).length>2&&"ID"===(s=r[0]).type&&9===e.nodeType&&I&&x.relative[r[1].type]){if(!(e=(x.find.ID(s.matches[0].replace(mt,yt),e)||[])[0]))return n;c&&(e=e.parentNode),t=t.slice(r.shift().value.length)}for(
// Fetch a seed set for right-to-left matching
o=ft.needsContext.test(t)?0:r.length;o--&&(s=r[o],!x.relative[a=s.type]);)if((l=x.find[a])&&(i=l(s.matches[0].replace(mt,yt),vt.test(r[0].type)&&u(e.parentNode)||e))){if(
// If seed is empty or no tokens remain, we can return early
r.splice(o,1),!(t=i.length&&f(r)))return Y.apply(n,i),n;break}}
// Compile and execute a filtering function if one is not provided
// Provide `match` to avoid retokenization if we modified the selector above
return(c||S(t,p))(i,e,!I,n,!e||vt.test(t)&&u(e.parentNode)||e),n},w.sortStable=P.split("").sort(z).join("")===P,w.detectDuplicates=!!D,A(),w.sortDetached=o(function(t){
// Should return 1, but returns 4 (following)
return 1&t.compareDocumentPosition(j.createElement("fieldset"))}),o(function(t){return t.innerHTML="<a href='#'></a>","#"===t.firstChild.getAttribute("href")})||r("type|href|height|width",function(t,e,n){if(!n)return t.getAttribute(e,"type"===e.toLowerCase()?1:2)}),w.attributes&&o(function(t){return t.innerHTML="<input/>",t.firstChild.setAttribute("value",""),""===t.firstChild.getAttribute("value")})||r("value",function(t,e,n){if(!n&&"input"===t.nodeName.toLowerCase())return t.defaultValue}),o(function(t){return null==t.getAttribute("disabled")})||r(Z,function(t,e,n){var i;if(!n)return!0===t[e]?e.toLowerCase():(i=t.getAttributeNode(e))&&i.specified?i.value:null}),e}(t);dt.find=bt,dt.expr=bt.selectors,
// Deprecated
dt.expr[":"]=dt.expr.pseudos,dt.uniqueSort=dt.unique=bt.uniqueSort,dt.text=bt.getText,dt.isXMLDoc=bt.isXML,dt.contains=bt.contains,dt.escapeSelector=bt.escape;var wt=function(t,e,n){for(var i=[],o=void 0!==n;(t=t[e])&&9!==t.nodeType;)if(1===t.nodeType){if(o&&dt(t).is(n))break;i.push(t)}return i},xt=function(t,e){for(var n=[];t;t=t.nextSibling)1===t.nodeType&&t!==e&&n.push(t);return n},Tt=dt.expr.match.needsContext,Ct=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,Et=/^.[^:#\[\.,]*$/;dt.filter=function(t,e,n){var i=e[0];return n&&(t=":not("+t+")"),1===e.length&&1===i.nodeType?dt.find.matchesSelector(i,t)?[i]:[]:dt.find.matches(t,dt.grep(e,function(t){return 1===t.nodeType}))},dt.fn.extend({find:function(t){var e,n,i=this.length,o=this;if("string"!=typeof t)return this.pushStack(dt(t).filter(function(){for(e=0;e<i;e++)if(dt.contains(o[e],this))return!0}));for(n=this.pushStack([]),e=0;e<i;e++)dt.find(t,o[e],n);return i>1?dt.uniqueSort(n):n},filter:function(t){return this.pushStack(s(this,t||[],!1))},not:function(t){return this.pushStack(s(this,t||[],!0))},is:function(t){
// If this is a positional/relative selector, check membership in the returned set
// so $("p:first").is("p:last") won't return true for a doc with two "p".
return!!s(this,"string"==typeof t&&Tt.test(t)?dt(t):t||[],!1).length}});
// Initialize a jQuery object
// A central reference to the root jQuery(document)
var St,
// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
// Shortcut simple #id case for speed
kt=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
// Give the init function the jQuery prototype for later instantiation
(dt.fn.init=function(t,e,n){var i,o;
// HANDLE: $(""), $(null), $(undefined), $(false)
if(!t)return this;
// Handle HTML strings
if(
// Method init() accepts an alternate rootjQuery
// so migrate can support jQuery.sub (gh-2101)
n=n||St,"string"==typeof t){
// Match html or make sure no context is specified for #id
if(!(
// Assume that strings that start and end with <> are HTML and skip the regex check
i="<"===t[0]&&">"===t[t.length-1]&&t.length>=3?[null,t,null]:kt.exec(t))||!i[1]&&e)return!e||e.jquery?(e||n).find(t):this.constructor(e).find(t);
// HANDLE: $(html) -> $(array)
if(i[1]){
// HANDLE: $(html, props)
if(e=e instanceof dt?e[0]:e,
// Option to run scripts is true for back-compat
// Intentionally let the error be thrown if parseHTML is not present
dt.merge(this,dt.parseHTML(i[1],e&&e.nodeType?e.ownerDocument||e:nt,!0)),Ct.test(i[1])&&dt.isPlainObject(e))for(i in e)
// Properties of context are called as methods if possible
dt.isFunction(this[i])?this[i](e[i]):this.attr(i,e[i]);return this}
// Inject the element directly into the jQuery object
return(o=nt.getElementById(i[2]))&&(this[0]=o,this.length=1),this}
// Execute immediately if ready is not present
return t.nodeType?(this[0]=t,this.length=1,this):dt.isFunction(t)?void 0!==n.ready?n.ready(t):t(dt):dt.makeArray(t,this)}).prototype=dt.fn,
// Initialize central reference
St=dt(nt);var $t=/^(?:parents|prev(?:Until|All))/,
// Methods guaranteed to produce a unique set when starting from a unique set
Nt={children:!0,contents:!0,next:!0,prev:!0};dt.fn.extend({has:function(t){var e=dt(t,this),n=e.length;return this.filter(function(){for(var t=0;t<n;t++)if(dt.contains(this,e[t]))return!0})},closest:function(t,e){var n,i=0,o=this.length,r=[],s="string"!=typeof t&&dt(t);
// Positional selectors never match, since there's no _selection_ context
if(!Tt.test(t))for(;i<o;i++)for(n=this[i];n&&n!==e;n=n.parentNode)
// Always skip document fragments
if(n.nodeType<11&&(s?s.index(n)>-1:
// Don't pass non-elements to Sizzle
1===n.nodeType&&dt.find.matchesSelector(n,t))){r.push(n);break}return this.pushStack(r.length>1?dt.uniqueSort(r):r)},
// Determine the position of an element within the set
index:function(t){
// No argument, return index in parent
// No argument, return index in parent
// Index in selector
// If it receives a jQuery object, the first element is used
return t?"string"==typeof t?at.call(dt(t),this[0]):at.call(this,t.jquery?t[0]:t):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(t,e){return this.pushStack(dt.uniqueSort(dt.merge(this.get(),dt(t,e))))},addBack:function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}}),dt.each({parent:function(t){var e=t.parentNode;return e&&11!==e.nodeType?e:null},parents:function(t){return wt(t,"parentNode")},parentsUntil:function(t,e,n){return wt(t,"parentNode",n)},next:function(t){return a(t,"nextSibling")},prev:function(t){return a(t,"previousSibling")},nextAll:function(t){return wt(t,"nextSibling")},prevAll:function(t){return wt(t,"previousSibling")},nextUntil:function(t,e,n){return wt(t,"nextSibling",n)},prevUntil:function(t,e,n){return wt(t,"previousSibling",n)},siblings:function(t){return xt((t.parentNode||{}).firstChild,t)},children:function(t){return xt(t.firstChild)},contents:function(t){
// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
// Treat the template element as a regular one in browsers that
// don't support it.
return r(t,"iframe")?t.contentDocument:(r(t,"template")&&(t=t.content||t),dt.merge([],t.childNodes))}},function(t,e){dt.fn[t]=function(n,i){var o=dt.map(this,e,n);
// Remove duplicates
// Reverse order for parents* and prev-derivatives
return"Until"!==t.slice(-5)&&(i=n),i&&"string"==typeof i&&(o=dt.filter(i,o)),this.length>1&&(Nt[t]||dt.uniqueSort(o),$t.test(t)&&o.reverse()),this.pushStack(o)}});var Dt=/[^\x20\t\r\n\f]+/g;/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
dt.Callbacks=function(t){
// Convert options from String-formatted to Object-formatted if needed
// (we check in cache first)
t="string"==typeof t?l(t):dt.extend({},t);var// Flag to know if list is currently firing
e,
// Last fire value for non-forgettable lists
n,
// Flag to know if list was already fired
i,
// Flag to prevent firing
o,
// Actual callback list
r=[],
// Queue of execution data for repeatable lists
s=[],
// Index of currently firing callback (modified by add/remove as needed)
a=-1,
// Fire callbacks
u=function(){for(
// Enforce single-firing
o=o||t.once,
// Execute callbacks for all pending executions,
// respecting firingIndex overrides and runtime changes
i=e=!0;s.length;a=-1)for(n=s.shift();++a<r.length;)
// Run callback and check for early termination
!1===r[a].apply(n[0],n[1])&&t.stopOnFalse&&(
// Jump to end and forget the data so .add doesn't re-fire
a=r.length,n=!1);
// Forget the data if we're done with it
t.memory||(n=!1),e=!1,
// Clean up if we're done firing for good
o&&(
// Keep an empty list if we have data for future add calls
r=n?[]:"")},
// Actual Callbacks object
c={
// Add a callback or a collection of callbacks to the list
add:function(){
// If we have memory from a past run, we should fire after adding
return r&&(n&&!e&&(a=r.length-1,s.push(n)),function e(n){dt.each(n,function(n,i){dt.isFunction(i)?t.unique&&c.has(i)||r.push(i):i&&i.length&&"string"!==dt.type(i)&&
// Inspect recursively
e(i)})}(arguments),n&&!e&&u()),this},
// Remove a callback from the list
remove:function(){return dt.each(arguments,function(t,e){for(var n;(n=dt.inArray(e,r,n))>-1;)r.splice(n,1),
// Handle firing indexes
n<=a&&a--}),this},
// Check if a given callback is in the list.
// If no argument is given, return whether or not list has callbacks attached.
has:function(t){return t?dt.inArray(t,r)>-1:r.length>0},
// Remove all callbacks from the list
empty:function(){return r&&(r=[]),this},
// Disable .fire and .add
// Abort any current/pending executions
// Clear all callbacks and values
disable:function(){return o=s=[],r=n="",this},disabled:function(){return!r},
// Disable .fire
// Also disable .add unless we have memory (since it would have no effect)
// Abort any pending executions
lock:function(){return o=s=[],n||e||(r=n=""),this},locked:function(){return!!o},
// Call all callbacks with the given context and arguments
fireWith:function(t,n){return o||(n=[t,(n=n||[]).slice?n.slice():n],s.push(n),e||u()),this},
// Call all the callbacks with the given arguments
fire:function(){return c.fireWith(this,arguments),this},
// To know if the callbacks have already been called at least once
fired:function(){return!!i}};return c},dt.extend({Deferred:function(e){var n=[
// action, add listener, callbacks,
// ... .then handlers, argument index, [final state]
["notify","progress",dt.Callbacks("memory"),dt.Callbacks("memory"),2],["resolve","done",dt.Callbacks("once memory"),dt.Callbacks("once memory"),0,"resolved"],["reject","fail",dt.Callbacks("once memory"),dt.Callbacks("once memory"),1,"rejected"]],i="pending",o={state:function(){return i},always:function(){return r.done(arguments).fail(arguments),this},catch:function(t){return o.then(null,t)},
// Keep pipe for back-compat
pipe:function(){var t=arguments;return dt.Deferred(function(e){dt.each(n,function(n,i){
// Map tuples (progress, done, fail) to arguments (done, fail, progress)
var o=dt.isFunction(t[i[4]])&&t[i[4]];
// deferred.progress(function() { bind to newDefer or newDefer.notify })
// deferred.done(function() { bind to newDefer or newDefer.resolve })
// deferred.fail(function() { bind to newDefer or newDefer.reject })
r[i[1]](function(){var t=o&&o.apply(this,arguments);t&&dt.isFunction(t.promise)?t.promise().progress(e.notify).done(e.resolve).fail(e.reject):e[i[0]+"With"](this,o?[t]:arguments)})}),t=null}).promise()},then:function(e,i,o){function r(e,n,i,o){return function(){var a=this,l=arguments,f=function(){var t,f;
// Support: Promises/A+ section 2.3.3.3.3
// https://promisesaplus.com/#point-59
// Ignore double-resolution attempts
if(!(e<s)){
// Support: Promises/A+ section 2.3.1
// https://promisesaplus.com/#point-48
if((t=i.apply(a,l))===n.promise())throw new TypeError("Thenable self-resolution");
// Support: Promises/A+ sections 2.3.3.1, 3.5
// https://promisesaplus.com/#point-54
// https://promisesaplus.com/#point-75
// Retrieve `then` only once
f=t&&(
// Support: Promises/A+ section 2.3.4
// https://promisesaplus.com/#point-64
// Only check objects and functions for thenability
"object"==typeof t||"function"==typeof t)&&t.then,
// Handle a returned thenable
dt.isFunction(f)?
// Special processors (notify) just wait for resolution
o?f.call(t,r(s,n,u,o),r(s,n,c,o)):(
// ...and disregard older resolution values
s++,f.call(t,r(s,n,u,o),r(s,n,c,o),r(s,n,u,n.notifyWith))):(
// Only substitute handlers pass on context
// and multiple values (non-spec behavior)
i!==u&&(a=void 0,l=[t]),
// Process the value(s)
// Default process is resolve
(o||n.resolveWith)(a,l))}},
// Only normal processors (resolve) catch and reject exceptions
p=o?f:function(){try{f()}catch(t){dt.Deferred.exceptionHook&&dt.Deferred.exceptionHook(t,p.stackTrace),
// Support: Promises/A+ section 2.3.3.3.4.1
// https://promisesaplus.com/#point-61
// Ignore post-resolution exceptions
e+1>=s&&(
// Only substitute handlers pass on context
// and multiple values (non-spec behavior)
i!==c&&(a=void 0,l=[t]),n.rejectWith(a,l))}};
// Support: Promises/A+ section 2.3.3.3.1
// https://promisesaplus.com/#point-57
// Re-resolve promises immediately to dodge false rejection from
// subsequent errors
e?p():(
// Call an optional hook to record the stack, in case of exception
// since it's otherwise lost when execution goes async
dt.Deferred.getStackHook&&(p.stackTrace=dt.Deferred.getStackHook()),t.setTimeout(p))}}var s=0;return dt.Deferred(function(t){
// progress_handlers.add( ... )
n[0][3].add(r(0,t,dt.isFunction(o)?o:u,t.notifyWith)),
// fulfilled_handlers.add( ... )
n[1][3].add(r(0,t,dt.isFunction(e)?e:u)),
// rejected_handlers.add( ... )
n[2][3].add(r(0,t,dt.isFunction(i)?i:c))}).promise()},
// Get a promise for this deferred
// If obj is provided, the promise aspect is added to the object
promise:function(t){return null!=t?dt.extend(t,o):o}},r={};
// All done!
// Add list-specific methods
// Make the deferred a promise
// Call given func if any
return dt.each(n,function(t,e){var s=e[2],a=e[5];
// promise.progress = list.add
// promise.done = list.add
// promise.fail = list.add
o[e[1]]=s.add,
// Handle state
a&&s.add(function(){
// state = "resolved" (i.e., fulfilled)
// state = "rejected"
i=a},
// rejected_callbacks.disable
// fulfilled_callbacks.disable
n[3-t][2].disable,
// progress_callbacks.lock
n[0][2].lock),
// progress_handlers.fire
// fulfilled_handlers.fire
// rejected_handlers.fire
s.add(e[3].fire),
// deferred.notify = function() { deferred.notifyWith(...) }
// deferred.resolve = function() { deferred.resolveWith(...) }
// deferred.reject = function() { deferred.rejectWith(...) }
r[e[0]]=function(){return r[e[0]+"With"](this===r?void 0:this,arguments),this},
// deferred.notifyWith = list.fireWith
// deferred.resolveWith = list.fireWith
// deferred.rejectWith = list.fireWith
r[e[0]+"With"]=s.fireWith}),o.promise(r),e&&e.call(r,r),r},
// Deferred helper
when:function(t){var
// count of uncompleted subordinates
e=arguments.length,
// count of unprocessed arguments
n=e,
// subordinate fulfillment data
i=Array(n),o=ot.call(arguments),
// the master Deferred
r=dt.Deferred(),
// subordinate callback factory
s=function(t){return function(n){i[t]=this,o[t]=arguments.length>1?ot.call(arguments):n,--e||r.resolveWith(i,o)}};
// Single- and empty arguments are adopted like Promise.resolve
if(e<=1&&(f(t,r.done(s(n)).resolve,r.reject,!e),"pending"===r.state()||dt.isFunction(o[n]&&o[n].then)))return r.then();
// Multiple arguments are aggregated like Promise.all array elements
for(;n--;)f(o[n],s(n),r.reject);return r.promise()}});
// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var At=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;dt.Deferred.exceptionHook=function(e,n){t.console&&t.console.warn&&e&&At.test(e.name)},dt.readyException=function(e){t.setTimeout(function(){throw e})};
// The deferred used on DOM ready
var jt=dt.Deferred();dt.fn.ready=function(t){return jt.then(t).catch(function(t){dt.readyException(t)}),this},dt.extend({
// Is the DOM ready to be used? Set to true once it occurs.
isReady:!1,
// A counter to track how many items to wait for before
// the ready event fires. See #6781
readyWait:1,
// Handle when the DOM is ready
ready:function(t){
// Abort if there are pending holds or we're already ready
(!0===t?--dt.readyWait:dt.isReady)||(
// Remember that the DOM is ready
dt.isReady=!0,
// If a normal DOM Ready event fired, decrement, and wait if need be
!0!==t&&--dt.readyWait>0||
// If there are functions bound, to execute
jt.resolveWith(nt,[dt]))}}),dt.ready.then=jt.then,
// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
"complete"===nt.readyState||"loading"!==nt.readyState&&!nt.documentElement.doScroll?
// Handle it asynchronously to allow scripts the opportunity to delay ready
t.setTimeout(dt.ready):(
// Use the handy event callback
nt.addEventListener("DOMContentLoaded",p),
// A fallback to window.onload, that will always work
t.addEventListener("load",p));
// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var Ot=function(t,e,n,i,o,r,s){var a=0,l=t.length,u=null==n;
// Sets many values
if("object"===dt.type(n)){o=!0;for(a in n)Ot(t,e,a,n[a],!0,r,s)}else if(void 0!==i&&(o=!0,dt.isFunction(i)||(s=!0),u&&(
// Bulk operations run against the entire set
s?(e.call(t,i),e=null):(u=e,e=function(t,e,n){return u.call(dt(t),n)})),e))for(;a<l;a++)e(t[a],n,s?i:i.call(t[a],a,e(t[a],n)));
// Gets
return o?t:u?e.call(t):l?e(t[0],n):r},It=function(t){
// Accepts only:
//  - Node
//    - Node.ELEMENT_NODE
//    - Node.DOCUMENT_NODE
//  - Object
//    - Any
return 1===t.nodeType||9===t.nodeType||!+t.nodeType};h.uid=1,h.prototype={cache:function(t){
// Check if the owner object already has a cache
var e=t[this.expando];
// If not, create one
// We can accept data for non-element nodes in modern browsers,
// but we should not, see #8335.
// Always return an empty object.
// If it is a node unlikely to be stringify-ed or looped over
// use plain assignment
return e||(e={},It(t)&&(t.nodeType?t[this.expando]=e:Object.defineProperty(t,this.expando,{value:e,configurable:!0}))),e},set:function(t,e,n){var i,o=this.cache(t);
// Handle: [ owner, key, value ] args
// Always use camelCase key (gh-2257)
if("string"==typeof e)o[dt.camelCase(e)]=n;else
// Copy the properties one-by-one to the cache object
for(i in e)o[dt.camelCase(i)]=e[i];return o},get:function(t,e){
// Always use camelCase key (gh-2257)
return void 0===e?this.cache(t):t[this.expando]&&t[this.expando][dt.camelCase(e)]},access:function(t,e,n){
// In cases where either:
//
//   1. No key was specified
//   2. A string key was specified, but no value provided
//
// Take the "read" path and allow the get method to determine
// which value to return, respectively either:
//
//   1. The entire cache object
//   2. The data stored at the key
//
// In cases where either:
//
//   1. No key was specified
//   2. A string key was specified, but no value provided
//
// Take the "read" path and allow the get method to determine
// which value to return, respectively either:
//
//   1. The entire cache object
//   2. The data stored at the key
//
// When the key is not a string, or both a key and value
// are specified, set or extend (existing objects) with either:
//
//   1. An object of properties
//   2. A key and value
//
return void 0===e||e&&"string"==typeof e&&void 0===n?this.get(t,e):(this.set(t,e,n),void 0!==n?n:e)},remove:function(t,e){var n,i=t[this.expando];if(void 0!==i){if(void 0!==e){n=(
// Support array or space separated string of keys
// If key is an array of keys...
// We always set camelCase keys, so remove that.
e=Array.isArray(e)?e.map(dt.camelCase):(e=dt.camelCase(e))in i?[e]:e.match(Dt)||[]).length;for(;n--;)delete i[e[n]]}
// Remove the expando if there's no more data
(void 0===e||dt.isEmptyObject(i))&&(
// Support: Chrome <=35 - 45
// Webkit & Blink performance suffers when deleting properties
// from DOM nodes, so set to undefined instead
// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
t.nodeType?t[this.expando]=void 0:delete t[this.expando])}},hasData:function(t){var e=t[this.expando];return void 0!==e&&!dt.isEmptyObject(e)}};var Lt=new h,Rt=new h,qt=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Ft=/[A-Z]/g;dt.extend({hasData:function(t){return Rt.hasData(t)||Lt.hasData(t)},data:function(t,e,n){return Rt.access(t,e,n)},removeData:function(t,e){Rt.remove(t,e)},
// TODO: Now that all calls to _data and _removeData have been replaced
// with direct calls to dataPriv methods, these can be deprecated.
_data:function(t,e,n){return Lt.access(t,e,n)},_removeData:function(t,e){Lt.remove(t,e)}}),dt.fn.extend({data:function(t,e){var n,i,o,r=this[0],s=r&&r.attributes;
// Gets all values
if(void 0===t){if(this.length&&(o=Rt.get(r),1===r.nodeType&&!Lt.get(r,"hasDataAttrs"))){for(n=s.length;n--;)
// Support: IE 11 only
// The attrs elements can be null (#14894)
s[n]&&0===(i=s[n].name).indexOf("data-")&&(i=dt.camelCase(i.slice(5)),g(r,i,o[i]));Lt.set(r,"hasDataAttrs",!0)}return o}
// Sets multiple values
// Sets multiple values
return"object"==typeof t?this.each(function(){Rt.set(this,t)}):Ot(this,function(e){var n;
// The calling jQuery object (element matches) is not empty
// (and therefore has an element appears at this[ 0 ]) and the
// `value` parameter was not undefined. An empty jQuery object
// will result in `undefined` for elem = this[ 0 ] which will
// throw an exception if an attempt to read a data cache is made.
if(r&&void 0===e){if(void 0!==(
// Attempt to get data from the cache
// The key will always be camelCased in Data
n=Rt.get(r,t)))return n;if(void 0!==(
// Attempt to "discover" the data in
// HTML5 custom data-* attrs
n=g(r,t)))return n}else
// Set the data...
this.each(function(){
// We always store the camelCased key
Rt.set(this,t,e)})},null,e,arguments.length>1,null,!0)},removeData:function(t){return this.each(function(){Rt.remove(this,t)})}}),dt.extend({queue:function(t,e,n){var i;if(t)
// Speed up dequeue by getting out quickly if this is just a lookup
return e=(e||"fx")+"queue",i=Lt.get(t,e),n&&(!i||Array.isArray(n)?i=Lt.access(t,e,dt.makeArray(n)):i.push(n)),i||[]},dequeue:function(t,e){e=e||"fx";var n=dt.queue(t,e),i=n.length,o=n.shift(),r=dt._queueHooks(t,e);
// If the fx queue is dequeued, always remove the progress sentinel
"inprogress"===o&&(o=n.shift(),i--),o&&(
// Add a progress sentinel to prevent the fx queue from being
// automatically dequeued
"fx"===e&&n.unshift("inprogress"),
// Clear up the last queue stop function
delete r.stop,o.call(t,function(){dt.dequeue(t,e)},r)),!i&&r&&r.empty.fire()},
// Not public - generate a queueHooks object, or return the current one
_queueHooks:function(t,e){var n=e+"queueHooks";return Lt.get(t,n)||Lt.access(t,n,{empty:dt.Callbacks("once memory").add(function(){Lt.remove(t,[e+"queue",n])})})}}),dt.fn.extend({queue:function(t,e){var n=2;return"string"!=typeof t&&(e=t,t="fx",n--),arguments.length<n?dt.queue(this[0],t):void 0===e?this:this.each(function(){var n=dt.queue(this,t,e);
// Ensure a hooks for this queue
dt._queueHooks(this,t),"fx"===t&&"inprogress"!==n[0]&&dt.dequeue(this,t)})},dequeue:function(t){return this.each(function(){dt.dequeue(this,t)})},clearQueue:function(t){return this.queue(t||"fx",[])},
// Get a promise resolved when queues of a certain type
// are emptied (fx is the type by default)
promise:function(t,e){var n,i=1,o=dt.Deferred(),r=this,s=this.length,a=function(){--i||o.resolveWith(r,[r])};for("string"!=typeof t&&(e=t,t=void 0),t=t||"fx";s--;)(n=Lt.get(r[s],t+"queueHooks"))&&n.empty&&(i++,n.empty.add(a));return a(),o.promise(e)}});var Pt=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Ht=new RegExp("^(?:([+-])=|)("+Pt+")([a-z%]*)$","i"),_t=["Top","Right","Bottom","Left"],Wt=function(t,e){
// Inline style trumps all
// isHiddenWithinTree might be called from jQuery#filter function;
// in that case, element will be second argument
// Otherwise, check computed style
// Support: Firefox <=43 - 45
// Disconnected elements can have computed display: none, so first confirm that elem is
// in the document.
return"none"===(t=e||t).style.display||""===t.style.display&&dt.contains(t.ownerDocument,t)&&"none"===dt.css(t,"display")},Mt=function(t,e,n,i){var o,r,s={};
// Remember the old values, and insert the new ones
for(r in e)s[r]=t.style[r],t.style[r]=e[r];o=n.apply(t,i||[]);
// Revert the old values
for(r in e)t.style[r]=s[r];return o},Bt={};dt.fn.extend({show:function(){return y(this,!0)},hide:function(){return y(this)},toggle:function(t){return"boolean"==typeof t?t?this.show():this.hide():this.each(function(){Wt(this)?dt(this).show():dt(this).hide()})}});var Ut=/^(?:checkbox|radio)$/i,zt=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,Vt=/^$|\/(?:java|ecma)script/i,Xt={
// Support: IE <=9 only
option:[1,"<select multiple='multiple'>","</select>"],
// XHTML parsers do not magically insert elements in the
// same way that tag soup parsers do. So we cannot shorten
// this by omitting <tbody> or other required elements.
thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};
// Support: IE <=9 only
Xt.optgroup=Xt.option,Xt.tbody=Xt.tfoot=Xt.colgroup=Xt.caption=Xt.thead,Xt.th=Xt.td;var Qt=/<|&#?\w+;/;!function(){var t=nt.createDocumentFragment().appendChild(nt.createElement("div")),e=nt.createElement("input");
// Support: Android 4.0 - 4.3 only
// Check state lost if the name is set (#11217)
// Support: Windows Web Apps (WWA)
// `name` and `type` must use .setAttribute for WWA (#14901)
e.setAttribute("type","radio"),e.setAttribute("checked","checked"),e.setAttribute("name","t"),t.appendChild(e),
// Support: Android <=4.1 only
// Older WebKit doesn't clone checked state correctly in fragments
ht.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,
// Support: IE <=11 only
// Make sure textarea (and checkbox) defaultValue is properly cloned
t.innerHTML="<textarea>x</textarea>",ht.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var Gt=nt.documentElement,Yt=/^key/,Jt=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Kt=/^([^.]*)(?:\.(.+)|)/;/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
dt.event={global:{},add:function(t,e,n,i,o){var r,s,a,l,u,c,f,p,h,d,g,v=Lt.get(t);
// Don't attach events to noData or text/comment nodes (but allow plain objects)
if(v)for(
// Caller can pass in an object of custom data in lieu of the handler
n.handler&&(n=(r=n).handler,o=r.selector),
// Ensure that invalid selectors throw exceptions at attach time
// Evaluate against documentElement in case elem is a non-element node (e.g., document)
o&&dt.find.matchesSelector(Gt,o),
// Make sure that the handler has a unique ID, used to find/remove it later
n.guid||(n.guid=dt.guid++),
// Init the element's event structure and main handler, if this is the first
(l=v.events)||(l=v.events={}),(s=v.handle)||(s=v.handle=function(e){
// Discard the second event of a jQuery.event.trigger() and
// when an event is called after a page has unloaded
return void 0!==dt&&dt.event.triggered!==e.type?dt.event.dispatch.apply(t,arguments):void 0}),u=(
// Handle multiple events separated by a space
e=(e||"").match(Dt)||[""]).length;u--;)h=g=(a=Kt.exec(e[u])||[])[1],d=(a[2]||"").split(".").sort(),
// There *must* be a type, no attaching namespace-only handlers
h&&(
// If event changes its type, use the special event handlers for the changed type
f=dt.event.special[h]||{},
// If selector defined, determine special event api type, otherwise given type
h=(o?f.delegateType:f.bindType)||h,
// Update special based on newly reset type
f=dt.event.special[h]||{},
// handleObj is passed to all event handlers
c=dt.extend({type:h,origType:g,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&dt.expr.match.needsContext.test(o),namespace:d.join(".")},r),
// Init the event handler queue if we're the first
(p=l[h])||((p=l[h]=[]).delegateCount=0,
// Only use addEventListener if the special events handler returns false
f.setup&&!1!==f.setup.call(t,i,d,s)||t.addEventListener&&t.addEventListener(h,s)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),
// Add to the element's handler list, delegates in front
o?p.splice(p.delegateCount++,0,c):p.push(c),
// Keep track of which events have ever been used, for event optimization
dt.event.global[h]=!0)},
// Detach an event or set of events from an element
remove:function(t,e,n,i,o){var r,s,a,l,u,c,f,p,h,d,g,v=Lt.hasData(t)&&Lt.get(t);if(v&&(l=v.events)){for(u=(
// Once for each type.namespace in types; type may be omitted
e=(e||"").match(Dt)||[""]).length;u--;)
// Unbind all events (on this namespace, if provided) for the element
if(a=Kt.exec(e[u])||[],h=g=a[1],d=(a[2]||"").split(".").sort(),h){for(f=dt.event.special[h]||{},p=l[h=(i?f.delegateType:f.bindType)||h]||[],a=a[2]&&new RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),
// Remove matching events
s=r=p.length;r--;)c=p[r],!o&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||i&&i!==c.selector&&("**"!==i||!c.selector)||(p.splice(r,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(t,c));
// Remove generic event handler if we removed something and no more handlers exist
// (avoids potential for endless recursion during removal of special event handlers)
s&&!p.length&&(f.teardown&&!1!==f.teardown.call(t,d,v.handle)||dt.removeEvent(t,h,v.handle),delete l[h])}else for(h in l)dt.event.remove(t,h+e[u],n,i,!0);
// Remove data and the expando if it's no longer used
dt.isEmptyObject(l)&&Lt.remove(t,"handle events")}},dispatch:function(t){
// Make a writable jQuery.Event from the native event object
var e,n,i,o,r,s,a=dt.event.fix(t),l=new Array(arguments.length),u=(Lt.get(this,"events")||{})[a.type]||[],c=dt.event.special[a.type]||{};for(
// Use the fix-ed jQuery.Event rather than the (read-only) native event
l[0]=a,e=1;e<arguments.length;e++)l[e]=arguments[e];
// Call the preDispatch hook for the mapped type, and let it bail if desired
if(a.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,a)){for(
// Determine handlers
s=dt.event.handlers.call(this,a,u),
// Run delegates first; they may want to stop propagation beneath us
e=0;(o=s[e++])&&!a.isPropagationStopped();)for(a.currentTarget=o.elem,n=0;(r=o.handlers[n++])&&!a.isImmediatePropagationStopped();)
// Triggered event must either 1) have no namespace, or 2) have namespace(s)
// a subset or equal to those in the bound event (both can have no namespace).
a.rnamespace&&!a.rnamespace.test(r.namespace)||(a.handleObj=r,a.data=r.data,void 0!==(i=((dt.event.special[r.origType]||{}).handle||r.handler).apply(o.elem,l))&&!1===(a.result=i)&&(a.preventDefault(),a.stopPropagation()));
// Call the postDispatch hook for the mapped type
return c.postDispatch&&c.postDispatch.call(this,a),a.result}},handlers:function(t,e){var n,i,o,r,s,a=[],l=e.delegateCount,u=t.target;
// Find delegate handlers
if(l&&
// Support: IE <=9
// Black-hole SVG <use> instance trees (trac-13180)
u.nodeType&&
// Support: Firefox <=42
// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
// Support: IE 11 only
// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
!("click"===t.type&&t.button>=1))for(;u!==this;u=u.parentNode||this)
// Don't check non-elements (#13208)
// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
if(1===u.nodeType&&("click"!==t.type||!0!==u.disabled)){for(r=[],s={},n=0;n<l;n++)void 0===s[
// Don't conflict with Object.prototype properties (#13203)
o=(i=e[n]).selector+" "]&&(s[o]=i.needsContext?dt(o,this).index(u)>-1:dt.find(o,this,null,[u]).length),s[o]&&r.push(i);r.length&&a.push({elem:u,handlers:r})}
// Add the remaining (directly-bound) handlers
return u=this,l<e.length&&a.push({elem:u,handlers:e.slice(l)}),a},addProp:function(t,e){Object.defineProperty(dt.Event.prototype,t,{enumerable:!0,configurable:!0,get:dt.isFunction(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(t){return t[dt.expando]?t:new dt.Event(t)},special:{load:{
// Prevent triggered image.load events from bubbling to window.load
noBubble:!0},focus:{
// Fire native event if possible so blur/focus sequence is correct
trigger:function(){if(this!==E()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===E()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{
// For checkbox, fire native event so checked state will be right
trigger:function(){if("checkbox"===this.type&&this.click&&r(this,"input"))return this.click(),!1},
// For cross-browser consistency, don't fire native .click() on links
_default:function(t){return r(t.target,"a")}},beforeunload:{postDispatch:function(t){
// Support: Firefox 20+
// Firefox doesn't alert if the returnValue field is not set.
void 0!==t.result&&t.originalEvent&&(t.originalEvent.returnValue=t.result)}}}},dt.removeEvent=function(t,e,n){
// This "if" is needed for plain objects
t.removeEventListener&&t.removeEventListener(e,n)},dt.Event=function(t,e){
// Allow instantiation without the 'new' keyword
if(!(this instanceof dt.Event))return new dt.Event(t,e);
// Event object
t&&t.type?(this.originalEvent=t,this.type=t.type,
// Events bubbling up the document may have been marked as prevented
// by a handler lower down the tree; reflect the correct value.
this.isDefaultPrevented=t.defaultPrevented||void 0===t.defaultPrevented&&
// Support: Android <=2.3 only
!1===t.returnValue?T:C,
// Create target properties
// Support: Safari <=6 - 7 only
// Target should not be a text node (#504, #13143)
this.target=t.target&&3===t.target.nodeType?t.target.parentNode:t.target,this.currentTarget=t.currentTarget,this.relatedTarget=t.relatedTarget):this.type=t,
// Put explicitly provided properties onto the event object
e&&dt.extend(this,e),
// Create a timestamp if incoming event doesn't have one
this.timeStamp=t&&t.timeStamp||dt.now(),
// Mark it as fixed
this[dt.expando]=!0},
// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
dt.Event.prototype={constructor:dt.Event,isDefaultPrevented:C,isPropagationStopped:C,isImmediatePropagationStopped:C,isSimulated:!1,preventDefault:function(){var t=this.originalEvent;this.isDefaultPrevented=T,t&&!this.isSimulated&&t.preventDefault()},stopPropagation:function(){var t=this.originalEvent;this.isPropagationStopped=T,t&&!this.isSimulated&&t.stopPropagation()},stopImmediatePropagation:function(){var t=this.originalEvent;this.isImmediatePropagationStopped=T,t&&!this.isSimulated&&t.stopImmediatePropagation(),this.stopPropagation()}},
// Includes all common event props including KeyEvent and MouseEvent specific props
dt.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(t){var e=t.button;
// Add which for key events
// Add which for key events
// Add which for click: 1 === left; 2 === middle; 3 === right
return null==t.which&&Yt.test(t.type)?null!=t.charCode?t.charCode:t.keyCode:!t.which&&void 0!==e&&Jt.test(t.type)?1&e?1:2&e?3:4&e?2:0:t.which}},dt.event.addProp),
// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
dt.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(t,e){dt.event.special[t]={delegateType:e,bindType:e,handle:function(t){var n,i=this,o=t.relatedTarget,r=t.handleObj;
// For mouseenter/leave call the handler if related is outside the target.
// NB: No relatedTarget if the mouse left/entered the browser window
return o&&(o===i||dt.contains(i,o))||(t.type=r.origType,n=r.handler.apply(this,arguments),t.type=e),n}}}),dt.fn.extend({on:function(t,e,n,i){return S(this,t,e,n,i)},one:function(t,e,n,i){return S(this,t,e,n,i,1)},off:function(t,e,n){var i,o;if(t&&t.preventDefault&&t.handleObj)
// ( event )  dispatched jQuery.Event
return i=t.handleObj,dt(t.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof t){
// ( types-object [, selector] )
for(o in t)this.off(o,e,t[o]);return this}
// ( types [, fn] )
return!1!==e&&"function"!=typeof e||(n=e,e=void 0),!1===n&&(n=C),this.each(function(){dt.event.remove(this,t,n,e)})}});var/* eslint-disable max-len */
// See https://github.com/eslint/eslint/issues/3229
Zt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,/* eslint-enable */
// Support: IE <=10 - 11, Edge 12 - 13
// In IE/Edge using regex groups here causes severe slowdowns.
// See https://connect.microsoft.com/IE/feedback/details/1736512/
te=/<script|<style|<link/i,
// checked="checked" or checked
ee=/checked\s*(?:[^=]|=\s*.checked.)/i,ne=/^true\/(.*)/,ie=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;dt.extend({htmlPrefilter:function(t){return t.replace(Zt,"<$1></$2>")},clone:function(t,e,n){var i,o,r,s,a=t.cloneNode(!0),l=dt.contains(t.ownerDocument,t);
// Fix IE cloning issues
if(!(ht.noCloneChecked||1!==t.nodeType&&11!==t.nodeType||dt.isXMLDoc(t)))for(
// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
s=b(a),i=0,o=(r=b(t)).length;i<o;i++)A(r[i],s[i]);
// Copy the events from the original to the clone
if(e)if(n)for(r=r||b(t),s=s||b(a),i=0,o=r.length;i<o;i++)D(r[i],s[i]);else D(t,a);
// Return the cloned set
// Preserve script evaluation history
return(s=b(a,"script")).length>0&&w(s,!l&&b(t,"script")),a},cleanData:function(t){for(var e,n,i,o=dt.event.special,r=0;void 0!==(n=t[r]);r++)if(It(n)){if(e=n[Lt.expando]){if(e.events)for(i in e.events)o[i]?dt.event.remove(n,i):dt.removeEvent(n,i,e.handle);
// Support: Chrome <=35 - 45+
// Assign undefined instead of using delete, see Data#remove
n[Lt.expando]=void 0}n[Rt.expando]&&(
// Support: Chrome <=35 - 45+
// Assign undefined instead of using delete, see Data#remove
n[Rt.expando]=void 0)}}}),dt.fn.extend({detach:function(t){return O(this,t,!0)},remove:function(t){return O(this,t)},text:function(t){return Ot(this,function(t){return void 0===t?dt.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=t)})},null,t,arguments.length)},append:function(){return j(this,arguments,function(t){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||k(this,t).appendChild(t)})},prepend:function(){return j(this,arguments,function(t){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var e=k(this,t);e.insertBefore(t,e.firstChild)}})},before:function(){return j(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this)})},after:function(){return j(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this.nextSibling)})},empty:function(){for(var t,e=0;null!=(t=this[e]);e++)1===t.nodeType&&(
// Prevent memory leaks
dt.cleanData(b(t,!1)),
// Remove any remaining nodes
t.textContent="");return this},clone:function(t,e){return t=null!=t&&t,e=null==e?t:e,this.map(function(){return dt.clone(this,t,e)})},html:function(t){return Ot(this,function(t){var e=this[0]||{},n=0,i=this.length;if(void 0===t&&1===e.nodeType)return e.innerHTML;
// See if we can take a shortcut and just use innerHTML
if("string"==typeof t&&!te.test(t)&&!Xt[(zt.exec(t)||["",""])[1].toLowerCase()]){t=dt.htmlPrefilter(t);try{for(;n<i;n++)
// Remove element nodes and prevent memory leaks
1===(e=this[n]||{}).nodeType&&(dt.cleanData(b(e,!1)),e.innerHTML=t);e=0}catch(t){}}e&&this.empty().append(t)},null,t,arguments.length)},replaceWith:function(){var t=[];
// Make the changes, replacing each non-ignored context element with the new content
return j(this,arguments,function(e){var n=this.parentNode;dt.inArray(this,t)<0&&(dt.cleanData(b(this)),n&&n.replaceChild(e,this))},t)}}),dt.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(t,e){dt.fn[t]=function(t){for(var n,i=[],o=dt(t),r=o.length-1,s=0;s<=r;s++)n=s===r?this:this.clone(!0),dt(o[s])[e](n),
// Support: Android <=4.0 only, PhantomJS 1 only
// .get() because push.apply(_, arraylike) throws on ancient WebKit
st.apply(i,n.get());return this.pushStack(i)}});var oe=/^margin/,re=new RegExp("^("+Pt+")(?!px)[a-z%]+$","i"),se=function(e){
// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
// IE throws on elements created in popups
// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
var n=e.ownerDocument.defaultView;return n&&n.opener||(n=t),n.getComputedStyle(e)};!function(){
// Executing both pixelPosition & boxSizingReliable tests require only one layout
// so they're executed at the same time to save the second computation.
function e(){
// This is a singleton, we need to execute it only once
if(a){a.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",a.innerHTML="",Gt.appendChild(s);var e=t.getComputedStyle(a);n="1%"!==e.top,
// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
r="2px"===e.marginLeft,i="4px"===e.width,
// Support: Android 4.0 - 4.3 only
// Some styles come back with percentage values, even though they shouldn't
a.style.marginRight="50%",o="4px"===e.marginRight,Gt.removeChild(s),
// Nullify the div so it wouldn't be stored in the memory and
// it will also be a sign that checks already performed
a=null}}var n,i,o,r,s=nt.createElement("div"),a=nt.createElement("div");
// Finish early in limited (non-browser) environments
a.style&&(
// Support: IE <=9 - 11 only
// Style of cloned element affects source element cloned (#8908)
a.style.backgroundClip="content-box",a.cloneNode(!0).style.backgroundClip="",ht.clearCloneStyle="content-box"===a.style.backgroundClip,s.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",s.appendChild(a),dt.extend(ht,{pixelPosition:function(){return e(),n},boxSizingReliable:function(){return e(),i},pixelMarginRight:function(){return e(),o},reliableMarginLeft:function(){return e(),r}}))}();var
// Swappable if display is none or starts with table
// except "table", "table-cell", or "table-caption"
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
ae=/^(none|table(?!-c[ea]).+)/,le=/^--/,ue={position:"absolute",visibility:"hidden",display:"block"},ce={letterSpacing:"0",fontWeight:"400"},fe=["Webkit","Moz","ms"],pe=nt.createElement("div").style;dt.extend({
// Add in style property hooks for overriding the default
// behavior of getting and setting a style property
cssHooks:{opacity:{get:function(t,e){if(e){
// We should always get a number back from opacity
var n=I(t,"opacity");return""===n?"1":n}}}},
// Don't automatically add "px" to these possibly-unitless properties
cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},
// Add in properties whose names you wish to fix before
// setting or getting the value
cssProps:{float:"cssFloat"},
// Get and set the style property on a DOM Node
style:function(t,e,n,i){
// Don't set styles on text and comment nodes
if(t&&3!==t.nodeType&&8!==t.nodeType&&t.style){
// Make sure that we're working with the right name
var o,r,s,a=dt.camelCase(e),l=le.test(e),u=t.style;
// Check if we're setting a value
if(
// Make sure that we're working with the right name. We don't
// want to query the value if it is a CSS custom property
// since they are user-defined.
l||(e=q(a)),
// Gets hook for the prefixed version, then unprefixed version
s=dt.cssHooks[e]||dt.cssHooks[a],void 0===n)
// If a hook was provided get the non-computed value from there
// If a hook was provided get the non-computed value from there
return s&&"get"in s&&void 0!==(o=s.get(t,!1,i))?o:u[e];
// Convert "+=" or "-=" to relative numbers (#7345)
"string"==(r=typeof n)&&(o=Ht.exec(n))&&o[1]&&(n=v(t,e,o),
// Fixes bug #9237
r="number"),
// Make sure that null and NaN values aren't set (#7116)
null!=n&&n===n&&(
// If a number was passed in, add the unit (except for certain CSS properties)
"number"===r&&(n+=o&&o[3]||(dt.cssNumber[a]?"":"px")),
// background-* props affect original clone's values
ht.clearCloneStyle||""!==n||0!==e.indexOf("background")||(u[e]="inherit"),
// If a hook was provided, use that value, otherwise just set the specified value
s&&"set"in s&&void 0===(n=s.set(t,n,i))||(l?u.setProperty(e,n):u[e]=n))}},css:function(t,e,n,i){var o,r,s,a=dt.camelCase(e);
// Make numeric if forced or a qualifier was provided and val looks numeric
// Make sure that we're working with the right name. We don't
// want to modify the value if it is a CSS custom property
// since they are user-defined.
// If a hook was provided get the computed value from there
// Try prefixed name followed by the unprefixed name
// Otherwise, if a way to get the computed value exists, use that
// Convert "normal" to computed value
// Make numeric if forced or a qualifier was provided and val looks numeric
return le.test(e)||(e=q(a)),(s=dt.cssHooks[e]||dt.cssHooks[a])&&"get"in s&&(o=s.get(t,!0,n)),void 0===o&&(o=I(t,e,i)),"normal"===o&&e in ce&&(o=ce[e]),""===n||n?(r=parseFloat(o),!0===n||isFinite(r)?r||0:o):o}}),dt.each(["height","width"],function(t,e){dt.cssHooks[e]={get:function(t,n,i){if(n)
// Certain elements can have dimension info if we invisibly show them
// but it must have a current display style that would benefit
// Support: Safari 8+
// Table columns in Safari have non-zero offsetWidth & zero
// getBoundingClientRect().width unless display is changed.
// Support: IE <=11 only
// Running getBoundingClientRect on a disconnected node
// in IE throws an error.
return!ae.test(dt.css(t,"display"))||t.getClientRects().length&&t.getBoundingClientRect().width?H(t,e,i):Mt(t,ue,function(){return H(t,e,i)})},set:function(t,n,i){var o,r=i&&se(t),s=i&&P(t,e,i,"border-box"===dt.css(t,"boxSizing",!1,r),r);
// Convert to pixels if value adjustment is needed
return s&&(o=Ht.exec(n))&&"px"!==(o[3]||"px")&&(t.style[e]=n,n=dt.css(t,e)),F(0,n,s)}}}),dt.cssHooks.marginLeft=L(ht.reliableMarginLeft,function(t,e){if(e)return(parseFloat(I(t,"marginLeft"))||t.getBoundingClientRect().left-Mt(t,{marginLeft:0},function(){return t.getBoundingClientRect().left}))+"px"}),
// These hooks are used by animate to expand properties
dt.each({margin:"",padding:"",border:"Width"},function(t,e){dt.cssHooks[t+e]={expand:function(n){for(var i=0,o={},
// Assumes a single number if not a string
r="string"==typeof n?n.split(" "):[n];i<4;i++)o[t+_t[i]+e]=r[i]||r[i-2]||r[0];return o}},oe.test(t)||(dt.cssHooks[t+e].set=F)}),dt.fn.extend({css:function(t,e){return Ot(this,function(t,e,n){var i,o,r={},s=0;if(Array.isArray(e)){for(i=se(t),o=e.length;s<o;s++)r[e[s]]=dt.css(t,e[s],!1,i);return r}return void 0!==n?dt.style(t,e,n):dt.css(t,e)},t,e,arguments.length>1)}}),dt.Tween=_,_.prototype={constructor:_,init:function(t,e,n,i,o,r){this.elem=t,this.prop=n,this.easing=o||dt.easing._default,this.options=e,this.start=this.now=this.cur(),this.end=i,this.unit=r||(dt.cssNumber[n]?"":"px")},cur:function(){var t=_.propHooks[this.prop];return t&&t.get?t.get(this):_.propHooks._default.get(this)},run:function(t){var e,n=_.propHooks[this.prop];return this.options.duration?this.pos=e=dt.easing[this.easing](t,this.options.duration*t,0,1,this.options.duration):this.pos=e=t,this.now=(this.end-this.start)*e+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):_.propHooks._default.set(this),this}},_.prototype.init.prototype=_.prototype,_.propHooks={_default:{get:function(t){var e;
// Use a property on the element directly when it is not a DOM element,
// or when there is no matching style property that exists.
// Use a property on the element directly when it is not a DOM element,
// or when there is no matching style property that exists.
// Passing an empty string as a 3rd parameter to .css will automatically
// attempt a parseFloat and fallback to a string if the parse fails.
// Simple values such as "10px" are parsed to Float;
// complex values such as "rotate(1rad)" are returned as-is.
return 1!==t.elem.nodeType||null!=t.elem[t.prop]&&null==t.elem.style[t.prop]?t.elem[t.prop]:(e=dt.css(t.elem,t.prop,""))&&"auto"!==e?e:0},set:function(t){
// Use step hook for back compat.
// Use cssHook if its there.
// Use .style if available and use plain properties where available.
dt.fx.step[t.prop]?dt.fx.step[t.prop](t):1!==t.elem.nodeType||null==t.elem.style[dt.cssProps[t.prop]]&&!dt.cssHooks[t.prop]?t.elem[t.prop]=t.now:dt.style(t.elem,t.prop,t.now+t.unit)}}},
// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
_.propHooks.scrollTop=_.propHooks.scrollLeft={set:function(t){t.elem.nodeType&&t.elem.parentNode&&(t.elem[t.prop]=t.now)}},dt.easing={linear:function(t){return t},swing:function(t){return.5-Math.cos(t*Math.PI)/2},_default:"swing"},dt.fx=_.prototype.init,
// Back compat <1.8 extension point
dt.fx.step={};var he,de,ge=/^(?:toggle|show|hide)$/,ve=/queueHooks$/;dt.Animation=dt.extend(V,{tweeners:{"*":[function(t,e){var n=this.createTween(t,e);return v(n.elem,t,Ht.exec(e),n),n}]},tweener:function(t,e){dt.isFunction(t)?(e=t,t=["*"]):t=t.match(Dt);for(var n,i=0,o=t.length;i<o;i++)n=t[i],V.tweeners[n]=V.tweeners[n]||[],V.tweeners[n].unshift(e)},prefilters:[function(t,e,n){var i,o,r,s,a,l,u,c,f="width"in e||"height"in e,p=this,h={},d=t.style,g=t.nodeType&&Wt(t),v=Lt.get(t,"fxshow");
// Queue-skipping animations hijack the fx hooks
n.queue||(null==(s=dt._queueHooks(t,"fx")).unqueued&&(s.unqueued=0,a=s.empty.fire,s.empty.fire=function(){s.unqueued||a()}),s.unqueued++,p.always(function(){
// Ensure the complete handler is called before this completes
p.always(function(){s.unqueued--,dt.queue(t,"fx").length||s.empty.fire()})}));
// Detect show/hide animations
for(i in e)if(o=e[i],ge.test(o)){if(delete e[i],r=r||"toggle"===o,o===(g?"hide":"show")){
// Pretend to be hidden if this is a "show" and
// there is still data from a stopped show/hide
if("show"!==o||!v||void 0===v[i])continue;g=!0}h[i]=v&&v[i]||dt.style(t,i)}if((
// Bail out if this is a no-op like .hide().hide()
l=!dt.isEmptyObject(e))||!dt.isEmptyObject(h)){
// Restrict "overflow" and "display" styles during box animations
f&&1===t.nodeType&&(
// Support: IE <=9 - 11, Edge 12 - 13
// Record all 3 overflow attributes because IE does not infer the shorthand
// from identically-valued overflowX and overflowY
n.overflow=[d.overflow,d.overflowX,d.overflowY],null==(
// Identify a display type, preferring old show/hide data over the CSS cascade
u=v&&v.display)&&(u=Lt.get(t,"display")),"none"===(c=dt.css(t,"display"))&&(u?c=u:(
// Get nonempty value(s) by temporarily forcing visibility
y([t],!0),u=t.style.display||u,c=dt.css(t,"display"),y([t]))),
// Animate inline elements as inline-block
("inline"===c||"inline-block"===c&&null!=u)&&"none"===dt.css(t,"float")&&(
// Restore the original display value at the end of pure show/hide animations
l||(p.done(function(){d.display=u}),null==u&&(c=d.display,u="none"===c?"":c)),d.display="inline-block")),n.overflow&&(d.overflow="hidden",p.always(function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]})),
// Implement show/hide animations
l=!1;for(i in h)
// General show/hide setup for this element animation
l||(v?"hidden"in v&&(g=v.hidden):v=Lt.access(t,"fxshow",{display:u}),
// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
r&&(v.hidden=!g),
// Show elements before animating them
g&&y([t],!0),/* eslint-disable no-loop-func */
p.done(function(){/* eslint-enable no-loop-func */
// The final step of a "hide" animation is actually hiding the element
g||y([t]),Lt.remove(t,"fxshow");for(i in h)dt.style(t,i,h[i])})),
// Per-property setup
l=U(g?v[i]:0,i,p),i in v||(v[i]=l.start,g&&(l.end=l.start,l.start=0))}}],prefilter:function(t,e){e?V.prefilters.unshift(t):V.prefilters.push(t)}}),dt.speed=function(t,e,n){var i=t&&"object"==typeof t?dt.extend({},t):{complete:n||!n&&e||dt.isFunction(t)&&t,duration:t,easing:n&&e||e&&!dt.isFunction(e)&&e};
// Go to the end state if fx are off
// Normalize opt.queue - true/undefined/null -> "fx"
// Queueing
return dt.fx.off?i.duration=0:"number"!=typeof i.duration&&(i.duration in dt.fx.speeds?i.duration=dt.fx.speeds[i.duration]:i.duration=dt.fx.speeds._default),null!=i.queue&&!0!==i.queue||(i.queue="fx"),i.old=i.complete,i.complete=function(){dt.isFunction(i.old)&&i.old.call(this),i.queue&&dt.dequeue(this,i.queue)},i},dt.fn.extend({fadeTo:function(t,e,n,i){
// Show any hidden elements after setting opacity to 0
return this.filter(Wt).css("opacity",0).show().end().animate({opacity:e},t,n,i)},animate:function(t,e,n,i){var o=dt.isEmptyObject(t),r=dt.speed(e,n,i),s=function(){
// Operate on a copy of prop so per-property easing won't be lost
var e=V(this,dt.extend({},t),r);
// Empty animations, or finishing resolves immediately
(o||Lt.get(this,"finish"))&&e.stop(!0)};return s.finish=s,o||!1===r.queue?this.each(s):this.queue(r.queue,s)},stop:function(t,e,n){var i=function(t){var e=t.stop;delete t.stop,e(n)};return"string"!=typeof t&&(n=e,e=t,t=void 0),e&&!1!==t&&this.queue(t||"fx",[]),this.each(function(){var e=!0,o=null!=t&&t+"queueHooks",r=dt.timers,s=Lt.get(this);if(o)s[o]&&s[o].stop&&i(s[o]);else for(o in s)s[o]&&s[o].stop&&ve.test(o)&&i(s[o]);for(o=r.length;o--;)r[o].elem!==this||null!=t&&r[o].queue!==t||(r[o].anim.stop(n),e=!1,r.splice(o,1));
// Start the next in the queue if the last step wasn't forced.
// Timers currently will call their complete callbacks, which
// will dequeue but only if they were gotoEnd.
!e&&n||dt.dequeue(this,t)})},finish:function(t){return!1!==t&&(t=t||"fx"),this.each(function(){var e,n=Lt.get(this),i=n[t+"queue"],o=n[t+"queueHooks"],r=dt.timers,s=i?i.length:0;
// Look for any active animations, and finish them
for(
// Enable finishing flag on private data
n.finish=!0,
// Empty the queue first
dt.queue(this,t,[]),o&&o.stop&&o.stop.call(this,!0),e=r.length;e--;)r[e].elem===this&&r[e].queue===t&&(r[e].anim.stop(!0),r.splice(e,1));
// Look for any animations in the old queue and finish them
for(e=0;e<s;e++)i[e]&&i[e].finish&&i[e].finish.call(this);
// Turn off finishing flag
delete n.finish})}}),dt.each(["toggle","show","hide"],function(t,e){var n=dt.fn[e];dt.fn[e]=function(t,i,o){return null==t||"boolean"==typeof t?n.apply(this,arguments):this.animate(B(e,!0),t,i,o)}}),
// Generate shortcuts for custom animations
dt.each({slideDown:B("show"),slideUp:B("hide"),slideToggle:B("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(t,e){dt.fn[t]=function(t,n,i){return this.animate(e,t,n,i)}}),dt.timers=[],dt.fx.tick=function(){var t,e=0,n=dt.timers;for(he=dt.now();e<n.length;e++)
// Run the timer and safely remove it when done (allowing for external removal)
(t=n[e])()||n[e]!==t||n.splice(e--,1);n.length||dt.fx.stop(),he=void 0},dt.fx.timer=function(t){dt.timers.push(t),dt.fx.start()},dt.fx.interval=13,dt.fx.start=function(){de||(de=!0,W())},dt.fx.stop=function(){de=null},dt.fx.speeds={slow:600,fast:200,
// Default speed
_default:400},
// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
dt.fn.delay=function(e,n){return e=dt.fx?dt.fx.speeds[e]||e:e,n=n||"fx",this.queue(n,function(n,i){var o=t.setTimeout(n,e);i.stop=function(){t.clearTimeout(o)}})},function(){var t=nt.createElement("input"),e=nt.createElement("select").appendChild(nt.createElement("option"));t.type="checkbox",
// Support: Android <=4.3 only
// Default value for a checkbox should be "on"
ht.checkOn=""!==t.value,
// Support: IE <=11 only
// Must access selectedIndex to make default options select
ht.optSelected=e.selected,(
// Support: IE <=11 only
// An input loses its value after becoming a radio
t=nt.createElement("input")).value="t",t.type="radio",ht.radioValue="t"===t.value}();var me,ye=dt.expr.attrHandle;dt.fn.extend({attr:function(t,e){return Ot(this,dt.attr,t,e,arguments.length>1)},removeAttr:function(t){return this.each(function(){dt.removeAttr(this,t)})}}),dt.extend({attr:function(t,e,n){var i,o,r=t.nodeType;
// Don't get/set attributes on text, comment and attribute nodes
if(3!==r&&8!==r&&2!==r)
// Fallback to prop when attributes are not supported
// Fallback to prop when attributes are not supported
// Attribute hooks are determined by the lowercase version
// Grab necessary hook if one is defined
return void 0===t.getAttribute?dt.prop(t,e,n):(1===r&&dt.isXMLDoc(t)||(o=dt.attrHooks[e.toLowerCase()]||(dt.expr.match.bool.test(e)?me:void 0)),void 0!==n?null===n?void dt.removeAttr(t,e):o&&"set"in o&&void 0!==(i=o.set(t,n,e))?i:(t.setAttribute(e,n+""),n):o&&"get"in o&&null!==(i=o.get(t,e))?i:null==(i=dt.find.attr(t,e))?void 0:i)},attrHooks:{type:{set:function(t,e){if(!ht.radioValue&&"radio"===e&&r(t,"input")){var n=t.value;return t.setAttribute("type",e),n&&(t.value=n),e}}}},removeAttr:function(t,e){var n,i=0,
// Attribute names can contain non-HTML whitespace characters
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
o=e&&e.match(Dt);if(o&&1===t.nodeType)for(;n=o[i++];)t.removeAttribute(n)}}),
// Hooks for boolean attributes
me={set:function(t,e,n){
// Remove boolean attributes when set to false
return!1===e?dt.removeAttr(t,n):t.setAttribute(n,n),n}},dt.each(dt.expr.match.bool.source.match(/\w+/g),function(t,e){var n=ye[e]||dt.find.attr;ye[e]=function(t,e,i){var o,r,s=e.toLowerCase();
// Avoid an infinite loop by temporarily removing this function from the getter
return i||(r=ye[s],ye[s]=o,o=null!=n(t,e,i)?s:null,ye[s]=r),o}});var be=/^(?:input|select|textarea|button)$/i,we=/^(?:a|area)$/i;dt.fn.extend({prop:function(t,e){return Ot(this,dt.prop,t,e,arguments.length>1)},removeProp:function(t){return this.each(function(){delete this[dt.propFix[t]||t]})}}),dt.extend({prop:function(t,e,n){var i,o,r=t.nodeType;
// Don't get/set properties on text, comment and attribute nodes
if(3!==r&&8!==r&&2!==r)
// Fix name and attach hooks
return 1===r&&dt.isXMLDoc(t)||(e=dt.propFix[e]||e,o=dt.propHooks[e]),void 0!==n?o&&"set"in o&&void 0!==(i=o.set(t,n,e))?i:t[e]=n:o&&"get"in o&&null!==(i=o.get(t,e))?i:t[e]},propHooks:{tabIndex:{get:function(t){
// Support: IE <=9 - 11 only
// elem.tabIndex doesn't always return the
// correct value when it hasn't been explicitly set
// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
// Use proper attribute retrieval(#12072)
var e=dt.find.attr(t,"tabindex");return e?parseInt(e,10):be.test(t.nodeName)||we.test(t.nodeName)&&t.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),
// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
ht.optSelected||(dt.propHooks.selected={get:function(t){/* eslint no-unused-expressions: "off" */
var e=t.parentNode;return e&&e.parentNode&&e.parentNode.selectedIndex,null},set:function(t){/* eslint no-unused-expressions: "off" */
var e=t.parentNode;e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex)}}),dt.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){dt.propFix[this.toLowerCase()]=this}),dt.fn.extend({addClass:function(t){var e,n,i,o,r,s,a,l=0;if(dt.isFunction(t))return this.each(function(e){dt(this).addClass(t.call(this,e,Q(this)))});if("string"==typeof t&&t)for(e=t.match(Dt)||[];n=this[l++];)if(o=Q(n),i=1===n.nodeType&&" "+X(o)+" "){for(s=0;r=e[s++];)i.indexOf(" "+r+" ")<0&&(i+=r+" ");o!==(
// Only assign if different to avoid unneeded rendering.
a=X(i))&&n.setAttribute("class",a)}return this},removeClass:function(t){var e,n,i,o,r,s,a,l=0;if(dt.isFunction(t))return this.each(function(e){dt(this).removeClass(t.call(this,e,Q(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof t&&t)for(e=t.match(Dt)||[];n=this[l++];)if(o=Q(n),
// This expression is here for better compressibility (see addClass)
i=1===n.nodeType&&" "+X(o)+" "){for(s=0;r=e[s++];)
// Remove *all* instances
for(;i.indexOf(" "+r+" ")>-1;)i=i.replace(" "+r+" "," ");o!==(
// Only assign if different to avoid unneeded rendering.
a=X(i))&&n.setAttribute("class",a)}return this},toggleClass:function(t,e){var n=typeof t;return"boolean"==typeof e&&"string"===n?e?this.addClass(t):this.removeClass(t):dt.isFunction(t)?this.each(function(n){dt(this).toggleClass(t.call(this,n,Q(this),e),e)}):this.each(function(){var e,i,o,r;if("string"===n)for(
// Toggle individual class names
i=0,o=dt(this),r=t.match(Dt)||[];e=r[i++];)
// Check each className given, space separated list
o.hasClass(e)?o.removeClass(e):o.addClass(e);else void 0!==t&&"boolean"!==n||((e=Q(this))&&
// Store className if set
Lt.set(this,"__className__",e),
// If the element has a class name or if we're passed `false`,
// then remove the whole classname (if there was one, the above saved it).
// Otherwise bring back whatever was previously saved (if anything),
// falling back to the empty string if nothing was stored.
this.setAttribute&&this.setAttribute("class",e||!1===t?"":Lt.get(this,"__className__")||""))})},hasClass:function(t){var e,n,i=0;for(e=" "+t+" ";n=this[i++];)if(1===n.nodeType&&(" "+X(Q(n))+" ").indexOf(e)>-1)return!0;return!1}});var xe=/\r/g;dt.fn.extend({val:function(t){var e,n,i,o=this[0];{if(arguments.length)return i=dt.isFunction(t),this.each(function(n){var o;1===this.nodeType&&(
// Treat null/undefined as ""; convert numbers to string
null==(o=i?t.call(this,n,dt(this).val()):t)?o="":"number"==typeof o?o+="":Array.isArray(o)&&(o=dt.map(o,function(t){return null==t?"":t+""})),
// If set returns undefined, fall back to normal setting
(e=dt.valHooks[this.type]||dt.valHooks[this.nodeName.toLowerCase()])&&"set"in e&&void 0!==e.set(this,o,"value")||(this.value=o))});if(o)
// Handle most common string cases
return(e=dt.valHooks[o.type]||dt.valHooks[o.nodeName.toLowerCase()])&&"get"in e&&void 0!==(n=e.get(o,"value"))?n:"string"==typeof(n=o.value)?n.replace(xe,""):null==n?"":n}}}),dt.extend({valHooks:{option:{get:function(t){var e=dt.find.attr(t,"value");
// Support: IE <=10 - 11 only
// option.text throws exceptions (#14686, #14858)
// Strip and collapse whitespace
// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
return null!=e?e:X(dt.text(t))}},select:{get:function(t){var e,n,i,o=t.options,s=t.selectedIndex,a="select-one"===t.type,l=a?null:[],u=a?s+1:o.length;
// Loop through all the selected options
for(i=s<0?u:a?s:0;i<u;i++)
// Support: IE <=9 only
// IE8-9 doesn't update selected after form reset (#2551)
if(((n=o[i]).selected||i===s)&&
// Don't return options that are disabled or in a disabled optgroup
!n.disabled&&(!n.parentNode.disabled||!r(n.parentNode,"optgroup"))){
// We don't need an array for one selects
if(
// Get the specific value for the option
e=dt(n).val(),a)return e;
// Multi-Selects return an array
l.push(e)}return l},set:function(t,e){for(var n,i,o=t.options,r=dt.makeArray(e),s=o.length;s--;)/* eslint-disable no-cond-assign */
((i=o[s]).selected=dt.inArray(dt.valHooks.option.get(i),r)>-1)&&(n=!0);
// Force browsers to behave consistently when non-matching value is set
return n||(t.selectedIndex=-1),r}}}}),
// Radios and checkboxes getter/setter
dt.each(["radio","checkbox"],function(){dt.valHooks[this]={set:function(t,e){if(Array.isArray(e))return t.checked=dt.inArray(dt(t).val(),e)>-1}},ht.checkOn||(dt.valHooks[this].get=function(t){return null===t.getAttribute("value")?"on":t.value})});
// Return jQuery for attributes-only inclusion
var Te=/^(?:focusinfocus|focusoutblur)$/;dt.extend(dt.event,{trigger:function(e,n,i,o){var r,s,a,l,u,c,f,p=[i||nt],h=ct.call(e,"type")?e.type:e,d=ct.call(e,"namespace")?e.namespace.split("."):[];
// Don't do events on text and comment nodes
if(s=a=i=i||nt,3!==i.nodeType&&8!==i.nodeType&&!Te.test(h+dt.event.triggered)&&(h.indexOf(".")>-1&&(
// Namespaced trigger; create a regexp to match event type in handle()
h=(d=h.split(".")).shift(),d.sort()),u=h.indexOf(":")<0&&"on"+h,
// Caller can pass in a jQuery.Event object, Object, or just an event type string
e=e[dt.expando]?e:new dt.Event(h,"object"==typeof e&&e),
// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
e.isTrigger=o?2:3,e.namespace=d.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,
// Clean up the event in case it is being reused
e.result=void 0,e.target||(e.target=i),
// Clone any incoming data and prepend the event, creating the handler arg list
n=null==n?[e]:dt.makeArray(n,[e]),
// Allow special events to draw outside the lines
f=dt.event.special[h]||{},o||!f.trigger||!1!==f.trigger.apply(i,n))){
// Determine event propagation path in advance, per W3C events spec (#9951)
// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
if(!o&&!f.noBubble&&!dt.isWindow(i)){for(l=f.delegateType||h,Te.test(l+h)||(s=s.parentNode);s;s=s.parentNode)p.push(s),a=s;
// Only add window if we got to document (e.g., not plain obj or detached DOM)
a===(i.ownerDocument||nt)&&p.push(a.defaultView||a.parentWindow||t)}for(
// Fire handlers on the event path
r=0;(s=p[r++])&&!e.isPropagationStopped();)e.type=r>1?l:f.bindType||h,(
// jQuery handler
c=(Lt.get(s,"events")||{})[e.type]&&Lt.get(s,"handle"))&&c.apply(s,n),(
// Native handler
c=u&&s[u])&&c.apply&&It(s)&&(e.result=c.apply(s,n),!1===e.result&&e.preventDefault());
// If nobody prevented the default action, do it now
// Call a native DOM method on the target with the same name as the event.
// Don't do default actions on window, that's where global variables be (#6170)
// Don't re-trigger an onFOO event when we call its FOO() method
// Prevent re-triggering of the same event, since we already bubbled it above
return e.type=h,o||e.isDefaultPrevented()||f._default&&!1!==f._default.apply(p.pop(),n)||!It(i)||u&&dt.isFunction(i[h])&&!dt.isWindow(i)&&((a=i[u])&&(i[u]=null),dt.event.triggered=h,i[h](),dt.event.triggered=void 0,a&&(i[u]=a)),e.result}},
// Piggyback on a donor event to simulate a different one
// Used only for `focus(in | out)` events
simulate:function(t,e,n){var i=dt.extend(new dt.Event,n,{type:t,isSimulated:!0});dt.event.trigger(i,null,e)}}),dt.fn.extend({trigger:function(t,e){return this.each(function(){dt.event.trigger(t,e,this)})},triggerHandler:function(t,e){var n=this[0];if(n)return dt.event.trigger(t,e,n,!0)}}),dt.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(t,e){
// Handle event binding
dt.fn[e]=function(t,n){return arguments.length>0?this.on(e,null,t,n):this.trigger(e)}}),dt.fn.extend({hover:function(t,e){return this.mouseenter(t).mouseleave(e||t)}}),ht.focusin="onfocusin"in t,
// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
ht.focusin||dt.each({focus:"focusin",blur:"focusout"},function(t,e){
// Attach a single capturing handler on the document while someone wants focusin/focusout
var n=function(t){dt.event.simulate(e,t.target,dt.event.fix(t))};dt.event.special[e]={setup:function(){var i=this.ownerDocument||this,o=Lt.access(i,e);o||i.addEventListener(t,n,!0),Lt.access(i,e,(o||0)+1)},teardown:function(){var i=this.ownerDocument||this,o=Lt.access(i,e)-1;o?Lt.access(i,e,o):(i.removeEventListener(t,n,!0),Lt.remove(i,e))}}});var Ce=t.location,Ee=dt.now(),Se=/\?/;
// Cross-browser xml parsing
dt.parseXML=function(e){var n;if(!e||"string"!=typeof e)return null;
// Support: IE 9 - 11 only
// IE throws on parseFromString with invalid input.
try{n=(new t.DOMParser).parseFromString(e,"text/xml")}catch(t){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||dt.error("Invalid XML: "+e),n};var ke=/\[\]$/,$e=/\r?\n/g,Ne=/^(?:submit|button|image|reset|file)$/i,De=/^(?:input|select|textarea|keygen)/i;
// Serialize an array of form elements or a set of
// key/values into a query string
dt.param=function(t,e){var n,i=[],o=function(t,e){
// If value is a function, invoke it and use its return value
var n=dt.isFunction(e)?e():e;i[i.length]=encodeURIComponent(t)+"="+encodeURIComponent(null==n?"":n)};
// If an array was passed in, assume that it is an array of form elements.
if(Array.isArray(t)||t.jquery&&!dt.isPlainObject(t))
// Serialize the form elements
dt.each(t,function(){o(this.name,this.value)});else
// If traditional, encode the "old" way (the way 1.3.2 or older
// did it), otherwise encode params recursively.
for(n in t)G(n,t[n],e,o);
// Return the resulting serialization
return i.join("&")},dt.fn.extend({serialize:function(){return dt.param(this.serializeArray())},serializeArray:function(){return this.map(function(){
// Can add propHook for "elements" to filter or add form elements
var t=dt.prop(this,"elements");return t?dt.makeArray(t):this}).filter(function(){var t=this.type;
// Use .is( ":disabled" ) so that fieldset[disabled] works
return this.name&&!dt(this).is(":disabled")&&De.test(this.nodeName)&&!Ne.test(t)&&(this.checked||!Ut.test(t))}).map(function(t,e){var n=dt(this).val();return null==n?null:Array.isArray(n)?dt.map(n,function(t){return{name:e.name,value:t.replace($e,"\r\n")}}):{name:e.name,value:n.replace($e,"\r\n")}}).get()}});var Ae=/%20/g,je=/#.*$/,Oe=/([?&])_=[^&]*/,Ie=/^(.*?):[ \t]*([^\r\n]*)$/gm,
// #7653, #8125, #8152: local protocol detection
Le=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Re=/^(?:GET|HEAD)$/,qe=/^\/\//,/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
Fe={},/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
Pe={},
// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
He="*/".concat("*"),
// Anchor tag for parsing the document origin
_e=nt.createElement("a");_e.href=Ce.href,dt.extend({
// Counter for holding the number of active queries
active:0,
// Last-Modified header cache for next request
lastModified:{},etag:{},ajaxSettings:{url:Ce.href,type:"GET",isLocal:Le.test(Ce.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/
accepts:{"*":He,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},
// Data converters
// Keys separate source (or catchall "*") and destination types with a single space
converters:{
// Convert anything to text
"* text":String,
// Text to html (true = no transformation)
"text html":!0,
// Evaluate text as a json expression
"text json":JSON.parse,
// Parse text as xml
"text xml":dt.parseXML},
// For options that shouldn't be deep extended:
// you can add your own custom options here if
// and when you create one that shouldn't be
// deep extended (see ajaxExtend)
flatOptions:{url:!0,context:!0}},
// Creates a full fledged settings object into target
// with both ajaxSettings and settings fields.
// If target is omitted, writes into ajaxSettings.
ajaxSetup:function(t,e){
// Building a settings object
// Extending ajaxSettings
return e?K(K(t,dt.ajaxSettings),e):K(dt.ajaxSettings,t)},ajaxPrefilter:Y(Fe),ajaxTransport:Y(Pe),
// Main method
ajax:function(e,n){
// Callback for when everything is done
function i(e,n,i,a){var u,p,h,w,x,T=n;
// Ignore repeat invocations
c||(c=!0,
// Clear timeout if it exists
l&&t.clearTimeout(l),
// Dereference transport for early garbage collection
// (no matter how long the jqXHR object will be used)
o=void 0,
// Cache response headers
s=a||"",
// Set readyState
C.readyState=e>0?4:0,
// Determine if successful
u=e>=200&&e<300||304===e,
// Get response data
i&&(w=Z(d,C,i)),
// Convert no matter what (that way responseXXX fields are always set)
w=tt(d,w,C,u),
// If successful, handle type chaining
u?(
// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
d.ifModified&&((x=C.getResponseHeader("Last-Modified"))&&(dt.lastModified[r]=x),(x=C.getResponseHeader("etag"))&&(dt.etag[r]=x)),
// if no content
204===e||"HEAD"===d.type?T="nocontent":304===e?T="notmodified":(T=w.state,p=w.data,u=!(h=w.error))):(
// Extract error from statusText and normalize for non-aborts
h=T,!e&&T||(T="error",e<0&&(e=0))),
// Set data for the fake xhr object
C.status=e,C.statusText=(n||T)+"",
// Success/Error
u?m.resolveWith(g,[p,T,C]):m.rejectWith(g,[C,T,h]),
// Status-dependent callbacks
C.statusCode(b),b=void 0,f&&v.trigger(u?"ajaxSuccess":"ajaxError",[C,d,u?p:h]),
// Complete
y.fireWith(g,[C,T]),f&&(v.trigger("ajaxComplete",[C,d]),
// Handle the global AJAX counter
--dt.active||dt.event.trigger("ajaxStop")))}
// If url is an object, simulate pre-1.5 signature
"object"==typeof e&&(n=e,e=void 0),
// Force options to be an object
n=n||{};var o,
// URL without anti-cache param
r,
// Response headers
s,a,
// timeout handle
l,
// Url cleanup var
u,
// Request state (becomes false upon send and true upon completion)
c,
// To know if global events are to be dispatched
f,
// Loop variable
p,
// uncached part of the url
h,
// Create the final options object
d=dt.ajaxSetup({},n),
// Callbacks context
g=d.context||d,
// Context for global events is callbackContext if it is a DOM node or jQuery collection
v=d.context&&(g.nodeType||g.jquery)?dt(g):dt.event,
// Deferreds
m=dt.Deferred(),y=dt.Callbacks("once memory"),
// Status-dependent callbacks
b=d.statusCode||{},
// Headers (they are sent all at once)
w={},x={},
// Default abort message
T="canceled",
// Fake xhr
C={readyState:0,
// Builds headers hashtable if needed
getResponseHeader:function(t){var e;if(c){if(!a)for(a={};e=Ie.exec(s);)a[e[1].toLowerCase()]=e[2];e=a[t.toLowerCase()]}return null==e?null:e},
// Raw string
getAllResponseHeaders:function(){return c?s:null},
// Caches the header
setRequestHeader:function(t,e){return null==c&&(t=x[t.toLowerCase()]=x[t.toLowerCase()]||t,w[t]=e),this},
// Overrides response content-type header
overrideMimeType:function(t){return null==c&&(d.mimeType=t),this},
// Status-dependent callbacks
statusCode:function(t){var e;if(t)if(c)
// Execute the appropriate callbacks
C.always(t[C.status]);else
// Lazy-add the new callbacks in a way that preserves old ones
for(e in t)b[e]=[b[e],t[e]];return this},
// Cancel the request
abort:function(t){var e=t||T;return o&&o.abort(e),i(0,e),this}};
// A cross-domain request is in order when the origin doesn't match the current origin.
if(
// Attach deferreds
m.promise(C),
// Add protocol if not provided (prefilters might expect it)
// Handle falsy url in the settings object (#10093: consistency with old signature)
// We also use the url parameter if available
d.url=((e||d.url||Ce.href)+"").replace(qe,Ce.protocol+"//"),
// Alias method option to type as per ticket #12004
d.type=n.method||n.type||d.method||d.type,
// Extract dataTypes list
d.dataTypes=(d.dataType||"*").toLowerCase().match(Dt)||[""],null==d.crossDomain){u=nt.createElement("a");
// Support: IE <=8 - 11, Edge 12 - 13
// IE throws exception on accessing the href property if url is malformed,
// e.g. http://example.com:80x/
try{u.href=d.url,
// Support: IE <=8 - 11 only
// Anchor's host property isn't correctly set when s.url is relative
u.href=u.href,d.crossDomain=_e.protocol+"//"+_e.host!=u.protocol+"//"+u.host}catch(t){
// If there is an error parsing the URL, assume it is crossDomain,
// it can be rejected by the transport if it is invalid
d.crossDomain=!0}}
// If request was aborted inside a prefilter, stop there
if(
// Convert data if not already a string
d.data&&d.processData&&"string"!=typeof d.data&&(d.data=dt.param(d.data,d.traditional)),
// Apply prefilters
J(Fe,d,n,C),c)return C;
// Watch for a new set of requests
(
// We can fire global events as of now if asked to
// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
f=dt.event&&d.global)&&0==dt.active++&&dt.event.trigger("ajaxStart"),
// Uppercase the type
d.type=d.type.toUpperCase(),
// Determine if request has content
d.hasContent=!Re.test(d.type),
// Save the URL in case we're toying with the If-Modified-Since
// and/or If-None-Match header later on
// Remove hash to simplify url manipulation
r=d.url.replace(je,""),
// More options handling for requests with no content
d.hasContent?d.data&&d.processData&&0===(d.contentType||"").indexOf("application/x-www-form-urlencoded")&&(d.data=d.data.replace(Ae,"+")):(
// Remember the hash so we can put it back
h=d.url.slice(r.length),
// If data is available, append data to url
d.data&&(r+=(Se.test(r)?"&":"?")+d.data,
// #9682: remove data so that it's not used in an eventual retry
delete d.data),
// Add or update anti-cache param if needed
!1===d.cache&&(r=r.replace(Oe,"$1"),h=(Se.test(r)?"&":"?")+"_="+Ee+++h),
// Put hash and anti-cache on the URL that will be requested (gh-1732)
d.url=r+h),
// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
d.ifModified&&(dt.lastModified[r]&&C.setRequestHeader("If-Modified-Since",dt.lastModified[r]),dt.etag[r]&&C.setRequestHeader("If-None-Match",dt.etag[r])),
// Set the correct header, if data is being sent
(d.data&&d.hasContent&&!1!==d.contentType||n.contentType)&&C.setRequestHeader("Content-Type",d.contentType),
// Set the Accepts header for the server, depending on the dataType
C.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+("*"!==d.dataTypes[0]?", "+He+"; q=0.01":""):d.accepts["*"]);
// Check for headers option
for(p in d.headers)C.setRequestHeader(p,d.headers[p]);
// Allow custom headers/mimetypes and early abort
if(d.beforeSend&&(!1===d.beforeSend.call(g,C,d)||c))
// Abort if not done already and return
return C.abort();
// If no transport, we auto-abort
if(
// Aborting is no longer a cancellation
T="abort",
// Install callbacks on deferreds
y.add(d.complete),C.done(d.success),C.fail(d.error),
// Get transport
o=J(Pe,d,n,C)){
// If request was aborted inside ajaxSend, stop there
if(C.readyState=1,
// Send global event
f&&v.trigger("ajaxSend",[C,d]),c)return C;
// Timeout
d.async&&d.timeout>0&&(l=t.setTimeout(function(){C.abort("timeout")},d.timeout));try{c=!1,o.send(w,i)}catch(t){
// Rethrow post-completion exceptions
if(c)throw t;
// Propagate others as results
i(-1,t)}}else i(-1,"No Transport");return C},getJSON:function(t,e,n){return dt.get(t,e,n,"json")},getScript:function(t,e){return dt.get(t,void 0,e,"script")}}),dt.each(["get","post"],function(t,e){dt[e]=function(t,n,i,o){
// The url can be an options object (which then must have .url)
// Shift arguments if data argument was omitted
return dt.isFunction(n)&&(o=o||i,i=n,n=void 0),dt.ajax(dt.extend({url:t,type:e,dataType:o,data:n,success:i},dt.isPlainObject(t)&&t))}}),dt._evalUrl=function(t){return dt.ajax({url:t,
// Make this explicit, since user can override this through ajaxSetup (#11264)
type:"GET",dataType:"script",cache:!0,async:!1,global:!1,throws:!0})},dt.fn.extend({wrapAll:function(t){var e;
// The elements to wrap the target around
return this[0]&&(dt.isFunction(t)&&(t=t.call(this[0])),e=dt(t,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&e.insertBefore(this[0]),e.map(function(){for(var t=this;t.firstElementChild;)t=t.firstElementChild;return t}).append(this)),this},wrapInner:function(t){return dt.isFunction(t)?this.each(function(e){dt(this).wrapInner(t.call(this,e))}):this.each(function(){var e=dt(this),n=e.contents();n.length?n.wrapAll(t):e.append(t)})},wrap:function(t){var e=dt.isFunction(t);return this.each(function(n){dt(this).wrapAll(e?t.call(this,n):t)})},unwrap:function(t){return this.parent(t).not("body").each(function(){dt(this).replaceWith(this.childNodes)}),this}}),dt.expr.pseudos.hidden=function(t){return!dt.expr.pseudos.visible(t)},dt.expr.pseudos.visible=function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)},dt.ajaxSettings.xhr=function(){try{return new t.XMLHttpRequest}catch(t){}};var We={
// File protocol always yields status code 0, assume 200
0:200,
// Support: IE <=9 only
// #1450: sometimes IE returns 1223 when it should be 204
1223:204},Me=dt.ajaxSettings.xhr();ht.cors=!!Me&&"withCredentials"in Me,ht.ajax=Me=!!Me,dt.ajaxTransport(function(e){var n,i;
// Cross domain only allowed if supported through XMLHttpRequest
if(ht.cors||Me&&!e.crossDomain)return{send:function(o,r){var s,a=e.xhr();
// Apply custom fields if provided
if(a.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(s in e.xhrFields)a[s]=e.xhrFields[s];
// Override mime type if needed
e.mimeType&&a.overrideMimeType&&a.overrideMimeType(e.mimeType),
// X-Requested-With header
// For cross-domain requests, seeing as conditions for a preflight are
// akin to a jigsaw puzzle, we simply never set it to be sure.
// (it can always be set on a per-request basis or even using ajaxSetup)
// For same-domain requests, won't change header if already provided.
e.crossDomain||o["X-Requested-With"]||(o["X-Requested-With"]="XMLHttpRequest");
// Set headers
for(s in o)a.setRequestHeader(s,o[s]);
// Callback
n=function(t){return function(){n&&(n=i=a.onload=a.onerror=a.onabort=a.onreadystatechange=null,"abort"===t?a.abort():"error"===t?
// Support: IE <=9 only
// On a manual native abort, IE9 throws
// errors on any property access that is not readyState
"number"!=typeof a.status?r(0,"error"):r(
// File: protocol always yields status 0; see #8605, #14207
a.status,a.statusText):r(We[a.status]||a.status,a.statusText,
// Support: IE <=9 only
// IE9 has no XHR2 but throws on binary (trac-11426)
// For XHR2 non-text, let the caller handle it (gh-2498)
"text"!==(a.responseType||"text")||"string"!=typeof a.responseText?{binary:a.response}:{text:a.responseText},a.getAllResponseHeaders()))}},
// Listen to events
a.onload=n(),i=a.onerror=n("error"),
// Support: IE 9 only
// Use onreadystatechange to replace onabort
// to handle uncaught aborts
void 0!==a.onabort?a.onabort=i:a.onreadystatechange=function(){
// Check readyState before timeout as it changes
4===a.readyState&&
// Allow onerror to be called first,
// but that will not handle a native abort
// Also, save errorCallback to a variable
// as xhr.onerror cannot be accessed
t.setTimeout(function(){n&&i()})},
// Create the abort callback
n=n("abort");try{
// Do send the request (this may raise an exception)
a.send(e.hasContent&&e.data||null)}catch(t){
// #14683: Only rethrow if this hasn't been notified as an error yet
if(n)throw t}},abort:function(){n&&n()}}}),
// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
dt.ajaxPrefilter(function(t){t.crossDomain&&(t.contents.script=!1)}),
// Install script dataType
dt.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(t){return dt.globalEval(t),t}}}),
// Handle cache's special case and crossDomain
dt.ajaxPrefilter("script",function(t){void 0===t.cache&&(t.cache=!1),t.crossDomain&&(t.type="GET")}),
// Bind script tag hack transport
dt.ajaxTransport("script",function(t){
// This transport only deals with cross domain requests
if(t.crossDomain){var e,n;return{send:function(i,o){e=dt("<script>").prop({charset:t.scriptCharset,src:t.url}).on("load error",n=function(t){e.remove(),n=null,t&&o("error"===t.type?404:200,t.type)}),
// Use native DOM manipulation to avoid our domManip AJAX trickery
nt.head.appendChild(e[0])},abort:function(){n&&n()}}}});var Be=[],Ue=/(=)\?(?=&|$)|\?\?/;
// Default jsonp settings
dt.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var t=Be.pop()||dt.expando+"_"+Ee++;return this[t]=!0,t}}),
// Detect, normalize options and install callbacks for jsonp requests
dt.ajaxPrefilter("json jsonp",function(e,n,i){var o,r,s,a=!1!==e.jsonp&&(Ue.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ue.test(e.data)&&"data");
// Handle iff the expected data type is "jsonp" or we have a parameter to set
if(a||"jsonp"===e.dataTypes[0])
// Delegate to script
// Get callback name, remembering preexisting value associated with it
// Insert callback into url or form data
// Use data converter to retrieve json after script execution
// Force json dataType
// Install callback
// Clean-up function (fires after converters)
return o=e.jsonpCallback=dt.isFunction(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Ue,"$1"+o):!1!==e.jsonp&&(e.url+=(Se.test(e.url)?"&":"?")+e.jsonp+"="+o),e.converters["script json"]=function(){return s||dt.error(o+" was not called"),s[0]},e.dataTypes[0]="json",r=t[o],t[o]=function(){s=arguments},i.always(function(){
// If previous value didn't exist - remove it
void 0===r?dt(t).removeProp(o):t[o]=r,
// Save back as free
e[o]&&(
// Make sure that re-using the options doesn't screw things around
e.jsonpCallback=n.jsonpCallback,
// Save the callback name for future use
Be.push(o)),
// Call if it was a function and we have a response
s&&dt.isFunction(r)&&r(s[0]),s=r=void 0}),"script"}),
// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
ht.createHTMLDocument=function(){var t=nt.implementation.createHTMLDocument("").body;return t.innerHTML="<form></form><form></form>",2===t.childNodes.length}(),
// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
dt.parseHTML=function(t,e,n){if("string"!=typeof t)return[];"boolean"==typeof e&&(n=e,e=!1);var i,o,r;
// Single tag
// Single tag
// Stop scripts or inline event handlers from being executed immediately
// by using document.implementation
// Set the base href for the created document
// so any parsed elements with URLs
// are based on the document's URL (gh-2965)
return e||(ht.createHTMLDocument?((i=(e=nt.implementation.createHTMLDocument("")).createElement("base")).href=nt.location.href,e.head.appendChild(i)):e=nt),o=Ct.exec(t),r=!n&&[],o?[e.createElement(o[1])]:(o=x([t],e,r),r&&r.length&&dt(r).remove(),dt.merge([],o.childNodes))},/**
 * Load a url into a page
 */
dt.fn.load=function(t,e,n){var i,o,r,s=this,a=t.indexOf(" ");
// If it's a function
// We assume that it's the callback
// If we have elements to modify, make the request
return a>-1&&(i=X(t.slice(a)),t=t.slice(0,a)),dt.isFunction(e)?(n=e,e=void 0):e&&"object"==typeof e&&(o="POST"),s.length>0&&dt.ajax({url:t,
// If "type" variable is undefined, then "GET" method will be used.
// Make value of this field explicit since
// user can override it through ajaxSetup method
type:o||"GET",dataType:"html",data:e}).done(function(t){
// Save response for use in complete callback
r=arguments,s.html(i?
// If a selector was specified, locate the right elements in a dummy div
// Exclude scripts to avoid IE 'Permission Denied' errors
dt("<div>").append(dt.parseHTML(t)).find(i):
// Otherwise use the full result
t)}).always(n&&function(t,e){s.each(function(){n.apply(this,r||[t.responseText,e,t])})}),this},
// Attach a bunch of functions for handling common AJAX events
dt.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(t,e){dt.fn[e]=function(t){return this.on(e,t)}}),dt.expr.pseudos.animated=function(t){return dt.grep(dt.timers,function(e){return t===e.elem}).length},dt.offset={setOffset:function(t,e,n){var i,o,r,s,a,l,u=dt.css(t,"position"),c=dt(t),f={};
// Set position first, in-case top/left are set even on static elem
"static"===u&&(t.style.position="relative"),a=c.offset(),r=dt.css(t,"top"),l=dt.css(t,"left"),
// Need to be able to calculate position if either
// top or left is auto and position is either absolute or fixed
("absolute"===u||"fixed"===u)&&(r+l).indexOf("auto")>-1?(s=(i=c.position()).top,o=i.left):(s=parseFloat(r)||0,o=parseFloat(l)||0),dt.isFunction(e)&&(
// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
e=e.call(t,n,dt.extend({},a))),null!=e.top&&(f.top=e.top-a.top+s),null!=e.left&&(f.left=e.left-a.left+o),"using"in e?e.using.call(t,f):c.css(f)}},dt.fn.extend({offset:function(t){
// Preserve chaining for setter
if(arguments.length)return void 0===t?this:this.each(function(e){dt.offset.setOffset(this,t,e)});var e,n,i,o,r=this[0];if(r)
// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
// Support: IE <=11 only
// Running getBoundingClientRect on a
// disconnected node in IE throws an error
// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
// Support: IE <=11 only
// Running getBoundingClientRect on a
// disconnected node in IE throws an error
return r.getClientRects().length?(i=r.getBoundingClientRect(),e=r.ownerDocument,n=e.documentElement,o=e.defaultView,{top:i.top+o.pageYOffset-n.clientTop,left:i.left+o.pageXOffset-n.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var t,e,n=this[0],i={top:0,left:0};
// Subtract parent offsets and element margins
// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
// because it is its only offset parent
// Assume getBoundingClientRect is there when computed position is fixed
// Get *real* offsetParent
// Get correct offsets
// Add offsetParent borders
return"fixed"===dt.css(n,"position")?e=n.getBoundingClientRect():(t=this.offsetParent(),e=this.offset(),r(t[0],"html")||(i=t.offset()),i={top:i.top+dt.css(t[0],"borderTopWidth",!0),left:i.left+dt.css(t[0],"borderLeftWidth",!0)}),{top:e.top-i.top-dt.css(n,"marginTop",!0),left:e.left-i.left-dt.css(n,"marginLeft",!0)}}},
// This method will return documentElement in the following cases:
// 1) For the element inside the iframe without offsetParent, this method will return
//    documentElement of the parent window
// 2) For the hidden or detached element
// 3) For body or html element, i.e. in case of the html node - it will return itself
//
// but those exceptions were never presented as a real life use-cases
// and might be considered as more preferable results.
//
// This logic, however, is not guaranteed and can change at any point in the future
offsetParent:function(){return this.map(function(){for(var t=this.offsetParent;t&&"static"===dt.css(t,"position");)t=t.offsetParent;return t||Gt})}}),
// Create scrollLeft and scrollTop methods
dt.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,e){var n="pageYOffset"===e;dt.fn[t]=function(i){return Ot(this,function(t,i,o){
// Coalesce documents and windows
var r;if(dt.isWindow(t)?r=t:9===t.nodeType&&(r=t.defaultView),void 0===o)return r?r[e]:t[i];r?r.scrollTo(n?r.pageXOffset:o,n?o:r.pageYOffset):t[i]=o},t,i,arguments.length)}}),
// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
dt.each(["top","left"],function(t,e){dt.cssHooks[e]=L(ht.pixelPosition,function(t,n){if(n)
// If curCSS returns percentage, fallback to offset
return n=I(t,e),re.test(n)?dt(t).position()[e]+"px":n})}),
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
dt.each({Height:"height",Width:"width"},function(t,e){dt.each({padding:"inner"+t,content:e,"":"outer"+t},function(n,i){
// Margin is only for outerHeight, outerWidth
dt.fn[i]=function(o,r){var s=arguments.length&&(n||"boolean"!=typeof o),a=n||(!0===o||!0===r?"margin":"border");return Ot(this,function(e,n,o){var r;
// Get document width or height
// Get width or height on the element, requesting but not forcing parseFloat
// Set width or height on the element
return dt.isWindow(e)?0===i.indexOf("outer")?e["inner"+t]:e.document.documentElement["client"+t]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+t],r["scroll"+t],e.body["offset"+t],r["offset"+t],r["client"+t])):void 0===o?dt.css(e,n,a):dt.style(e,n,o,a)},e,s?o:void 0,s)}})}),dt.fn.extend({bind:function(t,e,n){return this.on(t,null,e,n)},unbind:function(t,e){return this.off(t,null,e)},delegate:function(t,e,n,i){return this.on(e,t,n,i)},undelegate:function(t,e,n){
// ( namespace ) or ( selector, types [, fn] )
return 1===arguments.length?this.off(t,"**"):this.off(e,t||"**",n)}}),dt.holdReady=function(t){t?dt.readyWait++:dt.ready(!0)},dt.isArray=Array.isArray,dt.parseJSON=JSON.parse,dt.nodeName=r,
// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
"function"==typeof i&&i.amd&&i("jquery",[],function(){return dt});var
// Map over jQuery in case of overwrite
ze=t.jQuery,
// Map over the $ in case of overwrite
Ve=t.$;
// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
return dt.noConflict=function(e){return t.$===dt&&(t.$=Ve),e&&t.jQuery===dt&&(t.jQuery=ze),dt},e||(t.jQuery=t.$=dt),dt}),o("undefined"!=typeof $?$:window.$)}).call(t,void 0,void 0,void 0,void 0,function(t){e.exports=t})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],3:[function(t,e,n){/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */
!function(){function t(t,e,n){return t.call.apply(t.bind,arguments)}function n(t,e,n){if(!t)throw Error();if(2<arguments.length){var i=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,i),t.apply(e,n)}}return function(){return t.apply(e,arguments)}}function i(e,o,r){return(i=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?t:n).apply(null,arguments)}function o(t,e){this.a=t,this.o=e||t,this.c=this.o.document}function r(t,e,n,i){if(e=t.c.createElement(e),n)for(var o in n)n.hasOwnProperty(o)&&("style"==o?e.style.cssText=n[o]:e.setAttribute(o,n[o]));return i&&e.appendChild(t.c.createTextNode(i)),e}function s(t,e,n){(t=t.c.getElementsByTagName(e)[0])||(t=document.documentElement),t.insertBefore(n,t.lastChild)}function a(t){t.parentNode&&t.parentNode.removeChild(t)}function l(t,e,n){e=e||[],n=n||[];for(var i=t.className.split(/\s+/),o=0;o<e.length;o+=1){for(var r=!1,s=0;s<i.length;s+=1)if(e[o]===i[s]){r=!0;break}r||i.push(e[o])}for(e=[],o=0;o<i.length;o+=1){for(r=!1,s=0;s<n.length;s+=1)if(i[o]===n[s]){r=!0;break}r||e.push(i[o])}t.className=e.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function u(t,e){for(var n=t.className.split(/\s+/),i=0,o=n.length;i<o;i++)if(n[i]==e)return!0;return!1}function c(t){return t.o.location.hostname||t.a.location.hostname}function f(t,e,n){function i(){u&&o&&a&&(u(l),u=null)}e=r(t,"link",{rel:"stylesheet",href:e,media:"all"});var o=!1,a=!0,l=null,u=n||null;nt?(e.onload=function(){o=!0,i()},e.onerror=function(){o=!0,l=Error("Stylesheet failed to load"),i()}):setTimeout(function(){o=!0,i()},0),s(t,"head",e)}function p(t,e,n,i){var o=t.c.getElementsByTagName("head")[0];if(o){var s=r(t,"script",{src:e}),a=!1;return s.onload=s.onreadystatechange=function(){a||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(a=!0,n&&n(null),s.onload=s.onreadystatechange=null,"HEAD"==s.parentNode.tagName&&o.removeChild(s))},o.appendChild(s),setTimeout(function(){a||(a=!0,n&&n(Error("Script load timeout")))},i||5e3),s}return null}function h(){this.a=0,this.c=null}function d(t){return t.a++,function(){t.a--,v(t)}}function g(t,e){t.c=e,v(t)}function v(t){0==t.a&&t.c&&(t.c(),t.c=null)}function m(t){this.a=t||"-"}function y(t,e){this.c=t,this.f=4,this.a="n";var n=(e||"n4").match(/^([nio])([1-9])$/i);n&&(this.a=n[1],this.f=parseInt(n[2],10))}function b(t){return T(t)+" "+t.f+"00 300px "+w(t.c)}function w(t){var e=[];t=t.split(/,\s*/);for(var n=0;n<t.length;n++){var i=t[n].replace(/['"]/g,"");-1!=i.indexOf(" ")||/^\d/.test(i)?e.push("'"+i+"'"):e.push(i)}return e.join(",")}function x(t){return t.a+t.f}function T(t){var e="normal";return"o"===t.a?e="oblique":"i"===t.a&&(e="italic"),e}function C(t){var e=4,n="n",i=null;return t&&((i=t.match(/(normal|oblique|italic)/i))&&i[1]&&(n=i[1].substr(0,1).toLowerCase()),(i=t.match(/([1-9]00|normal|bold)/i))&&i[1]&&(/bold/i.test(i[1])?e=7:/[1-9]00/.test(i[1])&&(e=parseInt(i[1].substr(0,1),10)))),n+e}function E(t,e){this.c=t,this.f=t.o.document.documentElement,this.h=e,this.a=new m("-"),this.j=!1!==e.events,this.g=!1!==e.classes}function S(t){t.g&&l(t.f,[t.a.c("wf","loading")]),$(t,"loading")}function k(t){if(t.g){var e=u(t.f,t.a.c("wf","active")),n=[],i=[t.a.c("wf","loading")];e||n.push(t.a.c("wf","inactive")),l(t.f,n,i)}$(t,"inactive")}function $(t,e,n){t.j&&t.h[e]&&(n?t.h[e](n.c,x(n)):t.h[e]())}function N(){this.c={}}function D(t,e,n){var i,o=[];for(i in e)if(e.hasOwnProperty(i)){var r=t.c[i];r&&o.push(r(e[i],n))}return o}function A(t,e){this.c=t,this.f=e,this.a=r(this.c,"span",{"aria-hidden":"true"},this.f)}function j(t){s(t.c,"body",t.a)}function O(t){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+w(t.c)+";font-style:"+T(t)+";font-weight:"+t.f+"00;"}function I(t,e,n,i,o,r){this.g=t,this.j=e,this.a=i,this.c=n,this.f=o||3e3,this.h=r||void 0}function L(t,e,n,i,o,r,s){this.v=t,this.B=e,this.c=n,this.a=i,this.s=s||"BESbswy",this.f={},this.w=o||3e3,this.u=r||null,this.m=this.j=this.h=this.g=null,this.g=new A(this.c,this.s),this.h=new A(this.c,this.s),this.j=new A(this.c,this.s),this.m=new A(this.c,this.s),t=O(t=new y(this.a.c+",serif",x(this.a))),this.g.a.style.cssText=t,t=O(t=new y(this.a.c+",sans-serif",x(this.a))),this.h.a.style.cssText=t,t=O(t=new y("serif",x(this.a))),this.j.a.style.cssText=t,t=O(t=new y("sans-serif",x(this.a))),this.m.a.style.cssText=t,j(this.g),j(this.h),j(this.j),j(this.m)}function R(){if(null===ot){var t=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);ot=!!t&&(536>parseInt(t[1],10)||536===parseInt(t[1],10)&&11>=parseInt(t[2],10))}return ot}function q(t,e,n){for(var i in it)if(it.hasOwnProperty(i)&&e===t.f[it[i]]&&n===t.f[it[i]])return!0;return!1}function F(t){var e,n=t.g.a.offsetWidth,i=t.h.a.offsetWidth;(e=n===t.f.serif&&i===t.f["sans-serif"])||(e=R()&&q(t,n,i)),e?et()-t.A>=t.w?R()&&q(t,n,i)&&(null===t.u||t.u.hasOwnProperty(t.a.c))?H(t,t.v):H(t,t.B):P(t):H(t,t.v)}function P(t){setTimeout(i(function(){F(this)},t),50)}function H(t,e){setTimeout(i(function(){a(this.g.a),a(this.h.a),a(this.j.a),a(this.m.a),e(this.a)},t),0)}function _(t,e,n){this.c=t,this.a=e,this.f=0,this.m=this.j=!1,this.s=n}function W(t){0==--t.f&&t.j&&(t.m?((t=t.a).g&&l(t.f,[t.a.c("wf","active")],[t.a.c("wf","loading"),t.a.c("wf","inactive")]),$(t,"active")):k(t.a))}function M(t){this.j=t,this.a=new N,this.h=0,this.f=this.g=!0}function B(t,e,n,o,r){var s=0==--t.h;(t.f||t.g)&&setTimeout(function(){var t=r||null,a=o||null||{};if(0===n.length&&s)k(e.a);else{e.f+=n.length,s&&(e.j=s);var u,c=[];for(u=0;u<n.length;u++){var f=n[u],p=a[f.c],h=e.a,d=f;if(h.g&&l(h.f,[h.a.c("wf",d.c,x(d).toString(),"loading")]),$(h,"fontloading",d),h=null,null===rt)if(window.FontFace){var d=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),g=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);rt=d?42<parseInt(d[1],10):!g}else rt=!1;h=rt?new I(i(e.g,e),i(e.h,e),e.c,f,e.s,p):new L(i(e.g,e),i(e.h,e),e.c,f,e.s,t,p),c.push(h)}for(u=0;u<c.length;u++)c[u].start()}},0)}function U(t,e,n){var i=[],o=n.timeout;S(e);var i=D(t.a,n,t.c),r=new _(t.c,e,o);for(t.h=i.length,e=0,n=i.length;e<n;e++)i[e].load(function(e,n,i){B(t,r,e,n,i)})}function z(t,e){this.c=t,this.a=e}function V(t,e){this.c=t,this.a=e}function X(t,e){this.c=t||st,this.a=[],this.f=[],this.g=e||""}function Q(t,e){for(var n=e.length,i=0;i<n;i++){var o=e[i].split(":");3==o.length&&t.f.push(o.pop());var r="";2==o.length&&""!=o[1]&&(r=":"),t.a.push(o.join(r))}}function G(t){if(0==t.a.length)throw Error("No fonts to load!");if(-1!=t.c.indexOf("kit="))return t.c;for(var e=t.a.length,n=[],i=0;i<e;i++)n.push(t.a[i].replace(/ /g,"+"));return e=t.c+"?family="+n.join("%7C"),0<t.f.length&&(e+="&subset="+t.f.join(",")),0<t.g.length&&(e+="&text="+encodeURIComponent(t.g)),e}function Y(t){this.f=t,this.a=[],this.c={}}function J(t){for(var e=t.f.length,n=0;n<e;n++){var i=t.f[n].split(":"),o=i[0].replace(/\+/g," "),r=["n4"];if(2<=i.length){var s;if(s=[],a=i[1])for(var a=a.split(","),l=a.length,u=0;u<l;u++){var c;if((c=a[u]).match(/^[\w-]+$/))if(null==(p=ct.exec(c.toLowerCase())))c="";else{if(c=p[2],c=null==c||""==c?"n":ut[c],null==(p=p[1])||""==p)p="4";else var f=lt[p],p=f||(isNaN(p)?"4":p.substr(0,1));c=[c,p].join("")}else c="";c&&s.push(c)}0<s.length&&(r=s),3==i.length&&(i=i[2],s=[],0<(i=i?i.split(","):s).length&&(i=at[i[0]])&&(t.c[o]=i))}for(t.c[o]||(i=at[o])&&(t.c[o]=i),i=0;i<r.length;i+=1)t.a.push(new y(o,r[i]))}}function K(t,e){this.c=t,this.a=e}function Z(t,e){this.c=t,this.a=e}function tt(t,e){this.c=t,this.f=e,this.a=[]}var et=Date.now||function(){return+new Date},nt=!!window.FontFace;m.prototype.c=function(t){for(var e=[],n=0;n<arguments.length;n++)e.push(arguments[n].replace(/[\W_]+/g,"").toLowerCase());return e.join(this.a)},I.prototype.start=function(){var t=this.c.o.document,e=this,n=et(),i=new Promise(function(i,o){function r(){et()-n>=e.f?o():t.fonts.load(b(e.a),e.h).then(function(t){1<=t.length?i():setTimeout(r,25)},function(){o()})}r()}),o=null,r=new Promise(function(t,n){o=setTimeout(n,e.f)});Promise.race([r,i]).then(function(){o&&(clearTimeout(o),o=null),e.g(e.a)},function(){e.j(e.a)})};var it={D:"serif",C:"sans-serif"},ot=null;L.prototype.start=function(){this.f.serif=this.j.a.offsetWidth,this.f["sans-serif"]=this.m.a.offsetWidth,this.A=et(),F(this)};var rt=null;_.prototype.g=function(t){var e=this.a;e.g&&l(e.f,[e.a.c("wf",t.c,x(t).toString(),"active")],[e.a.c("wf",t.c,x(t).toString(),"loading"),e.a.c("wf",t.c,x(t).toString(),"inactive")]),$(e,"fontactive",t),this.m=!0,W(this)},_.prototype.h=function(t){var e=this.a;if(e.g){var n=u(e.f,e.a.c("wf",t.c,x(t).toString(),"active")),i=[],o=[e.a.c("wf",t.c,x(t).toString(),"loading")];n||i.push(e.a.c("wf",t.c,x(t).toString(),"inactive")),l(e.f,i,o)}$(e,"fontinactive",t),W(this)},M.prototype.load=function(t){this.c=new o(this.j,t.context||this.j),this.g=!1!==t.events,this.f=!1!==t.classes,U(this,new E(this.c,t),t)},z.prototype.load=function(t){function e(){if(r["__mti_fntLst"+i]){var n,o=r["__mti_fntLst"+i](),s=[];if(o)for(var a=0;a<o.length;a++){var l=o[a].fontfamily;void 0!=o[a].fontStyle&&void 0!=o[a].fontWeight?(n=o[a].fontStyle+o[a].fontWeight,s.push(new y(l,n))):s.push(new y(l))}t(s)}else setTimeout(function(){e()},50)}var n=this,i=n.a.projectId,o=n.a.version;if(i){var r=n.c.o;p(this.c,(n.a.api||"https://fast.fonts.net/jsapi")+"/"+i+".js"+(o?"?v="+o:""),function(o){o?t([]):(r["__MonotypeConfiguration__"+i]=function(){return n.a},e())}).id="__MonotypeAPIScript__"+i}else t([])},V.prototype.load=function(t){var e,n,i=this.a.urls||[],o=this.a.families||[],r=this.a.testStrings||{},s=new h;for(e=0,n=i.length;e<n;e++)f(this.c,i[e],d(s));var a=[];for(e=0,n=o.length;e<n;e++)if((i=o[e].split(":"))[1])for(var l=i[1].split(","),u=0;u<l.length;u+=1)a.push(new y(i[0],l[u]));else a.push(new y(i[0]));g(s,function(){t(a,r)})};var st="https://fonts.googleapis.com/css",at={latin:"BESbswy","latin-ext":"çöüğş",cyrillic:"йяЖ",greek:"αβΣ",khmer:"កខគ",Hanuman:"កខគ"},lt={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},ut={i:"i",italic:"i",n:"n",normal:"n"},ct=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/,ft={Arimo:!0,Cousine:!0,Tinos:!0};K.prototype.load=function(t){var e=new h,n=this.c,i=new X(this.a.api,this.a.text),o=this.a.families;Q(i,o);var r=new Y(o);J(r),f(n,G(i),d(e)),g(e,function(){t(r.a,r.c,ft)})},Z.prototype.load=function(t){var e=this.a.id,n=this.c.o;e?p(this.c,(this.a.api||"https://use.typekit.net")+"/"+e+".js",function(e){if(e)t([]);else if(n.Typekit&&n.Typekit.config&&n.Typekit.config.fn){e=n.Typekit.config.fn;for(var i=[],o=0;o<e.length;o+=2)for(var r=e[o],s=e[o+1],a=0;a<s.length;a++)i.push(new y(r,s[a]));try{n.Typekit.load({events:!1,classes:!1,async:!0})}catch(t){}t(i)}},2e3):t([])},tt.prototype.load=function(t){var e=this.f.id,n=this.c.o,i=this;e?(n.__webfontfontdeckmodule__||(n.__webfontfontdeckmodule__={}),n.__webfontfontdeckmodule__[e]=function(e,n){for(var o=0,r=n.fonts.length;o<r;++o){var s=n.fonts[o];i.a.push(new y(s.name,C("font-weight:"+s.weight+";font-style:"+s.style)))}t(i.a)},p(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+c(this.c)+"/"+e+".js",function(e){e&&t([])})):t([])};var pt=new M(window);pt.a.c.custom=function(t,e){return new V(e,t)},pt.a.c.fontdeck=function(t,e){return new tt(e,t)},pt.a.c.monotype=function(t,e){return new z(e,t)},pt.a.c.typekit=function(t,e){return new Z(e,t)},pt.a.c.google=function(t,e){return new K(e,t)};var ht={load:i(pt.load,pt)};"function"==typeof define&&define.amd?define(function(){return ht}):void 0!==e&&e.exports?e.exports=ht:(window.WebFont=ht,window.WebFontConfig&&pt.load(window.WebFontConfig))}()},{}],4:[function(t,e,n){window.setTimeout(function(){$(".alert-success:visible, .alert-danger:visible").fadeTo(500,0).slideUp(500,function(){$(this).remove()})},6e3)},{}],5:[function(t,e,n){t("webfontloader").load({google:{families:["Montserrat:300,600"]}})},{webfontloader:3}],6:[function(t,e,n){t("./_font-loader.js"),t("./_alert.js")},{"./_alert.js":4,"./_font-loader.js":5}]},{},[6,2,1]);
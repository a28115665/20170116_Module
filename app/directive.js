angular.module('app')
.directive('action', function($rootScope, $filter, $state, AuthApi) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            /*
             * SMART ACTIONS
             */
            var smartActions = {
    
                // LOGOUT MSG 
                userLogout: function($this){
            
                    // ask verification
                    $.SmartMessageBox({
                        title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> 登出 <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
                        content : $this.data('logout-msg'),
                        buttons : '[否][是]'
            
                    }, function(ButtonPressed) {
                        if (ButtonPressed == "是") {
                            // $.root_.addClass('animated fadeOutUp');
                            // setTimeout(logout, 1000);
                            $state.transitionTo("login");
                            AuthApi.Logout();
                        }
                    });

                    // function logout() {
                    //     window.location = $this.attr('href');
                    // }
            
                },

                // RESET WIDGETS
                resetWidgets: function($this){
                    $.widresetMSG = $this.data('reset-msg');
                    
                    $.SmartMessageBox({
                        title : "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
                        content : $.widresetMSG || "Would you like to RESET all your saved widgets and clear LocalStorage?",
                        buttons : '[No][Yes]'
                    }, function(ButtonPressed) {
                        if (ButtonPressed == "Yes" && localStorage) {
                            localStorage.clear();
                            location.reload();
                        }
            
                    });
                },
                
                // LAUNCH FULLSCREEN 
                launchFullscreen: function(element){
            
                    if (!$.root_.hasClass("full-screen")) {
                
                        $.root_.addClass("full-screen");
                
                        if (element.requestFullscreen) {
                            element.requestFullscreen();
                        } else if (element.mozRequestFullScreen) {
                            element.mozRequestFullScreen();
                        } else if (element.webkitRequestFullscreen) {
                            element.webkitRequestFullscreen();
                        } else if (element.msRequestFullscreen) {
                            element.msRequestFullscreen();
                        }
                
                    } else {
                        
                        $.root_.removeClass("full-screen");
                        
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                
                    }
            
               },
            
               // MINIFY MENU
                minifyMenu: function($this){
                    if (!$.root_.hasClass("menu-on-top")){
                        $.root_.toggleClass("minified");
                        $.root_.removeClass("hidden-menu");
                        $('html').removeClass("hidden-menu-mobile-lock");
                        $this.effect("highlight", {}, 500);
                    }
                },
                
                // TOGGLE MENU 
                toggleMenu: function(){
                    if (!$.root_.hasClass("menu-on-top")){
                        $('html').toggleClass("hidden-menu-mobile-lock");
                        $.root_.toggleClass("hidden-menu");
                        $.root_.removeClass("minified");
                    } else if ( $.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated") ) {
                        $('html').toggleClass("hidden-menu-mobile-lock");
                        $.root_.toggleClass("hidden-menu");
                        $.root_.removeClass("minified");
                    }
                },     
            
                // TOGGLE SHORTCUT 
                toggleShortcut: function(){
                    
                    if (shortcut_dropdown.is(":visible")) {
                        shortcut_buttons_hide();
                    } else {
                        shortcut_buttons_show();
                    }

                    // SHORT CUT (buttons that appear when clicked on user name)
                    shortcut_dropdown.find('a').click(function(e) {
                        e.preventDefault();
                        window.location = $(this).attr('href');
                        setTimeout(shortcut_buttons_hide, 300);
                
                    });
                
                    // SHORTCUT buttons goes away if mouse is clicked outside of the area
                    $(document).mouseup(function(e) {
                        if (!shortcut_dropdown.is(e.target) && shortcut_dropdown.has(e.target).length === 0) {
                            shortcut_buttons_hide();
                        }
                    });
                    
                    // SHORTCUT ANIMATE HIDE
                    function shortcut_buttons_hide() {
                        shortcut_dropdown.animate({
                            height : "hide"
                        }, 300, "easeOutCirc");
                        $.root_.removeClass('shortcut-on');
                
                    }
                
                    // SHORTCUT ANIMATE SHOW
                    function shortcut_buttons_show() {
                        shortcut_dropdown.animate({
                            height : "show"
                        }, 200, "easeOutCirc");
                        $.root_.addClass('shortcut-on');
                    }
            
                }  
               
            };
            
            var actionEvents = {
                userLogout: function(e) {
                    smartActions.userLogout(element);
                },
                resetWidgets: function(e) {
                    smartActions.resetWidgets(element);
                },
                launchFullscreen: function(e) {
                    smartActions.launchFullscreen(document.documentElement);
                },
                minifyMenu: function(e) {
                    smartActions.minifyMenu(element);
                },
                toggleMenu: function(e) {
                    smartActions.toggleMenu();
                },
                toggleShortcut: function(e) {
                    smartActions.toggleShortcut();
                }
            };

            if (angular.isDefined(attrs.action) && attrs.action != '') {
                var actionEvent = actionEvents[attrs.action];
                if (typeof actionEvent === 'function') {
                    element.on('click', function(e) {
                        actionEvent(e);
                        e.preventDefault();
                    });
                }
            }

        }
    };
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})
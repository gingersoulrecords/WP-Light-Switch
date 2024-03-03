(function ($) {
    // Create the lightswitch object
    window.lightswitch = {
        // Empty switches array
        switches: [],

        // lightSwitchCookieStorage object
        lightSwitchCookieStorage: {
            setCookie: function setCookie(key, value, time, path) {
                var expires = new Date();
                expires.setTime(expires.getTime() + time);
                var pathValue = '';
                if (typeof path !== 'undefined') {
                    pathValue = 'path=' + path + ';';
                }
                document.cookie = key + '=' + value + ';' + pathValue + 'expires=' + expires.toUTCString();
            },
            getCookie: function getCookie(key) {
                var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
                return keyValue ? keyValue[2] : null;
            },
            removeCookie: function removeCookie(key) {
                document.cookie = key + '=; Max-Age=0; path=/';
            }
        },

        // IndexSwitches method
        indexSwitches: function () {
            console.log('indexSwitches method called')
            var self = this; // Save a reference to the lightswitch object

            // Find each .ls-toggle and .ls-menu element
            $('[class*="ls-toggle-"], [class*="ls-menu-"]').each(function () {
                // Get the class names
                var classNames = $(this).attr('class').split(' ');

                // Find the class that starts with 'ls-'
                var lsClass = classNames.find(function (className) {
                    return className.startsWith('ls-toggle-') || className.startsWith('ls-menu-');
                });

                if (lsClass) {
                    // Extract the switch name and modes from the ls- class
                    var name = lsClass.split('ls-toggle-')[1] || lsClass.split('ls-menu-')[1];
                    var modes = name.split('-');

                    // Create an object representing the switch
                    var switchObj = {
                        switch: $(this),
                        name: name,
                        modes: modes
                    };

                    // Add the switch object to the switches array
                    self.switches.push(switchObj); // Use self instead of this

                    // If there's no cookie that matches the name of this switch, set the page to the default mode
                    if (!self.lightSwitchCookieStorage.getCookie('ls-' + name)) {
                        var defaultMode = modes[0];
                        self.updateBodyClass(defaultMode, name);
                        // Uncomment the following line to also set the cookie to the switch's default mode
                        // self.setModeCookie(defaultMode, name);
                    }
                }
            });
        },

        // processSwitches method
        processSwitches: function () {
            this.switches.forEach(switchObj => {
                if (switchObj.switch.hasClass('ls-toggle-' + switchObj.name)) {
                    this.processToggles(switchObj);
                } else if (switchObj.switch.hasClass('ls-menu-' + switchObj.name)) {
                    this.processMenus(switchObj);
                }
            });
        },

        processToggles: function (switchObj) {
            switchObj.switch.on('click', () => {
                console.log('Toggle switch clicked.');

                const [defaultMode, alternateMode] = switchObj.modes;
                console.log(`Default mode: ${defaultMode}, Alternate mode: ${alternateMode}`);

                const currentMode = $('body').attr('class').match(new RegExp('ls-' + switchObj.name + '-added-\\S+'));
                let currentModeSuffix = '';
                if (currentMode) {
                    currentModeSuffix = currentMode[0].split('-').pop();
                    console.log(`Current mode: ${currentModeSuffix}`);
                    $('body').removeClass(currentModeSuffix);
                    $('body').removeClass(currentMode[0]);
                }

                let newMode = '';
                if (!currentModeSuffix || currentModeSuffix === defaultMode) {
                    console.log('Switching to alternate mode.');
                    newMode = alternateMode;
                } else {
                    console.log('Switching to default mode.');
                    newMode = defaultMode;
                }

                this.lightSwitchCookieStorage.removeCookie(switchObj.name);
                this.toggleMode(newMode, switchObj.name);
                this.updateBodyClass(newMode, switchObj.name);

                // Remove the setModeCookie call from here

                // Add the new mode class to the body
                $('body').addClass(newMode);
            });
        },

        // toggleMode method
        toggleMode: function (mode, switchName) {
            // Check if the body has the class
            var hasClass = $('body').hasClass('ls-' + switchName + '-added-' + mode);

            // Toggle the class on the body element
            $('body').toggleClass('ls-' + switchName + '-added-' + mode);

            // If the body had the class, remove the class and the attribute
            // Otherwise, add the class and update the attribute
            if (hasClass) {
                $('body').removeClass('ls-' + switchName + '-added-' + mode);
                this.removeBodyModeClass(switchName);
            } else {
                $('body').addClass('ls-' + switchName + '-added-' + mode);
                this.updateBodyClass(mode, switchName);
            }

            // Call setModeCookie method to set the mode cookie
            this.setModeCookie(mode, switchName);
        },

        // // updateBodyClass method
        // updateBodyClass: function (newMode, switchName) {
        //     const oldMode = $('body').attr('class').match(new RegExp('ls-' + switchName + '-added-\\S+'));
        //     if (oldMode) {
        //         $('body').removeClass(oldMode[0]);
        //     }
        //     $('body').addClass('ls-' + switchName + '-added-' + newMode);
        // },

        // updateBodyClass method
        updateBodyClass: function (newMode, switchName) {
            const oldMode = $('body').attr('class').match(new RegExp('ls-' + switchName + '-added-\\S+'));
            if (oldMode) {
                $('body').removeClass(oldMode[0]);
            }
            $('body').addClass('ls-' + switchName + '-added-' + newMode);

            // Also add the mode as a class
            $('body').addClass(newMode);
        },

        // removeBodyModeClass method
        removeBodyModeClass: function (switchName) {
            const oldMode = $('body').attr('class').match(new RegExp('ls-' + switchName + '-added-\\S+'));
            if (oldMode) {
                $('body').removeClass(oldMode[0]);
            }
        },


        // setModeCookie method
        setModeCookie: function (mode, switchName) {
            // Set a cookie with the prefix 'ls-', the switch name and mode
            this.lightSwitchCookieStorage.setCookie('ls-' + switchName, mode, 2628000000, '/');
            console.log(`Cookie set: ls-${switchName} = ${mode}`);
        },




    };



    //init functions
    window.lightswitch.indexSwitches();
    window.lightswitch.processSwitches();
})(jQuery);

<?php
/*
Plugin Name: WP LightSwitch
Description: A plugin to toggle light/dark mode on your WordPress site.
Version: 1.0
Author: Dave Bloom
*/

// Enqueue scripts

function wp_lightswitch_enqueue_scripts()
{
    // Enqueue jQuery
    wp_enqueue_script('jquery');

    // Enqueue your JavaScript file
    wp_enqueue_script('wp-lightswitch', plugin_dir_url(__FILE__) . 'js/wp-lightswitch.js', array('jquery'), '1.0', true);
}

add_action('wp_enqueue_scripts', 'wp_lightswitch_enqueue_scripts');


$cookiesDeleted = false;

function delete_mode_cookie()
{
    global $cookiesDeleted;
    $cookiesDeleted = true;

    // Loop over all cookies
    foreach ($_COOKIE as $key => $value) {
        // Check if the cookie key starts with the 'ls-' prefix
        if (strpos($key, 'ls-') === 0) {
            // Delete the cookie
            setcookie($key, '', time() - 3600, '/');
            unset($_COOKIE[$key]); // Also unset the cookie from the $_COOKIE array
        }
    }
}

// Add class to body
function wp_lightswitch_body_class($classes)
{
    global $cookiesDeleted;

    // Uncomment the following line to delete all 'ls-' cookies
    //delete_mode_cookie();

    if ($cookiesDeleted) {
        return $classes;
    }

    // Loop over all cookies
    foreach ($_COOKIE as $key => $value) {
        // Check if the cookie key starts with the 'ls-' prefix
        if (strpos($key, 'ls-') === 0) {
            // Remove the 'ls-' prefix from the cookie key to get the switch name
            $switchName = substr($key, 3);

            // The cookie value is the mode
            $mode = $value;

            // Add the mode as a body class
            $classes[] = $mode;
            // Add 'ls-[name]-added-' prefix to the mode
            $classes[] = 'ls-' . $switchName . '-added-' . $mode;
        }
    }

    return $classes;
}

add_filter('body_class', 'wp_lightswitch_body_class');

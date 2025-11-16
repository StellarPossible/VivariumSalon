<?php
define( 'DB_NAME', 'vivarium_salon_wp' );
define( 'DB_USER', 'vivarium_user' );
define( 'DB_PASSWORD', 'VivSalon2024!DB' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         'your-auth-key-here' );
define( 'SECURE_AUTH_KEY',  'your-secure-auth-key-here' );
define( 'LOGGED_IN_KEY',    'your-logged-in-key-here' );
define( 'NONCE_KEY',        'your-nonce-key-here' );
define( 'AUTH_SALT',        'your-auth-salt-here' );
define( 'SECURE_AUTH_SALT', 'your-secure-auth-salt-here' );
define( 'LOGGED_IN_SALT',   'your-logged-in-salt-here' );
define( 'NONCE_SALT',       'your-nonce-salt-here' );

$table_prefix = 'wp_';

define( 'WP_DEBUG', false );

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';

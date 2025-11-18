<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
define('DB_NAME', 'vivarium_salon_wp');
define('DB_USER', 'vivarium_wp_user');
define('DB_PASSWORD', 'Vivarium2024!Salon#Secure');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '+c%gvMO>96E#ib<(-=XsAOCcRT(TiMhp6@U/0tTfr@-(vAPkFz`_^fH)O`Yr4lu?');
define('SECURE_AUTH_KEY',  'E,Wu4TS?)bP^S%^fj5=Kv3>6.U2uR${F#2dHI,[T&1;:Cm%*mAnxks-`@vG&nE8q');
define('LOGGED_IN_KEY',    ':98x.0azY:h?,F|{BUl4OM.UJVNMeHZV[1p|J, R|ph,]xuAXA0/BeMi0)@h^wae');
define('NONCE_KEY',        '^iq|G89nDkY_d.wAb|%-kC2mnIBV {=q<Qp]yY|FM+&/lGcEVT7UM{wWnJSX#ayD');
define('AUTH_SALT',        'pkI8&6dtflOdlELxOZ07 e{<CEewjwn(~|_E+ErJ;}Tnt3&$MwO4|CUC@jGE>W]K');
define('SECURE_AUTH_SALT', '`WOUFb}QB8k[_k(5h8-|u~N+M Z)[-_lc9;)HyP!sUr/R{Q_2}0kt6^ISVmYqS!1');
define('LOGGED_IN_SALT',   'RU.>#e&3Y4U^}:IL~D4eJG/NDIi`.RW/eO )lDn{=7pmNy@t+>~qsMcX@k-Qvp/f');
define('NONCE_SALT',       '3PRHt~3t|=!yU<dpqY7z/%j| yw5X%w$^8tLX-/m+K/c41Agr*0j,#.g#X+#ddm ');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );


/* Add any custom values between this line and the "stop editing" line. */
define('WP_HOME', 'https://vivarium.stellarpossible.com/cms');
define('WP_SITEURL', 'https://vivarium.stellarpossible.com/cms');
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'vivarium-jwt-secret-key-2024');


/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

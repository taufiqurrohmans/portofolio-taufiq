CREATE TABLE `contact_rate_limits` (
	`fingerprint` text PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`window_start` text NOT NULL,
	`expires_at` text NOT NULL
);

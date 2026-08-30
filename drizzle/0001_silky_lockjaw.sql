ALTER TABLE `projects` ADD `problem` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `solution` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `dataset` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `method` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `evaluation` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `gallery_json` text DEFAULT '[]' NOT NULL;
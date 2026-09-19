ALTER TYPE "public"."order_status" ADD VALUE 'samples_sent' BEFORE 'quoted';--> statement-breakpoint
ALTER TYPE "public"."order_status" ADD VALUE 'quote_in_preparation' BEFORE 'quoted';--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "room_count" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "annual_guests_estimate" integer;
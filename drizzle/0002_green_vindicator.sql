CREATE TABLE "visitor_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"path" text NOT NULL,
	"locale" text,
	"referrer" text,
	"country" text,
	"city" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "visitor_events_session_id_idx" ON "visitor_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "visitor_events_created_at_idx" ON "visitor_events" USING btree ("created_at");

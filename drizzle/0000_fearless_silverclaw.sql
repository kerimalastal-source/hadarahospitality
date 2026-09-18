CREATE TYPE "public"."document_kind" AS ENUM('customer_upload', 'catalog');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('quote_requested', 'quoted', 'confirmed', 'in_production', 'shipped', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."portal_user_role" AS ENUM('customer', 'staff');--> statement-breakpoint
CREATE TYPE "public"."portal_user_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" "order_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"reference" text NOT NULL,
	"status" "order_status" DEFAULT 'quote_requested' NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"order_id" uuid,
	"file_url" text NOT NULL,
	"file_name" text NOT NULL,
	"uploaded_by" uuid,
	"kind" "document_kind" DEFAULT 'customer_upload' NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"company_id" uuid,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"role" "portal_user_role" DEFAULT 'customer' NOT NULL,
	"status" "portal_user_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portal_users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"file_url" text NOT NULL,
	"amount" text,
	"currency" text,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_status_events" ADD CONSTRAINT "order_status_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_portal_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."portal_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_documents" ADD CONSTRAINT "portal_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_documents" ADD CONSTRAINT "portal_documents_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_documents" ADD CONSTRAINT "portal_documents_uploaded_by_portal_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."portal_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_users" ADD CONSTRAINT "portal_users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
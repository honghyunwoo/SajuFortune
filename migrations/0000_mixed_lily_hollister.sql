CREATE TABLE "donations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reading_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"donor_name" text,
	"message" text,
	"payment_intent_id" text,
	"is_paid" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fortune_readings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"session_id" varchar NOT NULL,
	"gender" text NOT NULL,
	"birth_year" integer NOT NULL,
	"birth_month" integer NOT NULL,
	"birth_day" integer NOT NULL,
	"birth_hour" integer NOT NULL,
	"birth_minute" integer NOT NULL,
	"calendar_type" text NOT NULL,
	"service_type" text DEFAULT 'free' NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"saju_data" jsonb NOT NULL,
	"analysis_result" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

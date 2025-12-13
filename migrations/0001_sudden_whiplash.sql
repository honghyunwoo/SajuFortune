ALTER TABLE "donations" ADD COLUMN "is_refunded" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "refunded_at" timestamp;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "refund_reason" text;
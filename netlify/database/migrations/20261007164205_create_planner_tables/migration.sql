CREATE TABLE "backups" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" text PRIMARY KEY,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"collected" boolean DEFAULT false NOT NULL,
	"category" text,
	"notes" text,
	CONSTRAINT "materials_quantity_positive" CHECK ("quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_materials" (
	"id" text PRIMARY KEY,
	"template_id" text NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"category" text,
	CONSTRAINT "template_materials_quantity_positive" CHECK ("quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "materials_project_id_idx" ON "materials" ("project_id");--> statement-breakpoint
CREATE INDEX "template_materials_template_id_idx" ON "template_materials" ("template_id");--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "template_materials" ADD CONSTRAINT "template_materials_template_id_templates_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE;
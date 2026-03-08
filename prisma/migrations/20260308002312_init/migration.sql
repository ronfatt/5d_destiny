-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MEMBER', 'READER', 'MENTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "ReadingTheme" AS ENUM ('CAREER', 'WEALTH', 'LOVE', 'HEALTH');

-- CreateEnum
CREATE TYPE "ReadingType" AS ENUM ('QUICK', 'STANDARD', 'DEEP', 'DAILY');

-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CardCategory" AS ENUM ('ARCHETYPE', 'ENERGY', 'EVENT');

-- CreateEnum
CREATE TYPE "CardValueMode" AS ENUM ('FIXED', 'DUAL');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('LIGHT', 'SINGLE_THEME', 'FULL', 'MEMBER_DAILY', 'MEMBER_WEEKLY', 'MEMBER_MONTHLY');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'TRIAL', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('FOUNDATION', 'ADVANCED', 'PRACTICE', 'CERTIFICATION', 'BUSINESS', 'MENTOR');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CertificationLevel" AS ENUM ('READER_LEVEL_1', 'READER_LEVEL_2', 'MENTOR_LEVEL');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('ACTIVE', 'PENDING', 'EXPIRED', 'SUSPENDED', 'REVOKED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "birth_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "birth_time" TEXT NOT NULL,
    "birth_location" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNSPECIFIED',
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "birth_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ziwei_charts" (
    "id" TEXT NOT NULL,
    "birth_profile_id" TEXT NOT NULL,
    "engine_version" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "chart_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ziwei_charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destiny_readings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "birth_profile_id" TEXT,
    "question" TEXT NOT NULL,
    "theme" "ReadingTheme" NOT NULL,
    "reading_type" "ReadingType" NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "destiny_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "five_dimension_inputs" (
    "id" TEXT NOT NULL,
    "reading_id" TEXT NOT NULL,
    "structure_value" DOUBLE PRECISION NOT NULL,
    "timing_value" DOUBLE PRECISION NOT NULL,
    "energy_value" DOUBLE PRECISION NOT NULL,
    "mind_value" DOUBLE PRECISION NOT NULL,
    "action_value" DOUBLE PRECISION NOT NULL,
    "input_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "five_dimension_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "five_dimension_scores" (
    "id" TEXT NOT NULL,
    "reading_id" TEXT NOT NULL,
    "career_score" INTEGER NOT NULL,
    "wealth_score" INTEGER NOT NULL,
    "love_score" INTEGER NOT NULL,
    "health_score" INTEGER NOT NULL,
    "dominant_factor" TEXT NOT NULL,
    "risk_flags_json" JSONB NOT NULL,
    "breakdown_json" JSONB NOT NULL,
    "engine_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "five_dimension_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destiny_cards" (
    "id" TEXT NOT NULL,
    "card_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "CardCategory" NOT NULL,
    "value_mode" "CardValueMode" NOT NULL,
    "base_value" DOUBLE PRECISION,
    "positive_value" DOUBLE PRECISION,
    "negative_value" DOUBLE PRECISION,
    "keywords_json" JSONB NOT NULL,
    "positive_meaning" TEXT,
    "shadow_meaning" TEXT,
    "interpretation_hint" TEXT,
    "theme_bias_json" JSONB,
    "prompt_text" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "destiny_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_draws" (
    "id" TEXT NOT NULL,
    "reading_id" TEXT NOT NULL,
    "archetype_card_id" TEXT NOT NULL,
    "energy_card_1_id" TEXT NOT NULL,
    "energy_card_2_id" TEXT NOT NULL,
    "event_card_id" TEXT NOT NULL,
    "raw_energy_score" DOUBLE PRECISION NOT NULL,
    "mapped_energy_score" DOUBLE PRECISION NOT NULL,
    "draw_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_draws_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_results" (
    "id" TEXT NOT NULL,
    "reading_id" TEXT NOT NULL,
    "mind_answers_json" JSONB NOT NULL,
    "mind_average" DOUBLE PRECISION NOT NULL,
    "mind_level" INTEGER NOT NULL,
    "mind_factor" DOUBLE PRECISION NOT NULL,
    "action_answers_json" JSONB NOT NULL,
    "action_total" INTEGER NOT NULL,
    "action_raw" INTEGER NOT NULL,
    "action_label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionnaire_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destiny_reports" (
    "id" TEXT NOT NULL,
    "reading_id" TEXT NOT NULL,
    "report_type" "ReportType" NOT NULL,
    "report_version" TEXT NOT NULL,
    "report_json" JSONB NOT NULL,
    "report_text" TEXT NOT NULL,
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destiny_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_key" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'TRIAL',
    "started_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "provider" TEXT,
    "provider_ref" TEXT,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reading_id" TEXT,
    "membership_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "provider_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "course_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "price" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'USD',
    "meta_json" JSONB,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "level" "CertificationLevel" NOT NULL,
    "status" "CertificationStatus" NOT NULL DEFAULT 'PENDING',
    "cert_number" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engine_versions" (
    "id" TEXT NOT NULL,
    "engine_name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engine_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_sets" (
    "id" TEXT NOT NULL,
    "rule_type" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "school" TEXT,
    "config_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "birth_profiles_user_id_idx" ON "birth_profiles"("user_id");

-- CreateIndex
CREATE INDEX "ziwei_charts_birth_profile_id_idx" ON "ziwei_charts"("birth_profile_id");

-- CreateIndex
CREATE INDEX "destiny_readings_user_id_idx" ON "destiny_readings"("user_id");

-- CreateIndex
CREATE INDEX "destiny_readings_birth_profile_id_idx" ON "destiny_readings"("birth_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "five_dimension_inputs_reading_id_key" ON "five_dimension_inputs"("reading_id");

-- CreateIndex
CREATE UNIQUE INDEX "five_dimension_scores_reading_id_key" ON "five_dimension_scores"("reading_id");

-- CreateIndex
CREATE UNIQUE INDEX "destiny_cards_card_key_key" ON "destiny_cards"("card_key");

-- CreateIndex
CREATE UNIQUE INDEX "card_draws_reading_id_key" ON "card_draws"("reading_id");

-- CreateIndex
CREATE INDEX "card_draws_archetype_card_id_idx" ON "card_draws"("archetype_card_id");

-- CreateIndex
CREATE INDEX "card_draws_energy_card_1_id_idx" ON "card_draws"("energy_card_1_id");

-- CreateIndex
CREATE INDEX "card_draws_energy_card_2_id_idx" ON "card_draws"("energy_card_2_id");

-- CreateIndex
CREATE INDEX "card_draws_event_card_id_idx" ON "card_draws"("event_card_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_results_reading_id_key" ON "questionnaire_results"("reading_id");

-- CreateIndex
CREATE INDEX "destiny_reports_reading_id_idx" ON "destiny_reports"("reading_id");

-- CreateIndex
CREATE INDEX "memberships_user_id_idx" ON "memberships"("user_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_reading_id_idx" ON "payments"("reading_id");

-- CreateIndex
CREATE INDEX "payments_membership_id_idx" ON "payments"("membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_key_key" ON "courses"("course_key");

-- CreateIndex
CREATE INDEX "enrollments_course_id_idx" ON "enrollments"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "certifications_cert_number_key" ON "certifications"("cert_number");

-- CreateIndex
CREATE INDEX "certifications_user_id_idx" ON "certifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "engine_versions_engine_name_version_key" ON "engine_versions"("engine_name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "rule_sets_rule_type_version_school_key" ON "rule_sets"("rule_type", "version", "school");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "birth_profiles" ADD CONSTRAINT "birth_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ziwei_charts" ADD CONSTRAINT "ziwei_charts_birth_profile_id_fkey" FOREIGN KEY ("birth_profile_id") REFERENCES "birth_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destiny_readings" ADD CONSTRAINT "destiny_readings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destiny_readings" ADD CONSTRAINT "destiny_readings_birth_profile_id_fkey" FOREIGN KEY ("birth_profile_id") REFERENCES "birth_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "five_dimension_inputs" ADD CONSTRAINT "five_dimension_inputs_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "destiny_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "five_dimension_scores" ADD CONSTRAINT "five_dimension_scores_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "destiny_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_draws" ADD CONSTRAINT "card_draws_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "destiny_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_draws" ADD CONSTRAINT "card_draws_archetype_card_id_fkey" FOREIGN KEY ("archetype_card_id") REFERENCES "destiny_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_draws" ADD CONSTRAINT "card_draws_energy_card_1_id_fkey" FOREIGN KEY ("energy_card_1_id") REFERENCES "destiny_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_draws" ADD CONSTRAINT "card_draws_energy_card_2_id_fkey" FOREIGN KEY ("energy_card_2_id") REFERENCES "destiny_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_draws" ADD CONSTRAINT "card_draws_event_card_id_fkey" FOREIGN KEY ("event_card_id") REFERENCES "destiny_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_results" ADD CONSTRAINT "questionnaire_results_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "destiny_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destiny_reports" ADD CONSTRAINT "destiny_reports_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "destiny_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "destiny_readings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

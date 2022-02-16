import {MigrationInterface, QueryRunner} from "typeorm";

export class addProjectsAndCampaigns1644967785027 implements MigrationInterface {
    name = 'addProjectsAndCampaigns1644967785027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "logo" character varying, "createdBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."campaignStatus" AS ENUM('DRAFT', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED')`);
        await queryRunner.query(`CREATE TYPE "public"."paymentStatus" AS ENUM('NOT_PAID', 'PAID')`);
        await queryRunner.query(`CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "name" character varying, "logo" character varying, "links" text NOT NULL, "audioKeyWords" text, "textKeyWords" text, "analyzedPictures" text, "campaignStatus" "public"."campaignStatus" NOT NULL DEFAULT 'DRAFT', "paymentStatus" "public"."paymentStatus" NOT NULL DEFAULT 'NOT_PAID', "startDate" TIMESTAMP, "endDate" TIMESTAMP, "adminEmail" character varying, "adminPhone" character varying, "emotionDetection" boolean NOT NULL DEFAULT false, "cost" integer NOT NULL DEFAULT '0', "totalDuration" integer NOT NULL DEFAULT '0', "commentsCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_67eb52d32ceecf37ba86969b2f2" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_67eb52d32ceecf37ba86969b2f2"`);
        await queryRunner.query(`DROP TABLE "campaigns"`);
        await queryRunner.query(`DROP TYPE "public"."paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."campaignStatus"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCodeAndCodeHistory1697565499903 implements MigrationInterface {
    name = 'CreateCodeAndCodeHistory1697565499903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "code" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ownerId" integer NOT NULL, CONSTRAINT "UQ_b5c04a17f83b4eb709102d07688" UNIQUE ("name"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "code_history" ("id" SERIAL NOT NULL, "codeId" integer NOT NULL, "comment" character varying NOT NULL, "commit_sha" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_10cc61763a5e1c72f005bb2ef17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_c3900b088af47d293cb22e8f554" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code_history" ADD CONSTRAINT "FK_3aeee71331e2e219111ff3386bb" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_history" DROP CONSTRAINT "FK_3aeee71331e2e219111ff3386bb"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_c3900b088af47d293cb22e8f554"`);
        await queryRunner.query(`DROP TABLE "code_history"`);
        await queryRunner.query(`DROP TABLE "code"`);
    }

}

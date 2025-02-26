import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBranchesTable1740345522151 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
              new Table({
                name: "branches",
                columns: [
                  {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                  },
                  {
                    name: "full_address",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                  },
                  {
                    name: "document",
                    type: "varchar",
                    length: "30",
                    isNullable: false,
                  },
                  {
                    name: "user_id",
                    type: "int",
                    isNullable: false,
                  },
                  {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                  },
                  {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                  },
                ],
              })
            );

            await queryRunner.createForeignKey(
              "branches",
              new TableForeignKey({
                name: "user_fk",
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
              })
            );
          }
        
          public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropForeignKey("branches", "user_fk");
            await queryRunner.dropTable("branches");
          }
}

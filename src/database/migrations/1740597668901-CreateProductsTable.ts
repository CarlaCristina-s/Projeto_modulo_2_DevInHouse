import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateProductsTable1740597668901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "amount",
            type: "int",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "url_cover",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "branch_id",
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
      "products",
      new TableForeignKey({
        name: "branch_fk",
        columnNames: ["branch_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "branches",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("products", "branch_fk");
    await queryRunner.dropTable("products");
  }
}

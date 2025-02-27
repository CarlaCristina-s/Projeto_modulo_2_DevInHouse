import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateMovementsTable1740668198985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
        name: "movements",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "destination_branch_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "product_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "driver_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "quantity",
            type: "int",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ['PENDING', 'IN_PROGRESS', 'FINISHED'],
            default: "'PENDING'",
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
      "movements",
      new TableForeignKey({
        name: "destination_branch_fk",
        columnNames: ["destination_branch_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "branches",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "movements",
      new TableForeignKey({
        name: "product_fk",
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "movements",
      new TableForeignKey({
        name: "driver_fk",
        columnNames: ["driver_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "drivers",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("movements", "destination_branch_fk");
    await queryRunner.dropForeignKey("movements", "product_fk");
    await queryRunner.dropForeignKey("movements", "driver_fk");
    await queryRunner.dropTable("movements");
  }
}

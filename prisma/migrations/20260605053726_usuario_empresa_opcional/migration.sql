-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_id_empresa_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "id_empresa" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE;

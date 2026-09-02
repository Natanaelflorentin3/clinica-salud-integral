/*
  Warnings:

  - Added the required column `apellido` to the `Medico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medico" ADD COLUMN     "apellido" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "apellido" TEXT NOT NULL;

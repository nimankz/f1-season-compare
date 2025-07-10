-- CreateTable
CREATE TABLE `Driver` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `driver_number` INTEGER NOT NULL,
    `nationality` VARCHAR(191) NULL,
    `team_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Driver_driver_number_key`(`driver_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `team_id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` SMALLINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Race` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `round` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `circuit_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Result` (
    `id` VARCHAR(191) NOT NULL,
    `race_id` VARCHAR(191) NOT NULL,
    `driver_id` VARCHAR(191) NOT NULL,
    `position` INTEGER NULL,
    `points` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Telemetry` (
    `id` VARCHAR(191) NOT NULL,
    `race_id` VARCHAR(191) NOT NULL,
    `driver_id` VARCHAR(191) NOT NULL,
    `lap_number` INTEGER NOT NULL,
    `speed` DOUBLE NULL,
    `drs_status` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_race_id_fkey` FOREIGN KEY (`race_id`) REFERENCES `Race`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Telemetry` ADD CONSTRAINT `Telemetry_race_id_fkey` FOREIGN KEY (`race_id`) REFERENCES `Race`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Telemetry` ADD CONSTRAINT `Telemetry_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

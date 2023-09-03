-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TINYTEXT NOT NULL,
    `answer` TINYTEXT NOT NULL,
    `options` JSON NOT NULL,
    `contentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `mcqCount` INTEGER NOT NULL DEFAULT 0,
    `trueCount` INTEGER NOT NULL DEFAULT 0,
    `result` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `description` TINYTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `creatorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_QuestionToQuiz` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_QuestionToQuiz_AB_unique`(`A`, `B`),
    INDEX `_QuestionToQuiz_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_QuizToTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_QuizToTag_AB_unique`(`A`, `B`),
    INDEX `_QuizToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuestionToQuiz` ADD CONSTRAINT `_QuestionToQuiz_A_fkey` FOREIGN KEY (`A`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuestionToQuiz` ADD CONSTRAINT `_QuestionToQuiz_B_fkey` FOREIGN KEY (`B`) REFERENCES `quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuizToTag` ADD CONSTRAINT `_QuizToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuizToTag` ADD CONSTRAINT `_QuizToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

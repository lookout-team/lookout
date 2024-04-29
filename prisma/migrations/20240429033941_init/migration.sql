-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "last_updated" DATETIME,
    "current_sprint_id" INTEGER
);
INSERT INTO "new_Project" ("current_sprint_id", "description", "id", "last_updated", "title") SELECT "current_sprint_id", "description", "id", "last_updated", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_Sprint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "start_date" DATETIME,
    "end_date" DATETIME,
    "planned_capacity" INTEGER,
    "project_id" INTEGER NOT NULL,
    CONSTRAINT "Sprint_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sprint" ("end_date", "id", "planned_capacity", "project_id", "start_date", "title") SELECT "end_date", "id", "planned_capacity", "project_id", "start_date", "title" FROM "Sprint";
DROP TABLE "Sprint";
ALTER TABLE "new_Sprint" RENAME TO "Sprint";
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT,
    "requirements" TEXT,
    "acceptance_criteria" TEXT,
    "points" INTEGER,
    "assigned_to" INTEGER,
    "sprint_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "priority_id" INTEGER NOT NULL,
    CONSTRAINT "Task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "Priority" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("acceptance_criteria", "assigned_to", "category", "description", "id", "points", "priority_id", "requirements", "sprint_id", "status_id", "title") SELECT "acceptance_criteria", "assigned_to", "category", "description", "id", "points", "priority_id", "requirements", "sprint_id", "status_id", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

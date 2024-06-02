import PageBreadcrumbs from "@/app/ui/core/breadcrumbs";
import CommentSection from "@/app/ui/tasks/comment-section";
import TaskDetails from "@/app/ui/tasks/task-details";
import { auth } from "@/lib/auth/auth";
import {
  createComment,
  deleteComment,
  getTaskComments,
  updateComment,
} from "@/lib/db/comment";
import { getPriorities } from "@/lib/db/priority";
import { getSprint, getSprints } from "@/lib/db/sprint";
import { getStatuses } from "@/lib/db/status";
import { getTask, updateTask } from "@/lib/db/task";
import { getUsers } from "@/lib/db/user";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tasks - Lookout",
  description: "AI-Powered Project Management Platform",
};

export default async function Page({ params }: { params: { id: number } }) {
  const session = await auth();
  if (!session || !session.user?.id) redirect("/signin");
  const userId = +session?.user?.id;

  const task = await getTask({ id: +params.id });
  if (!task) return notFound();

  const sprint = await getSprint({ id: task?.sprint_id! });
  if (!sprint) return notFound();

  const sprints = await getSprints({ project_id: sprint.project_id });
  const users = await getUsers();
  const comments = await getTaskComments(task.id);
  const statuses = await getStatuses();
  const priorities = await getPriorities();

  async function updateTaskAction(form: FormData) {
    "use server";
    const task = Object.fromEntries(form.entries());
    await updateTask(task);
    revalidatePath(`/dashboard/tasks/${task.id}`);
  }

  async function createCommentAction(form: FormData) {
    "use server";
    const comment = form.get("comment")?.toString();
    if (!comment || !task?.id) return;
    const newComment = { text: comment, task_id: task?.id, user_id: userId };
    await createComment(newComment);
    revalidatePath(`/dashboard/tasks/${task.id}`);
  }

  async function updateCommentAction(form: FormData) {
    "use server";
    const commentId = form.get("id")?.toString();
    const comment = form.get("comment")?.toString();
    if (!comment || !commentId || !task?.id) return;

    await updateComment({
      id: +commentId,
      text: comment,
      last_modified: new Date(),
    });

    revalidatePath(`/dashboard/tasks/${task.id}`);
  }

  async function deleteCommentAction(form: FormData) {
    "use server";
    const commentId = form.get("id")?.toString();
    if (!commentId || !task?.id) return;
    await deleteComment(+commentId);
    revalidatePath(`/dashboard/tasks/${task.id}`);
  }

  const breadcrumbs = [
    { title: "Projects", link: "/dashboard/projects" },
    {
      title: sprint.project.title ?? "",
      link: `/dashboard/projects/${sprint.project.id}`,
    },
    {
      title: sprint.title ?? "",
      link: `/dashboard/projects/${sprint.project.id}`,
    },
    { title: task.title ?? "", link: undefined },
  ];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbs} />
      <TaskDetails
        task={task}
        sprints={sprints}
        users={users}
        statuses={statuses}
        priorities={priorities}
        updateAction={updateTaskAction}
      />
      <div className="grid grid-cols-10">
        <div className="col-span-7">
          <h1 className="text-xl font-medium mb-4">Discussion</h1>
          <CommentSection
            comments={comments}
            userId={userId}
            createAction={createCommentAction}
            updateAction={updateCommentAction}
            deleteAction={deleteCommentAction}
          />
        </div>
      </div>
    </>
  );
}

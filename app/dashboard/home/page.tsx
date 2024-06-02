import ActivityCard from "@/app/ui/home/activity-card";
import CommentSection from "@/app/ui/tasks/comment-section";
import TaskCard from "@/app/ui/tasks/task-card";
import { auth } from "@/lib/auth/auth";
import { getActivityLogs } from "@/lib/db/activity";
import { getComments } from "@/lib/db/comment";
import { getTasks } from "@/lib/db/task";
import { Newspaper, SquareCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!session || !userId) redirect("/signin");

  const userTasks = await getTasks({ assigned_to: +userId }, "desc");
  const activities = await getActivityLogs({ comment_id: null });
  const comments = await getComments();

  return (
    <>
      <div className="mt-4 mb-6 text-2xl font-medium">Home</div>
      <div className="grid grid-cols-12 gap-8 h-screen">
        <div className="col-span-3">
          <div className="text-xl mb-4">My Items</div>
          {userTasks.length > 0 ? (
            userTasks.map((task) => (
              <TaskCard key={`Task_${task.id}`} task={task} />
            ))
          ) : (
            <div className="flex items-center place-content-center opacity-75 h-20">
              <SquareCheck size={28} className="me-2" />
              <h1 className="text-md">No assigned tasks</h1>
            </div>
          )}
        </div>
        <div className="col-span-6">
          <div className="text-xl mb-4">Recent Activity</div>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityCard key={`Task_${activity.id}`} activity={activity} />
            ))
          ) : (
            <div className="flex items-center place-content-center opacity-75 h-20">
              <Newspaper size={28} className="me-2" />
              <h1 className="text-md">Nothing yet...</h1>
            </div>
          )}
        </div>
        <div className="col-span-3">
          <div className="text-xl mb-4">Discussions</div>
          <CommentSection comments={comments} />
        </div>
      </div>
    </>
  );
}

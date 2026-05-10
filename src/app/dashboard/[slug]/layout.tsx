import React, { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";
import { getCourseSidebar } from "@/app/data/course/get-course-sidebar";

interface IProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

const layout = async ({ children, params }: IProps) => {
  const { slug } = await params;
  const data = await getCourseSidebar(slug);

  return (
    <div className="flex min-h-0 h-full flex-1">
      {/* //sidebear */}

      <div className="w-80 min-h-0  border-border  h-full shrink-0 border-r">
        <CourseSidebar slug={slug} data={data} />
      </div>
      {/* //main content */}
      <div className="flex-1  overflow-hidden ">{children}</div>
    </div>
  );
};

export default layout;

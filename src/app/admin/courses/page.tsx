import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Button asChild>
          <Link href={"/admin/courses/create"}>Create Course</Link>
        </Button>
      </div>
      <div>
        <h1> Hear you will see all of the courses you have created</h1>
      </div>
    </>
  );
};

export default page;

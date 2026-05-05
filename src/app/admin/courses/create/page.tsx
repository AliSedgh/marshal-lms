import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CourseInfoForm from "../_components/CourseInfoForm";

const CourseCreationPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Button size={"icon"} asChild variant={"outline"}>
          <Link href="/admin/courses">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide base information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseInfoForm />
        </CardContent>
      </Card>
    </>
  );
};

export default CourseCreationPage;

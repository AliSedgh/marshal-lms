"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/them-toggle";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}
const features: featureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of courses from experts in various fields",
    // Unicode for book icon as often shown on Windows: 📚
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and hands-on projects",
    icon: "🎯",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your progress and stay motivated with detailed analytics",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Connect with a community of learners and get help from experts",
    icon: "👥",
  },
];
export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Badge variant={"outline"}>The Future of Online Education</Badge>
          <h1 className="text-4xl font-bold md:text-6xl tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl text-center">
            Discover a new wy to learn with our modern,interactive learning
            management system.Access high-quality courses anytime,anywhere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size={"lg"} asChild>
              <Link href={"/courses"}>Explore Courses</Link>
            </Button>
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/login"}>Signin</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="hover:shadow-2xl transition-shadow"
          >
            <CardHeader>
              <div className="text-4xl mb-4">{feature?.icon}</div>
              <CardTitle>{feature?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature?.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}

import { Ban, PlusCircle } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface IProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const EmptyState = ({ title, description, buttonText, buttonLink }: IProps) => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 ">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm mb-8 text-muted-foreground leading-tight">
        {description}
      </p>
      <Button className="mt-4" asChild>
        <Link href={buttonLink}>
          <PlusCircle className="size-4 mr-2" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};

export default EmptyState;

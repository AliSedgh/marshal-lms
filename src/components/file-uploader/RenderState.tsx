import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

interface IProps {
  isDragActive: boolean;
}
const RenderEmptyState: FC<IProps> = ({ isDragActive }) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && " text-primary",
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary cursor-pointer font-bold">
          click to upload{" "}
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
};

export const RenderErrorState: FC<IProps> = ({ isDragActive }) => {
  return (
    <div className=" text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30  mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>{" "}
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs text-muted-foreground mt-1">Something went wrong</p>
      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
};

export default RenderEmptyState;

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
}) {
  return (
    <div className="">
      <Image
        src={previewUrl}
        alt="uploaded file"
        fill
        className="object-contain p-2"
      />
      <Button
        disabled={isDeleting}
        onClick={handleRemoveFile}
        type="button"
        variant={"destructive"}
        size={"icon"}
        className={cn("absolute top-4 right-4")}
      >
        {isDeleting ? (
          <Loader2 className="size-4" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export const RenderUploadingState = ({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) => {
  return (
    <div className="text-center items-center justify-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-foreground text-sm font-medium">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
};

"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import RenderEmptyState, {
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import useConstructUrl from "@/hooks/use-construct-url";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
}

const Uploader: FC<IProps> = ({ value, onChange, fileTypeAccepted }) => {
  const fileUrl = useConstructUrl(value ?? "");
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });
  console.log("fileeeeeeeee", fileState);

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === "image",
          }),
        });
        if (!presignedResponse.ok) {
          toast.error("Failed to get presigned url");
          setFileState((prev) => ({
            ...prev,
            objectUrl: undefined,
            uploading: false,
            progress: 0,
            isDeleting: false,
            error: true,
          }));
          return;
        }
        const presigned = (await presignedResponse.json()) as {
          presignedUrl: string;
          key: string;
          contentType: string;
        };

        console.log("22222222222222222222", presigned);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFileState((prev) => ({
                ...prev,
                progress: progress,
              }));
            }
          };
          xhr.onload = () => {
            console.log("xhr.onload", xhr.status);
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key: presigned.key,
              }));
              onChange?.(presigned.key);
              toast.success("File uploaded successfully");
              resolve();
            } else {
              console.error("S3 PUT failed", xhr.status, xhr.responseText);
              toast.error("Failed to upload file");
              reject(new Error("Failed to upload file"));
              setFileState((prev) => ({
                ...prev,
                progress: 0,
                uploading: false,
                objectUrl: undefined,
                error: true,
              }));
            }
          };
          xhr.onerror = () => {
            setFileState((prev) => ({
              ...prev,
              progress: 0,
              uploading: false,
              objectUrl: undefined,
              error: true,
            }));
            reject(new Error("Upload failed"));
          };
          xhr.open("PUT", presigned.presignedUrl);
          xhr.setRequestHeader(
            "Content-Type",
            presigned.contentType || file.type || "application/octet-stream",
          );
          xhr.send(file);
        });
      } catch (error) {
        toast.error("Something went wrong");
        console.log("error", error);
        setFileState((prev) => ({
          ...prev,
          progress: 0,
          uploading: false,
          objectUrl: undefined,
          error: true,
        }));
      }
    },
    [fileTypeAccepted, onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          id: uuidv4(),
          file: acceptedFiles[0],
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          fileType: fileTypeAccepted,
          objectUrl: URL.createObjectURL(acceptedFiles[0]),
        });
        uploadFile(acceptedFiles[0]);
      }
    },
    [fileState.objectUrl, uploadFile, fileTypeAccepted],
  );

  const handleDeleteFile = async () => {
    if (fileState?.isDeleting || !fileState?.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: fileState.key }),
      });
      if (!response.ok) {
        toast.error("Failed to delete file");
        setFileState((prev) => ({
          ...prev,
          objectUrl: undefined,
          isDeleting: false,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        key: undefined,
        objectUrl: undefined,
        file: null,
        uploading: false,
        progress: 0,
        fileType: fileTypeAccepted,
      }));
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Error Removing File");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
        objectUrl: undefined,
      }));
    }
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const tooManyFiles = fileRejections.some((fileRejection) =>
        fileRejection.errors.some((error) => error.code === "too-many-files"),
      );
      if (tooManyFiles) {
        toast.error("You can only upload one file at a time");
      }

      const fileTooLarge = fileRejections.some((fileRejection) =>
        fileRejection.errors.some((error) => error.code === "file-too-large"),
      );
      if (fileTooLarge) {
        toast.error("File is too large");
      }
    }
  };

  const renderContent = () => {
    if (fileState.uploading && fileState.file) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState isDragActive={isDragActive} />;
    }
    if (fileState?.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState?.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleDeleteFile}
          fileType={fileTypeAccepted}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "image"
        ? {
            "image/*": [".png", ".jpg", ".jpeg"],
          }
        : {
            "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
          },
    maxFiles: 1,
    maxSize: fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 500 * 1024 * 1024,
    onDropRejected,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex flex-col items-center justify-center h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;

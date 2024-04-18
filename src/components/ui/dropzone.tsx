import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";
import React, { type ChangeEvent, useRef } from "react";

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string;
  className?: string;
  children: React.ReactNode;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      className,
      classNameWrapper,
      children,
      handleOnDrop,
      ...props
    }: DropzoneProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      handleOnDrop(files);
    };

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      handleOnDrop(files);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          `h-80 items-center justify-center border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
          classNameWrapper,
        )}
      >
        <CardContent
          className="flex w-full items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          {children}
          <Input
            {...props}
            value={undefined}
            ref={inputRef}
            type="file"
            multiple
            className={cn("inset-0 hidden", className)}
            onChange={handleChange}
          />
        </CardContent>
      </Card>
    );
  },
);

Dropzone.displayName = "Dropzone";

export default Dropzone;

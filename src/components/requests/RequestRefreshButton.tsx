import React, { forwardRef } from 'react';
import { Button } from "../ui/button";
import { ReloadIcon } from '@radix-ui/react-icons';

interface RequestRefreshButtonProps {
  onClick: () => void;
}

export const RequestRefreshButton = forwardRef<HTMLButtonElement, RequestRefreshButtonProps>(({ onClick }, ref) => {
  return (
    <Button
      ref={ref} 
      className="rounded-full pr-3 flex items-center justify-center gap-2"
      onClick={onClick}
    >
      <ReloadIcon className="icon-size" aria-hidden /> 
      I don&apos;t like my offers
    </Button>
  );
});

RequestRefreshButton.displayName = 'RequestRefreshButton';



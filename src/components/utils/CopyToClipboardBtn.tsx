import { errorToast } from '@/utils/toasts';
import { useRef, useState } from 'react';

export default function CopyToClipboardBtn({
  message,
  render,
}: {
  message: string;
  render: (props: { justCopied: boolean; copyMessage: () => void }) => JSX.Element;
}) {
  const [justCopied, setJustCopied] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return render({
    justCopied,
    copyMessage: () => {
      if (timeoutId?.current) {
        clearTimeout(timeoutId.current);
      }
      navigator.clipboard.writeText(message).catch(() => {
        errorToast("Couldn't copy to clipboard, please try again");
      });
      setJustCopied(true);
      timeoutId.current = setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    },
  });
}

import React from "react";

type TDialogState = "open" | "closed";

export function useDialogState(defaultState: TDialogState = "closed") {
	const [state, setState] = React.useState<TDialogState>(defaultState);
	return { state, setState } as const;
}
export type DialogState = ReturnType<typeof useDialogState>;

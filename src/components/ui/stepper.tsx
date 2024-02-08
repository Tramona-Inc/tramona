/* eslint-disable */
// TODO: fix type errors

import * as React from "react";

import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./button";
import { Separator } from "./separator";
import { Check, Loader2, X } from "lucide-react";

interface StepperContextValue extends StepperProps {
  isClickable?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isVertical?: boolean;
  isLabelVertical?: boolean;
  stepCount?: number;
}

const StepperContext = React.createContext<StepperContextValue>({
  activeStep: 0,
});

export const useStepperContext = () => React.useContext(StepperContext);

export const StepperProvider: React.FC<{
  value: StepperContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const isError = value.state === "error";
  const isLoading = value.state === "loading";

  const isVertical = value.orientation === "vertical";
  const isLabelVertical =
    value.orientation !== "vertical" && value.labelOrientation === "vertical";

  return (
    <StepperContext.Provider
      value={{ ...value, isError, isLoading, isVertical, isLabelVertical }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number;
  orientation?: "vertical" | "horizontal";
  state?: "loading" | "error";
  responsive?: boolean;
  onClickStep?: (step: number) => void;
  successIcon?: React.ReactElement;
  errorIcon?: React.ReactElement;
  labelOrientation?: "vertical" | "horizontal";
  children?: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "secondary";
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep = 0,
      orientation: orientationProp = "horizontal",
      state,
      responsive = true,
      onClickStep,
      successIcon,
      errorIcon,
      labelOrientation = "horizontal",
      variant = "default",
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const childArr = React.Children.toArray(children);
    const stepCount = childArr.length;

    const isClickable = !!onClickStep;

    const orientation = responsive ? "vertical" : orientationProp;

    const renderHorizontalContent = () => {
      if (activeStep <= childArr.length) {
        return React.Children.map(childArr[activeStep], (child, i) => {
          if (!React.isValidElement(child)) return;
          return React.Children.map(
            child.props.children,
            (childNode) => childNode,
          );
        });
      }
    };

    return (
      <StepperProvider
        value={{
          activeStep,
          state,
          responsive,
          orientation,
          onClickStep,
          labelOrientation,
          errorIcon,
          successIcon,
          variant,
          stepCount,
          isClickable,
        }}
      >
        <div
          {...rest}
          ref={ref}
          className={cn(
            "flex w-full flex-1 justify-between gap-4 text-center",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className,
          )}
        >
          {React.Children.map(children, (child, i) => {
            const isCompletedStep =
              (React.isValidElement(child) && child.props.isCompletedSteps) ??
              i < activeStep;
            const isLastStep = i === stepCount - 1;
            const isCurrentStep = i === activeStep;

            const stepProps = {
              index: i,
              isCompletedStep,
              isLastStep,
              isCurrentStep,
            };

            return React.isValidElement(child)
              ? React.cloneElement(child, stepProps)
              : null;
          })}
        </div>
        {orientation === "horizontal" && renderHorizontalContent()}
      </StepperProvider>
    );
  },
);

Stepper.displayName = "Stepper";

const stepperItemVariants = cva("relative flex flex-row gap-2", {
  variants: {
    isLastStep: {
      true: "flex-[0_0_auto] justify-end",
      false: "flex-[1_0_auto] justify-start",
    },
    isVertical: {
      true: "flex-col",
      false: "items-center",
    },
    isClickable: {
      true: "cursor-pointer",
    },
  },
});

export interface StepperConfig extends StepperItemLabelProps {
  icon?: React.ReactNode;
}

interface StepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperItemVariants>,
    StepperConfig {
  isCompletedStep?: boolean;
}

interface StepperItemStatus {
  index: number;
  isCompletedStep?: boolean;
  isCurrentStep?: boolean;
}

export interface StepperItemProps extends StepProps, StepperItemStatus {
  additionalClassName?: {
    button?: string;
    label?: string;
    description?: string;
  };
}

export const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (props, ref) => {
    const {
      label,
      description,
      optional,
      optionalLabel,
      icon: Icon,
      index,
      isCompletedStep,
      isCurrentStep,
      isLastStep,
      additionalClassName,
      children,
      className,
      ...rest
    } = props;

    const {
      isClickable,
      onClickStep,
      isVertical,
      isLabelVertical,
      isError,
      isLoading,
      successIcon,
      errorIcon,
      variant,
    } = useStepperContext();

    const handleClick = (index: number) => {
      if (isClickable && onClickStep) {
        onClickStep(index);
      }
    };

    const hasVisited = React.useMemo(
      () => isCurrentStep ?? isCompletedStep,
      [isCurrentStep, isCompletedStep],
    );

    const Success = React.useMemo(
      () => successIcon ?? <Check />,
      [successIcon],
    );
    const Error = React.useMemo(() => errorIcon ?? <X />, [errorIcon]);

    const RenderIcon = React.useMemo(() => {
      if (isCompletedStep) return Success;
      if (isCurrentStep) {
        if (isError) return Error;
        if (isLoading) return <Loader2 className="animate-spin" />;
      }
      if (Icon) return Icon;
      return index + 1;
    }, [
      isCompletedStep,
      Success,
      isCurrentStep,
      Error,
      isError,
      isLoading,
      Icon,
      index,
    ]);

    return (
      <div
        {...rest}
        className={cn(
          stepperItemVariants({
            isLastStep,
            isVertical,
            isClickable: isClickable && !!onClickStep,
          }),
          className,
        )}
        ref={ref}
        onClick={() => handleClick(index)}
        aria-disabled={!hasVisited}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isLabelVertical ? "flex-col" : "",
          )}
        >
          <Button
            aria-current={isCurrentStep ? "step" : undefined}
            data-invalid={isCurrentStep && isError}
            data-highlighted={isCompletedStep}
            data-clickable={isClickable}
            disabled={!hasVisited}
            className={cn(
              "aspect-square rounded-full aria-[current=step]:border-2 aria-[current=step]:border-primary data-[highlighted=true]:bg-primary data-[highlighted=true]:text-white lg:h-12 lg:w-12",
              isCompletedStep ?? typeof RenderIcon !== "number"
                ? "px-3 py-2"
                : "",
              additionalClassName?.button,
            )}
            variant={isCurrentStep && isError ? "destructive" : variant}
          >
            {RenderIcon}
          </Button>
          <StepperItemLabel
            label={label}
            description={description}
            optional={optional}
            optionalLabel={optionalLabel}
            labelClassName={additionalClassName?.label}
            descriptionClassName={additionalClassName?.description}
            isCurrentStep={isCurrentStep}
          />
        </div>
        <StepperItemConnector
          index={index}
          isLastStep={!!isLastStep}
          hasLabel={!!label || !!description}
          isCompletedStep={isCompletedStep ?? false}
        >
          {(isCurrentStep ?? isCompletedStep) && children}
        </StepperItemConnector>
      </div>
    );
  },
);

StepperItem.displayName = "StepperItem";

interface StepperItemLabelProps {
  children?: React.ReactNode;
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  optional?: boolean;
  optionalLabel?: string | React.ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
}

const StepperItemLabel: React.FC<
  StepperItemLabelProps & { isCurrentStep?: boolean }
> = ({
  label,
  description,
  optional,
  optionalLabel,
  labelClassName,
  descriptionClassName,
  isCurrentStep,
}) => {
  const { isLabelVertical } = useStepperContext();

  const shouldRender = React.useMemo(
    () => !!label || !!description,
    [label, description],
  );

  const renderOptionalLabel = React.useMemo(
    () => !!optional || !!optionalLabel,
    [optional, optionalLabel],
  );

  return shouldRender ? (
    <div
      aria-current={isCurrentStep ? "step" : undefined}
      className={cn(
        "ml-2 flex w-max flex-col justify-center p-2",
        isLabelVertical ? "items-center text-center" : "items-start text-left",
      )}
    >
      {!!label && (
        <p className={labelClassName}>
          {label}
          {renderOptionalLabel && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({optionalLabel})
            </span>
          )}
        </p>
      )}
      {!!description && (
        <p
          className={cn("text-sm text-muted-foreground", descriptionClassName)}
        >
          {description}
        </p>
      )}
    </div>
  ) : null;
};

StepperItemLabel.displayName = "StepperItemLabel";

interface StepperItemConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isCompletedStep?: boolean;
  isLastStep?: boolean;
  hasLabel?: boolean;
  index: number;
}

const StepperItemConnector = React.memo(
  ({
    isCompletedStep,
    isLastStep,
    hasLabel,
    index,
    children,
  }: StepperItemConnectorProps) => {
    const { isVertical } = useStepperContext();

    if (isVertical) {
      return (
        <div
          data-highlighted={isCompletedStep}
          className={cn(
            "ms-6 mt-1 flex h-auto min-h-[2rem] flex-1 self-stretch border-l-2 ps-8",
            isLastStep ? "min-h-0 border-transparent" : "",
            isCompletedStep ? "border-green-700" : "",
          )}
        >
          {!isCompletedStep && (
            <div className="my-4 block h-auto w-full">{children}</div>
          )}
        </div>
      );
    }

    if (isLastStep) {
      return null;
    }

    return (
      <Separator
        data-highlighted={isCompletedStep}
        className="flex h-[3px] min-h-[auto] flex-1 self-auto data-[highlighted=true]:bg-primary"
        orientation={isVertical ? "vertical" : "horizontal"}
      />
    );
  },
);

StepperItemConnector.displayName = "StepperItemConnector";

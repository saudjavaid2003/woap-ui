import * as React from "react";
import { StepperContext } from "./context";

function usePrevious<T>(value: T): T | undefined {
	const [prev, setPrev] = React.useState<T | undefined>(undefined);
	const [current, setCurrent] = React.useState<T>(value);

	if (value !== current) {
		setCurrent(value);
		setPrev(current);
	}

	return prev;
}

export function useStepper() {
	const context = React.useContext(StepperContext);

	if (context === undefined) {
		throw new Error("useStepper must be used within a StepperProvider");
	}

	const { children, className, ...rest } = context;

	const isLastStep = context.activeStep === context.steps.length - 1;
	const hasCompletedAllSteps = context.activeStep === context.steps.length;

	const previousActiveStep = usePrevious(context.activeStep);

	const currentStep = context.steps[context.activeStep];
	const isOptionalStep = !!currentStep?.optional;

	const isDisabledStep = context.activeStep === 0;

	return {
		...rest,
		isLastStep,
		hasCompletedAllSteps,
		isOptionalStep,
		isDisabledStep,
		currentStep,
		previousActiveStep,
	};
}
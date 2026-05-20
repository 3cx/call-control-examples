import React from "react";
import { ErrorPortal } from "./error-portal";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary  extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {hasError: false, error: null }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error: ', error, errorInfo);
        this.setState({ hasError: true, error, })
    }



    render(): React.ReactNode {
        return (
            <>
            {this.state.hasError && (
                <>
                    <ErrorPortal message={this.state.error?.message} />
                    <div>Error</div>
                </>
                )}
            {this.state.hasError === false && this.props.children}
            </>
        )
    }
    
}
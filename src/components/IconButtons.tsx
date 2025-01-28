import React, { FC } from "react";
import classNames from "classnames";

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
};

const IconButton: FC<BaseButtonProps> = ({
  onClick,
  disabled = false,
  icon: Icon,
  className = "",
  iconClassName = "",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "flex items-center justify-center bg-white text-black px-1.5 py-1.5 rounded border transition-all",
        "hover:bg-stone-50 disabled:opacity-50 hover:shadow-inner",
        className
      )}
      {...props}
    >
      <Icon className={classNames("h-4 w-4", iconClassName)} />
    </button>
  );
};

export IconButton;


type LoadingIconButtonProps = {
  loading?: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  iconClassName?: string;
};

const LoadingIconButton: FC<LoadingIconButtonProps> = ({
  loading = false,
  icon: Icon,
  ...props
}) => {
  const RenderIcon = loading ? SpinnerIcon : Icon;

  return (
    <IconButton
      {...props}
      icon={RenderIcon}
      iconClassName={classNames({ "animate-spin direction-reverse": loading }, props.iconClassName)}
    />
  );
};

export LoadingIconButton;

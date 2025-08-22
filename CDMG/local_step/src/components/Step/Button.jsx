import "./Button.css";

const Button = ({
  text,
  children,
  onClick,
  type = "DEFAULT",  // "DEFAULT" | "POSITIVE" | "NEGATIVE"
  size = "md",       // "sm" | "md" | "lg"
  disabled = false,
  className = "",
}) => {
  const typeClass =
    {
      DEFAULT: "Button--default",
      POSITIVE: "Button--positive",
      NEGATIVE: "Button--negative",
    }[type] || "Button--default";

  const sizeClass =
    {
      sm: "Button--sm",
      md: "Button--md",
      lg: "Button--lg",
    }[size] || "Button--md";

  const content = text ?? children;

  return (
    <button
      type="button"
      className={`Button ${typeClass} ${sizeClass} ${disabled ? "is-disabled" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;

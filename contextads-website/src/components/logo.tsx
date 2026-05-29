type LogoProps = {
  className?: string;
  showPeriod?: boolean;
  animate?: boolean;
};

export function Logo({
  className = "",
  showPeriod = true,
  animate = false,
}: LogoProps) {
  return (
    <span
      className={`logo-wordmark inline-block font-semibold tracking-[-0.03em] text-zinc-900 ${className}`}
    >
      <span
        className={
          animate ? "logo-part logo-part-context" : "inline"
        }
      >
        Context
      </span>
      <span className={animate ? "logo-part logo-part-ads" : "inline"}>
        Ads
      </span>
      {showPeriod ? (
        <span
          className={
            animate
              ? `logo-period ${showPeriod ? "logo-period-visible" : ""}`
              : "inline"
          }
        >
          .
        </span>
      ) : null}
    </span>
  );
}

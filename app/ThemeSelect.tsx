type ThemeSelectProps = {
  className?: string
  withLabel?: boolean
}

export const ThemeSelect = ({
  className,
  withLabel = false,
}: ThemeSelectProps) => {
  return (
    <div>
      {withLabel && (
        <label className="label pb-0">
          <span className="label-text">Color Theme</span>
        </label>
      )}
      <select
        data-choose-theme
        className={`select select-bordered ${
          withLabel ? 'mt-0' : ''
        } w-full max-w-xs ${className}`}
      >
        <option value="">System</option>
        <option value="talisTheme">Light</option>
        <option value="dark">Dark</option>
        <option value="shadowrun">Shadowrun</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="synthwave">Synthwave</option>
      </select>
    </div>
  )
}

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

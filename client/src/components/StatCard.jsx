const StatCard = ({ icon: Icon, value, label, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-primary-50 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-500">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

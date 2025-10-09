// components/MetricCard.js
interface MasterCardProps{
    title:string;
    value:string | number;
    description: string;
    change: string;
}

const MetricCard = ({ title, value, description, change } : MasterCardProps) => {
    return (
      <div className="bg-white p-[44px] rounded-lg shadow-md border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <div className="mt-4">
          <p className="text-gray-600 text-sm">{description}</p>
          {change && (
            <p className="text-green-500 text-xs mt-1">
              {change}
            </p>
          )}
        </div>
      </div>
    );
  };
  
  export default MetricCard;
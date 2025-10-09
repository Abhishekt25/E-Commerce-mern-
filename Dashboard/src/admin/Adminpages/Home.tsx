
import MetricCard from '../components/Dashboard-main/Mastercard';
import QuickProduct from '../components/Dashboard-main/quick-product';

const Home = () => {
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
        <p className="text-grey-600 mb-8">Welcome back! Here's what's happening with your store today.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          <MetricCard  
          title="Total Revenue"
          value="₹2,45,680"
          description="Amazon & Flijsiart combined"
          change="$115.99 from last month"
          />

          <MetricCard  
          title="Pending Orders"
          value="47"
          description="Awaiting processing"
          change="+3 from last month"
          />

          <MetricCard  
          title="Returns"
          value="12"
          description="This month"
          change="-2 from last month"
          />

          <MetricCard  
          title="Delayed Shipments"
          value="8"
          description="Requiring attention"
          change="+1 from last month"
          />

          <MetricCard  
          title="Low Stock Alerts"
          value="23"
          description="Items below threshold"
          change="-5 from last month"
          />
        </div>
        <div className="mt-4">
          < QuickProduct />
        </div>
      </div>
    )
  }
  
  export default Home
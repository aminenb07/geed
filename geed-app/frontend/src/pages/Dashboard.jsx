import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { useQuery } from 'react-query'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/users/dashboard')
      return response.data
    }
  })

  const stats = [
    {
      title: 'Total Services',
      value: dashboardData?.stats?.totalServices || '12',
      change: '+12%',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: dashboardData?.stats?.activeProjects || '8',
      change: '+5%',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      title: 'Team Members',
      value: dashboardData?.stats?.teamMembers || '24',
      change: '+8%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Growth Rate',
      value: dashboardData?.stats?.growthRate || '23%',
      change: '+15%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'service_created',
      title: 'New service "Web Development" created',
      time: '2 hours ago',
      icon: Plus
    },
    {
      id: 2,
      type: 'project_updated',
      title: 'Project "Mobile App" status updated',
      time: '4 hours ago',
      icon: Edit
    },
    {
      id: 3,
      type: 'user_joined',
      title: 'New team member joined',
      time: '1 day ago',
      icon: Users
    },
    {
      id: 4,
      type: 'service_viewed',
      title: 'Service "Consulting" viewed 15 times',
      time: '2 days ago',
      icon: Eye
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: 'Review project proposals',
      dueDate: 'Today, 3:00 PM',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Team meeting preparation',
      dueDate: 'Tomorrow, 10:00 AM',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Update service descriptions',
      dueDate: 'Dec 15, 2024',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Client presentation',
      dueDate: 'Dec 18, 2024',
      priority: 'high'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Tasks
                  </h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {task.dueDate}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Services
              </h3>
              <button className="btn-primary flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No services yet
              </h4>
              <p className="text-gray-600 mb-4">
                Create your first service to get started.
              </p>
              <button className="btn-primary">
                Create Service
              </button>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Analytics Dashboard
            </h3>
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Analytics Coming Soon
              </h4>
              <p className="text-gray-600">
                Detailed analytics and insights will be available here.
              </p>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Account Settings
            </h3>
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Settings Panel
              </h4>
              <p className="text-gray-600">
                Account settings and preferences will be available here.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
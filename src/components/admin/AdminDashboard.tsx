import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminService from "../../services/AdminService";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiPieChart,
  FiCalendar,
  FiHome,
  FiMap,
} from "react-icons/fi";
import { User } from "../../context/AuthContext";

// Custom type for age distribution
interface AgeDistribution {
  under18: number;
  age18to25: number;
  age26to35: number;
  age36to45: number;
  age46to60: number;
  over60: number;
}

// Custom type for user statistics
interface UserStatistics {
  totalUsers: number;
  maleCount: number;
  femaleCount: number;
  otherGenderCount: number;
  civilStatusDistribution: { [key: string]: number };
  ageDistribution: AgeDistribution;
  topBarangays: Array<{ barangay: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;
  recentRegistrations: User[];
}

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStatistics>({
    totalUsers: 0,
    maleCount: 0,
    femaleCount: 0,
    otherGenderCount: 0,
    civilStatusDistribution: {},
    ageDistribution: {
      under18: 0,
      age18to25: 0,
      age26to35: 0,
      age36to45: 0,
      age46to60: 0,
      over60: 0,
    },
    topBarangays: [],
    topCities: [],
    recentRegistrations: [],
  });

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await AdminService.getDashboardStats();

        // Transform the API response to match our local state structure
        const transformedStats = {
          totalUsers: dashboardStats.total_users,
          maleCount: dashboardStats.gender_distribution.male,
          femaleCount: dashboardStats.gender_distribution.female,
          otherGenderCount: dashboardStats.gender_distribution.other,
          civilStatusDistribution: dashboardStats.civil_status_distribution,
          ageDistribution: dashboardStats.age_distribution,
          // Transform the array format to our object format for locations
          topBarangays: dashboardStats.top_barangays.map(
            ([barangay, count]) => ({ barangay, count })
          ),
          topCities: dashboardStats.top_cities.map(([city, count]) => ({
            city,
            count,
          })),
          recentRegistrations: dashboardStats.recent_registrations,
        };

        setStats(transformedStats);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch dashboard statistics"
        );
        setLoading(false);
      }
    };

    if (authState.isAuthenticated && authState.user?.admin) {
      fetchDashboardStats();
    }
  }, [authState.isAuthenticated, authState.user]);

  // Calculate age based on date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Calculate age distribution
  const calculateAgeDistribution = (users: User[]): AgeDistribution => {
    const distribution: AgeDistribution = {
      under18: 0,
      age18to25: 0,
      age26to35: 0,
      age36to45: 0,
      age46to60: 0,
      over60: 0,
    };

    users.forEach((user) => {
      if (!user.date_of_birth) return;

      const age = calculateAge(user.date_of_birth);

      if (age < 18) distribution.under18++;
      else if (age >= 18 && age <= 25) distribution.age18to25++;
      else if (age >= 26 && age <= 35) distribution.age26to35++;
      else if (age >= 36 && age <= 45) distribution.age36to45++;
      else if (age >= 46 && age <= 60) distribution.age46to60++;
      else distribution.over60++;
    });

    return distribution;
  };

  // Get top locations (barangay, city, etc)
  const getTopLocations = (
    users: User[],
    locationType: "barangay" | "city"
  ): Array<{ [key: string]: any }> => {
    const locationCounts: { [key: string]: number } = {};

    users.forEach((user) => {
      if (user.residential_address && user.residential_address[locationType]) {
        const location = user.residential_address[locationType];
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ [locationType]: location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Refresh data
  const handleRefresh = () => {
    if (authState.isAuthenticated && authState.user?.admin) {
      setLoading(true);
      AdminService.getDashboardStats()
        .then((dashboardStats) => {
          // Transform the API response to match our local state structure
          const transformedStats = {
            totalUsers: dashboardStats.total_users,
            maleCount: dashboardStats.gender_distribution.male,
            femaleCount: dashboardStats.gender_distribution.female,
            otherGenderCount: dashboardStats.gender_distribution.other,
            civilStatusDistribution: dashboardStats.civil_status_distribution,
            ageDistribution: dashboardStats.age_distribution,
            // Transform the array format to our object format for locations
            topBarangays: dashboardStats.top_barangays.map(
              ([barangay, count]) => ({ barangay, count })
            ),
            topCities: dashboardStats.top_cities.map(([city, count]) => ({
              city,
              count,
            })),
            recentRegistrations: dashboardStats.recent_registrations,
          };

          setStats(transformedStats);
          setLoading(false);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Failed to refresh data"
          );
          setLoading(false);
        });
    }
  };

  // Format percentage
  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center">
          <FiPieChart className="text-xl sm:text-2xl mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Residents</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalUsers}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Male</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.maleCount}{" "}
                <span className="text-sm font-normal">
                  ({formatPercentage(stats.maleCount, stats.totalUsers)})
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <FiUserCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Female</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.femaleCount}{" "}
                <span className="text-sm font-normal">
                  ({formatPercentage(stats.femaleCount, stats.totalUsers)})
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FiUserCheck className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Other Gender</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.otherGenderCount}{" "}
                <span className="text-sm font-normal">
                  ({formatPercentage(stats.otherGenderCount, stats.totalUsers)})
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiUserX className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Age Distribution */}
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-base font-medium text-gray-800 flex items-center">
              <FiCalendar className="mr-2" />
              Age Distribution
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Under 18</span>
                  <span>{stats.ageDistribution.under18} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: formatPercentage(
                        stats.ageDistribution.under18,
                        stats.totalUsers
                      ),
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>18-25</span>
                  <span>{stats.ageDistribution.age18to25} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: formatPercentage(
                        stats.ageDistribution.age18to25,
                        stats.totalUsers
                      ),
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>26-35</span>
                  <span>{stats.ageDistribution.age26to35} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{
                      width: formatPercentage(
                        stats.ageDistribution.age26to35,
                        stats.totalUsers
                      ),
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>36-45</span>
                  <span>{stats.ageDistribution.age36to45} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{
                      width: formatPercentage(
                        stats.ageDistribution.age36to45,
                        stats.totalUsers
                      ),
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>46-60</span>
                  <span>{stats.ageDistribution.age46to60} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{
                      width: formatPercentage(
                        stats.ageDistribution.age46to60,
                        stats.totalUsers
                      ),
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Over 60</span>
                  <span>{stats.ageDistribution.over60} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full"
                    style={{
                      width: formatPercentage(
                        stats.ageDistribution.over60,
                        stats.totalUsers
                      ),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Civil Status Distribution */}
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-base font-medium text-gray-800 flex items-center">
              <FiUsers className="mr-2" />
              Civil Status Distribution
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {Object.entries(stats.civilStatusDistribution).map(
                ([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span>{count} people</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-black h-2.5 rounded-full"
                        style={{
                          width: formatPercentage(count, stats.totalUsers),
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top Barangays */}
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-base font-medium text-gray-800 flex items-center">
              <FiHome className="mr-2" />
              Top Barangays
            </h2>
          </div>
          <div className="p-4">
            {stats.topBarangays.length > 0 ? (
              <div className="space-y-3">
                {stats.topBarangays.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">
                        Barangay {item.barangay}
                      </span>
                      <span>{item.count} residents</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: formatPercentage(item.count, stats.totalUsers),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No barangay data available
              </p>
            )}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-base font-medium text-gray-800 flex items-center">
              <FiMap className="mr-2" />
              Top Cities
            </h2>
          </div>
          <div className="p-4">
            {stats.topCities.length > 0 ? (
              <div className="space-y-3">
                {stats.topCities.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.city}</span>
                      <span>{item.count} residents</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: formatPercentage(item.count, stats.totalUsers),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No city data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-medium text-gray-800 flex items-center">
            <FiUsers className="mr-2" />
            Recent Registrations
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Registered
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentRegistrations.map((user, index) => {
                // Get the full name
                const fullName = [
                  user.first_name || "",
                  user.middle_name ? `${user.middle_name.charAt(0)}.` : "",
                  user.last_name || "",
                  user.name_extension || "",
                ]
                  .filter(Boolean)
                  .join(" ");

                // Get location (barangay and city)
                const location = user.residential_address
                  ? `${user.residential_address.barangay || ""}, ${
                      user.residential_address.city || ""
                    }`
                  : "Not provided";

                // Format registration date
                const registrationDate = user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "Unknown";

                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            {(
                              user.first_name?.charAt(0) ||
                              user.email?.charAt(0) ||
                              ""
                            ).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {fullName || user.email?.split("@")[0]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {user.gender || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{location}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registrationDate}
                    </td>
                  </tr>
                );
              })}

              {stats.recentRegistrations.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No recent registrations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

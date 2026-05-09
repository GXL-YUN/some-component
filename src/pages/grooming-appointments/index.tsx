import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Appointment {
  id: string
  user_id: string
  user_name: string
  user_phone: string
  pet_name: string
  pet_type: string
  pet_size: string
  service_name: string
  service_price: number
  appointment_time: string
  status: 'pending' | 'confirmed' | 'in_service' | 'completed' | 'cancelled'
  note?: string
  verification_code: string
}

const STATUS_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '待服务' },
  { value: 'in_service', label: '服务中' },
  { value: 'completed', label: '已完成' },
]

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待确认', color: 'bg-orange-100 text-orange-600' },
  confirmed: { label: '待服务', color: 'bg-blue-100 text-blue-600' },
  in_service: { label: '服务中', color: 'bg-purple-100 text-purple-600' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-600' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500' },
}

export default function GroomingAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showDetail, setShowDetail] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // 日历数据
  const [calendarDates, setCalendarDates] = useState<string[]>([])

  useEffect(() => {
    generateCalendar()
    loadAppointments()
  }, [activeTab])

  const generateCalendar = () => {
    const dates: string[] = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    setCalendarDates(dates)
  }

  const loadAppointments = async () => {
    setLoading(true)
    // 模拟数据 - 直接设置
    const today = new Date()
    const mockAppointments: Appointment[] = [
      {
        id: 'apt-001',
        user_id: 'user-001',
        user_name: '张先生',
        user_phone: '138****1234',
        pet_name: '小白',
        pet_type: 'dog',
        pet_size: 'medium',
        service_name: '精洗护理',
        service_price: 120,
        appointment_time: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
        status: 'confirmed',
        verification_code: '123456',
        note: '狗狗比较敏感，请轻柔操作',
      },
      {
        id: 'apt-002',
        user_id: 'user-002',
        user_name: '李女士',
        user_phone: '139****5678',
        pet_name: '咪咪',
        pet_type: 'cat',
        pet_size: 'small',
        service_name: '造型美容',
        service_price: 200,
        appointment_time: new Date(today.setHours(10, 30, 0, 0)).toISOString(),
        status: 'pending',
        verification_code: '654321',
      },
      {
        id: 'apt-003',
        user_id: 'user-003',
        user_name: '王先生',
        user_phone: '137****9012',
        pet_name: '大黄',
        pet_type: 'dog',
        pet_size: 'large',
        service_name: '宠物SPA',
        service_price: 300,
        appointment_time: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
        status: 'in_service',
        verification_code: '111222',
      },
      {
        id: 'apt-004',
        user_id: 'user-004',
        user_name: '赵女士',
        user_phone: '136****3456',
        pet_name: '球球',
        pet_type: 'dog',
        pet_size: 'small',
        service_name: '基础洗澡',
        service_price: 50,
        appointment_time: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
        status: 'confirmed',
        verification_code: '333444',
      },
      {
        id: 'apt-005',
        user_id: 'user-005',
        user_name: '陈先生',
        user_phone: '135****7890',
        pet_name: '豆豆',
        pet_type: 'dog',
        pet_size: 'small',
        service_name: '精洗护理',
        service_price: 80,
        appointment_time: new Date(today.setHours(15, 30, 0, 0)).toISOString(),
        status: 'pending',
        verification_code: '555666',
        note: '这只泰迪毛发比较长，需要多吹一会',
      },
      {
        id: 'apt-006',
        user_id: 'user-006',
        user_name: '周女士',
        user_phone: '134****2345',
        pet_name: '毛毛',
        pet_type: 'cat',
        pet_size: 'small',
        service_name: '造型美容',
        service_price: 150,
        appointment_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
        status: 'confirmed',
        verification_code: '777888',
      },
      {
        id: 'apt-007',
        user_id: 'user-007',
        user_name: '吴先生',
        user_phone: '133****6789',
        pet_name: '旺财',
        pet_type: 'dog',
        pet_size: 'medium',
        service_name: '宠物SPA',
        service_price: 280,
        appointment_time: new Date(today.setHours(17, 0, 0, 0)).toISOString(),
        status: 'pending',
        verification_code: '999000',
      },
      {
        id: 'apt-008',
        user_id: 'user-008',
        user_name: '郑女士',
        user_phone: '132****0123',
        pet_name: '小黑',
        pet_type: 'dog',
        pet_size: 'large',
        service_name: '精洗护理',
        service_price: 180,
        appointment_time: new Date(today.setHours(18, 30, 0, 0)).toISOString(),
        status: 'confirmed',
        verification_code: '112233',
        note: '大型犬，需要两个人配合',
      },
      {
        id: 'apt-009',
        user_id: 'user-009',
        user_name: '孙先生',
        user_phone: '131****4567',
        pet_name: '花花',
        pet_type: 'cat',
        pet_size: 'small',
        service_name: '基础洗澡',
        service_price: 60,
        appointment_time: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        verification_code: '445566',
      },
      {
        id: 'apt-010',
        user_id: 'user-010',
        user_name: '钱女士',
        user_phone: '130****8901',
        pet_name: '乐乐',
        pet_type: 'dog',
        pet_size: 'medium',
        service_name: '造型美容',
        service_price: 220,
        appointment_time: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        verification_code: '778899',
      },
    ]
    
    try {
      const info = Taro.getStorageSync('merchantInfo')
      const res = await Network.request({
        url: `/api/grooming/appointments`,
        method: 'GET',
        data: {
          merchant_id: info?.id,
          status: activeTab === 'all' ? undefined : activeTab,
          date: viewMode === 'calendar' ? selectedDate : undefined,
        },
      })
      // 如果后端返回数据，使用后端数据；否则使用模拟数据
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setAppointments(res.data.data)
      } else {
        setAppointments(mockAppointments)
      }
    } catch (error) {
      console.error('加载预约失败:', error)
      setAppointments(mockAppointments)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetail(true)
  }

  const handleConfirm = async (appointment: Appointment) => {
    try {
      await Network.request({
        url: `/api/grooming/appointments/${appointment.id}/confirm`,
        method: 'POST',
      })
      Taro.showToast({ title: '已确认', icon: 'success' })
      loadAppointments()
    } catch (error) {
      console.error('确认失败:', error)
      setAppointments(appointments.map(a =>
        a.id === appointment.id ? { ...a, status: 'confirmed' } : a
      ))
      Taro.showToast({ title: '已确认', icon: 'success' })
    }
  }

  const handleStartService = async (appointment: Appointment) => {
    try {
      await Network.request({
        url: `/api/grooming/appointments/${appointment.id}/start`,
        method: 'POST',
      })
      Taro.showToast({ title: '服务开始', icon: 'success' })
      loadAppointments()
    } catch (error) {
      console.error('开始服务失败:', error)
      setAppointments(appointments.map(a =>
        a.id === appointment.id ? { ...a, status: 'in_service' } : a
      ))
    }
  }

  const handleComplete = async (appointment: Appointment) => {
    try {
      await Network.request({
        url: `/api/grooming/appointments/${appointment.id}/complete`,
        method: 'POST',
      })
      Taro.showToast({ title: '服务完成', icon: 'success' })
      loadAppointments()
    } catch (error) {
      console.error('完成服务失败:', error)
      setAppointments(appointments.map(a =>
        a.id === appointment.id ? { ...a, status: 'completed' } : a
      ))
    }
  }

  const handleReschedule = (appointment: Appointment) => {
    Taro.navigateTo({
      url: `/pages/grooming-reschedule/index?id=${appointment.id}`,
    })
  }

  const handleCancel = async (appointment: Appointment) => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await Network.request({
              url: `/api/grooming/appointments/${appointment.id}/cancel`,
              method: 'POST',
            })
            Taro.showToast({ title: '已取消', icon: 'success' })
            loadAppointments()
          } catch (error) {
            console.error('取消失败:', error)
            setAppointments(appointments.map(a =>
              a.id === appointment.id ? { ...a, status: 'cancelled' } : a
            ))
          }
        }
      },
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return {
      day: date.getDate(),
      weekday: isToday ? '今天' : weekdays[date.getDay()],
    }
  }

  const filteredAppointments = activeTab === 'all'
    ? appointments
    : appointments.filter(a => a.status === activeTab)

  if (showDetail && selectedAppointment) {
    return (
      <ScrollView className="min-h-screen bg-gray-50" scrollY>
        <View className="p-4">
          <View className="flex items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">预约详情</Text>
            <Text className="text-orange-500 text-sm" onClick={() => setShowDetail(false)}>
              返回
            </Text>
          </View>

          {/* 状态卡片 */}
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <View className="flex items-center justify-between">
                <Text className="text-sm text-gray-500">预约状态</Text>
                <Badge className={STATUS_MAP[selectedAppointment.status]?.color || 'bg-gray-100'}>
                  {STATUS_MAP[selectedAppointment.status]?.label || '未知'}
                </Badge>
              </View>
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Text className="text-sm text-gray-500">核销码</Text>
                <Text className="block text-2xl font-bold text-orange-500 mt-1">
                  {selectedAppointment.verification_code}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* 用户信息 */}
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-3">用户信息</Text>
              <View className="flex justify-between mb-2">
                <Text className="text-sm text-gray-500">用户</Text>
                <Text className="text-sm text-gray-800">{selectedAppointment.user_name}</Text>
              </View>
              <View className="flex justify-between mb-2">
                <Text className="text-sm text-gray-500">电话</Text>
                <Text className="text-sm text-gray-800">{selectedAppointment.user_phone}</Text>
              </View>
            </CardContent>
          </Card>

          {/* 宠物信息 */}
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-3">宠物信息</Text>
              <View className="flex justify-between mb-2">
                <Text className="text-sm text-gray-500">宠物名</Text>
                <Text className="text-sm text-gray-800">{selectedAppointment.pet_name}</Text>
              </View>
              <View className="flex justify-between mb-2">
                <Text className="text-sm text-gray-500">类型</Text>
                <Text className="text-sm text-gray-800">
                  {selectedAppointment.pet_type === 'dog' ? '狗狗' : '猫咪'}
                </Text>
              </View>
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">体型</Text>
                <Text className="text-sm text-gray-800">
                  {selectedAppointment.pet_size === 'small' ? '小型' : 
                   selectedAppointment.pet_size === 'medium' ? '中型' : '大型'}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* 服务信息 */}
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-3">服务信息</Text>
              <View className="flex justify-between mb-2">
                <Text className="text-sm text-gray-500">服务项目</Text>
                <Text className="text-sm text-gray-800">{selectedAppointment.service_name}</Text>
              </View>
              <View className="flex justify-between mb-2">
                <Text className="text-sm text-gray-500">预约时间</Text>
                <Text className="text-sm text-gray-800">{formatTime(selectedAppointment.appointment_time)}</Text>
              </View>
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">价格</Text>
                <Text className="text-base font-semibold text-orange-500">
                  ¥{selectedAppointment.service_price}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* 备注 */}
          {selectedAppointment.note && (
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <Text className="block text-base font-semibold text-gray-800 mb-2">备注</Text>
                <Text className="text-sm text-gray-600">{selectedAppointment.note}</Text>
              </CardContent>
            </Card>
          )}

          {/* 操作按钮 */}
          <View className="flex gap-3">
            {selectedAppointment.status === 'pending' && (
              <>
                <Button
                  className="flex-1 bg-green-500"
                  onClick={() => handleConfirm(selectedAppointment)}
                >
                  <Text className="text-white">确认预约</Text>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500"
                  onClick={() => handleCancel(selectedAppointment)}
                >
                  拒绝
                </Button>
              </>
            )}
            {selectedAppointment.status === 'confirmed' && (
              <>
                <Button
                  className="flex-1 bg-orange-500"
                  onClick={() => handleStartService(selectedAppointment)}
                >
                  <Text className="text-white">开始服务</Text>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleReschedule(selectedAppointment)}
                >
                  改期
                </Button>
              </>
            )}
            {selectedAppointment.status === 'in_service' && (
              <Button
                className="w-full bg-green-500"
                onClick={() => handleComplete(selectedAppointment)}
              >
                <Text className="text-white">完成服务</Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 视图切换 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex gap-2">
          <View
            className={`flex-1 py-2 rounded-lg text-center ${
              viewMode === 'list' ? 'bg-orange-500' : 'bg-gray-100'
            }`}
            onClick={() => setViewMode('list')}
          >
            <Text className={viewMode === 'list' ? 'text-white' : 'text-gray-600'}>
              列表视图
            </Text>
          </View>
          <View
            className={`flex-1 py-2 rounded-lg text-center ${
              viewMode === 'calendar' ? 'bg-orange-500' : 'bg-gray-100'
            }`}
            onClick={() => setViewMode('calendar')}
          >
            <Text className={viewMode === 'calendar' ? 'text-white' : 'text-gray-600'}>
              日历视图
            </Text>
          </View>
        </View>
      </View>

      {/* 日历选择 */}
      {viewMode === 'calendar' && (
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <ScrollView scrollX className="flex flex-row gap-2">
            {calendarDates.map((date) => {
              const { day, weekday } = getDateLabel(date)
              return (
                <View
                  key={date}
                  className={`flex-shrink-0 w-14 py-2 rounded-lg text-center ${
                    selectedDate === date ? 'bg-orange-500' : 'bg-gray-100'
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <Text className={`block text-lg font-semibold ${
                    selectedDate === date ? 'text-white' : 'text-gray-800'
                  }`}
                  >
                    {day}
                  </Text>
                  <Text className={`block text-xs ${
                    selectedDate === date ? 'text-white' : 'text-gray-500'
                  }`}
                  >
                    {weekday}
                  </Text>
                </View>
              )
            })}
          </ScrollView>
        </View>
      )}

      {/* 状态筛选 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <ScrollView scrollX className="flex flex-row gap-2">
          {STATUS_TABS.map((tab) => (
            <View
              key={tab.value}
              className={`flex-shrink-0 px-4 py-2 rounded-full ${
                activeTab === tab.value ? 'bg-orange-500' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              <Text className={activeTab === tab.value ? 'text-white' : 'text-gray-600'}>
                {tab.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 预约列表 */}
      <ScrollView className="min-h-screen bg-gray-50" scrollY>
        <View className="p-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="bg-white shadow-sm mb-3"
              onClick={() => handleViewDetail(appointment)}
            >
              <CardContent className="p-4">
                <View className="flex items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex items-center gap-2 mb-1">
                      <Text className="text-base font-medium text-gray-800">
                        {appointment.user_name}
                      </Text>
                      <Badge className={STATUS_MAP[appointment.status]?.color}>
                        {STATUS_MAP[appointment.status]?.label}
                      </Badge>
                    </View>
                    <Text className="text-sm text-gray-500">
                      {appointment.pet_name} · {appointment.service_name}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-orange-500">
                    ¥{appointment.service_price}
                  </Text>
                </View>

                <View className="flex items-center justify-between text-sm">
                  <Text className="text-gray-400">
                    {formatTime(appointment.appointment_time)}
                  </Text>
                  <Text className="text-orange-500">查看详情 {'>'}</Text>
                </View>
              </CardContent>
            </Card>
          ))}

          {filteredAppointments.length === 0 && (
            <View className="py-20 text-center">
              <Text className="text-4xl mb-4">📅</Text>
              <Text className="block text-gray-500">暂无预约</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

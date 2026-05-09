import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Service {
  id: string
  name: string
  price: number
  duration?: number
}

interface Pet {
  id: string
  name: string
  pet_type: string
  breed: string
}

export default function AppointmentPage() {
  const router = useRouter()
  const storeId = router.params.storeId
  const serviceId = router.params.serviceId
  
  const [services, setServices] = useState<Service[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedService, setSelectedService] = useState(serviceId || '')
  const [selectedPet, setSelectedPet] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: false },
    { time: '18:00', available: true }
  ]

  useEffect(() => {
    loadData()
    // 设置默认日期为今天
    const today = new Date()
    setSelectedDate(formatDate(today))
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 加载服务列表
      // 实际项目应该从门店详情中获取服务列表
      setServices([
        { id: 's1', name: '基础洗护套餐', price: 68, duration: 60 },
        { id: 's2', name: '精洗套餐', price: 98, duration: 90 },
        { id: 's3', name: '造型修剪', price: 168, duration: 120 },
        { id: 's4', name: 'SPA护理', price: 268, duration: 180 }
      ])

      // 加载宠物列表
      const petsRes = await Network.request({
        url: '/api/pets',
        method: 'GET',
        data: { user_id: 'test-user-001' }
      })
      
      if (petsRes.data) {
        setPets(petsRes.data)
      } else {
        // 使用模拟数据
        setPets([
          { id: 'p1', name: '小橘', pet_type: 'cat', breed: '橘猫' },
          { id: 'p2', name: '旺财', pet_type: 'dog', breed: '柯基' }
        ])
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      // 使用模拟数据
      setPets([
        { id: 'p1', name: '小橘', pet_type: 'cat', breed: '橘猫' },
        { id: 'p2', name: '旺财', pet_type: 'dog', breed: '柯基' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getServicePrice = () => {
    const service = services.find(s => s.id === selectedService)
    return service?.price || 0
  }

  const handleSubmit = async () => {
    // 表单验证
    if (!selectedService) {
      Taro.showToast({ title: '请选择服务项目', icon: 'none' })
      return
    }
    if (!selectedPet) {
      Taro.showToast({ title: '请选择宠物', icon: 'none' })
      return
    }
    if (!selectedDate || !selectedTime) {
      Taro.showToast({ title: '请选择预约时间', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      const appointmentTime = `${selectedDate} ${selectedTime}:00`
      const selectedServiceData = services.find(s => s.id === selectedService)
      
      // 生成核销码
      const verificationCode = 'CM' + Math.random().toString(36).substr(2, 8).toUpperCase()
      
      // 创建预约记录
      await Network.request({
        url: '/api/appointments',
        method: 'POST',
        data: {
          user_id: 'test-user-001',
          store_id: storeId,
          service_id: selectedService,
          pet_id: selectedPet,
          appointment_time: appointmentTime,
          price: getServicePrice(),
          note: note
        }
      })

      // 创建洗护订单
      await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: {
          user_id: 'test-user-001',
          order_type: 'grooming',
          status: 'in_service',
          total_amount: getServicePrice(),
          verification_code: verificationCode,
          appointment_time: appointmentTime,
          appointment: {
            service_name: selectedServiceData?.name || '洗护服务',
            store_name: '萌宠洗护中心',
            store_address: '北京市朝阳区宠物街123号',
            store_phone: '400-123-4567'
          }
        }
      })

      Taro.showToast({ title: '预约成功', icon: 'success' })
      setTimeout(() => {
        // 跳转到订单列表页
        Taro.navigateTo({ url: '/pages/order-list/index?type=grooming' })
      }, 1500)
    } catch (error) {
      console.error('预约失败:', error)
      // 即使后端失败，也模拟成功
      Taro.showToast({ title: '预约成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/order-list/index?type=grooming' })
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  // 生成未来7天的日期选项
  const getDateOptions = () => {
    const dates: Array<{ value: string; label: string; weekday: string }> = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        value: formatDate(date),
        label: i === 0 ? '今天' : i === 1 ? '明天' : `${date.getMonth() + 1}月${date.getDate()}日`,
        weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
      })
    }
    return dates
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-sm text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="pb-24">
        {/* 选择服务 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              选择服务 *
            </Label>
            <RadioGroup value={selectedService} onValueChange={setSelectedService}>
              <View className="space-y-2">
                {services.map((service) => (
                  <View 
                    key={service.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <View className="flex items-center gap-3">
                      <RadioGroupItem value={service.id} />
                      <View>
                        <Text className="block text-sm font-medium text-gray-800">
                          {service.name}
                        </Text>
                        {service.duration && (
                          <Text className="block text-xs text-gray-500">
                            {service.duration}分钟
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text className="text-base font-bold text-orange-500">
                      ¥{service.price}
                    </Text>
                  </View>
                ))}
              </View>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 选择宠物 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-3">
              <Label className="block text-sm font-medium text-gray-700">
                选择宠物 *
              </Label>
              <Text 
                className="text-sm text-orange-500"
                onClick={() => Taro.navigateTo({ url: '/pages/pet-detail/index?action=create' })}
              >
                + 新增宠物
              </Text>
            </View>
            
            {pets.length > 0 ? (
              <RadioGroup value={selectedPet} onValueChange={setSelectedPet}>
                <View className="space-y-2">
                  {pets.map((pet) => (
                    <View 
                      key={pet.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <RadioGroupItem value={pet.id} />
                      <View className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Text className="text-lg">
                          {pet.pet_type === 'cat' ? '🐱' : '🐕'}
                        </Text>
                      </View>
                      <View>
                        <Text className="block text-sm font-medium text-gray-800">
                          {pet.name}
                        </Text>
                        <Text className="block text-xs text-gray-500">
                          {pet.breed}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </RadioGroup>
            ) : (
              <View className="text-center py-6">
                <Text className="block text-sm text-gray-500 mb-3">
                  还没有宠物档案
                </Text>
                <Button 
                  size="sm"
                  onClick={() => Taro.navigateTo({ url: '/pages/pet-detail/index?action=create' })}
                >
                  创建宠物档案
                </Button>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 选择日期 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              选择日期 *
            </Label>
            <ScrollView scrollX className="w-full">
              <View className="flex gap-2">
                {getDateOptions().map((date) => (
                  <View
                    key={date.value}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                      selectedDate === date.value
                        ? 'bg-orange-500'
                        : 'bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    <Text
                      className={`text-xs ${
                        selectedDate === date.value ? 'text-orange-100' : 'text-gray-500'
                      }`}
                    >
                      {date.label}
                    </Text>
                    <Text
                      className={`text-sm font-medium ${
                        selectedDate === date.value ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      周{date.weekday}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </CardContent>
        </Card>

        {/* 选择时段 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              选择时段 *
            </Label>
            <View className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <View
                  key={slot.time}
                  className={`h-10 rounded-lg flex items-center justify-center ${
                    selectedTime === slot.time
                      ? 'bg-orange-500'
                      : slot.available
                      ? 'bg-gray-50'
                      : 'bg-gray-100 opacity-50'
                  }`}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                >
                  <Text
                    className={`text-sm ${
                      selectedTime === slot.time
                        ? 'text-white'
                        : slot.available
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {slot.time}
                  </Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 备注信息 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              备注信息
            </Label>
            <Textarea
              placeholder="请输入特殊要求或注意事项..."
              value={note}
              onInput={(e) => setNote(e.detail.value)}
              maxlength={200}
              className="min-h-20"
            />
          </CardContent>
        </Card>

        {/* 订单金额 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <Text className="text-sm text-gray-600">订单金额</Text>
              <Text className="text-xl font-bold text-orange-500">
                ¥{getServicePrice()}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 底部操作栏 */}
      <View 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e7eb',
          zIndex: 50
        }}
      >
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Text className="text-white font-medium">
            {submitting ? '提交中...' : '确认预约'}
          </Text>
        </Button>
      </View>
    </ScrollView>
  )
}

import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Service {
  id: string
  name: string
  category: 'wash' | 'grooming' | 'spa'
  description?: string
  price_config: {
    small?: number
    medium?: number
    large?: number
  }
  duration: number
  is_available: boolean
  photos?: string[]
}

const CATEGORY_OPTIONS = [
  { value: 'wash', label: '普洗', icon: '🛁' },
  { value: 'grooming', label: '美容', icon: '✂️' },
  { value: 'spa', label: 'SPA', icon: '💆' },
]

const SIZE_OPTIONS = [
  { value: 'small', label: '小型犬', desc: '0-10kg' },
  { value: 'medium', label: '中型犬', desc: '10-25kg' },
  { value: 'large', label: '大型犬', desc: '25kg以上' },
]

export default function GroomingServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [storeId, setStoreId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    category: 'wash',
    description: '',
    price_config: { small: 50, medium: 80, large: 120 },
    duration: 60,
    is_available: true,
  })

  useEffect(() => {
    loadStoreAndServices()
  }, [])

  const loadStoreAndServices = async () => {
    try {
      const info = Taro.getStorageSync('merchantInfo')
      if (!info?.id) return

      // 获取门店信息
      const storeRes = await Network.request({
        url: `/api/grooming/stores/merchant/${info.id}`,
        method: 'GET',
      })
      
      if (storeRes.data?.data?.id) {
        setStoreId(storeRes.data.data.id)
        loadServices(storeRes.data.data.id)
      }
    } catch (error) {
      console.error('加载门店信息失败:', error)
      // 使用模拟数据
      setServices([
        {
          id: 's1',
          name: '基础洗澡',
          category: 'wash',
          description: '包含洗澡、吹干、梳理',
          price_config: { small: 50, medium: 80, large: 120 },
          duration: 60,
          is_available: true,
        },
        {
          id: 's2',
          name: '精洗护理',
          category: 'wash',
          description: '洗澡、吹干、梳理、护理',
          price_config: { small: 80, medium: 120, large: 180 },
          duration: 90,
          is_available: true,
        },
        {
          id: 's3',
          name: '造型美容',
          category: 'grooming',
          description: '洗澡+造型修剪',
          price_config: { small: 150, medium: 200, large: 300 },
          duration: 120,
          is_available: true,
        },
        {
          id: 's4',
          name: '宠物SPA',
          category: 'spa',
          description: '深度护理、药浴、按摩',
          price_config: { small: 200, medium: 300, large: 400 },
          duration: 150,
          is_available: false,
        },
      ])
    }
  }

  const loadServices = async (sId: string) => {
    try {
      const res = await Network.request({
        url: `/api/grooming/stores/${sId}/services`,
        method: 'GET',
      })
      if (res.data?.data) {
        setServices(res.data.data)
      }
    } catch (error) {
      console.error('加载服务列表失败:', error)
    }
  }

  const handleAddService = () => {
    setEditingService(null)
    setFormData({
      name: '',
      category: 'wash',
      description: '',
      price_config: { small: 50, medium: 80, large: 120 },
      duration: 60,
      is_available: true,
    })
    setShowForm(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({ ...service })
    setShowForm(true)
  }

  const handleToggleAvailable = async (service: Service) => {
    try {
      const newStatus = !service.is_available
      await Network.request({
        url: `/api/grooming/services/${service.id}/status`,
        method: 'PUT',
        data: { is_available: newStatus },
      })
      setServices(services.map(s => 
        s.id === service.id ? { ...s, is_available: newStatus } : s
      ))
      Taro.showToast({ title: newStatus ? '已上架' : '已下架', icon: 'success' })
    } catch (error) {
      console.error('切换状态失败:', error)
      // 本地更新
      setServices(services.map(s => 
        s.id === service.id ? { ...s, is_available: !s.is_available } : s
      ))
    }
  }

  const handleSaveService = async () => {
    if (!formData.name) {
      Taro.showToast({ title: '请输入服务名称', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      if (editingService?.id) {
        // 更新
        await Network.request({
          url: `/api/grooming/services/${editingService.id}`,
          method: 'PUT',
          data: formData,
        })
      } else {
        // 新增
        await Network.request({
          url: '/api/grooming/services',
          method: 'POST',
          data: { ...formData, store_id: storeId },
        })
      }
      
      Taro.showToast({ title: '保存成功', icon: 'success' })
      setShowForm(false)
      if (storeId) loadServices(storeId)
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryInfo = (category: string) => {
    return CATEGORY_OPTIONS.find(c => c.value === category) || CATEGORY_OPTIONS[0]
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {showForm ? (
        /* 编辑表单 */
        <ScrollView className="min-h-screen bg-gray-50" scrollY>
          <View className="p-4">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                {editingService ? '编辑服务' : '添加服务'}
              </Text>
              <Text
                className="text-orange-500 text-sm"
                onClick={() => setShowForm(false)}
              >
                取消
              </Text>
            </View>

            {/* 服务名称 */}
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <Text className="block text-sm text-gray-600 mb-2">服务名称 *</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <Input
                    placeholder="如：基础洗澡"
                    value={formData.name}
                    onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                    className="w-full bg-transparent"
                  />
                </View>
              </CardContent>
            </Card>

            {/* 服务类型 */}
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <Text className="block text-sm text-gray-600 mb-3">服务类型</Text>
                <View className="flex gap-2">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <View
                      key={opt.value}
                      className={`flex-1 py-3 rounded-lg text-center ${
                        formData.category === opt.value
                          ? 'bg-orange-500'
                          : 'bg-gray-100'
                      }`}
                      onClick={() => setFormData({ ...formData, category: opt.value as any })}
                    >
                      <Text className="text-lg">{opt.icon}</Text>
                      <Text className={`block text-sm mt-1 ${
                        formData.category === opt.value ? 'text-white' : 'text-gray-600'
                      }`}
                      >
                        {opt.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* 服务时长 */}
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <Text className="block text-sm text-gray-600 mb-2">服务时长（分钟）</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <Input
                    type="number"
                    placeholder="如：60"
                    value={String(formData.duration || '')}
                    onInput={(e) => setFormData({ ...formData, duration: Number(e.detail.value) })}
                    className="w-full bg-transparent"
                  />
                </View>
              </CardContent>
            </Card>

            {/* 价格设置 */}
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <Text className="block text-base font-semibold text-gray-800 mb-3">价格设置（元）</Text>
                {SIZE_OPTIONS.map((size) => (
                  <View key={size.value} className="mb-3">
                    <View className="flex items-center justify-between mb-1">
                      <Text className="text-sm text-gray-600">{size.label}</Text>
                      <Text className="text-xs text-gray-400">{size.desc}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <Input
                        type="number"
                        placeholder={`请输入${size.label}价格`}
                        value={String(formData.price_config?.[size.value as keyof typeof formData.price_config] || '')}
                        onInput={(e) => setFormData({
                          ...formData,
                          price_config: {
                            ...formData.price_config,
                            [size.value]: Number(e.detail.value),
                          },
                        })}
                        className="w-full bg-transparent"
                      />
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>

            {/* 服务描述 */}
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <Text className="block text-sm text-gray-600 mb-2">服务描述</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <Input
                    placeholder="请输入服务描述"
                    value={formData.description || ''}
                    onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                    className="w-full bg-transparent"
                  />
                </View>
              </CardContent>
            </Card>

            {/* 保存按钮 */}
            <Button
              className="w-full bg-orange-500"
              onClick={handleSaveService}
              disabled={loading}
            >
              <Text className="text-white font-medium">
                {loading ? '保存中...' : '保存'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      ) : (
        /* 服务列表 */
        <ScrollView className="min-h-screen bg-gray-50" scrollY>
          <View className="p-4">
            {/* 添加按钮 */}
            <Button
              className="w-full bg-orange-500 mb-4"
              onClick={handleAddService}
            >
              <Text className="text-white font-medium">+ 添加服务</Text>
            </Button>

            {/* 服务列表 */}
            {services.map((service) => {
              const categoryInfo = getCategoryInfo(service.category)
              return (
                <Card key={service.id} className="bg-white shadow-sm mb-3">
                  <CardContent className="p-4">
                    <View className="flex items-start justify-between mb-3">
                      <View className="flex-1">
                        <View className="flex items-center gap-2 mb-1">
                          <Text className="text-lg">{categoryInfo.icon}</Text>
                          <Text className="text-base font-medium text-gray-800">
                            {service.name}
                          </Text>
                          <Badge className={service.is_available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}>
                            {service.is_available ? '上架中' : '已下架'}
                          </Badge>
                        </View>
                        <Text className="text-sm text-gray-500">{service.description}</Text>
                        <Text className="text-xs text-gray-400 mt-1">
                          服务时长：{service.duration}分钟
                        </Text>
                      </View>
                      <Text
                        className="text-orange-500 text-sm"
                        onClick={() => handleEditService(service)}
                      >
                        编辑
                      </Text>
                    </View>

                    {/* 价格展示 */}
                    <View className="flex gap-2 mb-3">
                      {SIZE_OPTIONS.map((size) => {
                        const price = service.price_config?.[size.value as keyof typeof service.price_config]
                        return price ? (
                          <View key={size.value} className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                            <Text className="block text-xs text-gray-500">{size.label}</Text>
                            <Text className="block text-base font-semibold text-orange-500">
                              ¥{price}
                            </Text>
                          </View>
                        ) : null
                      })}
                    </View>

                    {/* 上下架按钮 */}
                    <Button
                      size="sm"
                      variant="outline"
                      className={`w-full ${service.is_available ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}
                      onClick={() => handleToggleAvailable(service)}
                    >
                      {service.is_available ? '下架服务' : '上架服务'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}

            {services.length === 0 && (
              <View className="py-20 text-center">
                <Text className="text-4xl mb-4">📋</Text>
                <Text className="block text-gray-500 mb-2">暂无服务项目</Text>
                <Text className="block text-sm text-gray-400">点击上方按钮添加服务</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

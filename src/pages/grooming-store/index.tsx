import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface StoreInfo {
  id: string
  name: string
  logo_url?: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  opening_hours: string
  service_range: string
  description?: string
  photos?: string[]
  is_open: boolean
}

export default function GroomingStorePage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [merchantId, setMerchantId] = useState('')

  const [formData, setFormData] = useState<StoreInfo>({
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    opening_hours: '09:00-21:00',
    service_range: '',
    description: '',
    photos: [],
    is_open: true,
  })

  useEffect(() => {
    const info = Taro.getStorageSync('merchantInfo')
    if (info?.id) {
      setMerchantId(info.id)
      loadStoreInfo(info.id)
    }
  }, [])

  const loadStoreInfo = async (mId: string) => {
    try {
      const res = await Network.request({
        url: `/api/grooming/stores/merchant/${mId}`,
        method: 'GET',
      })
      if (res.data?.data) {
        setFormData(res.data.data)
      }
    } catch (error) {
      console.error('加载门店信息失败:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleChooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation({})
      if (res.address) {
        setFormData({
          ...formData,
          address: res.address,
          province: res.name?.split(/省|市/)[0] + '省' || '',
          city: res.name?.split(/市/)[0]?.split(/省/)[1] + '市' || '',
        })
      }
    } catch (error) {
      console.error('选择位置失败:', error)
    }
  }

  const handleUploadPhotos = async () => {
    try {
      setUploading(true)
      const result = await Taro.chooseImage({
        count: 9 - (formData.photos?.length || 0),
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })
      setFormData({
        ...formData,
        photos: [...(formData.photos || []), ...result.tempFilePaths],
      })
    } catch (error) {
      console.error('选择图片失败:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = (index: number) => {
    const photos = [...(formData.photos || [])]
    photos.splice(index, 1)
    setFormData({ ...formData, photos })
  }

  const handleSave = async () => {
    if (!formData.name) {
      Taro.showToast({ title: '请输入门店名称', icon: 'none' })
      return
    }
    if (!formData.phone) {
      Taro.showToast({ title: '请输入联系电话', icon: 'none' })
      return
    }
    if (!formData.address) {
      Taro.showToast({ title: '请输入门店地址', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      if (formData.id) {
        await Network.request({
          url: `/api/grooming/stores/${formData.id}`,
          method: 'PUT',
          data: formData,
        })
      } else {
        await Network.request({
          url: '/api/grooming/stores',
          method: 'POST',
          data: { ...formData, merchant_id: merchantId },
        })
      }
      Taro.showToast({ title: '保存成功', icon: 'success' })
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleOpen = async () => {
    if (!formData.id) {
      Taro.showToast({ title: '请先保存门店信息', icon: 'none' })
      return
    }
    try {
      const newStatus = !formData.is_open
      await Network.request({
        url: `/api/grooming/stores/${formData.id}/status`,
        method: 'PUT',
        data: { is_open: newStatus },
      })
      setFormData({ ...formData, is_open: newStatus })
      Taro.showToast({ title: newStatus ? '已营业' : '已打烊', icon: 'success' })
    } catch (error) {
      console.error('切换状态失败:', error)
    }
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 基本信息卡片 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-4">基本信息</Text>

            {/* 门店名称 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">门店名称 *</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="请输入门店名称"
                  value={formData.name}
                  onInput={(e) => handleInputChange('name', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            {/* 联系电话 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">联系电话 *</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  type="number"
                  placeholder="请输入联系电话"
                  value={formData.phone}
                  onInput={(e) => handleInputChange('phone', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            {/* 门店地址 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">门店地址 *</Text>
              <View
                className="bg-gray-50 rounded-lg px-3 py-3 flex items-center justify-between"
                onClick={handleChooseLocation}
              >
                <Text className={formData.address ? 'text-gray-800' : 'text-gray-400'}>
                  {formData.address || '点击选择门店位置'}
                </Text>
                <Text className="text-gray-400">{'>'}</Text>
              </View>
            </View>

            {/* 营业时间 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">营业时间</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="如: 09:00-21:00"
                  value={formData.opening_hours}
                  onInput={(e) => handleInputChange('opening_hours', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            {/* 服务范围 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">服务范围</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="如: 周边5公里"
                  value={formData.service_range}
                  onInput={(e) => handleInputChange('service_range', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            {/* 门店介绍 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">门店介绍</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="请输入门店介绍"
                  value={formData.description || ''}
                  onInput={(e) => handleInputChange('description', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 门店照片 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-4">门店照片</Text>
            <View className="flex flex-wrap gap-2">
              {formData.photos?.map((_, index) => (
                <View
                  key={index}
                  className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center relative"
                >
                  <Text className="text-xs text-gray-600">照片{index + 1}</Text>
                  <View
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <Text className="text-white text-xs">×</Text>
                  </View>
                </View>
              ))}
              {(formData.photos?.length || 0) < 9 && (
                <View
                  className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                  onClick={handleUploadPhotos}
                >
                  <Text className="text-2xl text-gray-300">+</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* 营业状态 */}
        {formData.id && (
          <Card className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <View className="flex items-center justify-between">
                <View>
                  <Text className="block text-base font-semibold text-gray-800">营业状态</Text>
                  <Text className="block text-sm text-gray-500 mt-1">
                    当前状态：{formData.is_open ? '营业中' : '已打烊'}
                  </Text>
                </View>
                <View
                  className={`px-4 py-2 rounded-full ${formData.is_open ? 'bg-green-500' : 'bg-gray-400'}`}
                  onClick={handleToggleOpen}
                >
                  <Text className="text-white text-sm">{formData.is_open ? '营业中' : '已打烊'}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 保存按钮 */}
        <Button
          className="w-full bg-orange-500"
          onClick={handleSave}
          disabled={loading || uploading}
        >
          <Text className="text-white font-medium">
            {loading ? '保存中...' : '保存'}
          </Text>
        </Button>
      </View>
    </ScrollView>
  )
}

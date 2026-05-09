import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, MapPin, Phone, User, Check } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Address {
  id: string
  receiver_name: string
  receiver_phone: string
  province: string
  city: string
  district: string
  detail_address: string
  is_default: boolean
  created_at: string
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const testUserId = 'test-user-001'

  // 编辑表单状态
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    province: '',
    city: '',
    district: '',
    detail_address: '',
    is_default: false
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/addresses',
        method: 'GET',
        data: { user_id: testUserId }
      })

      if (res.data?.data) {
        setAddresses(res.data.data)
      } else if (Array.isArray(res.data)) {
        setAddresses(res.data)
      }
    } catch (error) {
      console.error('加载地址列表失败:', error)
      // 使用模拟数据
      setAddresses([
        {
          id: '1',
          receiver_name: '张三',
          receiver_phone: '13812345678',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail_address: '科技园南区XXX大厦A座1001',
          is_default: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          receiver_name: '李四',
          receiver_phone: '13987654321',
          province: '广东省',
          city: '深圳市',
          district: '福田区',
          detail_address: '福华路XXX小区5栋302',
          is_default: false,
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setIsEditing(true)
    setEditingId(null)
    setFormData({
      receiver_name: '',
      receiver_phone: '',
      province: '',
      city: '',
      district: '',
      detail_address: '',
      is_default: false
    })
  }

  const handleEdit = (address: Address) => {
    setIsEditing(true)
    setEditingId(address.id)
    setFormData({
      receiver_name: address.receiver_name,
      receiver_phone: address.receiver_phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail_address: address.detail_address,
      is_default: address.is_default
    })
  }

  const handleSave = async () => {
    if (!formData.receiver_name || !formData.receiver_phone || !formData.province || 
        !formData.city || !formData.district || !formData.detail_address) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(formData.receiver_phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    try {
      const data = {
        ...formData,
        user_id: testUserId
      }

      if (editingId) {
        await Network.request({
          url: `/api/addresses/${editingId}`,
          method: 'PUT',
          data
        })
        Taro.showToast({ title: '修改成功', icon: 'success' })
      } else {
        await Network.request({
          url: '/api/addresses',
          method: 'POST',
          data
        })
        Taro.showToast({ title: '添加成功', icon: 'success' })
      }

      setIsEditing(false)
      loadAddresses()
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个地址吗？'
    })

    if (result.confirm) {
      try {
        await Network.request({
          url: `/api/addresses/${id}`,
          method: 'DELETE'
        })
        Taro.showToast({ title: '删除成功', icon: 'success' })
        loadAddresses()
      } catch (error) {
        console.error('删除失败:', error)
        Taro.showToast({ title: '删除失败', icon: 'error' })
      }
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await Network.request({
        url: `/api/addresses/${id}/default`,
        method: 'POST'
      })
      Taro.showToast({ title: '设置成功', icon: 'success' })
      loadAddresses()
    } catch (error) {
      console.error('设置默认地址失败:', error)
      Taro.showToast({ title: '设置失败', icon: 'error' })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 列表模式 */}
      {!isEditing ? (
        <View className="min-h-screen">
          {/* 页面标题 */}
          <View className="bg-white px-4 py-4 border-b border-gray-100">
            <View className="flex items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">收货地址</Text>
              <Button size="sm" onClick={handleAdd}>
                <Plus size={16} color="#ff6b35" className="mr-1" />
                新增地址
              </Button>
            </View>
          </View>

          {/* 地址列表 */}
          <ScrollView className="px-4 py-4" scrollY style={{ height: 'calc(100vh - 120px)' }}>
            {loading ? (
              <View className="flex items-center justify-center py-20">
                <Text className="text-sm text-gray-400">加载中...</Text>
              </View>
            ) : addresses.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-20">
                <Text className="text-4xl mb-4">📍</Text>
                <Text className="text-sm text-gray-400 mb-4">还没有添加地址</Text>
                <Button onClick={handleAdd}>
                  <Plus size={16} color="#ff6b35" className="mr-1" />
                  添加收货地址
                </Button>
              </View>
            ) : (
              <View className="space-y-3">
                {addresses.map((address) => (
                  <Card key={address.id} className="bg-white shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <View className="flex items-start gap-3">
                        {/* 图标 */}
                        <View className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <MapPin size={20} color="#ff6b35" />
                        </View>

                        {/* 地址信息 */}
                        <View className="flex-1">
                          <View className="flex items-center gap-2 mb-1">
                            <User size={14} color="#9ca3af" />
                            <Text className="text-base font-medium text-gray-800">
                              {address.receiver_name}
                            </Text>
                            <Phone size={14} color="#9ca3af" className="ml-2" />
                            <Text className="text-sm text-gray-600">
                              {formatPhone(address.receiver_phone)}
                            </Text>
                            {address.is_default && (
                              <Badge className="bg-orange-500 text-white text-xs">
                                默认
                              </Badge>
                            )}
                          </View>
                          
                          <Text className="block text-sm text-gray-600 mt-2">
                            {address.province}
                            {address.city}
                            {address.district}
                          </Text>
                          <Text className="block text-sm text-gray-500 mt-1">
                            {address.detail_address}
                          </Text>
                        </View>
                      </View>

                      {/* 操作按钮 */}
                      <View className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                        {!address.is_default && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            设为默认
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(address)}
                        >
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-200"
                          onClick={() => handleDelete(address.id)}
                        >
                          删除
                        </Button>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        // 编辑模式
        <ScrollView className="px-4 py-4" scrollY style={{ height: '100vh' }}>
          <View className="space-y-4">
            {/* 收货人信息 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Text className="block text-base font-medium text-gray-700 mb-2">
                  收货人信息
                </Text>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">姓名 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="请输入收货人姓名"
                    value={formData.receiver_name}
                    onInput={(e) => setFormData({ ...formData, receiver_name: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">手机号 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="请输入手机号"
                    type="number"
                    value={formData.receiver_phone}
                    onInput={(e) => setFormData({ ...formData, receiver_phone: e.detail.value })}
                  />
                </View>
              </CardContent>
            </Card>

            {/* 地址信息 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Text className="block text-base font-medium text-gray-700 mb-2">
                  地址信息
                </Text>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">省份 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如：广东省"
                    value={formData.province}
                    onInput={(e) => setFormData({ ...formData, province: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">城市 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如：深圳市"
                    value={formData.city}
                    onInput={(e) => setFormData({ ...formData, city: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">区/县 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如：南山区"
                    value={formData.district}
                    onInput={(e) => setFormData({ ...formData, district: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">详细地址 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="街道、楼牌号等"
                    value={formData.detail_address}
                    onInput={(e) => setFormData({ ...formData, detail_address: e.detail.value })}
                  />
                </View>
              </CardContent>
            </Card>

            {/* 设为默认 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <View
                  className="flex items-center justify-between"
                  onClick={() => setFormData({ ...formData, is_default: !formData.is_default })}
                >
                  <Text className="text-sm text-gray-700">设为默认地址</Text>
                  <View
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      formData.is_default ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  >
                    {formData.is_default && <Check size={14} color="#ffffff" />}
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <View className="flex gap-3">
              <Button className="flex-1 bg-orange-500" onClick={handleSave}>
                保存
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Calendar, Weight, Syringe, Scissors, Check, ImagePlus, Trash2 } from 'lucide-react-taro'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface Pet {
  id: string
  name: string
  pet_type: string
  breed: string
  gender: string
  birthday?: string
  photo_url?: string
  color?: string
  weight?: number
  sterilized?: boolean
  chip_number?: string
  personality?: string
  vaccine_records?: Array<{ date: string; name: string; note?: string }>
  deworming_records?: Array<{ date: string; type: string; note?: string }>
  description?: string
  created_at: string
}

interface PetRecord {
  id: string
  record_type: string
  record_date: string
  value?: string
  unit?: string
  description?: string
  photos?: string[]
}

interface PetPhoto {
  id: string
  pet_id: string
  photo_key: string
  photo_url: string
  description?: string
  sort_order: number
  created_at: string
}

export default function PetDetailPage() {
  const router = useRouter()
  const petId = router.params.petId
  const mode = router.params.mode

  const [pet, setPet] = useState<Pet | null>(null)
  const [records, setRecords] = useState<PetRecord[]>([])
  const [photos, setPhotos] = useState<PetPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(mode === 'add')
  const [activeTab, setActiveTab] = useState('info')

  // 编辑表单状态
  const [formData, setFormData] = useState({
    name: '',
    pet_type: 'cat',
    breed: '',
    gender: 'male',
    birthday: '',
    color: '',
    weight: '',
    sterilized: false,
    chip_number: '',
    personality: '',
    description: ''
  })

  // 每次页面显示时加载数据
  useDidShow(() => {
    if (mode === 'add') {
      setIsEditing(true)
    } else if (petId) {
      loadPetDetail()
      loadPetRecords()
      loadPetPhotos()
    } else {
      // 没有 petId 时，也要加载记录（可能是从添加记录页面返回）
      const currentPetId = router.params.petId
      if (currentPetId) {
        loadPetRecords()
        loadPetPhotos()
      }
    }
  })

  const loadPetDetail = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/pets/${petId}`,
        method: 'GET'
      })

      if (res.data?.data) {
        setPet(res.data.data)
        setFormData({
          name: res.data.data.name,
          pet_type: res.data.data.pet_type,
          breed: res.data.data.breed,
          gender: res.data.data.gender,
          birthday: res.data.data.birthday || '',
          color: res.data.data.color || '',
          weight: res.data.data.weight?.toString() || '',
          sterilized: res.data.data.sterilized || false,
          chip_number: res.data.data.chip_number || '',
          personality: res.data.data.personality || '',
          description: res.data.data.description || ''
        })
      } else if (res.data) {
        setPet(res.data)
      }
    } catch (error) {
      console.error('加载宠物详情失败:', error)
      // 使用模拟数据
      const mockPet: Pet = {
        id: petId || '1',
        name: '小橘',
        pet_type: 'cat',
        breed: '橘猫',
        gender: 'male',
        birthday: '2023-06-15',
        photo_url: '',
        color: '橘色',
        weight: 4.5,
        sterilized: true,
        chip_number: 'CN20231015001',
        personality: '活泼好动，喜欢玩逗猫棒',
        vaccine_records: [
          { date: '2023-08-15', name: '猫三联第一针', note: '已完成' },
          { date: '2023-09-15', name: '猫三联第二针', note: '已完成' }
        ],
        deworming_records: [
          { date: '2023-10-01', type: '体内驱虫', note: '拜耳' }
        ],
        description: '活泼好动，喜欢玩逗猫棒',
        created_at: new Date().toISOString()
      }
      setPet(mockPet)
      setFormData({
        name: mockPet.name,
        pet_type: mockPet.pet_type,
        breed: mockPet.breed,
        gender: mockPet.gender,
        birthday: mockPet.birthday || '',
        color: mockPet.color || '',
        weight: mockPet.weight?.toString() || '',
        sterilized: mockPet.sterilized || false,
        chip_number: mockPet.chip_number || '',
        personality: mockPet.personality || '',
        description: mockPet.description || ''
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPetRecords = async () => {
    try {
      const res = await Network.request({
        url: `/api/pets/${petId}/records`,
        method: 'GET'
      })

      if (res.data?.data) {
        setRecords(res.data.data)
      } else if (Array.isArray(res.data)) {
        setRecords(res.data)
      }
    } catch (error) {
      console.error('加载成长记录失败:', error)
      // 使用模拟数据
      setRecords([
        {
          id: '1',
          record_type: 'weight',
          record_date: '2024-01-01',
          value: '4.5',
          unit: 'kg',
          description: '体重正常'
        },
        {
          id: '2',
          record_type: 'bath',
          record_date: '2024-01-10',
          description: '洗澡美容'
        }
      ])
    }
  }

  const loadPetPhotos = async () => {
    try {
      const res = await Network.request({
        url: `/api/pets/${petId}/photos`,
        method: 'GET'
      })

      if (res.data?.data) {
        setPhotos(res.data.data)
      } else if (Array.isArray(res.data)) {
        setPhotos(res.data)
      }
    } catch (error) {
      console.error('加载宠物相册失败:', error)
      setPhotos([])
    }
  }

  const handleUploadPhoto = async () => {
    if (!petId) {
      Taro.showToast({ title: '请先保存宠物档案', icon: 'none' })
      return
    }

    try {
      const chooseRes = await Taro.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      Taro.showLoading({ title: '上传中...' })

      // 逐个上传图片
      for (const filePath of chooseRes.tempFilePaths) {
        try {
          await Network.uploadFile({
            url: `/api/pets/${petId}/photos`,
            filePath: filePath,
            name: 'file'
          })
        } catch (uploadError) {
          console.error('上传照片失败:', uploadError)
        }
      }

      Taro.hideLoading()
      Taro.showToast({ title: '上传成功', icon: 'success' })
      
      // 重新加载相册
      loadPetPhotos()
    } catch (error) {
      Taro.hideLoading()
      console.error('选择图片失败:', error)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这张照片吗？'
    })

    if (result.confirm) {
      try {
        await Network.request({
          url: `/api/pets/${petId}/photos/${photoId}`,
          method: 'DELETE'
        })
        Taro.showToast({ title: '删除成功', icon: 'success' })
        loadPetPhotos()
      } catch (error) {
        console.error('删除照片失败:', error)
        Taro.showToast({ title: '删除失败', icon: 'error' })
      }
    }
  }

  const handlePreviewImage = (currentUrl: string) => {
    const urls = photos.map(p => p.photo_url).filter(Boolean)
    Taro.previewImage({
      current: currentUrl,
      urls: urls
    })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.breed) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    try {
      const testUserId = 'test-user-001'
      const data = {
        ...formData,
        user_id: testUserId,
        weight: formData.weight ? parseFloat(formData.weight) : null
      }

      if (mode === 'add' || !petId) {
        await Network.request({
          url: '/api/pets',
          method: 'POST',
          data
        })
        Taro.showToast({ title: '添加成功', icon: 'success' })
      } else {
        await Network.request({
          url: `/api/pets/${petId}`,
          method: 'PUT',
          data: formData
        })
        Taro.showToast({ title: '保存成功', icon: 'success' })
      }

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'error' })
    }
  }

  const handleAddRecord = (recordType: string) => {
    if (!petId) {
      Taro.showToast({ title: '请先保存宠物档案', icon: 'none' })
      return
    }
    Taro.navigateTo({ 
      url: `/pages/pet-record/index?petId=${petId}&type=${recordType}` 
    })
  }

  const handleDelete = async () => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个宠物档案吗？'
    })

    if (result.confirm && petId) {
      try {
        await Network.request({
          url: `/api/pets/${petId}`,
          method: 'DELETE'
        })
        Taro.showToast({ title: '删除成功', icon: 'success' })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } catch (error) {
        console.error('删除失败:', error)
        Taro.showToast({ title: '删除失败', icon: 'error' })
      }
    }
  }

  const calculateAge = (birthday?: string) => {
    if (!birthday) return '未知'
    
    const birth = new Date(birthday)
    const now = new Date()
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
    
    if (months < 1) return '不到1个月'
    if (months < 12) return `${months}个月`
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return remainingMonths > 0 ? `${years}岁${remainingMonths}个月` : `${years}岁`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  if (loading && !isEditing) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-sm text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 编辑模式 */}
      {isEditing ? (
        <ScrollView className="px-4 py-4" scrollY style={{ height: 'calc(100vh - 120px)' }}>
          <View className="space-y-4">
            {/* 宠物头像 */}
            <View className="flex justify-center mb-4">
              <View className="w-24 h-24 bg-gradient-to-br from-orange-100 to-teal-100 rounded-full flex items-center justify-center">
                <Text className="text-5xl">
                  {formData.pet_type === 'cat' ? '🐱' : '🐶'}
                </Text>
              </View>
            </View>

            {/* 基本信息 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Text className="block text-base font-medium text-gray-700 mb-2">
                  基本信息
                </Text>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">宠物名字 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="请输入宠物名字"
                    value={formData.name}
                    onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">宠物类型</Label>
                  <View className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={formData.pet_type === 'cat' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, pet_type: 'cat' })}
                    >
                      🐱 猫咪
                    </Button>
                    <Button
                      size="sm"
                      variant={formData.pet_type === 'dog' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, pet_type: 'dog' })}
                    >
                      🐶 狗狗
                    </Button>
                  </View>
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">品种 *</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如：英短、柯基、金毛等"
                    value={formData.breed}
                    onInput={(e) => setFormData({ ...formData, breed: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">性别</Label>
                  <View className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={formData.gender === 'male' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                    >
                      ♂ 公
                    </Button>
                    <Button
                      size="sm"
                      variant={formData.gender === 'female' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                    >
                      ♀ 母
                    </Button>
                  </View>
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">生日</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如：2023-06-15"
                    value={formData.birthday}
                    onInput={(e) => setFormData({ ...formData, birthday: e.detail.value })}
                  />
                </View>
              </CardContent>
            </Card>

            {/* 外观信息 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Text className="block text-base font-medium text-gray-700 mb-2">
                  外观信息
                </Text>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">毛色</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如：橘色、蓝色、黄白相间等"
                    value={formData.color}
                    onInput={(e) => setFormData({ ...formData, color: e.detail.value })}
                  />
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">体重（kg）</Label>
                  <Input
                    className="bg-gray-50"
                    type="digit"
                    placeholder="如：4.5"
                    value={formData.weight}
                    onInput={(e) => setFormData({ ...formData, weight: e.detail.value })}
                  />
                </View>
              </CardContent>
            </Card>

            {/* 健康信息 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Text className="block text-base font-medium text-gray-700 mb-2">
                  健康信息
                </Text>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">绝育状态</Label>
                  <View
                    className="flex items-center justify-between mt-2"
                    onClick={() => setFormData({ ...formData, sterilized: !formData.sterilized })}
                  >
                    <Text className="text-sm text-gray-700">
                      {formData.sterilized ? '已绝育' : '未绝育'}
                    </Text>
                    <View
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        formData.sterilized ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    >
                      {formData.sterilized && <Check size={14} color="#ffffff" />}
                    </View>
                  </View>
                </View>

                <View>
                  <Label className="text-sm text-gray-600 mb-1">芯片编号</Label>
                  <Input
                    className="bg-gray-50"
                    placeholder="如有芯片请填写编号"
                    value={formData.chip_number}
                    onInput={(e) => setFormData({ ...formData, chip_number: e.detail.value })}
                  />
                </View>
              </CardContent>
            </Card>

            {/* 性格特点 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <Label className="text-sm text-gray-600 mb-1">性格特点</Label>
                <Input
                  className="bg-gray-50 mt-2"
                  placeholder="描述宠物的性格特点"
                  value={formData.personality}
                  onInput={(e) => setFormData({ ...formData, personality: e.detail.value })}
                />
              </CardContent>
            </Card>

            {/* 备注 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <Label className="text-sm text-gray-600 mb-1">备注</Label>
                <Input
                  className="bg-gray-50 mt-2"
                  placeholder="其他需要记录的信息"
                  value={formData.description}
                  onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                />
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <View className="flex gap-3">
              <Button className="flex-1 bg-orange-500" onClick={handleSave}>
                保存
              </Button>
              {mode !== 'add' && (
                <Button variant="outline" onClick={handleDelete}>
                  删除
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        // 查看模式
        <ScrollView className="min-h-screen bg-gray-50" scrollY>
          <View className="pb-24">
            {/* 宠物头像和基本信息 */}
            <View className="bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-8">
              <View className="flex flex-col items-center">
                <View className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden mb-3">
                  {pet?.photo_url ? (
                    <Text className="text-xs text-gray-400">照片</Text>
                  ) : (
                    <Text className="text-5xl">
                      {pet?.pet_type === 'cat' ? '🐱' : '🐶'}
                    </Text>
                  )}
                </View>
                <View className="flex items-center gap-2 mb-2">
                  <Text className="text-2xl font-bold text-white">{pet?.name}</Text>
                  <Text className={`text-xl ${pet?.gender === 'male' ? 'text-blue-200' : 'text-pink-200'}`}>
                    {pet?.gender === 'male' ? '♂' : '♀'}
                  </Text>
                  {pet?.sterilized && (
                    <Badge className="bg-white bg-opacity-20 text-white text-xs">
                      已绝育
                    </Badge>
                  )}
                </View>
                <View className="flex items-center gap-2">
                  <Badge className="bg-white bg-opacity-20 text-white">
                    {pet?.pet_type === 'cat' ? '猫咪' : '狗狗'}
                  </Badge>
                  <Text className="text-sm text-orange-100">{pet?.breed}</Text>
                  {pet?.color && (
                    <>
                      <Text className="text-sm text-orange-200">·</Text>
                      <Text className="text-sm text-orange-100">{pet.color}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* 标签页 */}
            <View className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">基本信息</TabsTrigger>
                  <TabsTrigger value="vaccine" className="flex-1">健康记录</TabsTrigger>
                  <TabsTrigger value="growth" className="flex-1">成长记录</TabsTrigger>
                  <TabsTrigger value="album" className="flex-1">相册</TabsTrigger>
                </TabsList>
              </Tabs>
            </View>

            {/* 基本信息 */}
            {activeTab === 'info' && (
              <View className="px-4 py-4 space-y-3">
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <View className="flex justify-between">
                      <Text className="text-sm text-gray-500">年龄</Text>
                      <Text className="text-sm text-gray-700">
                        {calculateAge(pet?.birthday)}
                      </Text>
                    </View>
                    <View className="flex justify-between">
                      <Text className="text-sm text-gray-500">生日</Text>
                      <Text className="text-sm text-gray-700">
                        {pet?.birthday ? formatDate(pet.birthday) : '未知'}
                      </Text>
                    </View>
                    <View className="flex justify-between">
                      <Text className="text-sm text-gray-500">品种</Text>
                      <Text className="text-sm text-gray-700">{pet?.breed}</Text>
                    </View>
                    <View className="flex justify-between">
                      <Text className="text-sm text-gray-500">性别</Text>
                      <Text className="text-sm text-gray-700">
                        {pet?.gender === 'male' ? '公' : '母'}
                      </Text>
                    </View>
                    {pet?.weight && (
                      <View className="flex justify-between">
                        <Text className="text-sm text-gray-500">体重</Text>
                        <Text className="text-sm text-gray-700">{pet.weight} kg</Text>
                      </View>
                    )}
                    {pet?.chip_number && (
                      <View className="flex justify-between">
                        <Text className="text-sm text-gray-500">芯片编号</Text>
                        <Text className="text-sm text-gray-700">{pet.chip_number}</Text>
                      </View>
                    )}
                  </CardContent>
                </Card>

                {pet?.personality && (
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <Text className="text-sm text-gray-500 mb-2">性格特点</Text>
                      <Text className="text-sm text-gray-700">{pet.personality}</Text>
                    </CardContent>
                  </Card>
                )}

                {pet?.description && (
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <Text className="text-sm text-gray-500 mb-2">备注</Text>
                      <Text className="text-sm text-gray-700">{pet.description}</Text>
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  编辑资料
                </Button>
              </View>
            )}

            {/* 健康记录 */}
            {activeTab === 'vaccine' && (
              <View className="px-4 py-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAddRecord('health')}
                >
                  <Plus size={16} color="#ff6b35" className="mr-1" />
                  添加健康记录
                </Button>

                {/* 疫苗接种记录 */}
                <View>
                  <View className="flex items-center gap-2 mb-3">
                    <Syringe size={18} color="#14b8a6" />
                    <Text className="text-base font-semibold text-gray-700">疫苗接种</Text>
                    <Badge variant="secondary" className="text-xs">
                      {records.filter(r => r.record_type === 'vaccine').length}
                    </Badge>
                  </View>
                  {records.filter(r => r.record_type === 'vaccine').length > 0 ? (
                    <View className="space-y-2">
                      {records
                        .filter(r => r.record_type === 'vaccine')
                        .map((record) => (
                          <Card key={record.id} className="bg-white shadow-sm">
                            <CardContent className="p-3">
                              <View className="flex items-center justify-between">
                                <View className="flex-1">
                                  <Text className="block text-sm font-medium text-gray-800">
                                    {record.description || '疫苗接种'}
                                  </Text>
                                  <Text className="block text-xs text-gray-500 mt-1">
                                    {formatDate(record.record_date)}
                                  </Text>
                                </View>
                                <Badge variant="secondary" className="text-xs">已完成</Badge>
                              </View>
                            </CardContent>
                          </Card>
                        ))}
                    </View>
                  ) : (
                    <View className="flex flex-col items-center py-6 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-400">暂无疫苗接种记录</Text>
                    </View>
                  )}
                </View>

                {/* 驱虫记录 */}
                <View>
                  <View className="flex items-center gap-2 mb-3">
                    <Check size={18} color="#14b8a6" />
                    <Text className="text-base font-semibold text-gray-700">驱虫记录</Text>
                    <Badge variant="secondary" className="text-xs">
                      {records.filter(r => r.record_type === 'deworming').length}
                    </Badge>
                  </View>
                  {records.filter(r => r.record_type === 'deworming').length > 0 ? (
                    <View className="space-y-2">
                      {records
                        .filter(r => r.record_type === 'deworming')
                        .map((record) => (
                          <Card key={record.id} className="bg-white shadow-sm">
                            <CardContent className="p-3">
                              <View className="flex items-center justify-between">
                                <View className="flex-1">
                                  <Text className="block text-sm font-medium text-gray-800">
                                    {record.description || '驱虫记录'}
                                  </Text>
                                  <Text className="block text-xs text-gray-500 mt-1">
                                    {formatDate(record.record_date)}
                                  </Text>
                                </View>
                                <Badge variant="secondary" className="text-xs">已完成</Badge>
                              </View>
                            </CardContent>
                          </Card>
                        ))}
                    </View>
                  ) : (
                    <View className="flex flex-col items-center py-6 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-400">暂无驱虫记录</Text>
                    </View>
                  )}
                </View>

                {/* 空状态 */}
                {records.filter(r => r.record_type === 'vaccine' || r.record_type === 'deworming').length === 0 && (
                  <View className="flex flex-col items-center py-10">
                    <Text className="text-3xl mb-3">💉</Text>
                    <Text className="text-sm text-gray-400">暂无健康记录</Text>
                  </View>
                )}
              </View>
            )}

            {/* 成长记录 */}
            {activeTab === 'growth' && (
              <View className="px-4 py-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAddRecord('growth')}
                >
                  <Plus size={16} color="#ff6b35" className="mr-1" />
                  添加成长记录
                </Button>

                {/* 体重记录 */}
                <View>
                  <View className="flex items-center gap-2 mb-3">
                    <Weight size={18} color="#ff6b35" />
                    <Text className="text-base font-semibold text-gray-700">体重记录</Text>
                    <Badge variant="secondary" className="text-xs">
                      {records.filter(r => r.record_type === 'weight').length}
                    </Badge>
                  </View>
                  {records.filter(r => r.record_type === 'weight').length > 0 ? (
                    <View className="space-y-2">
                      {records
                        .filter(r => r.record_type === 'weight')
                        .map((record) => (
                          <Card key={record.id} className="bg-white shadow-sm">
                            <CardContent className="p-3">
                              <View className="flex items-center justify-between">
                                <View className="flex-1">
                                  <Text className="block text-lg font-bold text-orange-500">
                                    {record.value} {record.unit || 'kg'}
                                  </Text>
                                  <Text className="block text-xs text-gray-500 mt-1">
                                    {formatDate(record.record_date)}
                                  </Text>
                                </View>
                              </View>
                            </CardContent>
                          </Card>
                        ))}
                    </View>
                  ) : (
                    <View className="flex flex-col items-center py-6 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-400">暂无体重记录</Text>
                    </View>
                  )}
                </View>

                {/* 洗澡美容 */}
                <View>
                  <View className="flex items-center gap-2 mb-3">
                    <Scissors size={18} color="#ff6b35" />
                    <Text className="text-base font-semibold text-gray-700">洗澡美容</Text>
                    <Badge variant="secondary" className="text-xs">
                      {records.filter(r => r.record_type === 'bath').length}
                    </Badge>
                  </View>
                  {records.filter(r => r.record_type === 'bath').length > 0 ? (
                    <View className="space-y-2">
                      {records
                        .filter(r => r.record_type === 'bath')
                        .map((record) => (
                          <Card key={record.id} className="bg-white shadow-sm">
                            <CardContent className="p-3">
                              <View className="flex items-center justify-between">
                                <View className="flex-1">
                                  <Text className="block text-sm font-medium text-gray-800">
                                    {record.description || '洗澡美容'}
                                  </Text>
                                  <Text className="block text-xs text-gray-500 mt-1">
                                    {formatDate(record.record_date)}
                                  </Text>
                                </View>
                              </View>
                            </CardContent>
                          </Card>
                        ))}
                    </View>
                  ) : (
                    <View className="flex flex-col items-center py-6 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-400">暂无洗澡美容记录</Text>
                    </View>
                  )}
                </View>

                {/* 其他记录 */}
                <View>
                  <View className="flex items-center gap-2 mb-3">
                    <Calendar size={18} color="#ff6b35" />
                    <Text className="text-base font-semibold text-gray-700">其他记录</Text>
                    <Badge variant="secondary" className="text-xs">
                      {records.filter(r => r.record_type === 'other').length}
                    </Badge>
                  </View>
                  {records.filter(r => r.record_type === 'other').length > 0 ? (
                    <View className="space-y-2">
                      {records
                        .filter(r => r.record_type === 'other')
                        .map((record) => (
                          <Card key={record.id} className="bg-white shadow-sm">
                            <CardContent className="p-3">
                              <View className="flex items-center justify-between">
                                <View className="flex-1">
                                  <Text className="block text-sm font-medium text-gray-800">
                                    {record.description || '其他记录'}
                                  </Text>
                                  <Text className="block text-xs text-gray-500 mt-1">
                                    {formatDate(record.record_date)}
                                  </Text>
                                </View>
                              </View>
                            </CardContent>
                          </Card>
                        ))}
                    </View>
                  ) : (
                    <View className="flex flex-col items-center py-6 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-400">暂无其他记录</Text>
                    </View>
                  )}
                </View>

                {/* 空状态 */}
                {records.filter(r => r.record_type === 'weight' || r.record_type === 'bath' || r.record_type === 'other').length === 0 && (
                  <View className="flex flex-col items-center py-10">
                    <Text className="text-3xl mb-3">📊</Text>
                    <Text className="text-sm text-gray-400">暂无成长记录</Text>
                  </View>
                )}
              </View>
            )}

            {/* 宠物相册 */}
            {activeTab === 'album' && (
              <View className="px-4 py-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleUploadPhoto}
                >
                  <ImagePlus size={16} color="#ff6b35" className="mr-1" />
                  上传照片
                </Button>

                {/* 照片网格 */}
                {photos.length > 0 ? (
                  <View className="grid grid-cols-3 gap-2">
                    {photos.map((photo) => (
                      <View
                        key={photo.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image
                          className="w-full h-full"
                          src={photo.photo_url}
                          mode="aspectFill"
                          onClick={() => handlePreviewImage(photo.photo_url)}
                        />
                        <View
                          className="absolute top-1 right-1 w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 size={14} color="#ffffff" />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="flex flex-col items-center py-10">
                    <Text className="text-3xl mb-3">📸</Text>
                    <Text className="text-sm text-gray-400">暂无照片</Text>
                    <Text className="text-xs text-gray-300 mt-1">点击上方按钮上传宠物照片</Text>
                  </View>
                )}

                {/* 照片统计 */}
                {photos.length > 0 && (
                  <View className="text-center">
                    <Text className="block text-xs text-gray-400">
                      共 {photos.length} 张照片
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

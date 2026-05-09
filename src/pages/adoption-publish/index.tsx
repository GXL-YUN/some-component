import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface PublishForm {
  // 基本信息
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  gender: '公' | '母'
  weight: string
  
  // 健康状态
  healthDetails: string
  
  // 领养要求
  requirements: string[]
  newRequirement: string
  
  // 描述信息
  description: string
  story: string
  
  // 联系方式
  contactName: string
  contactPhone: string
  wechat: string
  location: string
  
  // 图片
  images: string[]
}

export default function AdoptionPublishPage() {
  const [form, setForm] = useState<PublishForm>({
    name: '',
    type: 'cat',
    breed: '',
    age: '',
    gender: '公',
    weight: '',
    healthDetails: '',
    requirements: [],
    newRequirement: '',
    description: '',
    story: '',
    contactName: '',
    contactPhone: '',
    wechat: '',
    location: '',
    images: []
  })

  const handleInputChange = (field: keyof PublishForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddRequirement = () => {
    if (form.newRequirement.trim() && form.requirements.length < 5) {
      setForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, prev.newRequirement.trim()],
        newRequirement: ''
      }))
    }
  }

  const handleRemoveRequirement = (index: number) => {
    setForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 9 - form.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, ...res.tempFilePaths]
        }))
      }
    })
  }

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Taro.showToast({ title: '请输入宠物名称', icon: 'none' })
      return false
    }
    if (!form.breed.trim()) {
      Taro.showToast({ title: '请输入宠物品种', icon: 'none' })
      return false
    }
    if (!form.age.trim()) {
      Taro.showToast({ title: '请输入宠物年龄', icon: 'none' })
      return false
    }
    if (!form.description.trim()) {
      Taro.showToast({ title: '请输入宠物描述', icon: 'none' })
      return false
    }
    if (!form.contactName.trim()) {
      Taro.showToast({ title: '请输入联系人姓名', icon: 'none' })
      return false
    }
    if (!form.contactPhone.trim()) {
      Taro.showToast({ title: '请输入联系电话', icon: 'none' })
      return false
    }
    if (!form.location.trim()) {
      Taro.showToast({ title: '请输入所在地区', icon: 'none' })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    Taro.showModal({
      title: '确认发布',
      content: '确定要发布这条领养信息吗？',
      success: async (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '发布中...' })
          
          // 模拟提交
          setTimeout(() => {
            Taro.hideLoading()
            Taro.showToast({ title: '发布成功', icon: 'success' })
            
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500)
          }, 1000)
        }
      }
    })
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50 pb-24" scrollY>
      <View className="p-4">
        {/* 宠物照片 */}
        <Card className="bg-white mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              宠物照片 <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex flex-wrap gap-2">
              {form.images.map((img, index) => (
                <View key={index} className="relative w-24 h-24">
                  <Image 
                    src={img} 
                    className="w-full h-full rounded-lg"
                    mode="aspectFill"
                  />
                  <View 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Text className="text-white text-xs">×</Text>
                  </View>
                </View>
              ))}
              {form.images.length < 9 && (
                <View 
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center"
                  onClick={handleChooseImage}
                >
                  <Text className="text-2xl text-gray-400">+</Text>
                  <Text className="text-xs text-gray-400 mt-1">添加照片</Text>
                </View>
              )}
            </View>
            <Text className="block text-xs text-gray-400 mt-2">
              最多上传9张照片，第一张将作为封面展示
            </Text>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card className="bg-white mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              基本信息 <Text className="text-red-500">*</Text>
            </Text>

            {/* 宠物名称 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">宠物名称</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="给宠物起个名字吧"
                  value={form.name}
                  onInput={(e) => handleInputChange('name', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            {/* 宠物类型 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">宠物类型</Text>
              <View className="flex gap-3">
                <View 
                  className={`flex-1 py-2 rounded-lg text-center ${form.type === 'cat' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => handleInputChange('type', 'cat')}
                >
                  <Text>🐱 猫咪</Text>
                </View>
                <View 
                  className={`flex-1 py-2 rounded-lg text-center ${form.type === 'dog' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => handleInputChange('type', 'dog')}
                >
                  <Text>🐕 狗狗</Text>
                </View>
              </View>
            </View>

            {/* 品种 */}
            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">品种</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="例如：英短、泰迪、中华田园犬"
                  value={form.breed}
                  onInput={(e) => handleInputChange('breed', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            {/* 年龄、性别、体重 */}
            <View className="flex gap-3 mb-4">
              <View className="flex-1">
                <Text className="block text-sm text-gray-600 mb-2">年龄</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <Input
                    placeholder="例如：1岁"
                    value={form.age}
                    onInput={(e) => handleInputChange('age', e.detail.value)}
                    className="w-full bg-transparent"
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="block text-sm text-gray-600 mb-2">性别</Text>
                <View className="flex gap-2">
                  <View 
                    className={`flex-1 py-2 rounded-lg text-center text-sm ${form.gender === '公' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => handleInputChange('gender', '公')}
                  >
                    <Text>公</Text>
                  </View>
                  <View 
                    className={`flex-1 py-2 rounded-lg text-center text-sm ${form.gender === '母' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => handleInputChange('gender', '母')}
                  >
                    <Text>母</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mb-0">
              <Text className="block text-sm text-gray-600 mb-2">体重（选填）</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="例如：4.5kg"
                  value={form.weight}
                  onInput={(e) => handleInputChange('weight', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 健康状态 */}
        <Card className="bg-white mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">健康状态</Text>
            <View className="bg-gray-50 rounded-lg px-3 py-2">
              <Input
                placeholder="请描述宠物的健康状况，如疫苗、绝育、驱虫等"
                value={form.healthDetails}
                onInput={(e) => handleInputChange('healthDetails', e.detail.value)}
                className="w-full bg-transparent"
              />
            </View>
          </CardContent>
        </Card>

        {/* 领养要求 */}
        <Card className="bg-white mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">领养要求</Text>

            <View className="flex flex-wrap gap-2 mb-3">
              {form.requirements.map((req, index) => (
                <Badge 
                  key={index} 
                  className="bg-orange-50 text-orange-600 flex items-center gap-1"
                >
                  <Text>{req}</Text>
                  <Text 
                    className="text-orange-400"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    ×
                  </Text>
                </Badge>
              ))}
            </View>

            <View className="flex gap-2">
              <View className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="输入领养要求"
                  value={form.newRequirement}
                  onInput={(e) => handleInputChange('newRequirement', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
              <Button 
                size="sm"
                className="bg-orange-500 text-white"
                onClick={handleAddRequirement}
                disabled={form.requirements.length >= 5}
              >
                添加
              </Button>
            </View>
            <Text className="block text-xs text-gray-400 mt-2">
              最多添加5条领养要求
            </Text>
          </CardContent>
        </Card>

        {/* 宠物描述 */}
        <Card className="bg-white mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              宠物描述 <Text className="text-red-500">*</Text>
            </Text>
            <View className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
              <Input
                placeholder="简单描述宠物的性格特点、生活习惯"
                value={form.description}
                onInput={(e) => handleInputChange('description', e.detail.value)}
                className="w-full bg-transparent"
              />
            </View>

            <Text className="block text-sm text-gray-600 mb-2">它的故事（选填）</Text>
            <View className="bg-gray-50 rounded-lg px-3 py-2">
              <Input
                placeholder="讲述宠物的来历、救助经过等"
                value={form.story}
                onInput={(e) => handleInputChange('story', e.detail.value)}
                className="w-full bg-transparent"
              />
            </View>
          </CardContent>
        </Card>

        {/* 联系方式 */}
        <Card className="bg-white mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              联系方式 <Text className="text-red-500">*</Text>
            </Text>

            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">联系人姓名</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="您的称呼"
                  value={form.contactName}
                  onInput={(e) => handleInputChange('contactName', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">联系电话</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  type="number"
                  placeholder="您的手机号码"
                  value={form.contactPhone}
                  onInput={(e) => handleInputChange('contactPhone', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="block text-sm text-gray-600 mb-2">微信号（选填）</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="您的微信号"
                  value={form.wechat}
                  onInput={(e) => handleInputChange('wechat', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-600 mb-2">所在地区</Text>
              <View className="bg-gray-50 rounded-lg px-3 py-2">
                <Input
                  placeholder="例如：北京市朝阳区"
                  value={form.location}
                  onInput={(e) => handleInputChange('location', e.detail.value)}
                  className="w-full bg-transparent"
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 温馨提示 */}
        <Card className="bg-orange-50 mb-4">
          <CardContent className="p-4">
            <View className="flex items-start gap-2">
              <Text className="text-lg">💡</Text>
              <View className="flex-1">
                <Text className="block text-sm font-medium text-orange-800 mb-1">发布须知</Text>
                <Text className="block text-xs text-orange-700 leading-relaxed">
                  1. 请确保宠物信息真实准确{'\n'}
                  2. 请如实填写健康状态{'\n'}
                  3. 请认真筛选领养人{'\n'}
                  4. 建议签订领养协议
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 底部提交按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button 
          className="w-full bg-orange-500 text-white"
          onClick={handleSubmit}
        >
          发布领养信息
        </Button>
      </View>
    </ScrollView>
  )
}

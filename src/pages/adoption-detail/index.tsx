import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.css'

interface AdoptionDetail {
  id: string
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  gender: '公' | '母'
  weight: string
  status: 'available' | 'reserved' | 'adopted'
  requirements: string[]
  description: string
  avatar: string
  color: string
  vaccinated: boolean
  neutered: boolean
  dewormed: boolean
  health: string[]
  location: string
  publisher: {
    name: string
    avatar: string
    verified: boolean
    adoptions: number
  }
  publishTime: string
  images: string[]
  story: string
}

export default function AdoptionDetailPage() {
  const [detail, setDetail] = useState<AdoptionDetail | null>(null)

  useEffect(() => {
    loadDetail()
  }, [])

  const loadDetail = async () => {
    const params = Taro.getCurrentInstance().router?.params
    const petId = params?.id

    // 模拟数据
    const mockDetail: AdoptionDetail = {
      id: petId || 'adopt-001',
      name: '小橘',
      type: 'cat',
      breed: '橘猫',
      age: '1岁',
      gender: '公',
      weight: '4.5kg',
      status: 'available',
      requirements: ['有养宠经验优先', '同意定期回访', '室内饲养', '不离不弃'],
      description: '性格温顺，已绝育驱虫，特别亲人，喜欢被抚摸。2024年3月在小区救助，当时只有几个月大，一直在寄养家庭生活。',
      avatar: '🐱',
      color: 'bg-orange-100',
      vaccinated: true,
      neutered: true,
      dewormed: true,
      health: ['猫三联疫苗', '狂犬疫苗', '体内驱虫', '体外驱虫'],
      location: '北京市朝阳区望京街道',
      publisher: {
        name: '爱心救助站',
        avatar: '🏠',
        verified: true,
        adoptions: 128
      },
      publishTime: '2024-04-01',
      images: [],
      story: '小橘是我在小区里发现的流浪猫，当时它只有几个月大，瘦骨嶙峋，还受了伤。经过几个月的精心照顾，现在已经完全康复，变成了一个健康活泼的小胖子。它性格特别温顺，喜欢被抚摸，从不抓人咬人。因为工作原因要搬家，无法带它一起走，希望能为它找到一个温暖的家，一个真正爱它、不离不弃的主人。'
    }

    setDetail(mockDetail)
  }

  const handleApplyAdoption = () => {
    Taro.showModal({
      title: '申请领养',
      content: '确定要申请领养这只宠物吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '申请已提交', icon: 'success' })
          // 跳转到领养申请表单
          setTimeout(() => {
            Taro.navigateTo({ url: `/pages/adoption-apply/index?id=${detail?.id}` })
          }, 1500)
        }
      }
    })
  }

  const handleContact = () => {
    Taro.showModal({
      title: '联系发布者',
      content: '是否要与发布者取得联系？',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateTo({ url: '/pages/chat/index' })
        }
      }
    })
  }

  if (!detail) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50 pb-24" scrollY>
      {/* 顶部图片区 */}
      <View className={`${detail.color} h-64 flex items-center justify-center relative`}>
        <Text className="text-8xl">{detail.avatar}</Text>
        <View className="absolute top-4 right-4">
          {detail.status === 'available' && (
            <Badge className="bg-green-500 text-white">可领养</Badge>
          )}
          {detail.status === 'reserved' && (
            <Badge className="bg-blue-500 text-white">已预约</Badge>
          )}
          {detail.status === 'adopted' && (
            <Badge className="bg-gray-400 text-white">已领养</Badge>
          )}
        </View>
      </View>

      {/* 基本信息 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-gray-800">{detail.name}</Text>
          <Text className="text-sm text-gray-500">{detail.breed}</Text>
        </View>
        <View className="flex items-center gap-4 text-sm text-gray-600">
          <Text>{detail.type === 'cat' ? '🐱 猫咪' : '🐕 狗狗'}</Text>
          <Text>{detail.gender}</Text>
          <Text>{detail.age}</Text>
          <Text>{detail.weight}</Text>
        </View>
      </View>

      {/* 健康状态 */}
      <Card className="bg-white mx-4 mt-4">
        <CardContent className="p-4">
          <Text className="block text-base font-semibold text-gray-800 mb-3">健康状态</Text>
          <View className="flex flex-wrap gap-2 mb-3">
            {detail.vaccinated && (
              <Badge className="bg-green-50 text-green-600">✓ 已疫苗</Badge>
            )}
            {detail.neutered && (
              <Badge className="bg-blue-50 text-blue-600">✓ 已绝育</Badge>
            )}
            {detail.dewormed && (
              <Badge className="bg-purple-50 text-purple-600">✓ 已驱虫</Badge>
            )}
          </View>
          <View className="flex flex-wrap gap-2">
            {detail.health.map((item, index) => (
              <View key={index} className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-600">
                {item}
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* 领养要求 */}
      <Card className="bg-white mx-4 mt-4">
        <CardContent className="p-4">
          <Text className="block text-base font-semibold text-gray-800 mb-3">领养要求</Text>
          {detail.requirements.map((req, index) => (
            <View key={index} className="flex items-start gap-2 mb-2">
              <Text className="text-orange-500 text-sm">•</Text>
              <Text className="text-sm text-gray-600">{req}</Text>
            </View>
          ))}
        </CardContent>
      </Card>

      {/* 宠物故事 */}
      <Card className="bg-white mx-4 mt-4">
        <CardContent className="p-4">
          <Text className="block text-base font-semibold text-gray-800 mb-3">它的故事</Text>
          <Text className="block text-sm text-gray-600 leading-relaxed">{detail.story}</Text>
        </CardContent>
      </Card>

      {/* 发布者信息 */}
      <Card className="bg-white mx-4 mt-4">
        <CardContent className="p-4">
          <Text className="block text-base font-semibold text-gray-800 mb-3">发布者信息</Text>
          <View className="flex items-center gap-3">
            <View className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
              <Text className="text-2xl">{detail.publisher.avatar}</Text>
            </View>
            <View className="flex-1">
              <View className="flex items-center gap-2">
                <Text className="text-base font-medium text-gray-800">{detail.publisher.name}</Text>
                {detail.publisher.verified && (
                  <Badge className="bg-orange-100 text-orange-600 text-xs">已认证</Badge>
                )}
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                已成功送养 {detail.publisher.adoptions} 只宠物
              </Text>
            </View>
          </View>
          <View className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <Text className="text-xs text-gray-500">发布时间：{detail.publishTime}</Text>
            <Text className="text-xs text-gray-500">📍 {detail.location}</Text>
          </View>
        </CardContent>
      </Card>

      {/* 温馨提示 */}
      <Card className="bg-orange-50 mx-4 mt-4">
        <CardContent className="p-4">
          <View className="flex items-start gap-2">
            <Text className="text-lg">💡</Text>
            <View className="flex-1">
              <Text className="block text-sm font-medium text-orange-800 mb-1">领养须知</Text>
              <Text className="block text-xs text-orange-700 leading-relaxed">
                领养宠物是一份长期的责任和承诺，请确保您有足够的时间、精力和经济能力照顾它。宠物可能需要10-20年的陪伴，请慎重考虑后再申请领养。
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 底部操作栏 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
        <View className="flex-1">
          <Button 
            variant="outline"
            className="w-full border-orange-500 text-orange-500"
            onClick={handleContact}
          >
            联系发布者
          </Button>
        </View>
        <View className="flex-1">
          <Button 
            className="w-full bg-orange-500 text-white"
            onClick={handleApplyAdoption}
            disabled={detail.status !== 'available'}
          >
            {detail.status === 'available' ? '申请领养' : detail.status === 'reserved' ? '已预约' : '已领养'}
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}
